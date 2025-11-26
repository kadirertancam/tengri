// ================================
// TENGRÎ: Oyun Mantığı Motoru
// Game Logic Engine
// ================================

class TengriGame {
    constructor() {
        this.gameState = {
            turn: 1,
            currentPlayer: 'player', // 'player' or 'opponent'
            phase: 'main', // 'main', 'combat', 'end'

            player: {
                health: 30,
                maxHealth: 30,
                armor: 0,
                mana: 1,
                maxMana: 1,
                deck: [],
                hand: [],
                board: [],
                graveyard: [],
                effects: [] // Ongoing effects
            },

            opponent: {
                health: 30,
                maxHealth: 30,
                armor: 0,
                mana: 1,
                maxMana: 1,
                deck: [],
                hand: [],
                board: [],
                graveyard: [],
                effects: []
            }
        };

        this.selectedCard = null;
        this.selectedTarget = null;
        this.gameOver = false;
        this.winner = null;
    }

    // ============= GAME INITIALIZATION =============
    initializeGame() {
        // Create default decks
        this.gameState.player.deck = this.createDefaultDeck();
        this.gameState.opponent.deck = this.createDefaultDeck();

        // Shuffle decks
        this.shuffleDeck(this.gameState.player.deck);
        this.shuffleDeck(this.gameState.opponent.deck);

        // Draw initial hands
        this.drawInitialHands();

        // Update UI
        this.updateUI();
    }

    createDefaultDeck() {
        const deck = [];

        // Add a balanced default deck (30 cards)
        // Mix of creatures, spells, and heroes
        const deckComposition = [
            61, 62, 63, 64, 65, 66, 67, 68, 69, 70, // 10 common creatures
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, // 10 uncommon creatures
            71, 72, 73, 74, 75, 76, 77, 78, // 8 common spells
            26, 27 // 2 rare heroes
        ];

        deckComposition.forEach(cardId => {
            const card = getCardById(cardId);
            if (card) {
                deck.push({ ...card }); // Clone card
            }
        });

        return deck;
    }

    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    drawInitialHands() {
        // Player draws 3 cards
        for (let i = 0; i < 3; i++) {
            this.drawCard('player');
        }

        // Opponent draws 4 cards (goes second, gets +1 card)
        for (let i = 0; i < 4; i++) {
            this.drawCard('opponent');
        }
    }

    // ============= CARD OPERATIONS =============
    drawCard(player) {
        const state = this.gameState[player];

        if (state.deck.length === 0) {
            // Deck is empty - fatigue damage
            this.dealFatigueDamage(player);
            return null;
        }

        if (state.hand.length >= 10) {
            // Hand is full - burn card
            const burnedCard = state.deck.shift();
            console.log(`${player} burned card: ${burnedCard.name}`);
            return null;
        }

        const card = state.deck.shift();
        state.hand.push(card);

        this.updateUI();
        return card;
    }

    drawCards(player, count) {
        const drawnCards = [];
        for (let i = 0; i < count; i++) {
            const card = this.drawCard(player);
            if (card) drawnCards.push(card);
        }
        return drawnCards;
    }

    playCard(card, player, target = null) {
        const state = this.gameState[player];

        // Check mana cost
        if (state.mana < card.cost) {
            console.log('Not enough mana!');
            return false;
        }

        // Remove from hand
        const handIndex = state.hand.indexOf(card);
        if (handIndex === -1) return false;
        state.hand.splice(handIndex, 1);

        // Spend mana
        state.mana -= card.cost;

        // Play card based on type
        if (card.type === CardType.CREATURE || card.type === CardType.GOD ||
            card.type === CardType.HERO || card.type === CardType.EVIL) {
            // Summon to board
            if (state.board.length < 7) {
                const creature = {
                    ...card,
                    currentHealth: card.health,
                    currentAttack: card.attack,
                    canAttack: card.abilities && card.abilities.includes(Ability.HASTE),
                    statuses: [...(card.abilities || [])]
                };
                state.board.push(creature);

                // Trigger battlecry effect
                if (card.effect && typeof card.effect === 'function') {
                    this.executeCardEffect(card, player, target);
                }
            }
        } else if (card.type === CardType.SPELL) {
            // Cast spell
            if (card.effect && typeof card.effect === 'function') {
                this.executeCardEffect(card, player, target);
            }
            state.graveyard.push(card);
        } else if (card.type === CardType.ARTIFACT) {
            // Apply artifact effect
            if (card.effect && typeof card.effect === 'function') {
                this.executeCardEffect(card, player, target);
            }
            state.effects.push({
                type: 'artifact',
                card: card,
                permanent: true
            });
        }

        this.updateUI();
        this.checkWinCondition();
        return true;
    }

