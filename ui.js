// ================================
// TENGRÎ: UI Controller  
// User Interface & Interactions
// ================================

// ============= MENU NAVIGATION =============
document.getElementById('btnNewGame')?.addEventListener('click', () => {
    startNewGame();
});

document.getElementById('btnDeckBuilder')?.addEventListener('click', () => {
    showScreen('deckBuilder');
    loadDeckBuilder();
});

document.getElementById('btnCollection')?.addEventListener('click', () => {
    showScreen('collection');
    loadCollection();
});

document.getElementById('btnTutorial')?.addEventListener('click', () => {
    showScreen('tutorial');
});

document.getElementById('btnMenu')?.addEventListener('click', () => {
    if (confirm('Ana menüye dönmek istediğinize emin misiniz?')) {
        document.getElementById('gameBoard').classList.remove('active');
        document.getElementById('mainMenu').classList.add('active');
    }
});

document.getElementById('btnEndTurn')?.addEventListener('click', () => {
    if (game && !game.gameOver) {
        game.endTurn();
    }
});

// Close buttons for screens
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const screenId = e.target.getAttribute('data-close');
        hideScreen(screenId);
    });
});

function showScreen(screenId) {
    document.getElementById(screenId)?.classList.add('active');
}

function hideScreen(screenId) {
    document.getElementById(screenId)?.classList.remove('active');
}

// ============= GAME UI RENDERING =============
function updateGameUI(gameState) {
    document.getElementById('turnCount').textContent = gameState.turn;
    document.getElementById('currentPhase').textContent = gameState.phase === 'main' ? 'Ana Faz' : 'Savaş Fazı';

    updatePlayerStats('player', gameState.player);
    updatePlayerStats('opponent', gameState.opponent);

    renderHand('player', gameState.player.hand);
    renderHand('opponent', gameState.opponent.hand);

    renderBoard('player', gameState.player.board);
    renderBoard('opponent', gameState.opponent.board);

    document.getElementById('playerDeckCount').textContent = gameState.player.deck.length;
    document.getElementById('opponentDeckCount').textContent = gameState.opponent.deck.length;

    document.getElementById('playerHandCount').textContent = gameState.player.hand.length;
    document.getElementById('opponentHandCount').textContent = gameState.opponent.hand.length;
}

function updatePlayerStats(player, state) {
    const prefix = player === 'player' ? 'player' : 'opponent';
    const healthEl = document.getElementById(`${prefix}Health`);
    const manaEl = document.getElementById(`${prefix}Mana`);

    if (healthEl) {
        healthEl.textContent = state.armor > 0 ? `${state.health} (+${state.armor})` : state.health;
    }

    if (manaEl) {
        manaEl.textContent = `${state.mana}/${state.maxMana}`;
    }
}

function renderHand(player, hand) {
    const handEl = document.getElementById(`${player}Hand`);
    if (!handEl) return;

    handEl.innerHTML = '';

    if (player === 'opponent') {
        hand.forEach(() => {
            const cardBack = createCardBack();
            handEl.appendChild(cardBack);
        });
    } else {
        hand.forEach(card => {
            const cardEl = createCardElement(card, player);
            handEl.appendChild(cardEl);
        });
    }
}

function renderBoard(player, board) {
    const boardEl = document.getElementById(`${player}Board`);
    if (!boardEl) return;

    const placeholder = boardEl.querySelector('.board-placeholder');
    if (placeholder) {
        placeholder.style.display = board.length === 0 ? 'block' : 'none';
    }

    boardEl.querySelectorAll('.card').forEach(el => el.remove());

    board.forEach(creature => {
        const creatureEl = createCreatureElement(creature, player);
        boardEl.appendChild(creatureEl);
    });
}

