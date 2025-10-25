// Test script for Coffee World progression
// This script simulates game progression to test if dungeons unlock correctly

// Mock browser environment
global.window = {};
global.document = {
    getElementById: () => null,
    createElement: () => ({ style: {}, textContent: '', appendChild: () => {} }),
    addEventListener: () => {}
};

// Load the game code
const fs = require('fs');
const gameCode = fs.readFileSync('js/game.js', 'utf8');

// Extract the relevant parts for testing
// We'll create a simplified version to test progression

// Test data
let testTotalCoffee = 0;
let testCurrentDialogueIndex = 0;
let testDefeatedBosses = [];
let testDungeons = {
    salaReuniones: { unlocked: false, unlockAt: 750 },
    cafeteriaOscura: { unlocked: false, unlockAt: 4000 },
    casaDamian: { unlocked: false, unlockAt: 8500 },
    bodegaSecreta: { unlocked: false, unlockAt: 17500 },
    posadaPerros: { unlocked: false, unlockAt: 27500 },
    oficinaCentral: { unlocked: false, unlockAt: 47500 }
};

// Simplified functions for testing
function getCurrentAct() {
    if (testTotalCoffee >= 50000) return 6;
    if (testTotalCoffee >= 35000) return 5;
    if (testTotalCoffee >= 20000) return 4;
    if (testTotalCoffee >= 10000) return 3;
    if (testTotalCoffee >= 5000) return 2;
    return 1;
}

function extractActNumber(actString) {
    const match = actString.match(/Acto (\d+)/);
    return match ? parseInt(match[1]) : 1;
}

function getLastDialogueIndexForAct(actNumber) {
    // Contar diálogos por acto
    const actCounts = {
        1: 10, // Acto 1: índices 0-9
        2: 10, // Acto 2: índices 10-19
        3: 5,  // Acto 3: índices 20-24
        4: 4,  // Acto 4: índices 25-28
        5: 4,  // Acto 5: índices 29-32
        6: 1   // Acto 6: índice 33+
    };

    let total = 0;
    for (let i = 1; i <= actNumber; i++) {
        total += actCounts[i] || 0;
    }
    return total - 1; // Último índice del acto
}

// Test progression
console.log('=== TESTING COFFEE WORLD PROGRESSION ===\n');

function testProgression() {
    let step = 0;

    // Simulate accumulating coffee and checking unlocks
    for (let coffee = 0; coffee <= 60000; coffee += 1000) {
        testTotalCoffee = coffee;

        // Test dungeon unlocks
        if (!testDungeons.salaReuniones.unlocked && testTotalCoffee >= testDungeons.salaReuniones.unlockAt) {
            testDungeons.salaReuniones.unlocked = true;
            console.log(`Step ${++step}: Sala de Reuniones unlocked at ${coffee} coffee`);
        }

        if (!testDungeons.cafeteriaOscura.unlocked && testCurrentDialogueIndex >= getLastDialogueIndexForAct(1)) {
            testDungeons.cafeteriaOscura.unlocked = true;
            console.log(`Step ${++step}: Cafeteria Oscura unlocked at dialogue ${testCurrentDialogueIndex} (should be after Act 1 complete)`);
        }

        if (!testDungeons.casaDamian.unlocked && testCurrentDialogueIndex >= getLastDialogueIndexForAct(2)) {
            testDungeons.casaDamian.unlocked = true;
            console.log(`Step ${++step}: Casa Damian unlocked at dialogue ${testCurrentDialogueIndex} (should be after Act 2 complete)`);
        }

        // Simulate dialogue progression (simplified)
        if (testCurrentDialogueIndex < 9 && coffee >= 1000 + (testCurrentDialogueIndex * 500)) {
            testCurrentDialogueIndex++;
            console.log(`Dialogue progressed to ${testCurrentDialogueIndex} at ${coffee} coffee`);
        }
    }

    console.log('\n=== FINAL STATE ===');
    console.log('Total Coffee:', testTotalCoffee);
    console.log('Current Dialogue:', testCurrentDialogueIndex);
    console.log('Dungeons Unlocked:', Object.keys(testDungeons).filter(key => testDungeons[key].unlocked));
}

testProgression();