    executeCardEffect(card, player, target) {
        // Simple effect execution - would be expanded in full version
        try {
            if (card.effect) {
                card.effect(this, target);
            }
        } catch (e) {
            console.log('Effect execution error:', e);
        }
    }

    // ============= COMBAT SYSTEM =============
    attack(attacker, target, attackingPlayer) {
        if (!attacker.canAttack) {
            console.log('Creature cannot attack this turn!');
            return false;
        }

        const defendingPlayer = attackingPlayer === 'player' ? 'opponent' : 'player';

        if (target === 'face') {
            // Attack player directly
            this.dealDamage(defendingPlayer, attacker.currentAttack);

            // Lifesteal check
            if (attacker.statuses && attacker.statuses.includes(Ability.LIFESTEAL)) {
                this.healPlayer(attackingPlayer, attacker.currentAttack);
            }
        } else {
            // Attack creature
            const damageToDefender = attacker.currentAttack;
            const damageToAttacker = target.currentAttack;

            target.currentHealth -= damageToDefender;
            attacker.currentHealth -= damageToAttacker;

            // Check for deaths
            this.checkCreatureDeath(attacker, attackingPlayer);
            this.checkCreatureDeath(target, defendingPlayer);
        }

        attacker.canAttack = false;
        this.updateUI();
        this.checkWinCondition();
        return true;
    }

    dealDamage(player, amount) {
        const state = this.gameState[player];

        // Armor absorbs damage first
        if (state.armor > 0) {
            const absorbed = Math.min(state.armor, amount);
            state.armor -= absorbed;
            amount -= absorbed;
        }

        state.health -= amount;
        this.updateUI();
        return state.health <= 0;
    }

    healPlayer(player, amount) {
        const state = this.gameState[player];
        state.health = Math.min(state.health + amount, state.maxHealth);
        this.updateUI();
    }

    checkCreatureDeath(creature, player) {
        const state = this.gameState[player];

        if (creature.currentHealth <= 0) {
            // Check Divine Shield
            if (creature.statuses && creature.statuses.includes(Ability.DIVINE)) {
                creature.statuses = creature.statuses.filter(s => s !== Ability.DIVINE);
                creature.currentHealth = 1;
                return false;
            }

            // Remove from board
            const boardIndex = state.board.indexOf(creature);
            if (boardIndex !== -1) {
                state.board.splice(boardIndex, 1);
                state.graveyard.push(creature);
            }

            this.updateUI();
            return true;
        }
        return false;
    }

    // ============= TURN SYSTEM =============
    endTurn() {
        const currentPlayer = this.gameState.currentPlayer;
        const nextPlayer = currentPlayer === 'player' ? 'opponent' : 'player';

        // End current player's turn
        this.processTurnEnd(currentPlayer);

        // Start next player's turn
        this.gameState.currentPlayer = nextPlayer;
        if (nextPlayer === 'player') {
            this.gameState.turn++;
        }

        this.processTurnStart(nextPlayer);

        // AI turn if opponent
        if (nextPlayer === 'opponent') {
            setTimeout(() => this.aiTurn(), 1000);
        }

        this.updateUI();
    }

    processTurnEnd(player) {
        const state = this.gameState[player];

        // Process end-of-turn effects
        state.effects.forEach(effect => {
            if (effect.type === 'heal_each_turn') {
                this.healPlayer(player, effect.amount);
            } else if (effect.type === 'draw_each_turn') {
                this.drawCard(player);
            }
        });
    }

    processTurnStart(player) {
        const state = this.gameState[player];

        // Increase mana
        if (state.maxMana < 10) {
            state.maxMana++;
        }
        state.mana = state.maxMana;

        // Draw card
        this.drawCard(player);

        // Refresh creatures (can attack again)
        state.board.forEach(creature => {
            creature.canAttack = true;

            // Regenerate
            if (creature.statuses && creature.statuses.includes(Ability.REGENERATE)) {
                creature.currentHealth = Math.min(creature.currentHealth + 1, creature.health);
            }
        });

        this.updateUI();
    }

