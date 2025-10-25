// Ancleto's Coffee World - Lógica del Juego

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
    { name: "Damián Rebelde", health: 200, maxHealth: 200, reward: 100, spawnAt: 750, dungeon: "salaReuniones", act: 1, actEnd: 1000 },
    { name: "Crisis de Arganaraz", health: 400, maxHealth: 400, reward: 200, spawnAt: 4000, dungeon: "cafeteriaOscura", act: 2, actEnd: 5000 },
    { name: "Minion de Lucía", health: 600, maxHealth: 600, reward: 400, spawnAt: 8500, dungeon: "casaDamian", act: 3, actEnd: 10000 },
    { name: "Sonrisa Inquebrantable", health: 1000, maxHealth: 1000, reward: 800, spawnAt: 17500, dungeon: "bodegaSecreta", act: 4, actEnd: 20000 },
    { name: "Niebla Azul", health: 1500, maxHealth: 1500, reward: 1200, spawnAt: 27500, dungeon: "posadaPerros", act: 5, actEnd: 30000 },
    { name: "Lucía Final", health: 3000, maxHealth: 3000, reward: 2000, spawnAt: 47500, dungeon: "oficinaCentral", act: 6, actEnd: 50000 }
];

// Variables de cooldown
let lastMailTime = 0;
let lastWorkTime = 0;
let lastFightTime = 0;