function createCardElement(card, owner) {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${card.rarity}`;
    cardEl.setAttribute('data-card-id', card.id);

    cardEl.innerHTML = `
        <div class="card-cost">${card.cost}</div>
        <div class="card-name">${card.name}</div>
        <div class="card-type">${getCardTypeLabel(card.type)}</div>
        <div class="card-image">${card.icon || '🎴'}</div>
        <div class="card-text">${card.description || ''}</div>
        ${(card.attack !== null && card.health !== null) ? `
            <div class="card-stats">
                <div class="stat-attack">⚔️ ${card.attack}</div>
                <div class="stat-defense">🛡️ ${card.health}</div>
            </div>
        ` : ''}
    `;

    if (owner === 'player' && game && game.gameState.currentPlayer === 'player') {
        cardEl.addEventListener('click', () => handleCardClick(card, owner));
        cardEl.style.cursor = 'pointer';
    }

    return cardEl;
}

function createCreatureElement(creature, owner) {
    const creatureEl = document.createElement('div');
    creatureEl.className = `card ${creature.rarity}`;
    creatureEl.setAttribute('data-card-id', creature.id);

    const statusIcons = [];
    if (creature.statuses) {
        if (creature.statuses.includes(Ability.TAUNT)) statusIcons.push('🛡️');
        if (creature.statuses.includes(Ability.DIVINE)) statusIcons.push('✨');
        if (creature.statuses.includes(Ability.FLYING)) statusIcons.push('🦅');
        if (creature.statuses.includes(Ability.STEALTH)) statusIcons.push('👁️‍🗨️');
    }

    const canAttackIndicator = creature.canAttack && owner === 'player' ?
        '<div style="position:absolute; top:0; right:0; background:green; color:white; padding:2px 6px; font-size:0.7rem; border-radius:4px;">⚡Ready</div>' : '';

    creatureEl.innerHTML = `
        ${canAttackIndicator}
        <div class="card-cost">${creature.cost}</div>
        <div class="card-name">${creature.name}</div>
        <div class="card-type">${getCardTypeLabel(creature.type)} ${statusIcons.join(' ')}</div>
        <div class="card-image">${creature.icon || '🎴'}</div>
        <div class="card-text">${creature.description || ''}</div>
        <div class="card-stats">
            <div class="stat-attack">⚔️ ${creature.currentAttack}</div>
            <div class="stat-defense">🛡️ ${creature.currentHealth}</div>
        </div>
    `;

    if (owner === 'player' && game && game.gameState.currentPlayer === 'player') {
        creatureEl.addEventListener('click', () => handleCreatureClick(creature, owner));
        creatureEl.style.cursor = 'pointer';
    } else if (owner === 'opponent') {
        creatureEl.addEventListener('click', () => handleOpponentCreatureClick(creature));
        creatureEl.style.cursor = 'crosshair';
    }

    return creatureEl;
}

function createCardBack() {
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.textContent = '🎴';
    return cardBack;
}

function getCardTypeLabel(type) {
    const labels = {
        [CardType.GOD]: '🌟 Tanrı',
        [CardType.HERO]: '⚔️ Kahraman',
        [CardType.CREATURE]: '🐺 Yaratık',
        [CardType.EVIL]: '👻 Kötü Ruh',
        [CardType.SPELL]: '✨ Büyü',
        [CardType.ARTIFACT]: '🗡️ Efsanevi Eşya'
    };
    return labels[type] || type;
}

// ============= CARD INTERACTIONS =============
function handleCardClick(card, owner) {
    if (!game || game.gameOver || game.gameState.currentPlayer !== 'player') return;

    if (game.playCard(card, 'player', null)) {
        console.log(`Played card: ${card.name}`);
        showFloatingText('Kart Oynandı!', 'green');
    } else {
        console.log('Cannot play card');
        showFloatingText('Yeterli Mana Yok!', 'red');
    }
}

function handleCreatureClick(creature, owner) {
    if (!game || game.gameOver || game.gameState.currentPlayer !== 'player') return;

    if (!creature.canAttack) {
        showFloatingText('Bu yaratık saldıramaz!', 'orange');
        return;
    }

    game.selectedCard = creature;
    showFloatingText('Hedef seç (rakibe tıkla veya rakip yaratığına tıkla)', 'blue');
    highlightTargets();
}

function handleOpponentCreatureClick(target) {
    if (!game) return;

    if (!game.selectedCard) {
        showFloatingText('Önce kendi yaratığını seç!', 'orange');
        return;
    }

    if (game.attack(game.selectedCard, target, 'player')) {
        console.log(`${game.selectedCard.name} attacked ${target.name}`);
        showFloatingText('Saldırı!', 'red');
    }

    game.selectedCard = null;
    removeHighlights();
}

function handleOpponentFaceClick() {
    if (!game || !game.selectedCard) return;

    if (game.attack(game.selectedCard, 'face', 'player')) {
        console.log(`${game.selectedCard.name} attacked opponent`);
        showFloatingText('Hamle!', 'red');
    }

    game.selectedCard = null;
    removeHighlights();
}

document.querySelector('.opponent-area')?.addEventListener('click', handleOpponentFaceClick);

function highlightTargets() {
    setTimeout(() => {
        document.querySelectorAll('#opponentBoard .card').forEach(card => {
            card.style.border = '3px solid yellow';
            card.style.boxShadow = '0 0 20px rgba(255, 255, 0, 0.6)';
        });

        const opponentArea = document.querySelector('.opponent-area');
        if (opponentArea) {
            opponentArea.style.border = '3px solid yellow';
        }
    }, 50);
}

function removeHighlights() {
    document.querySelectorAll('.card').forEach(card => {
        card.style.border = '';
        card.style.boxShadow = '';
    });

    const opponentArea = document.querySelector('.opponent-area');
    if (opponentArea) {
        opponentArea.style.border = '';
    }
}

// ============= VISUAL FEEDBACK =============
function showFloatingText(text, color = 'white') {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: ${color};
        padding: 20px 40px;
        border-radius: 12px;
        font-size: 1.5rem;
        font-weight: 700;
        z-index: 10000;
        animation: fadeOut 2s forwards;
        pointer-events: none;
    `;

    document.body.appendChild(floatingText);

    setTimeout(() => {
        floatingText.remove();
    }, 2000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        70% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        100% { opacity: 0; transform: translate(-50%, -60%) scale(0.9); }
    }
`;
document.head.appendChild(style);

// ============= DECK BUILDER =============
function loadDeckBuilder() {
    const cardPool = document.getElementById('cardPoolGrid');
    if (!cardPool) return;

    cardPool.innerHTML = '';
    const allCards = getAllCards();

    allCards.forEach(card => {
        const cardEl = createCardElement(card, 'builder');
        cardEl.addEventListener('click', () => addCardToDeck(card));
        cardPool.appendChild(cardEl);
    });
}

let currentDeck = [];

function addCardToDeck(card) {
    if (currentDeck.length >= 30) {
        alert('Deste dolu! (Maksimum 30 kart)');
        return;
    }
    currentDeck.push(card);
    updateDeckList();
}

function updateDeckList() {
    const deckList = document.getElementById('deckList');
    const deckCount = document.getElementById('deckCardCount');
    if (!deckList || !deckCount) return;

    deckCount.textContent = currentDeck.length;
    deckList.innerHTML = '';

    currentDeck.forEach((card, index) => {
        const item = document.createElement('div');
        item.style.cssText = `padding: 8px; margin: 4px 0; background: rgba(0, 0, 0, 0.3); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;`;
        item.innerHTML = `
            <span>${card.name} (${card.cost})</span>
            <button onclick="removeCardFromDeck(${index})" style="background: #dc143c; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer;">✕</button>
        `;
        deckList.appendChild(item);
    });
}

function removeCardFromDeck(index) {
    currentDeck.splice(index, 1);
    updateDeckList();
}

document.getElementById('btnClearDeck')?.addEventListener('click', () => {
    if (confirm('Desteyi temizlemek istediğinize emin misiniz?')) {
        currentDeck = [];
        updateDeckList();
    }
});

document.getElementById('btnSaveDeck')?.addEventListener('click', () => {
    if (currentDeck.length !== 30) {
        alert(`Deste tam olmalı! (Şu an: ${currentDeck.length}/30)`);
        return;
    }
    localStorage.setItem('tengri_custom_deck', JSON.stringify(currentDeck));
    alert('Deste kaydedildi!');
    hideScreen('deckBuilder');
});

// ============= COLLECTION =============
function loadCollection() {
    const collectionGrid = document.getElementById('collectionGrid');
    if (!collectionGrid) return;

    collectionGrid.innerHTML = '';
    const allCards = getAllCards();

    allCards.forEach(card => {
        const cardEl = createCardElement(card, 'collection');
        cardEl.addEventListener('click', () => showCardDetail(card));
        cardEl.style.cursor = 'pointer';
        collectionGrid.appendChild(cardEl);
    });
}

function showCardDetail(card) {
    const modal = document.getElementById('cardDetailModal');
    const content = document.getElementById('cardDetailContent');
    if (!modal || !content) return;

    content.innerHTML = `
        <div style="max-width: 400px; text-align: center;">
            <h2 style="color: var(--color-gold); margin-bottom: 16px;">${card.name}</h2>
            <div style="font-size: 4rem; margin: 20px 0;">${card.icon || '🎴'}</div>
            <p style="font-size: 1.1rem; margin: 16px 0;"><strong>${getCardTypeLabel(card.type)}</strong></p>
            <p style="margin: 16px 0;">${card.description || 'Açıklama yok'}</p>
            ${card.lore ? `<p style="font-style: italic; color: var(--color-text-muted); margin: 16px 0;">"${card.lore}"</p>` : ''}
            <div style="margin-top: 24px;">
                <p><strong>Mana:</strong> ${card.cost}</p>
                ${card.attack !== null ? `<p><strong>Saldırı:</strong> ${card.attack}</p>` : ''}
                ${card.health !== null ? `<p><strong>Can:</strong> ${card.health}</p>` : ''}
                <p><strong>Nadirlik:</strong> ${card.rarity.toUpperCase()}</p>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

document.querySelector('.modal-close')?.addEventListener('click', () => {
    document.getElementById('cardDetailModal').classList.remove('active');
});

document.getElementById('filterRarity')?.addEventListener('change', applyFilters);
document.getElementById('filterType')?.addEventListener('change', applyFilters);

function applyFilters() {
    const rarityFilter = document.getElementById('filterRarity')?.value;
    const typeFilter = document.getElementById('filterType')?.value;
    const cardPool = document.getElementById('cardPoolGrid');
    if (!cardPool) return;

    cardPool.innerHTML = '';
    let cards = getAllCards();

    if (rarityFilter && rarityFilter !== 'all') {
        cards = cards.filter(c => c.rarity === rarityFilter);
    }

    if (typeFilter && typeFilter !== 'all') {
        cards = cards.filter(c => c.type === typeFilter);
    }

    cards.forEach(card => {
        const cardEl = createCardElement(card, 'builder');
        cardEl.addEventListener('click', () => addCardToDeck(card));
        cardPool.appendChild(cardEl);
    });
}
