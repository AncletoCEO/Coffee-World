// AncletoCoffeeWorld - Lógica del Juego

// Variables del juego
let coffee = 0;
let totalCoffee = 0;
let cps = 0; // Café por segundo
let charisma = 0;
let coffeeStrength = 0;
let upgrades = {
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
let achievements = [];
let consoleVisible = false;
let currentBoss = null;
let defeatedBosses = [];
let bosses = [
    { name: "Minion de Lucía", health: 200, maxHealth: 200, reward: 50, spawnAt: 1000 },
    { name: "Niebla Azul", health: 800, maxHealth: 800, reward: 300, spawnAt: 5000 },
    { name: "Lucía", health: 2000, maxHealth: 2000, reward: 1500, spawnAt: 50000 }
];

// Variables de cooldown
let lastMailTime = 0;
let lastWorkTime = 0;
let lastFightTime = 0;

// Variables de exploración
let inDungeon = false;
let currentDungeon = null;
let playerPos = { x: 0, y: 0 };
let dungeons = {
    cafeteriaOscura: {
        unlocked: false,
        unlockAt: 1000,
        map: [
            ['#','#','#','#','#'],
            ['#','.','M','.','#'],
            ['#','.','.','.','#'],
            ['#','M','P','.','#'],
            ['#','#','#','#','#']
        ],
        monsters: { M: { name: 'Café Amargo', health: 50, reward: 10 } },
        exit: { x: 4, y: 2 }
    },
    bodegaSecreta: {
        unlocked: false,
        unlockAt: 10000,
        map: [
            ['#','#','#','#','#','#'],
            ['#','.','M','.','M','#'],
            ['#','.','.','.','.','#'],
            ['#','M','P','.','M','#'],
            ['#','.','.','.','.','#'],
            ['#','#','#','#','#','#']
        ],
        monsters: { M: { name: 'Grano Maldito', health: 100, reward: 50 } },
        exit: { x: 5, y: 3 }
    }
};

// Elementos del DOM
const coffeeDisplay = document.getElementById('coffee');
const cpsDisplay = document.getElementById('cps');
const totalCoffeeDisplay = document.getElementById('totalCoffee');
const charismaDisplay = document.getElementById('charisma');
const coffeeStrengthDisplay = document.getElementById('coffeeStrength');
const bossNameDisplay = document.getElementById('bossName');
const bossHealthDisplay = document.getElementById('bossHealth');
const bossMaxHealthDisplay = document.getElementById('bossMaxHealth');
const dpsDisplay = document.getElementById('dps');
const fightBossButton = document.getElementById('fightBoss');
const donateBtn = document.getElementById('donateBtn');
const sendMailBtn = document.getElementById('sendMailBtn');
const soundToggle = document.getElementById('soundToggle');
const consoleToggle = document.getElementById('consoleToggle');
const resetGame = document.getElementById('resetGame');
const currentActDisplay = document.getElementById('currentAct');
const actDescriptionDisplay = document.getElementById('actDescription');
const consoleOutput = document.getElementById('consoleOutput');
const consoleInput = document.getElementById('consoleInput');
const csvFileInput = document.getElementById('csvFileInput');

// Event listeners
csvFileInput.addEventListener('change', loadFromCSV);
const upgradeButtons = {
    upgrade1: document.getElementById('upgrade1'),
    upgrade2: document.getElementById('upgrade2'),
    upgrade3: document.getElementById('upgrade3'),
    upgrade4: document.getElementById('upgrade4'),
    upgrade5: document.getElementById('upgrade5'),
    upgrade6: document.getElementById('upgrade6'),
    upgrade7: document.getElementById('upgrade7'),
    upgrade8: document.getElementById('upgrade8'),
    upgrade9: document.getElementById('upgrade9'),
    upgrade10: document.getElementById('upgrade10')
};
const achievementList = document.getElementById('achievementList');
const narrativeTextDisplay = document.getElementById('narrativeText');

// Cargar progreso desde LocalStorage
function loadGame() {
    const saved = localStorage.getItem('ancletoCoffeeWorld');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            coffee = parseFloat(data.coffee) || 0;
            totalCoffee = parseFloat(data.totalCoffee) || 0;
            cps = parseFloat(data.cps) || 0;
            charisma = parseInt(data.charisma) || 0;
            coffeeStrength = parseInt(data.coffeeStrength) || 0;
            upgrades = data.upgrades || upgrades;
            achievements = data.achievements || [];
            currentBoss = data.currentBoss || null;
            defeatedBosses = data.defeatedBosses || [];
            if (data.dungeons) {
                for (const [name, dungeon] of Object.entries(data.dungeons)) {
                    if (dungeons[name]) {
                        dungeons[name].unlocked = dungeon.unlocked;
                        dungeons[name].map = dungeon.map; // Para preservar cambios como monstruos derrotados
                    }
                }
            }
            lastMailTime = parseInt(data.lastMailTime) || 0;
            lastWorkTime = parseInt(data.lastWorkTime) || 0;
            lastFightTime = parseInt(data.lastFightTime) || 0;
        } catch (e) {
            console.error('Error cargando datos guardados:', e);
            // Reinicializar valores por defecto si hay error
            coffee = 0;
            totalCoffee = 0;
            cps = 0;
            charisma = 0;
            coffeeStrength = 0;
        }
    }
    // Validar valores después de cargar
    validateGameValues();
    updateDisplay();
    updateAchievements();
    updateBossDisplay();
    updateStory();
    updateMailButton();
}