    // ============= AI OPPONENT =============
    aiTurn() {
        const ai = this.gameState.opponent;

        // Simple AI: play random cards and attack with all creatures

        // Play cards
        let attempts = 0;
        while (ai.mana > 0 && ai.hand.length > 0 && attempts < 20) {
            const playableCards = ai.hand.filter(c => c.cost <= ai.mana);
            if (playableCards.length === 0) break;

            const randomCard = playableCards[Math.floor(Math.random() * playableCards.length)];
            this.playCard(randomCard, 'opponent', null);
            attempts++;
        }

        // Attack with all creatures
        setTimeout(() => {
            ai.board.forEach(creature => {
                if (creature.canAttack) {
                    // Attack face if no taunt, otherwise attack taunt
                    const playerTaunts = this.gameState.player.board.filter(c =>
                        c.statuses && c.statuses.includes(Ability.TAUNT)
                    );

                    if (playerTaunts.length > 0) {
                        const target = playerTaunts[Math.floor(Math.random() * playerTaunts.length)];
                        this.attack(creature, target, 'opponent');
                    } else {
                        this.attack(creature, 'face', 'opponent');
                    }
                }
            });

            // End AI turn
            setTimeout(() => this.endTurn(), 500);
        }, 1000);
    }

    // ============= GAME EFFECTS =============
    buffAllAllies(attackBuff, healthBuff) {
        const player = this.gameState.currentPlayer;
        const state = this.gameState[player];

        state.board.forEach(creature => {
            creature.currentAttack += attackBuff;
            creature.currentHealth += healthBuff;
            creature.health += healthBuff;
        });

        this.updateUI();
    }

    buffCreature(target, attackBuff, healthBuff) {
        if (target) {
            target.currentAttack += attackBuff;
            target.currentHealth += healthBuff;
            target.health += healthBuff;
            this.updateUI();
        }
    }

    summonTokens(name, count, attack, health) {
        const player = this.gameState.currentPlayer;
        const state = this.gameState[player];

        for (let i = 0; i < count && state.board.length < 7; i++) {
            const token = {
                id: 'token_' + Date.now() + i,
                name: name,
                type: CardType.CREATURE,
                rarity: Rarity.COMMON,
                cost: 1,
                attack: attack,
                health: health,
                currentAttack: attack,
                currentHealth: health,
                canAttack: false,
                statuses: [],
                icon: '🗡️'
            };
            state.board.push(token);
        }

        this.updateUI();
    }

    addManaCrystals(count) {
        const player = this.gameState.currentPlayer;
        const state = this.gameState[player];

        state.maxMana = Math.min(state.maxMana + count, 10);
        state.mana = Math.min(state.mana + count, state.maxMana);

        this.updateUI();
    }

    addArmor(amount) {
        const player = this.gameState.currentPlayer;
        const state = this.gameState[player];

        state.armor += amount;
        this.updateUI();
    }

    increaseMaxHealth(amount) {
        const player = this.gameState.currentPlayer;
        const state = this.gameState[player];

        state.maxHealth += amount;
        state.health += amount;
        this.updateUI();
    }

    healAllAllies(mode) {
        const player = this.gameState.currentPlayer;
        const state = this.gameState[player];

        if (mode === 'full') {
            state.board.forEach(creature => {
                creature.currentHealth = creature.health;
            });
        }

        this.updateUI();
    }

    // ============= WIN CONDITION =============
    checkWinCondition() {
        if (this.gameState.player.health <= 0) {
            this.gameOver = true;
            this.winner = 'opponent';
            this.showGameOver('Yenildin!');
        } else if (this.gameState.opponent.health <= 0) {
            this.gameOver = true;
            this.winner = 'player';
            this.showGameOver('Kazandın!');
        }
    }

    showGameOver(message) {
        setTimeout(() => {
            alert(message + '\n\nYeni oyun başlatılıyor...');
            this.resetGame();
        }, 500);
    }

    resetGame() {
        this.gameState = {
            turn: 1,
            currentPlayer: 'player',
            phase: 'main',
            player: {
                health: 30, maxHealth: 30, armor: 0, mana: 1, maxMana: 1,
                deck: [], hand: [], board: [], graveyard: [], effects: []
            },
            opponent: {
                health: 30, maxHealth: 30, armor: 0, mana: 1, maxMana: 1,
                deck: [], hand: [], board: [], graveyard: [], effects: []
            }
        };

        this.gameOver = false;
        this.winner = null;
        this.initializeGame();
    }

    dealFatigueDamage(player) {
        const fatigueCount = this.gameState[player].graveyard.length - 30;
        this.dealDamage(player, fatigueCount);
    }

    // ============= UI UPDATE =============
    updateUI() {
        if (typeof updateGameUI === 'function') {
            updateGameUI(this.gameState);
        }
    }
}

// Global game instance
let game = null;

function startNewGame() {
    game = new TengriGame();
    game.initializeGame();

    // Hide menu, show game board
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('gameBoard').classList.add('active');
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 2000);
});
