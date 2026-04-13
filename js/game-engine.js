export const initialUpgrades = {
    upgrade1: { name: "Máquina Verde", owned: 0, cost: 10, cpsIncrease: 1, charismaIncrease: 1 },
    upgrade2: { name: "Charlas Motivacionales", owned: 0, cost: 100, cpsIncrease: 5, charismaIncrease: 2 },
    upgrade3: { name: "Tamper de Acero", owned: 0, cost: 500, cpsIncrease: 20, coffeeStrengthIncrease: 5 },
    upgrade4: { name: "Café Colombiano", owned: 0, cost: 200, charismaIncrease: 2 },
    upgrade5: { name: "Perros Guardianes", owned: 0, cost: 1000, coffeeStrengthIncrease: 10 },
    upgrade6: { name: "Lista de Vergüenza", owned: 0, cost: 5000, cpsIncrease: 50 },
    upgrade7: { name: "Viernes de Cupping", owned: 0, cost: 10000, cpsIncrease: 100 },
    upgrade8: { name: "Sifón Japonés", owned: 0, cost: 20000, charismaIncrease: 5 },
    upgrade9: { name: "Filtros SQL", owned: 0, cost: 50000, coffeeStrengthIncrease: 20 },
    upgrade10: { name: "Comunicaciones Corporativas", owned: 0, cost: 100000, cpsIncrease: 200 }
};

export const actLimits = {
    1: { maxCoffee: 5000, maxCoffeeStrength: 25 },
    2: { maxCoffee: 15000, maxCoffeeStrength: 50 },
    3: { maxCoffee: 30000, maxCoffeeStrength: 75 },
    4: { maxCoffee: 50000, maxCoffeeStrength: 100 },
    5: { maxCoffee: 75000, maxCoffeeStrength: 125 },
    6: { maxCoffee: 100000, maxCoffeeStrength: 150 }
};

export const initialBosses = [
    { name: "Damián Rebelde", health: 200, maxHealth: 200, reward: 100, spawnAt: 750, dungeon: "salaReuniones", act: 1 },
    { name: "Crisis de Arganaraz", health: 400, maxHealth: 400, reward: 200, spawnAt: 4000, dungeon: "cafeteriaOscura", act: 2 },
    { name: "Minion de Lucía", health: 600, maxHealth: 600, reward: 400, spawnAt: 8500, dungeon: "casaDamian", act: 3 },
    { name: "Sonrisa Inquebrantable", health: 1000, maxHealth: 1000, reward: 800, spawnAt: 17500, dungeon: "bodegaSecreta", act: 4 },
    { name: "Niebla Azul", health: 1500, maxHealth: 1500, reward: 1200, spawnAt: 27500, dungeon: "posadaPerros", act: 5 },
    { name: "Lucía Final", health: 3000, maxHealth: 3000, reward: 2000, spawnAt: 47500, dungeon: "oficinaCentral", act: 6 }
];

export function normalizeInteger(value, defaultValue = 0) {
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : defaultValue;
}

export function normalizeFloat(value, defaultValue = 0) {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : defaultValue;
}