// Resetear juego
function resetGameData() {
    if (confirm('¿Estás seguro de que quieres eliminar toda tu partida y empezar de cero? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('ancletoCoffeeWorld');
        coffee = 0;
        totalCoffee = 0;
        cps = 0;
        charisma = 0;
        coffeeStrength = 0;
        achievements = [];
        currentBoss = null;
        defeatedBosses = [];
        lastMailTime = 0;
        lastWorkTime = 0;
        lastFightTime = 0;
        
        // Resetear upgrades
        for (const key in upgrades) {
            upgrades[key].owned = 0;
        }
        
        // Resetear dungeons
        for (const name in dungeons) {
            dungeons[name].unlocked = false;
            dungeons[name].map = JSON.parse(JSON.stringify(dungeons[name].map)); // Reset map
        }
        
        updateDisplay();
        updateAchievements();
        updateBossDisplay();
        updateStory();
        updateMailButton();
        consoleLog('Juego reseteado. ¡Bienvenido de nuevo a AncletoCoffeeWorld!');
    }
}

// Guardar progreso en LocalStorage
function saveGame() {
    const data = {
        coffee,
        totalCoffee,
        cps,
        charisma,
        coffeeStrength,
        upgrades,
        achievements,
        currentBoss,
        defeatedBosses,
        dungeons,
        lastMailTime,
        lastWorkTime,
        lastFightTime
    };
    localStorage.setItem('ancletoCoffeeWorld', JSON.stringify(data));
}

// Funciones para CSV
function saveToCSV() {
    const data = {
        coffee,
        totalCoffee,
        cps,
        charisma,
        coffeeStrength,
        upgrades: JSON.stringify(upgrades),
        achievements: JSON.stringify(achievements),
        currentBoss: JSON.stringify(currentBoss),
        defeatedBosses: JSON.stringify(defeatedBosses),
        dungeons: JSON.stringify(dungeons),
        lastMailTime,
        lastWorkTime,
        lastFightTime
    };
    const csvContent = 'data:text/csv;charset=utf-8,' + 
        Object.keys(data).join(',') + '\n' + 
        Object.values(data).join(',');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ancleto_save.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    consoleLog('Progreso guardado en CSV.');
}

function loadFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const values = lines[1].split(',');
        const data = {};
        headers.forEach((h, i) => data[h] = values[i]);
        
        coffee = parseFloat(data.coffee) || 0;
        totalCoffee = parseFloat(data.totalCoffee) || 0;
        cps = parseFloat(data.cps) || 0;
        charisma = parseInt(data.charisma) || 0;
        coffeeStrength = parseInt(data.coffeeStrength) || 0;
        upgrades = JSON.parse(data.upgrades) || upgrades;
        achievements = JSON.parse(data.achievements) || [];
        currentBoss = JSON.parse(data.currentBoss) || null;
        defeatedBosses = JSON.parse(data.defeatedBosses) || [];
        if (data.dungeons) dungeons = JSON.parse(data.dungeons);
        lastMailTime = parseInt(data.lastMailTime) || 0;
        lastWorkTime = parseInt(data.lastWorkTime) || 0;
        lastFightTime = parseInt(data.lastFightTime) || 0;
        
        updateDisplay();
        updateAchievements();
        updateBossDisplay();
        updateStory();
        updateMailButton();
        consoleLog('Progreso cargado desde CSV.');
    };
    reader.readAsText(file);
}