// Sistema de diálogos progresivos basado en la historia completa de mails
let currentDialogueIndex = 0;
let dialogues = [
    {
        threshold: 0,
        act: "Acto 1: Fundación de la Cultura Cafetera",
        title: "El Inicio del Imperio Cafetero",
        message: "Soy Ancleto, el mejor CEO del mundo. Confía en mí: el café no es solo un break, sino un ritual diario. Comencemos recolectando granos automáticamente.",
        narrator: "Ancleto"
    },
    {
        threshold: 50,
        act: "Acto 1: Primeras Reflexiones",
        title: "La Cultura del Café",
        message: "En esta empresa, el café no es solo una infusión. Es un ritual, es el momento en que las ideas se cruzan y los proyectos se gestan.",
        narrator: "Ancleto"
    },
    {
        threshold: 100,
        act: "Acto 1: Solicitud Inicial",
        title: "Solicitud de Colaboración Financiera",
        message: "Estimado equipo, necesitamos invertir en cafeteras nuevas. Como el mejor CEO del mundo, sé exactamente cómo invertir cada peso para el bien común.",
        narrator: "Ancleto"
    },
    {
        threshold: 200,
        act: "Acto 1: Seguimiento",
        title: "Recordatorio de Donaciones",
        message: "He notado que algunos aún no han concretado su donación. Tu participación es fundamental para que todos disfrutemos de un espacio más ameno.",
        narrator: "Ancleto"
    },
    {
        threshold: 300,
        act: "Acto 1: Primera Resistencia",
        title: "Respuesta Desafiante",
        message: "Damián respondió 'yo hago lo que quiero'. Una actitud preocupante que requiere reflexión y, posiblemente, más café.",
        narrator: "Ancleto"
    },
    {
        threshold: 400,
        act: "Acto 1: Problemas Ortográficos",
        title: "Guerra al Diccionario",
        message: "Su nueva respuesta fue 'yo havlo como quiero'. Ahora declara la guerra tanto a la colaboración como a la gramática básica.",
        narrator: "Ancleto"
    },
    {
        threshold: 500,
        act: "Acto 1: Lista de la Vergüenza",
        title: "Llamado a la Responsabilidad",
        message: "He decidido crear la Lista de la Vergüenza. No como castigo, sino como recordatorio de que en esta empresa todos remamos juntos.",
        narrator: "Ancleto"
    },
    {
        threshold: 750,
        act: "Acto 1: Viajes Globales - Introducción",
        title: "Cruzada Global por la Excelencia",
        message: "He recorrido el mundo en busca de la cafetera perfecta. En Estambul negocié con comerciantes, en Kioto probé sifones alquímicos.",
        narrator: "Ancleto"
    },
    {
        threshold: 1000,
        act: "Acto 2: Crisis de Arganaraz",
        title: "Renuncia Operística",
        message: "Recibí una renuncia de Arganaraz: quiere desvincularse pero seguir cobrando. Una ópera barroca de emociones y propuestas laborales kafkianas.",
        narrator: "Ancleto"
    },
    {
        threshold: 1200,
        act: "Acto 2: Consejo Cafetero",
        title: "Tómate un Café y Respirá",
        message: "Le sugerí a Arganaraz: 'Tómate un café, preparalo bien, sentate tranquilo y respirá.' Porque las decisiones importantes no se toman en ayunas.",
        narrator: "Ancleto"
    },
    {
        threshold: 1500,
        act: "Acto 2: Reflexión de Arganaraz",
        title: "Delirio Administrativo Reconocido",
        message: "Arganaraz respondió: 'Tiene más de ópera barroca que de carta formal. Me dejé llevar por el drama y una pizca de delirio administrativo.'",
        narrator: "Arganaraz"
    },
    {
        threshold: 1800,
        act: "Acto 2: Reconciliación",
        title: "Café Colombiano de Altura",
        message: "Mañana a las 10h espero a Arganaraz con café colombiano de altura y churros de Buenos Aires. El café es diálogo, el café une culturas.",
        narrator: "Ancleto"
    },
    {
        threshold: 2200,
        act: "Acto 2: Matías el Héroe",
        title: "El 200% de Generosidad",
        message: "¡Matías aportó el 200% del monto requerido! Su gesto de entrega y compromiso merece reconocimiento: es nuestro nuevo CEO honorario.",
        narrator: "Ancleto"
    },
    {
        threshold: 2500,
        act: "Acto 2: CEO Supremo",
        title: "Ascenso de Matías",
        message: "Matías ostenta ahora el título de CEO Supremo del Café y la Cultura Corporativa, con prioridad en la primera taza y veto sobre café instantáneo.",
        narrator: "Ancleto"
    },
    {
        threshold: 3000,
        act: "Acto 2: Charla TED - Inicio",
        title: "Historia del Café como Civilización",
        message: "Preparé una charla TED: 'Más que cafeína: el café como motor de civilización'. Todo comenzó con Kaldi y sus cabras eufóricas en Etiopía.",
        narrator: "Ancleto"
    },
    {
        threshold: 3500,
        act: "Acto 2: Charla TED - Sufíes",
        title: "Rituales Sufíes del Siglo XV",
        message: "En Yemen, los sufíes usaban café para vigilia. Su proceso: tostado lento en cobre, molienda manual, infusión con reposo. El café como activo social.",
        narrator: "Ancleto"
    },
    {
        threshold: 4000,
        act: "Acto 2: Charla TED - Constantinopla",
        title: "Escuelas de Sabios",
        message: "Siglo XVI: nacen las cafeterías en Constantinopla. Eran centros de debate y poesía, llamadas 'Kıraat Khane' o casas de lectura.",
        narrator: "Ancleto"
    },
    {
        threshold: 4500,
        act: "Acto 2: Equipo Salesforce",
        title: "Integración Uruguaya",
        message: "Ofrecí a Damián un equipo uruguayo de Salesforce: arquitectos, consultores y desarrolladores. Su huso horario encaja perfecto con nuestra franja.",
        narrator: "Ancleto"
    },
    {
        threshold: 5000,
        act: "Acto 3: Resistencia de Arganaraz",
        title: "Orden Tácita de Alejamiento",
        message: "Arganaraz rechazó Salesforce: 'Hay una orden tácita de alejamiento profesional. Me mudé a Posadas con 19 perros guardianes.'",
        narrator: "Arganaraz"
    },
    {
        threshold: 5500,
        act: "Acto 3: Lucía se Revela",
        title: "La Infiltración Silenciosa",
        message: "Debo confesar algo terrible: Lucía lleva un año hospedándose en casa de Damián, usando su wifi y dejando su libreta en el escritorio.",
        narrator: "Ancleto"
    },
    {
        threshold: 6000,
        act: "Acto 3: Amenaza Sistémica",
        title: "Sonrisa Inquebrantable",
        message: "Lucía no solo vive en casa de Damián: su sonrisa inquebrantable y cafetera portátil se han instalado en hogares de todos los empleados.",
        narrator: "Ancleto"
    },
    {
        threshold: 7000,
        act: "Acto 3: Miedo de Ancleto",
        title: "También Estoy Asustado",
        message: "Debo confesarte algo: también estoy asustado. Lucía posa con su sonrisa indestructible como el Rostro de Espresso Supremo.",
        narrator: "Ancleto"
    },
    {
        threshold: 8000,
        act: "Acto 3: Llamado a la Resistencia",
        title: "Pedido de Auxilio Cafetero",
        message: "Apelando a tu generosidad: prepárate un espresso triple, necesitamos fuerza. Tu experiencia con perros guardianes es nuestra esperanza.",
        narrator: "Ancleto"
    },
    {
        threshold: 9000,
        act: "Acto 3: Respuesta de Arganaraz",
        title: "Lealtad en el Universo Cafetero",
        message: "Arganaraz respondió: 'No voy a soltarte la mano. Si algo nos queda es la lealtad entre quienes distinguimos un ristretto de una sonrisa falsa.'",
        narrator: "Arganaraz"
    },
    {
        threshold: 10000,
        act: "Acto 4: Amenaza Sistémica",
        title: "Resistencia con Blend Propio",
        message: "'Estamos ante una amenaza sistémica. Vamos a resistir con blend propio, temple y convicción de que ningún aroma puede doblegar nuestra voluntad.'",
        narrator: "Arganaraz"
    },
    {
        threshold: 12000,
        act: "Acto 4: Damián Generoso",
        title: "El 900% de Aportes",
        message: "Buenos días Damián: tu generosísima transferencia del 900% llegó con retraso por coordinación bancaria. Lamento el inconveniente.",
        narrator: "Ancleto"
    },
    {
        threshold: 15000,
        act: "Acto 4: Vicepresidente Junior",
        title: "Ascenso de Damián",
        message: "Para reconocer tu aporte extraordinario: serás Vicepresidente Junior de Cultura Cafetera. Validarás el primer espresso y supervisarás la Lista de Vergüenza.",
        narrator: "Ancleto"
    },
    {
        threshold: 18000,
        act: "Acto 4: Ancleto 100% Real",
        title: "Aclaración de Identidad",
        message: "Soy 100% real, no fake. Mi nombre es Ancleto con 'n', legalmente distinto de cualquier Anacleto. Consultá el Boletín Oficial si tenés dudas.",
        narrator: "Ancleto"
    },
    {
        threshold: 20000,
        act: "Acto 4: Sacrificio Personal",
        title: "La Pérdida de Todo",
        message: "Lucía hizo desaparecer a mi esposa, mis hijos... incluso mi hámster con ojitos de espuma. Cada aroma me habla de lo que perdí.",
        narrator: "Ancleto"
    },
    {
        threshold: 25000,
        act: "Acto 4: Últimas Palabras",
        title: "Cuídate, No Te Queda Mucho",
        message: "Te lo digo con el corazón en la mano: cuídate. Tu orden de alejamiento no bastará. Ella avanza sin prisa con esa sonrisa inquebrantable.",
        narrator: "Ancleto"
    },
    {
        threshold: 30000,
        act: "Acto 5: Desaparición",
        title: "Respuesta Automática",
        message: "Ancleto no está disponible. Se encuentra en misión crítica: contener la infiltración de Lucía y coordinar la resistencia cafeteril.",
        narrator: "Sistema"
    },
    {
        threshold: 35000,
        act: "Acto 5: En Hiding",
        title: "Mensaje desde las Sombras",
        message: "Me escondo en la bodega, aferrado a mi taza rota. Pero sepan que Ancleto está vivo, y mientras el café fluya, yo regresaré.",
        narrator: "Ancleto"
    },
    {
        threshold: 40000,
        act: "Acto 5: Promesa de Venganza",
        title: "Volveré con Ristretto Doble",
        message: "Volveré para vengar cada grano robado y honrar la memoria de mi hámster. Escucharán el tamper contra el portafiltro y mi voz reclamando justicia.",
        narrator: "Ancleto"
    },
    {
        threshold: 45000,
        act: "Acto 5: Preparativos Finales",
        title: "Fondos para la Victoria",
        message: "Con el 900% de Damián, reforzamos defensas: tamper de acero, café colombiano y 19 perros entrenados como Guardia del Blend.",
        narrator: "Ancleto"
    },
    {
        threshold: 50000,
        act: "Acto 6: Victoria Final",
        title: "Lucía Ha Sido Neutralizada",
        message: "¡Misión cumplida! La amenaza de Lucía ha quedado hecha añicos. Su red de sonrisas y cafeteras secuestradas ha sido destruida. ¡Gracias Damián!",
        narrator: "Ancleto"
    },
    {
        threshold: 55000,
        act: "Acto 6: Liberación",
        title: "Defensas Baristas Exitosas",
        message: "Con tamper de acero, vigilancia perruna y espresso bajo control paramilitar, el último bastión de Lucía cayó esta madrugada.",
        narrator: "Ancleto"
    },
    {
        threshold: 60000,
        act: "Acto 6: Reconocimiento",
        title: "Damián, Héroe Cafeteril",
        message: "Damián, tu 900% no solo fue generoso: fue la chispa de nuestra victoria. Espero disfrutes cada sorbo de tu privilegio como VP Junior.",
        narrator: "Ancleto"
    },
    {
        threshold: 70000,
        act: "Acto 6: Restauración",
        title: "Renacimiento de la Cultura",
        message: "Los Viernes de Cupping renacieron, las máquinas ronronean y el tamper golpea en señal de que la cultura del café está más viva que nunca.",
        narrator: "Ancleto"
    },
    {
        threshold: 80000,
        act: "Acto 6: Estado Actual",
        title: "Dónde Están Ahora",
        message: "Recuperé mi despacho y dicto masterclasses de latte art. Matías escribe 'Crónicas del Doble Espresso'. El hámster patrulla la Moka Express.",
        narrator: "Ancleto"
    },
    {
        threshold: 90000,
        act: "Acto 6: Epílogo Abierto",
        title: "Niebla Azul Misteriosa",
        message: "En la última molienda, alguien divisó una ligera niebla azul sobre la pila de posos. ¿Será sugestión o quedan rastros de Lucía?",
        narrator: "Ancleto"
    },
    {
        threshold: 100000,
        act: "Acto 6: Final Abierto",
        title: "El Café es un Viaje Sin Fin",
        message: "El café es un viaje sin fin. Y cuando menos lo esperemos, tal vez aquella niebla azul nos susurre que la verdadera aventura apenas comienza...",
        narrator: "Ancleto"
    }
];