export function validateGameValues(state) {
    state.coffee = normalizeFloat(state.coffee);
    state.totalCoffee = normalizeFloat(state.totalCoffee);
    state.cps = normalizeFloat(state.cps);
    state.charisma = normalizeInteger(state.charisma);
    state.coffeeStrength = normalizeInteger(state.coffeeStrength);
    state.lastMailTime = normalizeInteger(state.lastMailTime);
    state.lastWorkTime = normalizeInteger(state.lastWorkTime);
    state.lastFightTime = normalizeInteger(state.lastFightTime);
    state.donateEndTime = normalizeInteger(state.donateEndTime);
    state.lastDonateTime = normalizeInteger(state.lastDonateTime);
    state.currentDialogueIndex = normalizeInteger(state.currentDialogueIndex);

    if (Array.isArray(state.achievements) === false) {
        state.achievements = [];
    }
    if (Array.isArray(state.defeatedBosses) === false) {
        state.defeatedBosses = [];
    }

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9a3553f (Add Thursday Easter egg overlay and implement roguelike mode features)
    if (!state.persistentBonuses || typeof state.persistentBonuses !== 'object') {
        state.persistentBonuses = { cps: 1.0 };
    }
    state.persistentBonuses.cps = normalizeFloat(state.persistentBonuses.cps, 1.0);

<<<<<<< HEAD
=======
>>>>>>> 7d4ce85 (Superpowers (#8))
=======
>>>>>>> 9a3553f (Add Thursday Easter egg overlay and implement roguelike mode features)
    for (const key in state.upgrades) {
        const upgrade = state.upgrades[key];
        if (!upgrade || typeof upgrade !== 'object') {
            state.upgrades[key] = { ...initialUpgrades[key] };
            continue;
        }
        upgrade.owned = normalizeInteger(upgrade.owned);
        upgrade.cost = normalizeInteger(upgrade.cost, initialUpgrades[key]?.cost || 0);
    }
}

export function getUpgradeCost(upgrade) {
    return upgrade.cost * Math.pow(1.15, upgrade.owned);
}

export function getCurrentAct(totalCoffee) {
    if (totalCoffee >= 50000) return 6;
    if (totalCoffee >= 35000) return 5;
    if (totalCoffee >= 20000) return 4;
    if (totalCoffee >= 10000) return 3;
    if (totalCoffee >= 5000) return 2;
    return 1;
}

export function hasPendingBoss(state) {
    const currentAct = getCurrentAct(state.totalCoffee);
    return state.bosses.some(boss => boss.act === currentAct && state.totalCoffee >= boss.spawnAt && !state.defeatedBosses.includes(boss.name));
}

export function buyUpgrade(state, upgradeKey) {
    const upgrade = state.upgrades[upgradeKey];
    if (!upgrade) return false;

    const cost = getUpgradeCost(upgrade);
    const currentAct = getCurrentAct(state.totalCoffee);
    const limits = actLimits[currentAct] || null;
    const pendingBoss = hasPendingBoss(state);

    if (limits && state.totalCoffee >= limits.maxCoffee) {
        if (!pendingBoss || !upgrade.coffeeStrengthIncrease) {
            return false;
        }
    }

    if (limits && upgrade.coffeeStrengthIncrease && state.coffeeStrength >= limits.maxCoffeeStrength) {
        return false;
    }

    if (state.coffee < cost) {
        return false;
    }

    state.coffee -= cost;
    upgrade.owned += 1;
    state.cps += upgrade.cpsIncrease || 0;
    state.charisma += upgrade.charismaIncrease || 0;
    state.coffeeStrength += upgrade.coffeeStrengthIncrease || 0;
    return true;
}

export function calculateEffectiveCPS(state, now = Date.now()) {
    let effective = state.cps;
    if (now < state.donateEndTime) {
        effective *= 1.1;
    }
    if (state.thursdayModeUnlocked && typeof state.cpsMultiplier === 'number' && state.cpsMultiplier !== 1.0) {
        effective *= state.cpsMultiplier;
    }
<<<<<<< HEAD
<<<<<<< HEAD
    if (state.persistentBonuses && typeof state.persistentBonuses.cps === 'number' && state.persistentBonuses.cps !== 1.0) {
        effective *= state.persistentBonuses.cps;
    }
=======
>>>>>>> 7d4ce85 (Superpowers (#8))
=======
    if (state.persistentBonuses && typeof state.persistentBonuses.cps === 'number' && state.persistentBonuses.cps !== 1.0) {
        effective *= state.persistentBonuses.cps;
    }
>>>>>>> 9a3553f (Add Thursday Easter egg overlay and implement roguelike mode features)
    return effective;
}

export function produceCoffee(state, now = Date.now()) {
    validateGameValues(state);
    const effectiveCPS = calculateEffectiveCPS(state, now);
    state.coffee += effectiveCPS;
    state.totalCoffee += effectiveCPS;
    return effectiveCPS;
}

export function serializeState(state) {
    return JSON.stringify(state);
}

export function deserializeState(jsonString) {
    const parsed = JSON.parse(jsonString);
    const defaultState = createInitialState();
    const state = {
        ...defaultState,
        ...parsed,
        upgrades: parsed.upgrades ? { ...defaultState.upgrades, ...parsed.upgrades } : { ...defaultState.upgrades },
        achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
        defeatedBosses: Array.isArray(parsed.defeatedBosses) ? parsed.defeatedBosses : [],
<<<<<<< HEAD
<<<<<<< HEAD
        bosses: Array.isArray(parsed.bosses) ? parsed.bosses : defaultState.bosses,
        persistentBonuses: parsed.persistentBonuses || defaultState.persistentBonuses
=======
        bosses: Array.isArray(parsed.bosses) ? parsed.bosses : defaultState.bosses
>>>>>>> 7d4ce85 (Superpowers (#8))
=======
        bosses: Array.isArray(parsed.bosses) ? parsed.bosses : defaultState.bosses,
        persistentBonuses: parsed.persistentBonuses || defaultState.persistentBonuses
>>>>>>> 9a3553f (Add Thursday Easter egg overlay and implement roguelike mode features)
    };
    validateGameValues(state);
    return state;
}

export function createInitialState() {
    return {
        coffee: 0,
        totalCoffee: 0,
        cps: 0,
        charisma: 0,
        coffeeStrength: 0,
        upgrades: JSON.parse(JSON.stringify(initialUpgrades)),
        achievements: [],
        currentBoss: null,
        defeatedBosses: [],
        bosses: JSON.parse(JSON.stringify(initialBosses)),
        lastMailTime: 0,
        lastWorkTime: 0,
        lastFightTime: 0,
        donateEndTime: 0,
        lastDonateTime: 0,
        currentDialogueIndex: 0,
        thursdayModeUnlocked: false,
<<<<<<< HEAD
<<<<<<< HEAD
        cpsMultiplier: 1.0,
        persistentBonuses: { cps: 1.0 }
=======
        cpsMultiplier: 1.0
>>>>>>> 7d4ce85 (Superpowers (#8))
=======
        cpsMultiplier: 1.0,
        persistentBonuses: { cps: 1.0 }
>>>>>>> 9a3553f (Add Thursday Easter egg overlay and implement roguelike mode features)
    };
}