// Función para log en consola
function consoleLog(message) {
    const p = document.createElement('p');
    p.textContent = '> ' + message;
    consoleOutput.appendChild(p);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Función utilitaria para validar y corregir valores numéricos
function validateGameValues() {
    if (isNaN(coffee) || coffee < 0) coffee = 0;
    if (isNaN(totalCoffee) || totalCoffee < 0) totalCoffee = 0;
    if (isNaN(cps) || cps < 0) cps = 0;
    if (isNaN(charisma) || charisma < 0) charisma = 0;
    if (isNaN(coffeeStrength) || coffeeStrength < 0) coffeeStrength = 0;
    
    // Validar upgrades
    for (const [key, upgrade] of Object.entries(upgrades)) {
        if (isNaN(upgrade.owned) || upgrade.owned < 0) upgrade.owned = 0;
        if (isNaN(upgrade.cost) || upgrade.cost < 0) upgrade.cost = 10;
    }
}

// Funciones de manejo de comandos
function handleBuyCommand(target) {
    const upgradeMap = {
        'machine': 'upgrade1', 'máquina verde': 'upgrade1',
        'charlas': 'upgrade2', 'charlas motivacionales': 'upgrade2',
        'tamper': 'upgrade3', 'tamper de acero': 'upgrade3',
        'colombiano': 'upgrade4', 'café colombiano': 'upgrade4',
        'guardianes': 'upgrade5', 'perros guardianes': 'upgrade5',
        'vergüenza': 'upgrade6', 'lista de vergüenza': 'upgrade6',
        'cupping': 'upgrade7', 'viernes de cupping': 'upgrade7',
        'sifón': 'upgrade8', 'sifón japonés': 'upgrade8',
        'filtros': 'upgrade9', 'filtros sql': 'upgrade9',
        'corporativos': 'upgrade10', 'comunicaciones corporativas': 'upgrade10'
    };
    
    const upgradeKey = upgradeMap[target];
    if (upgradeKey) {
        buyUpgrade(upgradeKey);
        consoleLog(`Compraste ${upgrades[upgradeKey].name}`);
    } else {
        consoleLog('Upgrade no encontrado. Usa: buy [nombre]');
    }
}

function handleFightCommand() {
    fightBoss();
    consoleLog('Atacando al boss...');
}

function handleListCommand(target) {
    if (target === 'upgrades' || target === '') {
        const upgradeList = [
            '1. Máquina Verde: +1 CPS (Costo: 10 café)',
            '2. Charlas Motivacionales: +5 CPS (Costo: 100 café)',
            '3. Tamper de Acero: +20 CPS (Costo: 500 café)',
            '4. Café Colombiano: +2 Carisma (Costo: 200 café)',
            '5. Perros Guardianes: +10 Fuerza Cafetera (Costo: 1000 café)',
            '6. Lista de Vergüenza: +50 CPS (Costo: 5000 café)',
            '7. Viernes de Cupping: +100 CPS (Costo: 10000 café)',
            '8. Sifón Japonés: +5 Carisma (Costo: 20000 café)',
            '9. Filtros SQL: +20 Fuerza Cafetera (Costo: 50000 café)',
            '10. Comunicaciones Corporativas: +200 CPS (Costo: 100000 café)'
        ];
        consoleLog('Upgrades disponibles:\n' + upgradeList.join('\n'));
    } else if (target === 'achievements') {
        let achList = 'Logros obtenidos:\n';
        achievements.forEach(ach => {
            achList += `- ${typeof ach === 'string' ? ach : ach.name}: ${ach.description || ''}\n`;
        });
        if (achievements.length === 0) achList += 'Ninguno aún.\n';
        consoleLog(achList);
    } else {
        consoleLog('Usa: list upgrades o list achievements');
    }
}

function handleBossCommand() {
    if (currentBoss) {
        const dps = charisma + coffeeStrength;
        consoleLog(`Boss: ${currentBoss.name} | Vida: ${currentBoss.health}/${currentBoss.maxHealth} | DPS: ${dps}`);
    } else {
        consoleLog('No hay boss activo.');
    }
}

function handleSaveCommand() {
    saveGame();
    consoleLog('Juego guardado.');
}

function handleLoadCommand() {
    loadGame();
    consoleLog('Juego cargado.');
}

function handleStatusCommand() {
    consoleLog(`Café: ${Math.floor(coffee)} | CPS: ${cps} | Carisma: ${charisma} | Fuerza: ${coffeeStrength}`);
}

function handleExploreCommand(target) {
    const dungeonMap = {
        'cafeteria oscura': 'cafeteriaOscura',
        'bodega secreta': 'bodegaSecreta'
    };
    
    const dungeonKey = dungeonMap[target];
    if (dungeonKey) {
        enterDungeon(dungeonKey);
    } else {
        consoleLog('Mazmorras disponibles: cafeteria oscura, bodega secreta (si desbloqueadas)');
    }
}

function handleGoCommand(target) {
    if (!inDungeon) {
        consoleLog('Primero explora una mazmorra.');
        return;
    }
    
    const directions = {
        'north': [0, -1],
        'south': [0, 1],
        'east': [1, 0],
        'west': [-1, 0]
    };
    
    const direction = directions[target];
    if (direction) {
        movePlayer(direction[0], direction[1]);
    } else {
        consoleLog('Direcciones: north, south, east, west');
    }
}

function handleExitCommand() {
    if (inDungeon) {
        exitDungeon();
    } else {
        consoleLog('No estás en una mazmorra.');
    }
}

function handleMailCommand() {
    sendMail();
}

function handleWorkCommand() {
    work();
}

function handleDungeonsCommand() {
    let dungeonList = 'Mazmorras disponibles:\n';
    for (const [name, dungeon] of Object.entries(dungeons)) {
        if (dungeon.unlocked) {
            dungeonList += `- ${name.replace(/([A-Z])/g, ' $1').toLowerCase()}\n`;
        }
    }
    if (dungeonList === 'Mazmorras disponibles:\n') {
        dungeonList += 'Ninguna aún. Derrota bosses para desbloquear.';
    }
    consoleLog(dungeonList);
}

function handleSaveCSVCommand() {
    saveToCSV();
}

function handleLoadCSVCommand() {
    document.getElementById('csvFileInput').click();
}

function handleHelpCommand() {
    consoleLog('Comandos: buy [upgrade], fight, donate, mail, work, dungeons, list [upgrades/achievements], boss, save, load, status, explore [mazmorra], go [direccion], exit, savecsv, loadcsv, fixnan, help');
}

// Comandos de cheat
function handleAddCoffeeCommand(target) {
    const amount = parseInt(target) || 1000;
    coffee += amount;
    totalCoffee += amount;
    consoleLog(`Cheat activado: +${amount} café.`);
    updateDisplay();
    saveGame();
}

function handleGodModeCommand() {
    coffee += 100000;
    totalCoffee += 100000;
    charisma += 100;
    coffeeStrength += 100;
    consoleLog('Modo dios activado: Café, carisma y fuerza máxima.');
    updateDisplay();
    saveGame();
}

function handleMaxUpgradesCommand() {
    for (const key in upgrades) {
        upgrades[key].owned += 10;
    }
    updateDisplay();
    consoleLog('Cheat: Todos los upgrades maximizados.');
    saveGame();
}

function handleKillBossCommand() {
    if (currentBoss) {
        coffee += currentBoss.reward;
        totalCoffee += currentBoss.reward;
        defeatedBosses.push(currentBoss.name);
        consoleLog(`Cheat: ${currentBoss.name} derrotado instantáneamente.`);
        currentBoss = null;
        updateBossDisplay();
        updateDisplay();
        saveGame();
    } else {
        consoleLog('No hay boss activo.');
    }
}

function handleUnlockAllCommand() {
    for (const name in dungeons) {
        dungeons[name].unlocked = true;
    }
    consoleLog('Cheat: Todas las mazmorras desbloqueadas.');
    updateDisplay();
    saveGame();
}

function handleFixNaNCommand() {
    validateGameValues();
    consoleLog('Valores NaN corregidos. Juego restaurado.');
    updateDisplay();
    saveGame();
}

// Comandos disponibles
const commands = {
    buy: handleBuyCommand,
    fight: handleFightCommand,
    list: handleListCommand,
    boss: handleBossCommand,
    save: handleSaveCommand,
    load: handleLoadCommand,
    status: handleStatusCommand,
    explore: handleExploreCommand,
    go: handleGoCommand,
    exit: handleExitCommand,
    mail: handleMailCommand,
    work: handleWorkCommand,
    dungeons: handleDungeonsCommand,
    savecsv: handleSaveCSVCommand,
    loadcsv: handleLoadCSVCommand,
    help: handleHelpCommand,
    // Cheats
    addcoffee: handleAddCoffeeCommand,
    godmode: handleGodModeCommand,
    maxupgrades: handleMaxUpgradesCommand,
    killboss: handleKillBossCommand,
    unlockall: handleUnlockAllCommand,
    fixnan: handleFixNaNCommand
};

// Manejar comandos
function handleCommand(command) {
    const parts = command.toLowerCase().split(' ');
    const action = parts[0];
    const target = parts.slice(1).join(' ');

    const commandHandler = commands[action];
    if (commandHandler) {
        commandHandler(target);
    } else {
        consoleLog('Comando desconocido. Escribe "help" para ayuda.');
    }
}

// Actualizar historia
function updateStory() {
    const storyActs = [
        {
            threshold: 0,
            act: "Acto 1: Fundación de la Cultura Cafetera",
            desc: "Como Ancleto, decides que el café no es solo un break, sino un ritual diario. Comienzas recolectando café básico automáticamente.",
            narrative: "🌱 Inicio humilde: cada grano cuenta en tu imperio cafetero."
        },
        {
            threshold: 100,
            act: "Acto 2: La Crisis de Arganaraz",
            desc: "Damian Arganaraz envía renuncia dramática pidiendo cobrar. Lo convences con 'tómate un café'.",
            narrative: "☕ Crisis resuelta: el poder del café une al equipo."
        },
        {
            threshold: 1000,
            act: "Acto 3: La Cruzada contra Lucía",
            desc: "Lucía secuestra familia y hámster. Damian aporta 900% para financiar defensa.",
            narrative: "⚔️ Guerra declarada: tu carisma cafetero será tu arma."
        },
        {
            threshold: 5000,
            act: "Acto 4: Ascenso y Reconocimientos",
            desc: "Matías se convierte en CEO honorario. Damian VP Junior. El imperio crece.",
            narrative: "👑 Expansión exitosa: liderazgo y café van de la mano."
        },
        {
            threshold: 20000,
            act: "Acto 5: Viajes Globales",
            desc: "Viajes a Estambul, Kioto, Milán para analizar cafeteras. Conocimiento global.",
            narrative: "🌍 Sabiduría mundial: cada cultura aporta su secreto cafetero."
        },
        {
            threshold: 50000,
            act: "Acto 6: Revolución Tecnológica",
            desc: "Implementas sistemas SQL y automatización. La tecnología potencia tu imperio.",
            narrative: "💻 Era digital: café y código trabajando juntos."
        },
        {
            threshold: 100000,
            act: "Acto 7: Resolución Técnica y Legado",
            desc: "Error Divide by Zero en compensatorios resuelto. Damian comprende la perfección técnica.",
            narrative: "🏆 Maestría absoluta: tu legado cafetero será eterno."
        }
    ];
    
    // Encontrar el acto actual
    let currentStoryAct = storyActs[0];
    for (let i = storyActs.length - 1; i >= 0; i--) {
        if (totalCoffee >= storyActs[i].threshold) {
            currentStoryAct = storyActs[i];
            break;
        }
    }
    
    // Actualizar elementos del DOM si existen
    if (currentActDisplay) {
        currentActDisplay.textContent = currentStoryAct.act;
    }
    if (actDescriptionDisplay) {
        actDescriptionDisplay.textContent = currentStoryAct.desc;
    }
    
    // Mostrar narrativa especial en logros importantes
    const nextAct = storyActs.find(act => act.threshold > totalCoffee);
    if (nextAct) {
        const progress = Math.floor((totalCoffee / nextAct.threshold) * 100);
        if (progress >= 90 && !achievements.includes(`Próximo: ${nextAct.act}`)) {
            showNarrative(`🎯 ${progress}% completado hacia: ${nextAct.act}`);
        }
    }
    
    // Mostrar narrativa del acto actual si es nuevo
    const lastAct = localStorage.getItem('lastStoryAct');
    if (lastAct !== currentStoryAct.act) {
        showNarrative(currentStoryAct.narrative);
        localStorage.setItem('lastStoryAct', currentStoryAct.act);
        consoleLog(`📖 ${currentStoryAct.act}: ${currentStoryAct.desc}`);
    }

    // Mostrar créditos al final
    const creditsSection = document.getElementById('credits');
    if (creditsSection) {
        if (totalCoffee >= 100000) {
            creditsSection.style.display = 'block';
            if (!achievements.includes('Leyenda Cafetera')) {
                achievements.push('Leyenda Cafetera');
                consoleLog('🏆 ¡LOGRO ÉPICO DESBLOQUEADO: Leyenda Cafetera!');
                updateAchievements();
            }
        } else {
            creditsSection.style.display = 'none';
        }
    }
}

// Mostrar mensaje narrativo
function showNarrative(message) {
    if (narrativeTextDisplay) {
        narrativeTextDisplay.textContent = message;
        // Agregar una animación sutil para que el usuario note el cambio
        narrativeTextDisplay.style.opacity = '0.7';
        setTimeout(() => {
            if (narrativeTextDisplay) {
                narrativeTextDisplay.style.opacity = '1';
            }
        }, 100);
    }
}

// Actualizar botón de mail
function updateMailButton() {
    const remaining = Math.max(0, 120000 - (Date.now() - lastMailTime));
    if (remaining > 0) {
        const seconds = Math.ceil(remaining / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        sendMailBtn.textContent = `Mail (${minutes}:${secs.toString().padStart(2, '0')})`;
        sendMailBtn.disabled = true;
        sendMailBtn.classList.add('cooldown');
    } else {
        sendMailBtn.textContent = 'Enviar Mail Corporativo';
        sendMailBtn.disabled = false;
        sendMailBtn.classList.remove('cooldown');
    }
}

// Actualizar la interfaz
function updateDisplay() {
    // Validar valores antes de mostrar
    validateGameValues();
    
    coffeeDisplay.textContent = Math.floor(coffee);
    cpsDisplay.textContent = cps;
    totalCoffeeDisplay.textContent = Math.floor(totalCoffee);
    charismaDisplay.textContent = charisma;
    coffeeStrengthDisplay.textContent = coffeeStrength;

    // Actualizar botones de upgrades
    for (const [key, upgrade] of Object.entries(upgrades)) {
        const button = upgradeButtons[key];
        const cost = upgrade.cost * Math.pow(1.15, upgrade.owned); // Aumento de costo
        let desc = '';
        if (upgrade.cpsIncrease) desc += `+${upgrade.cpsIncrease} CPS `;
        if (upgrade.charismaIncrease) desc += `+${upgrade.charismaIncrease} Carisma `;
        if (upgrade.coffeeStrengthIncrease) desc += `+${upgrade.coffeeStrengthIncrease} Fuerza Cafetera `;
        button.textContent = `${upgrade.name}: ${desc.trim()} (Costo: ${Math.floor(cost)} café)`;
        button.disabled = coffee < cost;
    }

    // Desbloquear mazmorras
    if (!dungeons.cafeteriaOscura.unlocked && defeatedBosses.includes('Minion de Lucía')) {
        dungeons.cafeteriaOscura.unlocked = true;
        consoleLog('¡Nueva mazmorra desbloqueada: cafeteria oscura!');
    }
    if (!dungeons.bodegaSecreta.unlocked && defeatedBosses.includes('Niebla Azul')) {
        dungeons.bodegaSecreta.unlocked = true;
        consoleLog('¡Nueva mazmorra desbloqueada: bodega secreta!');
    }
    
    // Actualizar botón de mail
    updateMailButton();
    
    // Actualizar display del boss para cooldowns
    updateBossDisplay();
}

// Funciones de exploración
function displayMap() {
    if (!inDungeon || !currentDungeon) return;
    let mapStr = 'Mapa actual:\n';
    for (let y = 0; y < currentDungeon.map.length; y++) {
        for (let x = 0; x < currentDungeon.map[y].length; x++) {
            if (x === playerPos.x && y === playerPos.y) {
                mapStr += '@';
            } else {
                mapStr += currentDungeon.map[y][x];
            }
        }
        mapStr += '\n';
    }
    consoleLog(mapStr);
}

function enterDungeon(name) {
    if (!dungeons[name] || !dungeons[name].unlocked) {
        consoleLog('Mazmorra no disponible.');
        return;
    }
    inDungeon = true;
    currentDungeon = dungeons[name];
    playerPos = { x: 2, y: 3 }; // Posición inicial
    consoleLog(`Entrando a ${name.replace(/([A-Z])/g, ' $1').toLowerCase()}...`);
    displayMap();
}

function exitDungeon() {
    inDungeon = false;
    currentDungeon = null;
    consoleLog('Saliendo de la mazmorra.');
}

function movePlayer(dx, dy) {
    if (!inDungeon) {
        consoleLog('No estás en una mazmorra.');
        return;
    }
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    if (newX < 0 || newX >= currentDungeon.map[0].length || newY < 0 || newY >= currentDungeon.map.length) {
        consoleLog('No puedes ir ahí.');
        return;
    }
    const tile = currentDungeon.map[newY][newX];
    if (tile === '#') {
        consoleLog('¡Pared! No puedes pasar.');
        return;
    }
    playerPos.x = newX;
    playerPos.y = newY;
    if (tile === 'M') {
        // Luchar automáticamente
        const monster = currentDungeon.monsters[tile];
        consoleLog(`¡Encuentras a ${monster.name}! Luchando...`);
        // Simular combate automático basado en fuerza
        const damage = coffeeStrength + charisma;
        if (damage >= monster.health) {
            coffee += monster.reward;
            consoleLog(`¡Derrotaste a ${monster.name}! Ganaste ${monster.reward} café.`);
            currentDungeon.map[newY][newX] = '.'; // Remover monstruo
        } else {
            consoleLog(`¡${monster.name} te derrotó! Perdiste ${Math.floor(monster.reward / 2)} café.`);
            coffee = Math.max(0, coffee - Math.floor(monster.reward / 2));
        }
    } else if (newX === currentDungeon.exit.x && newY === currentDungeon.exit.y) {
        consoleLog('¡Encontraste la salida!');
        exitDungeon();
        return;
    }
    displayMap();
}

// Producción automática
function produceCoffee() {
    // Validar valores antes de calcular
    validateGameValues();
    
    coffee += cps;
    totalCoffee += cps;
    spawnBoss();
    // Los bosses ya no pelean automáticamente - el jugador debe usar el botón
    updateDisplay();
    checkAchievements();
    updateStory(); // Asegurar que la historia se actualice
    saveGame();
}

// Comprar upgrade
function buyUpgrade(upgradeKey) {
    const upgrade = upgrades[upgradeKey];
    if (!upgrade) {
        consoleLog('Upgrade no encontrado.');
        return;
    }
    
    const cost = upgrade.cost * Math.pow(1.15, upgrade.owned);
    if (coffee >= cost) {
        coffee -= cost;
        upgrade.owned++;
        
        // Asegurar que los valores sean números válidos
        cps += upgrade.cpsIncrease || 0;
        charisma += upgrade.charismaIncrease || 0;
        coffeeStrength += upgrade.coffeeStrengthIncrease || 0;
        
        updateDisplay();
        saveGame();

        // Mensajes narrativos
        if (upgradeKey === 'upgrade1') {
            showNarrative("¡Excelente! La Máquina Verde es el inicio de tu imperio cafetero. Confía en mí, esto es solo el comienzo.");
        } else if (upgradeKey === 'upgrade2') {
            showNarrative("Charlas Motivacionales: nada motiva más que un buen café. ¡Sigue así!");
        } else if (upgradeKey === 'upgrade3') {
            showNarrative("El Tamper de Acero te hará fuerte. ¡Prepárate para batallas!");
        } else if (upgradeKey === 'upgrade4') {
            showNarrative("Café Colombiano puro. Damian dice que sabe a éxito.");
        } else if (upgradeKey === 'upgrade5') {
            showNarrative("Perros Guardianes: protegerán tu café de amenazas. ¡Woof!");
        } else if (upgradeKey === 'upgrade6') {
            showNarrative("Lista de Vergüenza: ¡No dones y aumenta tu producción por vergüenza!");
        } else if (upgradeKey === 'upgrade7') {
            showNarrative("Viernes de Cupping: ¡Celebremos con multiplicadores globales!");
        } else if (upgradeKey === 'upgrade8') {
            showNarrative("Sifón Japonés: viajes a Kioto para analizar cafeteras. ¡Qué inspirador!");
        } else if (upgradeKey === 'upgrade9') {
            showNarrative("Filtros SQL: previenen errores de división. ¡Estabilidad técnica!");
        } else if (upgradeKey === 'upgrade10') {
            showNarrative("Comunicaciones Corporativas: envía mails automáticamente. ¡Eficiencia!");
        }
        playUpgradeSound();
    }
}

// Verificar logros
function checkAchievements() {
    const achievementData = [
        // Logros de progreso básico
        { threshold: 100, key: 'Primeros 100 granos', stat: 'totalCoffee', icon: '🌱' },
        { threshold: 1000, key: 'Café Milenario', stat: 'totalCoffee', icon: '🏆' },
        { threshold: 10000, key: 'Imperio en Crecimiento', stat: 'totalCoffee', icon: '🏢' },
        { threshold: 50000, key: 'Magnate Cafetero', stat: 'totalCoffee', icon: '💰' },
        { threshold: 100000, key: 'Emperador del Café', stat: 'totalCoffee', icon: '👑' },
        
        // Logros de producción
        { threshold: 10, key: 'Producción decente', stat: 'cps', icon: '⚡' },
        { threshold: 50, key: 'Máquina de café', stat: 'cps', icon: '☕' },
        { threshold: 200, key: 'Fábrica cafetera', stat: 'cps', icon: '🏭' },
        { threshold: 500, key: 'Industria global', stat: 'cps', icon: '🌍' },
        
        // Logros de carisma
        { threshold: 10, key: 'Carismático', stat: 'charisma', icon: '😊' },
        { threshold: 25, key: 'Líder Natural', stat: 'charisma', icon: '👨‍💼' },
        { threshold: 50, key: 'CEO Carismático', stat: 'charisma', icon: '🎩' },
        
        // Logros de fuerza
        { threshold: 20, key: 'Fuerte Cafetero', stat: 'coffeeStrength', icon: '💪' },
        { threshold: 50, key: 'Guerrero del Café', stat: 'coffeeStrength', icon: '⚔️' },
        { threshold: 100, key: 'Leyenda de Batalla', stat: 'coffeeStrength', icon: '🛡️' },
        
        // Logros de bosses
        { threshold: 1, key: 'Primer Derrotado', stat: 'defeatedBosses', icon: '🥇' },
        { threshold: 2, key: 'Cazador de Jefes', stat: 'defeatedBosses', icon: '🎯' },
        { threshold: 3, key: 'Maestro Cafetero', stat: 'defeatedBosses', icon: '🏅' }
    ];
    
    // Logros especiales
    const specialAchievements = [
        {
            condition: () => Object.values(upgrades).reduce((sum, u) => sum + u.owned, 0) >= 10,
            key: 'Coleccionista',
            icon: '📦'
        },
        {
            condition: () => Object.values(upgrades).reduce((sum, u) => sum + u.owned, 0) >= 50,
            key: 'Acumulador Supremo',
            icon: '🗃️'
        },
        {
            condition: () => Object.values(dungeons).filter(d => d.unlocked).length >= 2,
            key: 'Explorador de Mazmorras',
            icon: '🗺️'
        },
        {
            condition: () => totalCoffee >= 1000 && charisma >= 10 && coffeeStrength >= 10,
            key: 'Triple Amenaza',
            icon: '⭐'
        },
        {
            condition: () => cps >= 100 && totalCoffee < 50000,
            key: 'Eficiencia Extrema',
            icon: '⚡'
        }
    ];
    
    // Verificar logros normales
    achievementData.forEach(achievement => {
        let currentValue;
        switch (achievement.stat) {
            case 'totalCoffee':
                currentValue = totalCoffee;
                break;
            case 'cps':
                currentValue = cps;
                break;
            case 'charisma':
                currentValue = charisma;
                break;
            case 'coffeeStrength':
                currentValue = coffeeStrength;
                break;
            case 'defeatedBosses':
                currentValue = defeatedBosses.length;
                break;
        }
        
        if (currentValue >= achievement.threshold && !achievements.includes(achievement.key)) {
            achievements.push(achievement.key);
            consoleLog(`${achievement.icon} ¡LOGRO DESBLOQUEADO: ${achievement.key}!`);
            updateAchievements();
            playEventSound();
        }
    });
    
    // Verificar logros especiales
    specialAchievements.forEach(achievement => {
        if (achievement.condition() && !achievements.includes(achievement.key)) {
            achievements.push(achievement.key);
            consoleLog(`${achievement.icon} ¡LOGRO ESPECIAL: ${achievement.key}!`);
            updateAchievements();
            playEventSound();
        }
    });
}

// Actualizar display del boss
function updateBossDisplay() {
    if (currentBoss) {
        bossNameDisplay.textContent = currentBoss.name;
        bossHealthDisplay.textContent = Math.floor(currentBoss.health);
        bossMaxHealthDisplay.textContent = currentBoss.maxHealth;
        dpsDisplay.textContent = Math.max(1, Math.floor((charisma + coffeeStrength) * 0.5));
        fightBossButton.style.display = 'inline-block';
        
        // Actualizar cooldown del botón de luchar
        const remaining = Math.max(0, 2000 - (Date.now() - lastFightTime));
        if (remaining > 0) {
            const seconds = Math.ceil(remaining / 1000);
            fightBossButton.textContent = `Luchar (${seconds}s)`;
            fightBossButton.disabled = true;
            fightBossButton.classList.add('cooldown');
        } else {
            fightBossButton.textContent = 'Luchar contra Boss';
            fightBossButton.disabled = false;
            fightBossButton.classList.remove('cooldown');
        }
    } else {
        bossNameDisplay.textContent = 'Ninguno';
        bossHealthDisplay.textContent = '0';
        bossMaxHealthDisplay.textContent = '0';
        dpsDisplay.textContent = '0';
        fightBossButton.style.display = 'none';
    }
}

// Spawnear boss si no hay uno y se cumple condición
function spawnBoss() {
    if (!currentBoss) {
        for (let boss of bosses) {
            if (totalCoffee >= boss.spawnAt && !defeatedBosses.includes(boss.name)) {
                currentBoss = { ...boss };
                updateBossDisplay();
                showNarrative(`¡Alerta! ${boss.name} ha aparecido. ¡Defiende tu imperio cafetero!`);
                break;
            }
        }
    }
}

// Luchar contra el boss
function fightBoss() {
    if (!currentBoss) {
        consoleLog('No hay boss activo para luchar.');
        return;
    }
    
    // Cooldown de 2 segundos entre ataques
    if (Date.now() - lastFightTime < 2000) {
        const remaining = Math.ceil((2000 - (Date.now() - lastFightTime)) / 1000);
        consoleLog(`Espera ${remaining} segundos antes de atacar de nuevo.`);
        return;
    }
    
    const damage = Math.max(1, Math.floor((charisma + coffeeStrength) * 0.5)); // Reducir daño para combates más largos
    currentBoss.health -= damage;
    lastFightTime = Date.now();
    
    consoleLog(`¡Atacas a ${currentBoss.name}! Daño: ${damage}. Vida restante: ${Math.max(0, currentBoss.health)}/${currentBoss.maxHealth}`);
    
    if (currentBoss.health <= 0) {
        coffee += currentBoss.reward;
        totalCoffee += currentBoss.reward;
        achievements.push(`Derrotaste a ${currentBoss.name}`);
        updateAchievements();
        defeatedBosses.push(currentBoss.name);
        showNarrative(`¡Victoria! Derrotaste a ${currentBoss.name}. ¡Tu imperio cafetero crece!`);
        consoleLog(`🏆 ¡Victoria! Derrotaste a ${currentBoss.name} y ganaste ${currentBoss.reward} café.`);
        playBossDefeatSound();
        currentBoss = null;
    }
    updateBossDisplay();
    updateDisplay();
    saveGame();
}

// Eventos especiales
function donate() {
    if (coffee >= 100) {
        coffee -= 100;
        cps *= 1.1; // +10% temporal
        showNarrative("¡Gracias por donar! Tu producción aumenta temporalmente.");
        playEventSound();
        updateDisplay();
        saveGame();
    }
}

function sendMail() {
    if (Date.now() - lastMailTime < 120000) { // 2 minutos cooldown
        const remaining = Math.ceil((120000 - (Date.now() - lastMailTime)) / 1000);
        consoleLog(`Espera ${remaining} segundos antes de enviar otro mail.`);
        return;
    }
    coffee += 50;
    totalCoffee += 50;
    lastMailTime = Date.now();
    showNarrative("Mail corporativo enviado. ¡Más café generado!");
    playEventSound();
    updateDisplay();
    updateMailButton();
    saveGame();
}

function work() {
    if (Date.now() - lastWorkTime < 5000) { // 5 segundos cooldown
        consoleLog('Espera 5 segundos antes de trabajar de nuevo.');
        return;
    }
    const earned = 20 + Math.floor(charisma / 2);
    coffee += earned;
    totalCoffee += earned;
    lastWorkTime = Date.now();
    consoleLog(`Trabajaste duro. Ganaste ${earned} café.`);
    updateDisplay();
    saveGame();
}

// Actualizar lista de logros
function updateAchievements() {
    achievementList.innerHTML = '';
    achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.textContent = achievement;
        achievementList.appendChild(li);
    });
}

