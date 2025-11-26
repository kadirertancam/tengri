// ================================
// TENGRÎ: Kart Veritabanı
// 80+ Türk Mitolojisi Kartı
// ================================

const CardType = {
    GOD: 'god',
    HERO: 'hero',
    CREATURE: 'creature',
    EVIL: 'evil',
    SPELL: 'spell',
    ARTIFACT: 'artifact'
};

const Rarity = {
    LEGENDARY: 'legendary',
    EPIC: 'epic',
    RARE: 'rare',
    UNCOMMON: 'uncommon',
    COMMON: 'common'
};

const Ability = {
    TAUNT: 'taunt',         // Kalkan - Önce bu vurulmalı
    FLYING: 'flying',       // Uçuş - Sadece uçanlar engelleyebilir
    HASTE: 'haste',         // Hız - Çağrıldığı tur saldırabilir
    STEALTH: 'stealth',     // Gizlilik - 1 tur görünmez
    LIFESTEAL: 'lifesteal', // Can çekme - Hasar kadar iyileştir
    DIVINE: 'divine',       // İlahi - İlk hasar önlenir
    CHARGE: 'charge',       // Hücum - +2 saldırı
    REGENERATE: 'regenerate' // Her tur +1 can
};

// KART VERİTABANI
const CARD_DATABASE = [
    // ============= LEGENDARY CARDS (8) =============
    {
        id: 1,
        name: 'Gök Tanrı (Tengri)',
        type: CardType.GOD,
        rarity: Rarity.LEGENDARY,
        cost: 10,
        attack: 10,
        health: 10,
        abilities: [Ability.DIVINE, Ability.FLYING],
        description: 'Tüm dost yaratıklara +3/+3 verir. Düşman yaratıkları sessizleştirir.',
        lore: 'Gökyüzünün efendisi, kaderin belirleyicisi, evrenin yaratıcısı.',
        icon: '☁️',
        effect: (game) => {
            // Tüm dost yaratıklara buff, düşman yaratıkları silence
            game.buffAllAllies(3, 3);
            game.silenceAllEnemies();
        }
    },
    {
        id: 2,
        name: 'Erlik Han',
        type: CardType.GOD,
        rarity: Rarity.LEGENDARY,
        cost: 9,
        attack: 8,
        health: 9,
        abilities: [Ability.LIFESTEAL],
        description: '3 düşman yaratığını yok et. Onların kopyalarını kendi tarafında yaratır.',
        lore: 'Yeraltı dünyasının karanlık hükümdarı, ölülerin efendisi.',
        icon: '💀',
        effect: (game) => {
            game.destroyAndStealCreatures(3);
        }
    },
    {
        id: 3,
        name: 'Kayra Han',
        type: CardType.GOD,
        rarity: Rarity.LEGENDARY,
        cost: 10,
        attack: 9,
        health: 12,
        abilities: [Ability.DIVINE, Ability.REGENERATE],
        description: 'Oyuna girdiğinde 3 yaratık çağır. Her tur 2 can iyileştir.',
        lore: 'Evrenin yaratıcısı, tanrıların babası, sonsuz bilgeliğin kaynağı.',
        icon: '🌌',
        effect: (game) => {
            game.summonRandomCreatures(3, 3, 3);
            game.healPlayerEachTurn(2);
        }
    },
    {
        id: 4,
        name: 'Ülgen',
        type: CardType.GOD,
        rarity: Rarity.LEGENDARY,
        cost: 8,
        attack: 6,
        health: 10,
        abilities: [Ability.DIVINE, Ability.FLYING],
        description: 'Tüm dostları tam can yapar. +2 mana kristali ekler.',
        lore: 'İyiliğin tanrısı, ışığın kaynağı, hayatın koruyucusu.',
        icon: '🌟',
        effect: (game) => {
            game.healAllAllies('full');
            game.addManaCrystals(2);
        }
    },
    {
        id: 5,
        name: 'Oğuz Kağan',
        type: CardType.HERO,
        rarity: Rarity.LEGENDARY,
        cost: 8,
        attack: 8,
        health: 8,
        abilities: [Ability.HASTE, Ability.CHARGE],
        description: 'Savaşa girdiğinde 6 Oğuz Yiğidi çağırır (2/2).',
        lore: 'Türklerin efsanevi atası, 24 Oğuz boyunun kurucusu.',
        icon: '👑',
        effect: (game) => {
            game.summonTokens('Oğuz Yiğidi', 6, 2, 2);
        }
    },
    {
        id: 6,
        name: 'Alp Er Tunga',
        type: CardType.HERO,
        rarity: Rarity.LEGENDARY,
        cost: 7,
        attack: 7,
        health: 7,
        abilities: [Ability.TAUNT, Ability.DIVINE],
        description: 'Düşman saldırılarını göğüsleyerek karşı hasar verir.',
        lore: 'Saka Türklerinin büyük hükümdarı, yenilmez savaşçı.',
        icon: '⚔️',
        effect: (game) => {
            game.addCounterAttack();
        }
    },
    {
        id: 7,
        name: 'Simurg (Anka Kuşu)',
        type: CardType.CREATURE,
        rarity: Rarity.LEGENDARY,
        cost: 7,
        attack: 5,
        health: 5,
        abilities: [Ability.FLYING, Ability.REGENERATE],
        description: 'Her tur 1 kart çek. Tüm kuş kartlarına +2/+2 verir.',
        lore: 'Kaf Dağının bilge kuşu, ölümsüzlüğü simgeler.',
        icon: '🦅',
        effect: (game) => {
            game.drawCardEachTurn();
            game.buffCreatureType('bird', 2, 2);
        }
    },
    {
        id: 8,
        name: 'Yelbegen (7 Başlı Ejderha)',
        type: CardType.CREATURE,
        rarity: Rarity.LEGENDARY,
        cost: 9,
        attack: 9,
        health: 9,
        abilities: [Ability.FLYING],
        description: 'Her turda rastgele bir düşman kartını yok eder.',
        lore: 'Gökyüzünü karartan yedi başlı ejderha, güneşi ve ayı yutar.',
        icon: '🐉',
        effect: (game) => {
            game.destroyRandomEnemyCardEachTurn();
        }
    },

    // ============= EPIC CARDS (12) =============
    {
        id: 9,
        name: 'Umay Ana',
        type: CardType.GOD,
        rarity: Rarity.EPIC,
        cost: 6,
        attack: 4,
        health: 8,
        abilities: [Ability.REGENERATE],
        description: 'Tüm dostları iyileştir ve +2 can ver.',
        lore: 'Bereket tanrıçası, çocukların ve kadınların koruyucusu.',
        icon: '🌸',
        effect: (game) => {
            game.healAllAllies('full');
            game.buffAllAllies(0, 2);
        }
    },
    {
        id: 10,
        name: 'Mergen',
        type: CardType.GOD,
        rarity: Rarity.EPIC,
        cost: 5,
        attack: 4,
        health: 6,
        abilities: [Ability.FLYING],
        description: 'Oyuna girdiğinde 3 kart çek.',
        lore: 'Bilgelik tanrısı, oku hedefini asla şaşırmaz.',
        icon: '🏹',
        effect: (game) => {
            game.drawCards(3);
        }
    },
    {
        id: 11,
        name: 'Kızagan',
        type: CardType.GOD,
        rarity: Rarity.EPIC,
        cost: 6,
        attack: 7,
        health: 5,
        abilities: [Ability.CHARGE, Ability.HASTE],
        description: 'Tüm dost yaratıklara +2 saldırı verir.',
        lore: 'Savaş tanrısı, kaba kuvvetin efendisi.',
        icon: '⚡',
        effect: (game) => {
            game.buffAllAllies(2, 0);
        }
    },
    {
        id: 12,
        name: 'Albastı',
        type: CardType.EVIL,
        rarity: Rarity.EPIC,
        cost: 5,
        attack: 4,
        health: 3,
        abilities: [Ability.STEALTH],
        description: 'Bir düşman yaratığının canını 1\'e düşürür.',
        lore: 'Lohusaların korkulu rüyası, gece gölgelerinde gizlenir.',
        icon: '👹',
        effect: (game) => {
            game.weakenEnemyCreature(1);
        }
    },
    {
        id: 13,
        name: 'Abası',
        type: CardType.EVIL,
        rarity: Rarity.EPIC,
        cost: 5,
        attack: 5,
        health: 5,
        abilities: [],
        description: 'Düşmanın elinden bir kart çalar.',
        lore: 'Tek gözlü, demir dişli kötü ruh. Ruhları kaçırır.',
        icon: '👁️',
        effect: (game) => {
            game.stealCard();
        }
    },
    {
        id: 14,
        name: 'Bükrek (İyi Ejderha)',
        type: CardType.CREATURE,
        rarity: Rarity.EPIC,
        cost: 6,
        attack: 6,
        health: 6,
        abilities: [Ability.TAUNT, Ability.REGENERATE],
        description: 'Kötü ruhlara karşı +3/+3 bonusu alır.',
        lore: 'İnsanları koruyan iyi kalpli ejderha.',
        icon: '🐲',
        effect: (game) => {
            game.buffAgainstEvilSpirits(3, 3);
        }
    },
    {
        id: 15,
        name: 'Bozkurt (Asena)',
        type: CardType.CREATURE,
        rarity: Rarity.EPIC,
        cost: 4,
        attack: 3,
        health: 3,
        abilities: [Ability.HASTE],
        description: 'Oyuna girdiğinde 2 Kurt daha çağırır (2/2).',
        lore: 'Türklerin kutsal yol göstericisi, gri kurt.',
        icon: '🐺',
        effect: (game) => {
            game.summonTokens('Kurt', 2, 2, 2);
        }
    },
    {
        id: 16,
        name: 'Ergenekon Demircisi',
        type: CardType.HERO,
        rarity: Rarity.EPIC,
        cost: 5,
        attack: 4,
        health: 5,
        abilities: [],
        description: '+1 mana kristali ekler. +5 zırh kazanır.',
        lore: 'Demir dağı eriten kahraman ataların temsilcisi.',
        icon: '🔨',
        effect: (game) => {
            game.addManaCrystals(1);
            game.addArmor(5);
        }
    },
    {
        id: 17,
        name: 'Demir Dağ',
        type: CardType.ARTIFACT,
        rarity: Rarity.EPIC,
        cost: 4,
        attack: null,
        health: null,
        abilities: [],
        description: '+5 maksimum can. Her tur 1 can iyileştir.',
        lore: 'Ergenekon\'dan çıkışın sembolü.',
        icon: '⛰️',
        effect: (game) => {
            game.increaseMaxHealth(5);
            game.healPlayerEachTurn(1);
        }
    },
    {
        id: 18,
        name: 'Bilgi Ağacı',
        type: CardType.ARTIFACT,
        rarity: Rarity.EPIC,
        cost: 3,
        attack: null,
        health: null,
        abilities: [],
        description: 'Her tur sonunda 1 kart çek.',
        lore: 'Simurg\'un yaşadığı kutsal ağaç.',
        icon: '🌳',
        effect: (game) => {
            game.drawCardEachTurn();
        }
    },
    {
        id: 19,
        name: 'Tengri\'nin Gazabı',
        type: CardType.SPELL,
        rarity: Rarity.EPIC,
        cost: 7,
        attack: null,
        health: null,
        abilities: [],
        description: '7 hasar ver. Eğer hedef yok edilirse 3 can iyileştir.',
        lore: 'Gök Tanrı\'nın öfkesi yeryüzünü titretir.',
        icon: '⚡',
        effect: (game, target) => {
            const killed = game.dealDamage(target, 7);
            if (killed) game.healPlayer(3);
        }
    },
    {
        id: 20,
        name: 'Erlik\'in Laneti',
        type: CardType.SPELL,
        rarity: Rarity.EPIC,
        cost: 6,
        attack: null,
        health: null,
        abilities: [],
        description: 'Bir düşman yaratığı yok et ve onunkoğ kopyasını sen oyna.',
        lore: 'Yeraltı tanrısının karanlık büyüsü.',
        icon: '💀',
        effect: (game, target) => {
            game.destroyAndCopy(target);
        }
    },

    // ============= RARE CARDS (20) =============
    {
        id: 21,
        name: 'Dağ İyesi',
        type: CardType.CREATURE,
        rarity: Rarity.RARE,
        cost: 4,
        attack: 3,
        health: 6,
        abilities: [Ability.TAUNT],
        description: 'Dağ gibi sağlam. +3 savunma.',
        lore: 'Dağların koruyucu ruhu.',
        icon: '🏔️',
        effect: null
    },
    {
        id: 22,
        name: 'Su İyesi',
        type: CardType.CREATURE,
        rarity: Rarity.RARE,
        cost: 3,
        attack: 2,
        health: 5,
        abilities: [Ability.REGENERATE],
        description: 'Her tur +1 can iyileşir.',
        lore: 'Suların koruyucu ruhu.',
        icon: '💧',
        effect: null
    },
    {
        id: 23,
        name: 'Orman İyesi',
        type: CardType.CREATURE,
        rarity: Rarity.RARE,
        cost: 3,
        attack: 3,
        health: 4,
        abilities: [Ability.STEALTH],
        description: '1 tur görünmez.',
        lore: 'Ormanların gizli koruyucusu.',
        icon: '🌲',
        effect: null
    },
    {
        id: 24,
        name: 'Ateş İyesi (Od Ana)',
        type: CardType.CREATURE,
        rarity: Rarity.RARE,
        cost: 4,
        attack: 5,
        health: 3,
        abilities: [],
        description: 'Yok edildiğinde 3 hasar dağıtır.',
        lore: 'Ateşin annesi, ocağın koruyucusu.',
        icon: '🔥',
        effect: (game) => {
            game.dealDamageWhenDies(3);
        }
    },
    {
        id: 25,
        name: 'Yel İyesi',
        type: CardType.CREATURE,
        rarity: Rarity.RARE,
        cost: 2,
        attack: 2,
        health: 2,
        abilities: [Ability.FLYING, Ability.HASTE],
        description: 'Rüzgar kadar hızlı.',
        lore: 'Rüzgarların koruyucu ruhu.',
        icon: '🌪️',
        effect: null
    },
    {
        id: 26,
        name: 'Alp Eren',
        type: CardType.HERO,
        rarity: Rarity.RARE,
        cost: 4,
        attack: 4,
        health: 4,
        abilities: [Ability.CHARGE],
        description: '+2 saldırı bonusu.',
        lore: 'Yiğit Türk savaşçısı.',
        icon: '⚔️',
        effect: null
    },
    {
        id: 27,
        name: 'Alp Batur',
        type: CardType.HERO,
        rarity: Rarity.RARE,
        cost: 5,
        attack: 5,
        health: 5,
        abilities: [Ability.DIVINE],
        description: 'İlk hasar önlenir.',
        lore: 'Cesur kahraman, korkusuzların en yiğidi.',
        icon: '🛡️',
        effect: null
    },
    {
        id: 28,
        name: 'Alp Kara',
        type: CardType.HERO,
        rarity: Rarity.RARE,
        cost: 3,
        attack: 3,
        health: 4,
        abilities: [Ability.LIFESTEAL],
        description: 'Verdiği hasar kadar iyileştir.',
        lore: 'Karanlığın savaşçısı.',
        icon: '🌑',
        effect: null
    },
    {
        id: 29,
        name: 'Alp Gün',
        type: CardType.HERO,
        rarity: Rarity.RARE,
        cost: 4,
        attack: 5,
        health: 3,
        abilities: [Ability.HASTE],
        description: 'Hızlı saldırı.',
        lore: 'Güneş kadar parlak savaşçı.',
        icon: '☀️',
        effect: null
    },
    {
        id: 30,
        name: 'Alp Ay',
        type: CardType.HERO,
        rarity: Rarity.RARE,
        cost: 3,
        attack: 2,
        health: 5,
        abilities: [Ability.STEALTH],
        description: 'Gece gölgelerinde gizlenir.',
        lore: 'Ayın gizli savaşçısı.',
        icon: '🌙',
        effect: null
    },
    {
        id: 31,
        name: 'Gulyabani',
        type: CardType.EVIL,
        rarity: Rarity.RARE,
        cost: 4,
        attack: 5,
        health: 2,
        abilities: [],
        description: 'Saldırıda bulunduğunda düşmanı korkutur (-1 saldırı).',
        lore: 'Gece yarısı mezarlıklarda dolaşan korkunç yaratık.',
        icon: '🧟',
        effect: (game, target) => {
            game.debuffTarget(target, -1, 0);
        }
    },
    {
        id: 32,
        name: 'Hınkır Munkur',
        type: CardType.EVIL,
        rarity: Rarity.RARE,
        cost: 5,
        attack: 6,
        health: 4,
        abilities: [],
        description: 'Bir yaratığı yok ederek +2/+2 alır.',
        lore: 'İnsanları boğup yiyen canavar.',
        icon: '👻',
        effect: (game, target) => {
            game.devourCreature(target, 2, 2);
        }
    },
    {
        id: 33,
        name: 'Enkebit',
        type: CardType.EVIL,
        rarity: Rarity.RARE,
        cost: 3,
        attack: 3,
        health: 4,
        abilities: [],
        description: 'Düşmanı 1 tur sessizleştirir.',
        lore: 'Uykudaki insanları boğazlar.',
        icon: '😈',
        effect: (game) => {
            game.silenceOpponent(1);
        }
    },
    {
        id: 34,
        name: 'Kamos (Karakura)',
        type: CardType.EVIL,
        rarity: Rarity.RARE,
        cost: 3,
        attack: 2,
        health: 4,
        abilities: [],
        description: 'Düşmanı 2 tur kart çekemez hale getirir.',
        lore: 'Kabus ruhu, rüyalarda korkutur.',
        icon: '🌑',
        effect: (game) => {
            game.preventCardDraw(2);
        }
    },
    {
        id: 35,
        name: 'Öcü',
        type: CardType.EVIL,
        rarity: Rarity.RARE,
        cost: 4,
        attack: 4,
        health: 5,
        abilities: [Ability.TAUNT],
        description: 'Çocukları korkutur. Düşman -1 mana.',
        lore: 'Dev gibi korkunç yaratık.',
        icon: '👹',
        effect: (game) => {
            game.reduceMana(1);
        }
    },
    {
        id: 36,
        name: 'Umay\'ın Bereketi',
        type: CardType.SPELL,
        rarity: Rarity.RARE,
        cost: 4,
        attack: null,
        health: null,
        abilities: [],
        description: 'Tüm dostları +2/+2 yükselt ve iyileştir.',
        lore: 'Bereket tanrıçasının lütfu.',
        icon: '🌸',
        effect: (game) => {
            game.buffAndHealAllAllies(2, 2);
        }
    },
    {
        id: 37,
        name: 'Kurt Çağırma',
        type: CardType.SPELL,
        rarity: Rarity.RARE,
        cost: 3,
        attack: null,
        health: null,
        abilities: [],
        description: '3 Kurt çağır (2/2).',
        lore: 'Bozkurtun soyundan yaratıklar.',
        icon: '🐺',
        effect: (game) => {
            game.summonTokens('Kurt', 3, 2, 2);
        }
    },
    {
        id: 38,
        name: 'Şaman Ritüeli',
        type: CardType.SPELL,
        rarity: Rarity.RARE,
        cost: 2,
        attack: null,
        health: null,
        abilities: [],
        description: '2 kart çek. +1 mana kristali.',
        lore: 'Şamanın kutsal töreni.',
        icon: '🔮',
        effect: (game) => {
            game.drawCards(2);
            game.addManaCrystals(1);
        }
    },
    {
        id: 39,
        name: 'Savaş Çağrısı',
        type: CardType.SPELL,
        rarity: Rarity.RARE,
        cost: 3,
        attack: null,
        health: null,
        abilities: [],
        description: 'Tüm dostlara +3 saldırı ver ve Haste kazan.',
        lore: 'Türk ordusunun savaş narası.',
        icon: '📯',
        effect: (game) => {
            game.buffAllAlliesWithHaste(3, 0);
        }
    },
    {
        id: 40,
        name: 'Gök Kalkanı',
        type: CardType.SPELL,
        rarity: Rarity.RARE,
        cost: 2,
        attack: null,
        health: null,
        abilities: [],
        description: '+5 zırh kazan. Bir yaratığa Divine Shield ver.',
        lore: 'Tengri\'nin koruması.',
        icon: '🛡️',
        effect: (game, target) => {
            game.addArmor(5);
            game.giveDivineShield(target);
        }
    },

    // ============= UNCOMMON CARDS (20) =============
    {
        id: 41,
        name: 'Türk Süvarisi',
        type: CardType.CREATURE,
        rarity: Rarity.UNCOMMON,
        cost: 3,
        attack: 3,
        health: 3,
        abilities: [Ability.CHARGE],
        description: 'Hızlı atlı savaşçı.',
        lore: 'Türk ordusunun at üstündeki gücü.',
        icon: '🏇',
        effect: null
    },
    {
        id: 42,
        name: 'Okçu Alp',
        type: CardType.CREATURE,
        rarity: Rarity.UNCOMMON,
        cost: 2,
        attack: 2,
        health: 2,
        abilities: [],
        description: '2 hasar verir.',
        lore: 'Usta okçu.',
        icon: '🏹',
        effect: (game, target) => {
            game.dealDamage(target, 2);
        }
    },
    {
        id: 43,
        name: 'Kılıç Ustası',
        type: CardType.CREATURE,
        rarity: Rarity.UNCOMMON,
        cost: 3,
        attack: 4,
        health: 2,
        abilities: [],
        description: 'Keskin kılıç darbesi.',
        lore: 'Kılıç sanatının ustası.',
        icon: '⚔️',
        effect: null
    },
    {
        id: 44,
        name: 'Şaman',
        type: CardType.CREATURE,
        rarity: Rarity.UNCOMMON,
        cost: 2,
        attack: 1,
        health: 4,
        abilities: [],
        description: 'Oyuna girdiğinde 1 kart çek.',
        lore: 'Ruhlarla konuşan bilge.',
        icon: '🧙',
        effect: (game) => {
            game.drawCards(1);
        }
    },
    {
        id: 45,
        name: 'Koruyucu Bekçi',
        type: CardType.CREATURE,
        rarity: Rarity.UNCOMMON,
        cost: 4,
        attack: 2,
        health: 6,
        abilities: [Ability.TAUNT],
        description: 'Kaim kalkan.',
        lore: 'Kabilenin sadık bekçisi.',
        icon: '🛡️',
        effect: null
    },
    {
        id: 46,
        name: 'Bozkır Avcısı',
        type: CardType.CREATURE,
        rarity: Rarity.UNCOMMON,
        cost: 2,
        attack: 3,
        health: 1,
        abilities: [Ability.HASTE],
        description: 'Hızlı av.',
        lore: 'Bozkırın en hızlı avcısı.',
        icon: '🏹',
        effect: null
    },
    {
        id: 47,
        name: 'Savaş Davulcusu',
        type: CardType.CREATURE,
        rarity: Rarity.UNCOMMON,
        cost: 3,
        attack: 2,
        health: 4,
        abilities: [],
        description: 'Tüm dostlara +1 saldırı verir.',
        lore: 'Davul sesi orduyu coşturur.',
        icon: '🥁',
        effect: (game) => {
            game.buffAllAllies(1, 0);
        }
    },
    {
        id: 48,
        name: 'Sancaktar',
        type: CardType.CREATURE,
        rarity: Rarity.UNCOMMON,
        cost: 3,
        attack: 2,
        health: 3,
        abilities: [],
        description: 'Tüm dostlara +1 can verir.',
        lore: 'Sancağı taşıyan yiğit.',
        icon: '🚩',
        effect: (game) => {
            game.buffAllAllies(0, 1);
        }
    },
    {
        id: 49,
        name: 'Atlı Hafif Süvari',
        type: CardType.CREATURE,
        rarity: Rarity.UNCOMMON,
        cost: 2,
        attack: 2,
        health: 3,
        abilities: [],
        description: 'Standart birim.',
        lore: 'Türk ordusunun temeli.',
        icon: '🐎',
        effect: null
    },
    {
        id: 50,
        name: 'Piyade Alp',
        type: CardType.CREATURE,
        rarity: Rarity.UNCOMMON,
        cost: 2,
        attack: 2,
        health: 2,
        abilities: [],
        description: 'Standart birim.',
        lore: 'Yaya savaşçı.',
        icon: '⚔️',
        effect: null
    },
    {
        id: 51,
        name: 'İyileştirme',
        type: CardType.SPELL,
        rarity: Rarity.UNCOMMON,
        cost: 2,
        attack: null,
        health: null,
        abilities: [],
        description: '5 can iyileştir.',
        lore: 'Şifanın gücü.',
        icon: '💚',
        effect: (game, target) => {
            game.heal(target, 5);
        }
    },
    {
        id: 52,
        name: 'Ateş Topu',
        type: CardType.SPELL,
        rarity: Rarity.UNCOMMON,
        cost: 3,
        attack: null,
        health: null,
        abilities: [],
        description: '4 hasar ver.',
        lore: 'Ateş büyüsü.',
        icon: '🔥',
        effect: (game, target) => {
            game.dealDamage(target, 4);
        }
    },
    {
        id: 53,
        name: 'Güçlendirme',
        type: CardType.SPELL,
        rarity: Rarity.UNCOMMON,
        cost: 2,
        attack: null,
        health: null,
        abilities: [],
        description: 'Bir yaratığa +3/+3 ver.',
        lore: 'Güç büyüsü.',
        icon: '💪',
        effect: (game, target) => {
            game.buffCreature(target, 3, 3);
        }
    },
    {
        id: 54,
        name: 'Yıldırım Çarpması',
        type: CardType.SPELL,
        rarity: Rarity.UNCOMMON,
        cost: 1,
        attack: null,
        health: null,
        abilities: [],
        description: '2 hasar ver.',
        lore: 'Gökyüzünden inen güç.',
        icon: '⚡',
        effect: (game, target) => {
            game.dealDamage(target, 2);
        }
    },
    {
        id: 55,
        name: 'Zırhlama',
        type: CardType.SPELL,
        rarity: Rarity.UNCOMMON,
        cost: 1,
        attack: null,
        health: null,
        abilities: [],
        description: '+3 zırh kazan.',
        lore: 'Savunma büyüsü.',
        icon: '🛡️',
        effect: (game) => {
            game.addArmor(3);
        }
    },
    {
        id: 56,
        name: 'Öfke',
        type: CardType.SPELL,
        rarity: Rarity.UNCOMMON,
        cost: 2,
        attack: null,
        health: null,
        abilities: [],
        description: 'Bir yaratığa +4 saldırı ve Haste ver.',
        lore: 'Savaş öfkesi.',
        icon: '😡',
        effect: (game, target) => {
            game.buffCreatureWithHaste(target, 4, 0);
        }
    },
    {
        id: 57,
        name: 'Gölge Adımı',
        type: CardType.SPELL,
        rarity: Rarity.UNCOMMON,
        cost: 1,
        attack: null,
        health: null,
        abilities: [],
        description: 'Bir yaratığa Stealth ver.',
        lore: 'Görünmezlik büyüsü.',
        icon: '👤',
        effect: (game, target) => {
            game.giveStealth(target);
        }
    },
    {
        id: 58,
        name: 'Kutsal Toprak',
        type: CardType.ARTIFACT,
        rarity: Rarity.UNCOMMON,
        cost: 2,
        attack: null,
        health: null,
        abilities: [],
        description: 'Her tur 2 can iyileştir.',
        lore: 'Otağın kutsal toprağı.',
        icon: '🏕️',
        effect: (game) => {
            game.healPlayerEachTurn(2);
        }
    },
    {
        id: 59,
        name: 'Savaş Borusu',
        type: CardType.ARTIFACT,
        rarity: Rarity.UNCOMMON,
        cost: 2,
        attack: null,
        health: null,
        abilities: [],
        description: 'Tüm dostlara +1 saldırı verir.',
        lore: 'Savaşa çağıran boru.',
        icon: '📯',
        effect: (game) => {
            game.buffAllAllies(1, 0);
        }
    },
    {
        id: 60,
        name: 'Koruyucu Tılsım',
        type: CardType.ARTIFACT,
        rarity: Rarity.UNCOMMON,
        cost: 3,
        attack: null,
        health: null,
        abilities: [],
        description: '+3 maksimum can.',
        lore: 'Nazarlık tılsımı.',
        icon: '🧿',
        effect: (game) => {
            game.increaseMaxHealth(3);
        }
    },

    // ============= COMMON CARDS (20) =============
    {
        id: 61,
        name: 'Genç Savaşçı',
        type: CardType.CREATURE,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: 1,
        health: 2,
        abilities: [],
        description: 'Temel birim.',
        lore: 'Genç ve hevesli savaşçı.',
        icon: '⚔️',
        effect: null
    },
    {
        id: 62,
        name: 'Mızrakçı',
        type: CardType.CREATURE,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: 2,
        health: 1,
        abilities: [],
        description: 'Temel birim.',
        lore: 'Mızrak ustası.',
        icon: '🗡️',
        effect: null
    },
    {
        id: 63,
        name: 'Kalkan Taşıyıcı',
        type: CardType.CREATURE,
        rarity: Rarity.COMMON,
        cost: 2,
        attack: 1,
        health: 4,
        abilities: [Ability.TAUNT],
        description: 'Temel savunma.',
        lore: 'Sadık kalkan taşıyıcı.',
        icon: '🛡️',
        effect: null
    },
    {
        id: 64,
        name: 'Çoban',
        type: CardType.CREATURE,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: 1,
        health: 1,
        abilities: [],
        description: 'Basit yaratık.',
        lore: 'Bozkırın çobanı.',
        icon: '🧑',
        effect: null
    },
    {
        id: 65,
        name: 'Avcı',
        type: CardType.CREATURE,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: 2,
        health: 1,
        abilities: [],
        description: 'Basit birim.',
        lore: 'Usta avcı.',
        icon: '🏹',
        effect: null
    },
    {
        id: 66,
        name: 'Genç Atлı',
        type: CardType.CREATURE,
        rarity: Rarity.COMMON,
        cost: 2,
        attack: 2,
        health: 2,
        abilities: [],
        description: 'Standart birim.',
        lore: 'At üstündeki genç savaşçı.',
        icon: '🐎',
        effect: null
    },
    {
        id: 67,
        name: 'Köy Koruyucusu',
        type: CardType.CREATURE,
        rarity: Rarity.COMMON,
        cost: 3,
        attack: 2,
        health: 3,
        abilities: [Ability.TAUNT],
        description: 'Köyü korur.',
        lore: 'Köyün bekçisi.',
        icon: '🧔',
        effect: null
    },
    {
        id: 68,
        name: 'İzcigece Gözcü',
        type: CardType.CREATURE,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: 1,
        health: 2,
        abilities: [],
        description: 'Oyuna girdiğinde 1 kart çek.',
        lore: 'Gece nöbetçisi.',
        icon: '👀',
        effect: (game) => {
            game.drawCards(1);
        }
    },
    {
        id: 69,
        name: 'Kabile Yaşlısı',
        type: CardType.CREATURE,
        rarity: Rarity.COMMON,
        cost: 2,
        attack: 1,
        health: 3,
        abilities: [],
        description: '1 can iyileştir.',
        lore: 'Bilge yaşlı.',
        icon: '👴',
        effect: (game) => {
            game.healPlayer(1);
        }
    },
    {
        id: 70,
        name: 'Sürü Atı',
        type: CardType.CREATURE,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: 1,
        health: 1,
        abilities: [],
        description: 'Basit yaratık.',
        lore: 'Bozkırın vahşi atı.',
        icon: '🐴',
        effect: null
    },
    {
        id: 71,
        name: 'Ok Yağmuru',
        type: CardType.SPELL,
        rarity: Rarity.COMMON,
        cost: 2,
        attack: null,
        health: null,
        abilities: [],
        description: 'Tüm düşman yaratıklara 1 hasar ver.',
        lore: 'Okçuların saldırısı.',
        icon: '🏹',
        effect: (game) => {
            game.damageAllEnemies(1);
        }
    },
    {
        id: 72,
        name: 'Küçük İyileştirme',
        type: CardType.SPELL,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: null,
        health: null,
        abilities: [],
        description: '3 can iyileştir.',
        lore: 'Basit şifa.',
        icon: '💚',
        effect: (game, target) => {
            game.heal(target, 3);
        }
    },
    {
        id: 73,
        name: 'Kıvılcım',
        type: CardType.SPELL,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: null,
        health: null,
        abilities: [],
        description: '1 hasar ver.',
        lore: 'Küçük ateş büyüsü.',
        icon: '✨',
        effect: (game, target) => {
            game.dealDamage(target, 1);
        }
    },
    {
        id: 74,
        name: 'Güç',
        type: CardType.SPELL,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: null,
        health: null,
        abilities: [],
        description: 'Bir yaratığa +2/+0 ver.',
        lore: 'Saldırı gücü.',
        icon: '💪',
        effect: (game, target) => {
            game.buffCreature(target, 2, 0);
        }
    },
    {
        id: 75,
        name: 'Dayanıklılık',
        type: CardType.SPELL,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: null,
        health: null,
        abilities: [],
        description: 'Bir yaratığa +0/+2 ver.',
        lore: 'Savunma gücü.',
        icon: '🛡️',
        effect: (game, target) => {
            game.buffCreature(target, 0, 2);
        }
    },
    {
        id: 76,
        name: 'Hızlanma',
        type: CardType.SPELL,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: null,
        health: null,
        abilities: [],
        description: 'Bir yaratığa Haste ver.',
        lore: 'Hız büyüsü.',
        icon: '⚡',
        effect: (game, target) => {
            game.giveHaste(target);
        }
    },
    {
        id: 77,
        name: 'Kart Çekme',
        type: CardType.SPELL,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: null,
        health: null,
        abilities: [],
        description: '1 kart çek.',
        lore: 'Bilgi kaynağı.',
        icon: '📖',
        effect: (game) => {
            game.drawCards(1);
        }
    },
    {
        id: 78,
        name: 'Mana Kristali',
        type: CardType.SPELL,
        rarity: Rarity.COMMON,
        cost: 0,
        attack: null,
        health: null,
        abilities: [],
        description: '+1 boş mana kristali.',
        lore: 'Enerji kaynağı.',
        icon: '💎',
        effect: (game) => {
            game.addManaCrystals(1);
        }
    },
    {
        id: 79,
        name: 'Zırh Parçası',
        type: CardType.ARTIFACT,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: null,
        health: null,
        abilities: [],
        description: '+2 zırh kazan.',
        lore: 'Basit zırh.',
        icon: '🛡️',
        effect: (game) => {
            game.addArmor(2);
        }
    },
    {
        id: 80,
        name: 'Şans Tılsımı',
        type: CardType.ARTIFACT,
        rarity: Rarity.COMMON,
        cost: 1,
        attack: null,
        health: null,
        abilities: [],
        description: '1 kart çek.',
        lore: 'Şans getiren tılsım.',
        icon: '🍀',
        effect: (game) => {
            game.drawCards(1);
        }
    }
];

// Helper Functions
function getCardById(id) {
    return CARD_DATABASE.find(card => card.id === id);
}

function getCardsByType(type) {
    return CARD_DATABASE.filter(card => card.type === type);
}

function getCardsByRarity(rarity) {
    return CARD_DATABASE.filter(card => card.rarity === rarity);
}

function getAllCards() {
    return [...CARD_DATABASE];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CARD_DATABASE,
        CardType,
        Rarity,
        Ability,
        getCardById,
        getCardsByType,
        getCardsByRarity,
        getAllCards
    };
}