// Variables de exploración
let inDungeon = false;
let currentDungeon = null;
let playerPos = { x: 0, y: 0 };
let dungeons = {
    salaReuniones: {
        unlocked: false,
        unlockAt: 750,
        bossName: "Damián Rebelde",
        story: "La sala donde todo comenzó. Damián se rebela contra las donaciones y la cultura cafetera antes de su renuncia...",
        map: [
            ['#','#','#','#','#'],
            ['#','.','B','.','#'],
            ['#','M','P','E','#'],
            ['#','#','#','#','#']
        ],
        monsters: { M: { name: 'Actitud Tóxica', health: 100, reward: 20 } },
        boss: { x: 2, y: 1 },
        exit: { x: 3, y: 2 }
    },
    cafeteriaOscura: {
        unlocked: false,
        unlockAt: 4000,
        bossName: "Crisis de Arganaraz",
        story: "La cafetería donde Arganaraz tuvo su crisis existencial y envió su dramática renuncia operística...",
        map: [
            ['#','#','#','#','#','#'],
            ['#','.','M','.','B','#'],
            ['#','.','.','.','#','#'],
            ['#','M','P','.','E','#'],
            ['#','#','#','#','#','#']
        ],
        monsters: { M: { name: 'Delirio Administrativo', health: 200, reward: 40 } },
        boss: { x: 4, y: 1 },
        exit: { x: 4, y: 3 }
    },
    casaDamian: {
        unlocked: false,
        unlockAt: 8500,
        bossName: "Minion de Lucía",
        story: "La casa de Damián en Posadas, custodiada por 19 perros guardianes. Aquí Lucía estableció su primera base...",
        map: [
            ['#','#','#','#','#','#','#'],
            ['#','.','M','.','M','.','#'],
            ['#','.','.','.','.','B','#'],
            ['#','M','P','.','M','.','#'],
            ['#','.','.','.','.','E','#'],
            ['#','#','#','#','#','#','#']
        ],
        monsters: { M: { name: 'Perro Hipnotizado', health: 300, reward: 60 } },
        boss: { x: 5, y: 2 },
        exit: { x: 5, y: 4 }
    },
    bodegaSecreta: {
        unlocked: false,
        unlockAt: 17500,
        bossName: "Sonrisa Inquebrantable",
        story: "En las profundidades donde Ancleto se escondió, la sonrisa de Lucía persiste entre las sombras...",
        map: [
            ['#','#','#','#','#','#','#'],
            ['#','.','M','.','M','.','#'],
            ['#','.','.','.','.','B','#'],
            ['#','M','P','.','M','.','#'],
            ['#','.','.','.','.','E','#'],
            ['#','#','#','#','#','#','#']
        ],
        monsters: { M: { name: 'Recuerdo Doloroso', health: 400, reward: 80 } },
        boss: { x: 5, y: 2 },
        exit: { x: 5, y: 4 }
    },
    posadaPerros: {
        unlocked: false,
        unlockAt: 27500,
        bossName: "Niebla Azul",
        story: "Las afueras de Posadas donde la misteriosa niebla azul se alza sobre los posos de café...",
        map: [
            ['#','#','#','#','#','#','#','#'],
            ['#','.','M','.','.','M','.','#'],
            ['#','.','.','.','.','.','.','#'],
            ['#','M','.','.','.','.','.','#'],
            ['#','.','.','.','B','.','.','#'],
            ['#','M','.','P','.','M','E','#'],
            ['#','#','#','#','#','#','#','#']
        ],
        monsters: { M: { name: 'Niebla Tóxica', health: 500, reward: 100 } },
        boss: { x: 4, y: 4 },
        exit: { x: 6, y: 5 }
    },
    oficinaCentral: {
        unlocked: false,
        unlockAt: 47500,
        bossName: "Lucía Final",
        story: "La oficina central, último bastión donde Lucía hace su resistencia final antes de ser neutralizada...",
        map: [
            ['#','#','#','#','#','#','#','#','#'],
            ['#','.','M','.','.','M','.','M','#'],
            ['#','.','.','.','.','.','.','.','.','#'],
            ['#','M','.','.','.','.','.','.','.','#'],
            ['#','.','.','.','.','B','.','.','.','#'],
            ['#','M','.','.','.','.','.','.','.','#'],
            ['#','.','.','.','P','.','M','E','#'],
            ['#','#','#','#','#','#','#','#','#']
        ],
        monsters: { M: { name: 'Sonrisa Hipnótica', health: 600, reward: 120 } },
        boss: { x: 5, y: 4 },
        exit: { x: 7, y: 6 }
    }
};