// Event listeners para botones
upgradeButtons.upgrade1.addEventListener('click', () => buyUpgrade('upgrade1'));
upgradeButtons.upgrade2.addEventListener('click', () => buyUpgrade('upgrade2'));
upgradeButtons.upgrade3.addEventListener('click', () => buyUpgrade('upgrade3'));
upgradeButtons.upgrade4.addEventListener('click', () => buyUpgrade('upgrade4'));
upgradeButtons.upgrade5.addEventListener('click', () => buyUpgrade('upgrade5'));
upgradeButtons.upgrade6.addEventListener('click', () => buyUpgrade('upgrade6'));
upgradeButtons.upgrade7.addEventListener('click', () => buyUpgrade('upgrade7'));
upgradeButtons.upgrade8.addEventListener('click', () => buyUpgrade('upgrade8'));
upgradeButtons.upgrade9.addEventListener('click', () => buyUpgrade('upgrade9'));
upgradeButtons.upgrade10.addEventListener('click', () => buyUpgrade('upgrade10'));

fightBossButton.addEventListener('click', fightBoss);

soundToggle.addEventListener('click', toggleSound);

consoleToggle.addEventListener('click', () => {
    consoleVisible = !consoleVisible;
    const consoleSection = document.getElementById('console');
    consoleSection.style.display = consoleVisible ? 'block' : 'none';
    consoleToggle.textContent = `Consola: ${consoleVisible ? 'ON' : 'OFF'}`;
});