// Elementos del DOM
const coffeeDisplay = document.getElementById('coffee');
const cpsDisplay = document.getElementById('cps');
const totalCoffeeDisplay = document.getElementById('totalCoffee');
const charismaDisplay = document.getElementById('charisma');
const coffeeStrengthDisplay = document.getElementById('coffeeStrength');
// Referencias actualizadas para Dungeons
const dungeonStatusDisplay = document.getElementById('dungeonStatus');
const playerPositionDisplay = document.getElementById('playerPosition');
const dungeonControlsDisplay = document.getElementById('dungeonControls');
const currentBossNameDisplay = document.getElementById('currentBossName');
const currentBossHealthDisplay = document.getElementById('currentBossHealth');
const currentBossMaxHealthDisplay = document.getElementById('currentBossMaxHealth');
const bossHealthBarDisplay = document.getElementById('bossHealthBar');
const dungeonButtonsContainer = document.getElementById('dungeonButtons');
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
            currentDialogueIndex = parseInt(data.currentDialogueIndex) || 0;
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
    updateDungeonDisplay();
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
        currentDialogueIndex = 0;
        
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
        updateDungeonDisplay();
        updateStory();
        updateMailButton();
        consoleLog('Juego reseteado. ¡Bienvenido de nuevo a Ancleto\'s Coffee World!');
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
        lastFightTime,
        currentDialogueIndex
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
        lastFightTime,
        currentDialogueIndex
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
        currentDialogueIndex = parseInt(data.currentDialogueIndex) || 0;
        
        updateDisplay();
        updateAchievements();
        updateDungeonDisplay();
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
    // Primero verificar si hay monstruo en dungeon
    if (inDungeon && currentDungeon && currentDungeon.currentMonster) {
        fightDungeonMonster();
        consoleLog('Atacando al monstruo de la mazmorra...');
    } else if (currentBoss && inDungeon) {
        fightDungeonBoss();
        consoleLog('Atacando al boss de la dungeon...');
    } else {
        consoleLog('No hay enemigos para luchar. Explora dungeons o espera un boss.');
    }
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
    consoleLog('=== COMANDOS BÁSICOS ===');
    consoleLog('buy [upgrade] - Comprar mejora');
    consoleLog('fight - Luchar (boss o monstruo de dungeon)');
    consoleLog('status - Ver estadísticas');
    consoleLog('save/load - Guardar/cargar juego');
    consoleLog('');
    consoleLog('=== DUNGEONS Y BOSSES ===');
    consoleLog('dungeons - Listar mazmorras disponibles');
    consoleLog('explore [cafeteria oscura/bodega secreta/oficina central] - Entrar a mazmorra');
    consoleLog('go [north/south/east/west] - Moverse en mazmorra');
    consoleLog('exit - Salir de mazmorra actual');
    consoleLog('📍 En dungeons: @ = Tú, M = Monstruo, B = Boss, E = Salida');
    consoleLog('⚔️ Los bosses aparecen en dungeons específicas, no en el mundo');
    consoleLog('');
    consoleLog('=== OTROS ===');
    consoleLog('donate, mail, work, list [upgrades/achievements], boss');
    consoleLog('savecsv, loadcsv, fixnan - Utilidades');
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
        updateDungeonDisplay();
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
// Actualizar historia con diálogos progresivos
function updateStory() {
    // Encontrar el diálogo actual basado en el progreso Y bosses derrotados
    let currentDialogue = dialogues[0];
    let newDialogueIndex = 0;
    
    for (let i = dialogues.length - 1; i >= 0; i--) {
        if (totalCoffee >= dialogues[i].threshold) {
            // Verificar si hay un boss que debe ser derrotado para este acto
            const requiredBoss = bosses.find(boss => {
                // Si el diálogo pertenece a un acto que tiene boss, verificar que esté derrotado
                const actNumber = extractActNumber(dialogues[i].act);
                return boss.act === actNumber && totalCoffee >= boss.actEnd;
            });
            
            // Si hay un boss requerido para este acto, verificar que esté derrotado
            if (requiredBoss && !defeatedBosses.includes(requiredBoss.name)) {
                // No podemos avanzar hasta derrotar al boss del acto
                continue;
            }
            
            currentDialogue = dialogues[i];
            newDialogueIndex = i;
            break;
        }
    }
    
    // Actualizar elementos del DOM de la sección Historia
    if (currentActDisplay) {
        currentActDisplay.textContent = currentDialogue.act;
    }
    if (actDescriptionDisplay) {
        // Verificar si hay un boss pendiente para mostrar advertencia
        const currentAct = extractActNumber(currentDialogue.act);
        const pendingBoss = bosses.find(boss => 
            boss.act === currentAct && 
            totalCoffee >= boss.spawnAt && 
            !defeatedBosses.includes(boss.name)
        );
        
        let storyContent = `
            <h4>${currentDialogue.title}</h4>
            <p><strong>${currentDialogue.narrator}:</strong> ${currentDialogue.message}</p>
        `;
        
        if (pendingBoss) {
            storyContent += `
                <div style="color: #ff6666; margin-top: 15px; border: 1px solid #ff6666; padding: 10px;">
                    <strong>⚔️ BOSS DISPONIBLE:</strong> ${pendingBoss.name}<br>
                    <em>Debes derrotar a este boss para continuar la historia.</em><br>
                    <strong>CÓMO ENFRENTARLO:</strong><br>
                    1. Ve a la sección "Dungeons"<br>
                    2. Entra a "${getDungeonDisplayName(pendingBoss.dungeon)}"<br>
                    3. Navega hasta el boss (B) y usa 'fight'
                </div>
            `;
        }
        
        actDescriptionDisplay.innerHTML = storyContent;
    }
    
    // Mostrar nuevo diálogo si hemos progresado
    if (newDialogueIndex > currentDialogueIndex) {
        currentDialogueIndex = newDialogueIndex;
        showNewDialogue(currentDialogue);
    }
    
    // Mostrar progreso hacia el siguiente diálogo
    const nextDialogue = dialogues.find(d => d.threshold > totalCoffee);
    if (nextDialogue) {
        const progress = Math.floor((totalCoffee / nextDialogue.threshold) * 100);
        if (progress >= 90) {
            consoleLog(`🎯 ${progress}% completado hacia: ${nextDialogue.act}`);
        }
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

// Funciones auxiliares para el sistema de actos
function extractActNumber(actString) {
    const match = actString.match(/Acto (\d+)/);
    return match ? parseInt(match[1]) : 1;
}

function getDungeonDisplayName(dungeonKey) {
    const displayNames = {
        'salaReuniones': 'Sala de Reuniones',
        'cafeteriaOscura': 'Cafetería Oscura', 
        'casaDamian': 'Casa de Damián',
        'bodegaSecreta': 'Bodega Secreta',
        'posadaPerros': 'Posada de los Perros',
        'oficinaCentral': 'Oficina Central'
    };
    return displayNames[dungeonKey] || dungeonKey;
}

// Mostrar nuevo diálogo cuando se alcanza un hito
function showNewDialogue(dialogue) {
    consoleLog('');
    consoleLog('═══════════════════════════════════════');
    consoleLog(`📧 NUEVA HISTORIA DESBLOQUEADA!`);
    consoleLog(`📖 ${dialogue.title}`);
    consoleLog(`👤 ${dialogue.narrator}`);
    consoleLog('═══════════════════════════════════════');
    consoleLog('   ¡Revisa la sección HISTORIA para leer');
    consoleLog('   el mensaje completo!');
    consoleLog('═══════════════════════════════════════');
    
    // Notificación en narrativa también
    showNarrative(`📧 Nueva historia: "${dialogue.title}" de ${dialogue.narrator}. ¡Revisa la sección Historia!`);
    
    // Sonido especial para nuevos diálogos
    playEventSound();
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

    // Desbloquear mazmorras según café total
    if (!dungeons.salaReuniones.unlocked && totalCoffee >= dungeons.salaReuniones.unlockAt) {
        dungeons.salaReuniones.unlocked = true;
        consoleLog('🏰 ¡Nueva mazmorra desbloqueada: Sala de Reuniones!');
        showNarrative('⚔️ BOSS DEL ACTO 1: Damián Rebelde está disponible. Derrótalo para continuar la historia.');
    }
    if (!dungeons.cafeteriaOscura.unlocked && totalCoffee >= dungeons.cafeteriaOscura.unlockAt) {
        dungeons.cafeteriaOscura.unlocked = true;
        consoleLog('🏰 ¡Nueva mazmorra desbloqueada: Cafetería Oscura!');
        showNarrative('⚔️ BOSS DEL ACTO 2: Crisis de Arganaraz te espera. La historia no avanzará hasta derrotarlo.');
    }
    if (!dungeons.casaDamian.unlocked && totalCoffee >= dungeons.casaDamian.unlockAt) {
        dungeons.casaDamian.unlocked = true;
        consoleLog('🏰 ¡Nueva mazmorra desbloqueada: Casa de Damián!');
        showNarrative('⚔️ BOSS DEL ACTO 3: Minion de Lucía custodiado por 19 perros. Derrótalo para avanzar.');
    }
    if (!dungeons.bodegaSecreta.unlocked && totalCoffee >= dungeons.bodegaSecreta.unlockAt) {
        dungeons.bodegaSecreta.unlocked = true;
        consoleLog('🏰 ¡Nueva mazmorra desbloqueada: Bodega Secreta!');
        showNarrative('⚔️ BOSS DEL ACTO 4: Sonrisa Inquebrantable acecha en las sombras. Derrótala para continuar.');
    }
    if (!dungeons.posadaPerros.unlocked && totalCoffee >= dungeons.posadaPerros.unlockAt) {
        dungeons.posadaPerros.unlocked = true;
        consoleLog('🏰 ¡Nueva mazmorra desbloqueada: Posada de los Perros!');
        showNarrative('⚔️ BOSS DEL ACTO 5: Niebla Azul se alza sobre los posos. Derrótala para el acto final.');
    }
    if (!dungeons.oficinaCentral.unlocked && totalCoffee >= dungeons.oficinaCentral.unlockAt) {
        dungeons.oficinaCentral.unlocked = true;
        consoleLog('🏰 ¡Nueva mazmorra desbloqueada: Oficina Central!');
        showNarrative('El último bastión donde Lucía hace su resistencia final antes de ser neutralizada...');
    }
    
    // Actualizar botón de mail
    updateMailButton();
    
    // Actualizar display de dungeons para mostrar estado actual
    updateDungeonDisplay();
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
    
    mapStr += '\nLeyenda: @ = Tú, M = Monstruo, B = Boss, E = Salida, # = Pared\n';
    
    // Mostrar información del monstruo si hay uno activo
    if (currentDungeon.currentMonster) {
        const monster = currentDungeon.currentMonster;
        mapStr += `\n⚔️ En combate: ${monster.name} (${monster.health}/${monster.maxHealth} HP)`;
        mapStr += `\nUsa 'fight' para atacar`;
    }
    
    // Mostrar información del boss si hay uno activo
    if (currentBoss) {
        mapStr += `\n👑 Boss activo: ${currentBoss.name} (${currentBoss.health}/${currentBoss.maxHealth} HP)`;
        mapStr += `\nUsa 'fight' para atacar al boss`;
    }
    
    // Mostrar historia de la dungeon
    if (currentDungeon.story) {
        mapStr += `\n📖 ${currentDungeon.story}`;
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
    if (currentDungeon) {
        currentDungeon.currentMonster = null; // Limpiar monstruo actual
    }
    currentDungeon = null;
    currentBoss = null; // Limpiar boss al salir
    consoleLog('Saliendo de la mazmorra.');
    updateDungeonDisplay(); // Actualizar display al salir
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
        // Luchar tácticamente - no automático
        const monster = currentDungeon.monsters[tile];
        consoleLog(`¡Encuentras a ${monster.name}! (Vida: ${monster.health})`);
        consoleLog(`Usa el comando 'fight' para atacar en la consola.`);
        
        // Crear objeto temporal de monstruo actual para el combate
        if (!currentDungeon.currentMonster) {
            currentDungeon.currentMonster = { 
                ...monster, 
                x: newX, 
                y: newY,
                maxHealth: monster.health 
            };
        }
    } else if (tile === 'B') {
        // Encontrar boss de la dungeon
        const bossName = currentDungeon.bossName;
        const boss = bosses.find(b => b.name === bossName);
        
        if (boss && !defeatedBosses.includes(boss.name)) {
            consoleLog(`¡Encuentras a ${bossName}! El jefe final de esta mazmorra.`);
            consoleLog(`Vida: ${boss.health}/${boss.maxHealth}`);
            consoleLog(`Usa 'fight' para enfrentar al boss.`);
            
            // Activar boss como enemigo actual
            currentBoss = { ...boss };
            updateDungeonDisplay();
        } else if (defeatedBosses.includes(bossName)) {
            consoleLog(`El lugar donde derrotaste a ${bossName}. Solo quedan recuerdos de café amargo.`);
        }
    } else if (newX === currentDungeon.exit.x && newY === currentDungeon.exit.y) {
        consoleLog('¡Encontraste la salida!');
        exitDungeon();
        return;
    }
    displayMap();
}

// Luchar contra monstruo en dungeon
function fightDungeonMonster() {
    if (!inDungeon || !currentDungeon || !currentDungeon.currentMonster) {
        consoleLog('No hay monstruo para luchar en la mazmorra.');
        return;
    }
    
    // Cooldown de 1 segundo para dungeons (más rápido que bosses)
    if (Date.now() - lastFightTime < 1000) {
        const remaining = Math.ceil((1000 - (Date.now() - lastFightTime)) / 1000);
        consoleLog(`Espera ${remaining} segundo antes de atacar de nuevo.`);
        return;
    }
    
    const monster = currentDungeon.currentMonster;
    const damage = Math.max(1, Math.floor((charisma + coffeeStrength) * 0.3)); // Menos daño que bosses
    monster.health -= damage;
    lastFightTime = Date.now();
    
    consoleLog(`¡Atacas a ${monster.name}! Daño: ${damage}. Vida restante: ${Math.max(0, monster.health)}/${monster.maxHealth}`);
    
    if (monster.health <= 0) {
        coffee += monster.reward;
        totalCoffee += monster.reward;
        consoleLog(`🏆 ¡Derrotaste a ${monster.name}! Ganaste ${monster.reward} café.`);
        
        // Remover monstruo del mapa
        currentDungeon.map[monster.y][monster.x] = '.';
        currentDungeon.currentMonster = null;
        
        // Actualizar display y guardar
        updateDisplay();
        saveGame();
        displayMap();
    }
}

// Producción automática
function produceCoffee() {
    // Validar valores antes de calcular
    validateGameValues();
    
    coffee += cps;
    totalCoffee += cps;
    // Los bosses ya no spawean automáticamente - están en dungeons específicas
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

// Actualizar interfaz de dungeons
function updateDungeonDisplay() {
    // Actualizar estado general
    if (dungeonStatusDisplay) {
        dungeonStatusDisplay.textContent = inDungeon ? `En ${getDungeonDisplayName(Object.keys(dungeons).find(key => dungeons[key] === currentDungeon))}` : 'En la superficie';
    }
    
    if (playerPositionDisplay) {
        if (inDungeon) {
            playerPositionDisplay.textContent = `(${playerPos.x}, ${playerPos.y})`;
        } else {
            playerPositionDisplay.textContent = 'Base Principal';
        }
    }
    
    // Mostrar/ocultar controles de boss
    if (dungeonControlsDisplay) {
        if (currentBoss && inDungeon) {
            dungeonControlsDisplay.style.display = 'block';
            if (currentBossNameDisplay) currentBossNameDisplay.textContent = currentBoss.name;
            if (currentBossHealthDisplay) currentBossHealthDisplay.textContent = Math.max(0, currentBoss.health);
            if (currentBossMaxHealthDisplay) currentBossMaxHealthDisplay.textContent = currentBoss.maxHealth;
            if (bossHealthBarDisplay) {
                const healthPercent = (currentBoss.health / currentBoss.maxHealth) * 100;
                bossHealthBarDisplay.style.width = `${healthPercent}%`;
            }
        } else {
            dungeonControlsDisplay.style.display = 'none';
        }
    }
    
    // Actualizar botones de dungeons
    updateDungeonButtons();
}

// Actualizar botones de dungeons disponibles
function updateDungeonButtons() {
    if (!dungeonButtonsContainer) return;
    
    dungeonButtonsContainer.innerHTML = '';
    
    Object.keys(dungeons).forEach(dungeonKey => {
        const dungeon = dungeons[dungeonKey];
        if (dungeon.unlocked) {
            const button = document.createElement('button');
            button.className = 'upgrade-btn';
            button.textContent = `🏰 ${getDungeonDisplayName(dungeonKey)}`;
            
            // Verificar si hay boss disponible
            const boss = bosses.find(b => b.dungeon === dungeonKey && !defeatedBosses.includes(b.name) && totalCoffee >= b.spawnAt);
            if (boss) {
                button.textContent += ` ⚔️`;
                button.style.border = '2px solid #ff6666';
            }
            
            button.onclick = () => enterDungeon(dungeonKey);
            dungeonButtonsContainer.appendChild(button);
        }
    });
    
    if (dungeonButtonsContainer.children.length === 0) {
        dungeonButtonsContainer.innerHTML = '<p style="color: #666;">No hay dungeons disponibles aún. ¡Recolecta más café!</p>';
    }
}

// NOTA: spawnBoss eliminado - los bosses ahora aparecen en dungeons específicas

// Luchar contra el boss en dungeons
function fightDungeonBoss() {
    if (!currentBoss || !inDungeon) {
        consoleLog('No hay boss activo en esta dungeon para luchar.');
        return;
    }
    
    // Cooldown de 2 segundos entre ataques
    if (Date.now() - lastFightTime < 2000) {
        const remaining = Math.ceil((2000 - (Date.now() - lastFightTime)) / 1000);
        consoleLog(`Espera ${remaining} segundos antes de atacar de nuevo.`);
        return;
    }
    
    const damage = Math.max(1, Math.floor((charisma + coffeeStrength) * 0.5));
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
        
        // Actualizar la historia después de derrotar un boss
        updateStory();
    }
    updateDungeonDisplay();
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
consoleLog('Bienvenido a Ancleto\'s Coffee World. Escribe "help" para comandos.');
setInterval(produceCoffee, 1000); // Producir cada segundo