resetGame.addEventListener('click', resetGameData);

donateBtn.addEventListener('click', donate);
sendMailBtn.addEventListener('click', sendMail);

consoleInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const command = consoleInput.value.trim();
        if (command) {
            consoleLog(`> ${command}`);
            handleCommand(command);
            consoleInput.value = '';
        }
    }
});

// Sonidos
let audioContext;
let soundEnabled = true;

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('Web Audio API not supported');
    }
}

function playBeep(frequency = 440, duration = 200, type = 'sine') {
    if (!soundEnabled || !audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

function playUpgradeSound() {
    playBeep(523, 150); // C5
}

function playBossDefeatSound() {
    playBeep(659, 300); // E5
    setTimeout(() => playBeep(784, 300), 150); // G5
}

function playEventSound() {
    playBeep(349, 200); // F4
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? 'Sonido: ON' : 'Sonido: OFF';
}

// Iniciar el juego
initAudio();
loadGame();
consoleLog(`
   _____                      _____ _            _   __          __        _     _ _   
  / ____|                    / ____| |          | |  \\ \\        / /       | |   | | |  
 | |     ___  _ __  ___ ___  | |    | | ___  _ __| |_  \\ \\  /\\  / /__  _ __| | __| | |  
 | |    / _ \\| '_ \\/ __/ _ \\ | |    | |/ _ \\| '__| __|  \\ \\/  \\/ / _ \\| '__| |/ _\` | |  
 | |___| (_) | | | | (_|  __/ | |____| | (_) | |  | |_    \\  /\\  / (_) | |  | | (_| |_|  
  \\_____\\___/|_| |_|\\___\\___|  \\_____|_|\\___/|_|   \\__|    \\/  \\/ \\___/|_|  |_|\\__,_(_)  
                                                                                        
`);
consoleLog('Bienvenido a AncletoCoffeeWorld. Escribe "help" para comandos.');
setInterval(produceCoffee, 1000); // Producir cada segundo