import { createInitialState, getUpgradeCost, produceCoffee as engineProduceCoffee, getCurrentAct as getEngineCurrentAct, initialUpgrades, actLimits as engineActLimits, validateGameValues as validateEngineValues, buyUpgrade as engineBuyUpgrade, deserializeState } from './game-engine.js';

// Ancleto's Coffee World - Lógica del Juego

// Variables del juego
let coffee = 0;
let totalCoffee = 0;
let cps = 0; // Café por segundo
let charisma = 0;
let coffeeStrength = 0;
let upgrades = JSON.parse(JSON.stringify(initialUpgrades));
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
let donateEndTime = 0; // Tiempo cuando termina el efecto de donar
let lastDonateTime = 0; // Última vez que se donó (para cooldown)

// Variables del Feliz Jueves Mode (Post-Game)
let thursdayModeUnlocked = false;
let thursdayTime = 0; // Segundos desde las 9 AM del jueves (0-86400)
let buenFindePoints = 0;
let fridayLevel = 0;
let fridayUnlocked = false;
let activeThursdayEvents = [];
let postGameCompleted = false; // Nueva variable para rastrear si se completó el post-game
<<<<<<< HEAD
let roguelikeModeActive = false;
let roguelikeRuns = 0;
let persistentBonuses = {};
let nextRunMultiplier = 1.0;
=======
>>>>>>> 7d4ce85 (Superpowers (#8))
let thursdayStats = {
    thursdaysSurvived: 0,
    totalThursdayTime: 0,
    eventsEncountered: {},
    fridaysUnlocked: 0,
    bestPointsRecord: 0
};
<<<<<<< HEAD
let productionInterval = null;
=======
>>>>>>> 7d4ce85 (Superpowers (#8))
let cpsMultiplier = 1.0; // Multiplicador de CPS por eventos del jueves

// Constantes del Thursday Mode
const THURSDAY_EVENT_CHECK_INTERVAL = 300; // Segundos entre verificaciones de eventos
const THURSDAY_EVENT_PROBABILITY = 0.4; // Probabilidad de evento en cada verificación
const THURSDAY_POINT_RETENTION_RATIO = 0.3; // Porcentaje de puntos retenidos al reset
const FRIDAY_DURATION_MS = 7200000; // 2 horas en milisegundos
const POST_GAME_COMPLETION_FRIDAYL_LEVEL = 5; // Nivel de viernes para completar el post-game
let fridayEndTime = 0; // Timestamp cuando termina el viernes

// Límites por acto para evitar progreso muy rápido
let actLimits = engineActLimits;

function buildEngineState() {
    const state = createInitialState();
    Object.assign(state, {
        coffee,
        totalCoffee,
        cps,
        charisma,
        coffeeStrength,
        upgrades,
        achievements,
        currentBoss,
        defeatedBosses,
        bosses,
        lastMailTime,
        lastWorkTime,
        lastFightTime,
        donateEndTime,
        lastDonateTime,
        currentDialogueIndex,
        thursdayModeUnlocked,
<<<<<<< HEAD
        cpsMultiplier,
        persistentBonuses
=======
        cpsMultiplier
>>>>>>> 7d4ce85 (Superpowers (#8))
    });
    return state;
}

function applyEngineState(state) {
    coffee = state.coffee;
    totalCoffee = state.totalCoffee;
    cps = state.cps;
    charisma = state.charisma;
    coffeeStrength = state.coffeeStrength;
    upgrades = state.upgrades;
    achievements = state.achievements;
    currentBoss = state.currentBoss;
    bosses = state.bosses;
    defeatedBosses = state.defeatedBosses;
    lastMailTime = state.lastMailTime;
    lastWorkTime = state.lastWorkTime;
    lastFightTime = state.lastFightTime;
    donateEndTime = state.donateEndTime;
    lastDonateTime = state.lastDonateTime;
    currentDialogueIndex = state.currentDialogueIndex;
    thursdayModeUnlocked = state.thursdayModeUnlocked;
    cpsMultiplier = state.cpsMultiplier;
}

function validateAndApplyEngineState() {
    const state = buildEngineState();
    validateEngineValues(state);
    applyEngineState(state);
}

// Variables de desarrollo (ocultas)
let devModeEnabled = false;
let devCommands = [];

// Sistema de diálogos progresivos basado en la historia completa de mails
let currentDialogueIndex = 0;
let dialogues = [
    {
        relativeThreshold: 0.0,  // 0% del acto
        act: "Acto 1: Fundación de la Cultura Cafetera",
        title: "El Inicio del Imperio Cafetero",
        message: "Soy Ancleto, el mejor CEO del mundo. Confía en mí: el café no es solo un break, sino un ritual diario. Comencemos recolectando granos automáticamente.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.01, // 1% del acto
        act: "Acto 1: Primeras Reflexiones",
        title: "La Cultura del Café",
        message: "En esta empresa, el café no es solo una infusión. Es un ritual, es el momento en que las ideas se cruzan y los proyectos se gestan.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.02, // 2% del acto
        act: "Acto 1: Solicitud Inicial",
        title: "Solicitud de Colaboración Financiera",
        message: "Estimado equipo, necesitamos invertir en cafeteras nuevas. Como el mejor CEO del mundo, sé exactamente cómo invertir cada peso para el bien común.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.04, // 4% del acto
        act: "Acto 1: Seguimiento",
        title: "Recordatorio de Donaciones",
        message: "He notado que algunos aún no han concretado su donación. Tu participación es fundamental para que todos disfrutemos de un espacio más ameno.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.06, // 6% del acto
        act: "Acto 1: Primera Resistencia",
        title: "Respuesta Desafiante",
        message: "Damián respondió 'yo hago lo que quiero'. Una actitud preocupante que requiere reflexión y, posiblemente, más café.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.08, // 8% del acto
        act: "Acto 1: Problemas Ortográficos",
        title: "Guerra al Diccionario",
        message: "Su nueva respuesta fue 'yo havlo como quiero'. Ahora declara la guerra tanto a la colaboración como a la gramática básica.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.1, // 10% del acto
        act: "Acto 1: Lista de la Vergüenza",
        title: "Llamado a la Responsabilidad",
        message: "He decidido crear la Lista de la Vergüenza. No como castigo, sino como recordatorio de que en esta empresa todos remamos juntos.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.15, // 15% del acto
        act: "Acto 1: Viajes Globales - Introducción",
        title: "Cruzada Global por la Excelencia",
        message: "He recorrido el mundo en busca de la cafetera perfecta. En Estambul negocié con comerciantes, en Kioto probé sifones alquímicos.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.2, // 20% del acto - Fin del Acto 1
        act: "Acto 1: Fin del Acto",
        title: "Boss del Acto 1: Damián Rebelde",
        message: "¡Hemos completado el Acto 1! Ahora enfrentaremos a Damián Rebelde para desbloquear el Acto 2. ¡Prepárate para la batalla!",
        narrator: "Sistema"
    },
    {
        relativeThreshold: 0.0, // 0% del acto 2
        act: "Acto 2: Crisis de Arganaraz",
        title: "Renuncia Operística",
        message: "Recibí una renuncia de Arganaraz: quiere desvincularse pero seguir cobrando. Una ópera barroca de emociones y propuestas laborales kafkianas.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.014, // 1.4% del acto 2 (1200 café en acto de 10000)
        act: "Acto 2: Consejo Cafetero",
        title: "Tómate un Café y Respirá",
        message: "Le sugerí a Arganaraz: 'Tómate un café, preparalo bien, sentate tranquilo y respirá.' Porque las decisiones importantes no se toman en ayunas.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.02, // 2% del acto 2 (1500 café en acto de 10000)
        act: "Acto 2: Reflexión de Arganaraz",
        title: "Delirio Administrativo Reconocido",
        message: "Arganaraz respondió: 'Tiene más de ópera barroca que de carta formal. Me dejé llevar por el drama y una pizca de delirio administrativo.'",
        narrator: "Arganaraz"
    },
    {
        relativeThreshold: 0.026, // 2.6% del acto 2 (1800 café en acto de 10000)
        act: "Acto 2: Reconciliación",
        title: "Café Colombiano de Altura",
        message: "Mañana a las 10h espero a Arganaraz con café colombiano de altura y churros de Buenos Aires. El café es diálogo, el café une culturas.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.034, // 3.4% del acto 2 (2200 café en acto de 10000)
        act: "Acto 2: Matías el Héroe",
        title: "El 200% de Generosidad",
        message: "¡Matías aportó el 200% del monto requerido! Su gesto de entrega y compromiso merece reconocimiento: es nuestro nuevo CEO honorario.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.04, // 4% del acto 2 (2500 café en acto de 10000)
        act: "Acto 2: CEO Supremo",
        title: "Ascenso de Matías",
        message: "Matías ostenta ahora el título de CEO Supremo del Café y la Cultura Corporativa, con prioridad en la primera taza y veto sobre café instantáneo.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.05, // 5% del acto 2 (3000 café en acto de 10000)
        act: "Acto 2: Charla TED - Inicio",
        title: "Historia del Café como Civilización",
        message: "Preparé una charla TED: 'Más que cafeína: el café como motor de civilización'. Todo comenzó con Kaldi y sus cabras eufóricas en Etiopía.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.06, // 6% del acto 2 (3500 café relativo en acto de 5000)
        act: "Acto 2: Charla TED - Sufíes",
        title: "Rituales Sufíes del Siglo XV",
        message: "En Yemen, los sufíes usaban café para vigilia. Su proceso: tostado lento en cobre, molienda manual, infusión con reposo. El café como activo social.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.08, // 8% del acto 2 (4000 café relativo en acto de 5000)
        act: "Acto 2: Charla TED - Constantinopla",
        title: "Escuelas de Sabios",
        message: "Siglo XVI: nacen las cafeterías en Constantinopla. Eran centros de debate y poesía, llamadas 'Kıraat Khane' o casas de lectura.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.1, // 10% del acto 2 (4500 café relativo en acto de 5000)
        act: "Acto 2: Equipo Salesforce",
        title: "Integración Uruguaya",
        message: "Ofrecí a Damián un equipo uruguayo de Salesforce: arquitectos, consultores y desarrolladores. Su huso horario encaja perfecto con nuestra franja.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.12, // 12% del acto 2 (5000 café relativo en acto de 5000) - Fin del Acto 2
        act: "Acto 2: Resistencia de Arganaraz",
        title: "Orden Tácita de Alejamiento",
        message: "Arganaraz rechazó Salesforce: 'Hay una orden tácita de alejamiento profesional. Me mudé a Posadas con 19 perros guardianes.'",
        narrator: "Arganaraz"
    },
    {
        relativeThreshold: 0.14, // 14% del acto 2 (5500 café relativo en acto de 5000)
        act: "Acto 2: Lucía se Revela",
        title: "La Infiltración Silenciosa",
        message: "Debo confesar algo terrible: Lucía lleva un año hospedándose en casa de Damián, usando su wifi y dejando su libreta en el escritorio.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.0, // 0% del acto 3 (10000 café relativo en acto de 10000)
        act: "Acto 3: Amenaza Sistémica",
        title: "Sonrisa Inquebrantable",
        message: "Lucía no solo vive en casa de Damián: su sonrisa inquebrantable y cafetera portátil se han instalado en hogares de todos los empleados.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.1, // 10% del acto 3 (11000 café relativo en acto de 10000)
        act: "Acto 3: Miedo de Ancleto",
        title: "También Estoy Asustado",
        message: "Debo confesarte algo: también estoy asustado. Lucía posa con su sonrisa indestructible como el Rostro de Espresso Supremo.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.2, // 20% del acto 3 (12000 café relativo en acto de 10000)
        act: "Acto 3: Llamado a la Resistencia",
        title: "Pedido de Auxilio Cafetero",
        message: "Apelando a tu generosidad: prepárate un espresso triple, necesitamos fuerza. Tu experiencia con perros guardianes es nuestra esperanza.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.3, // 30% del acto 3 (13000 café relativo en acto de 10000)
        act: "Acto 3: Respuesta de Arganaraz",
        title: "Lealtad en el Universo Cafetero",
        message: "Arganaraz respondió: 'No voy a soltarte la mano. Si algo nos queda es la lealtad entre quienes distinguimos un ristretto de una sonrisa falsa.'",
        narrator: "Arganaraz"
    },
    {
        relativeThreshold: 0.4, // 40% del acto 3 (14000 café relativo en acto de 10000) - Fin del Acto 3
        act: "Acto 3: Resistencia con Blend Propio",
        title: "Resistencia con Blend Propio",
        message: "'Estamos ante una amenaza sistémica. Vamos a resistir con blend propio, temple y convicción de que ningún aroma puede doblegar nuestra voluntad.'",
        narrator: "Arganaraz"
    },
    {
        relativeThreshold: 0.0, // 0% del acto 4 (20000 café relativo en acto de 10000)
        act: "Acto 4: Damián Generoso",
        title: "El 900% de Aportes",
        message: "Buenos días Damián: tu generosísima transferencia del 900% llegó con retraso por coordinación bancaria. Lamento el inconveniente.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.1, // 10% del acto 4 (21000 café relativo en acto de 10000)
        act: "Acto 4: Vicepresidente Junior",
        title: "Ascenso de Damián",
        message: "Para reconocer tu aporte extraordinario: serás Vicepresidente Junior de Cultura Cafetera. Validarás el primer espresso y supervisarás la Lista de Vergüenza.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.2, // 20% del acto 4 (22000 café relativo en acto de 10000)
        act: "Acto 4: Ancleto 100% Real",
        title: "Aclaración de Identidad",
        message: "Soy 100% real, no fake. Mi nombre es Ancleto con 'n', legalmente distinto de cualquier Anacleto. Consultá el Boletín Oficial si tenés dudas.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.3, // 30% del acto 4 (23000 café relativo en acto de 10000) - Fin del Acto 4
        act: "Acto 4: Sacrificio Personal",
        title: "La Pérdida de Todo",
        message: "Lucía hizo desaparecer a mi esposa, mis hijos... incluso mi hámster con ojitos de espuma. Cada aroma me habla de lo que perdí.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.4, // 40% del acto 4 (24000 café relativo en acto de 10000)
        act: "Acto 4: Últimas Palabras",
        title: "Cuídate, No Te Queda Mucho",
        message: "Te lo digo con el corazón en la mano: cuídate. Tu orden de alejamiento no bastará. Ella avanza sin prisa con esa sonrisa inquebrantable.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.0, // 0% del acto 5 (30000 café relativo en acto de 20000)
        act: "Acto 5: Desaparición",
        title: "Respuesta Automática",
        message: "Ancleto no está disponible. Se encuentra en misión crítica: contener la infiltración de Lucía y coordinar la resistencia cafeteril.",
        narrator: "Sistema"
    },
    {
        relativeThreshold: 0.1, // 10% del acto 5 (32000 café relativo en acto de 20000)
        act: "Acto 5: En Hiding",
        title: "Mensaje desde las Sombras",
        message: "Me escondo en la bodega, aferrado a mi taza rota. Pero sepan que Ancleto está vivo, y mientras el café fluya, yo regresaré.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.2, // 20% del acto 5 (34000 café relativo en acto de 20000)
        act: "Acto 5: Promesa de Venganza",
        title: "Volveré con Ristretto Doble",
        message: "Volveré para vengar cada grano robado y honrar la memoria de mi hámster. Escucharán el tamper contra el portafiltro y mi voz reclamando justicia.",
        narrator: "Ancleto"
    },
    {
        relativeThreshold: 0.3, // 30% del acto 5 (36000 café relativo en acto de 20000)
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

// Eventos del Feliz Jueves Mode
const thursdayEvents = [
    {
        name: "Reunión Improvisada",
        type: "curse",
        duration: 1800, // 30 minutos en segundos del juego
        effect: () => { cpsMultiplier *= 0.5; },
        removeEffect: () => { cpsMultiplier /= 0.5; },
        probability: 0.3,
        message: "⚠️ Reunión improvisada! -50% producción por 30 min"
    },
    {
        name: "Mail del Jefe",
        type: "curse",
        duration: 900, // 15 minutos
        effect: () => { 
            // Extender cooldown existente en lugar de reemplazarlo
            const currentCooldown = Math.max(0, 120000 - (Date.now() - lastMailTime));
            lastMailTime = Date.now() - (120000 - currentCooldown - 60000);
        },
        removeEffect: () => {},
        probability: 0.25,
        message: "📧 Mail urgente del jefe! Cooldowns duplicados"
    },
    {
        name: "Café Agotado",
        type: "curse",
        duration: 600, // 10 minutos
        effect: () => { cpsMultiplier *= 0.3; },
        removeEffect: () => { cpsMultiplier /= 0.3; },
        probability: 0.2,
        message: "☕❌ ¡Máquinas rotas! -70% producción por 10 min"
    },
    {
        name: "Hora Feliz",
        type: "blessing",
        duration: 600, // 10 minutos
        effect: () => { cpsMultiplier *= 2.0; },
        removeEffect: () => { cpsMultiplier /= 2.0; },
        probability: 0.15,
        message: "🎉 ¡Hora Feliz! +100% producción por 10 min"
    },
    {
        name: "Home Office",
        type: "blessing",
        duration: 1200, // 20 minutos
        effect: () => { cpsMultiplier *= 1.5; },
        removeEffect: () => { cpsMultiplier /= 1.5; },
        probability: 0.1,
        message: "🏠 ¡Home Office! +50% producción por 20 min"
    }
];

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

// Visual Dungeon Elements
const dungeonVisualContainer = document.getElementById('dungeonVisualContainer');
const dungeonMapDisplay = document.getElementById('dungeonMap');
const moveUpBtn = document.getElementById('moveUpBtn');
const moveDownBtn = document.getElementById('moveDownBtn');
const moveLeftBtn = document.getElementById('moveLeftBtn');
const moveRightBtn = document.getElementById('moveRightBtn');
const fightBtn = document.getElementById('fightBtn');
const exitDungeonBtn = document.getElementById('exitDungeonBtn');

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

// Elementos del DOM para Thursday Mode
const thursdayPanel = document.getElementById('thursday-panel');
const thursdayClockDisplay = document.getElementById('thursday-clock');
const fridayPointsDisplay = document.getElementById('friday-points');
const activeEventsListDisplay = document.getElementById('active-events-list');
const fridayProgressBar = document.getElementById('friday-progress-bar');
const useBlessingBtn = document.getElementById('use-blessing-btn');
const emergencyCoffeeBtn = document.getElementById('emergency-coffee-btn');
const buenFindeCreditsSection = document.getElementById('buen-finde-credits');

// Cargar progreso desde LocalStorage
function loadGame() {
    const saved = localStorage.getItem('ancletoCoffeeWorld');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            const state = deserializeState(saved);
            applyEngineState(state);
            if (data.dungeons) {
                for (const [name, dungeon] of Object.entries(data.dungeons)) {
                    if (dungeons[name]) {
                        dungeons[name].unlocked = dungeon.unlocked;
                        dungeons[name].map = dungeon.map; // Para preservar cambios como monstruos derrotados
                    }
                }
            }
            lastMailTime = parseInt(data.lastMailTime) || state.lastMailTime || 0;
            lastWorkTime = parseInt(data.lastWorkTime) || state.lastWorkTime || 0;
            lastFightTime = parseInt(data.lastFightTime) || state.lastFightTime || 0;
            donateEndTime = parseInt(data.donateEndTime) || state.donateEndTime || 0;
            lastDonateTime = parseInt(data.lastDonateTime) || state.lastDonateTime || 0;
            currentDialogueIndex = parseInt(data.currentDialogueIndex) || state.currentDialogueIndex || 0;
            // Thursday Mode data
            thursdayModeUnlocked = data.thursdayModeUnlocked || state.thursdayModeUnlocked || false;
            thursdayTime = parseInt(data.thursdayTime) || 0;
            buenFindePoints = parseInt(data.buenFindePoints) || 0;
            fridayLevel = parseInt(data.fridayLevel) || 0;
            fridayUnlocked = data.fridayUnlocked || false;
            fridayEndTime = parseInt(data.fridayEndTime) || 0;
            activeThursdayEvents = data.activeThursdayEvents || [];
            thursdayStats = data.thursdayStats || {
                thursdaysSurvived: 0,
                totalThursdayTime: 0,
                eventsEncountered: {},
                fridaysUnlocked: 0,
                bestPointsRecord: 0
            };
            postGameCompleted = data.postGameCompleted || false;
<<<<<<< HEAD
            roguelikeModeActive = data.roguelikeModeActive || false;
            roguelikeRuns = parseInt(data.roguelikeRuns) || 0;
            persistentBonuses = data.persistentBonuses || {};
            nextRunMultiplier = parseFloat(data.nextRunMultiplier) || 1.0;
=======
>>>>>>> 7d4ce85 (Superpowers (#8))
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
    validateAndApplyEngineState();
    updateDisplay();
    updateAchievements();
    updateDungeonDisplay();
    updateStory();
    updateMailButton();
}

// Resetear juego
function resetGameData() {
    if (confirm('¿Estás seguro de que quieres eliminar toda tu partida y empezar de cero? Esta acción no se puede deshacer.')) {
        // Eliminar datos del localStorage
        localStorage.removeItem('ancletoCoffeeWorld');

        // Resetear todas las variables en memoria
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
        donateEndTime = 0;
        lastDonateTime = 0;
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

        // Mostrar mensaje de confirmación
        consoleLog('Juego reseteado completamente. Refrescando página...');

        // Refrescar la página después de un breve delay para que se vea el mensaje
        setTimeout(() => {
            location.reload();
        }, 1000);
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
        donateEndTime,
        lastDonateTime,
        currentDialogueIndex,
        // Thursday Mode data
        thursdayModeUnlocked,
        thursdayTime,
        buenFindePoints,
        fridayLevel,
        fridayUnlocked,
        fridayEndTime,
        activeThursdayEvents,
        thursdayStats,
<<<<<<< HEAD
        postGameCompleted,
        roguelikeModeActive,
        roguelikeRuns,
        persistentBonuses,
        nextRunMultiplier
=======
        postGameCompleted
>>>>>>> 7d4ce85 (Superpowers (#8))
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
        'sala reuniones': 'salaReuniones',
        'sala de reuniones': 'salaReuniones',
        'cafeteria oscura': 'cafeteriaOscura',
        'cafetería oscura': 'cafeteriaOscura',
        'casa damian': 'casaDamian',
        'casa de damian': 'casaDamian',
        'casa de damián': 'casaDamian',
        'bodega secreta': 'bodegaSecreta',
        'posada perros': 'posadaPerros',
        'posada de perros': 'posadaPerros',
        'posada de los perros': 'posadaPerros',
        'oficina central': 'oficinaCentral'
    };

    const dungeonKey = dungeonMap[target.toLowerCase()];
    if (dungeonKey) {
        enterDungeon(dungeonKey);
    } else {
        consoleLog('Mazmorras disponibles: sala reuniones, cafeteria oscura, casa damian, bodega secreta, posada perros, oficina central (si desbloqueadas)');
        consoleLog('Ejemplos: explore "casa de damian", explore "oficina central"');
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
    
    if (thursdayModeUnlocked) {
        consoleLog('');
        consoleLog('=== POST-GAME ===');
        consoleLog('jueves/thursday - Activar/desactivar Feliz Jueves Mode');
        consoleLog('⏰ Sobrevive el jueves eterno para alcanzar el Buen Finde!');
    }
<<<<<<< HEAD

    if (postGameCompleted) {
        consoleLog('');
        consoleLog('=== POST-POSTGAME ===');
        consoleLog('rogue/buenf - Iniciar modo Buen Finde roguelike tras completar el post-game');
    }
=======
>>>>>>> 7d4ce85 (Superpowers (#8))
    
    if (devModeEnabled) {
        consoleLog('');
        consoleLog('🔧 === MODO DESARROLLO ACTIVADO ===');
        consoleLog('devhelp - Ver todos los comandos de desarrollo');
        consoleLog('devinfo - Ver estado de desarrollo');
        consoleLog('devlog - Ver historial de comandos de desarrollo');
        consoleLog('');
        consoleLog('🚀 COMANDOS RÁPIDOS DE DESARROLLO:');
        consoleLog('setcoffee [amount] - Establecer café');
        consoleLog('settotal [amount] - Establecer café total');
        consoleLog('unlockall - Desbloquear todas las dungeons');
        consoleLog('jumpact [1-6] - Saltar al acto específico');
        consoleLog('spawnboss [name] - Spawnear boss específico');
        consoleLog('defeatboss [name] - Marcar boss como derrotado');
    }
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
    validateAndApplyEngineState();
    consoleLog('Valores NaN corregidos. Juego restaurado.');
    updateDisplay();
    saveGame();
}

<<<<<<< HEAD
function handleRoguelikeCommand() {
    enterRoguelikeMode();
}

=======
>>>>>>> 7d4ce85 (Superpowers (#8))
// Comando para activar/desactivar Thursday Mode
function handleJuevesCommand() {
    toggleThursdayMode();
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
    jueves: handleJuevesCommand,
    thursday: handleJuevesCommand,
<<<<<<< HEAD
    rogue: handleRoguelikeCommand,
    buenf: handleRoguelikeCommand,
=======
>>>>>>> 7d4ce85 (Superpowers (#8))
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

    // Comando secreto para activar modo desarrollo
    if (command === 'ancletomejorceodelmundotestcafetero') {
        activateDevMode();
        return;
    }
    
    // Comandos de desarrollo (solo si está activado)
    if (devModeEnabled && handleDevCommand(action, target)) {
        return;
    }

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

    // FIXED: Lógica más restrictiva para progresión ACTO POR ACTO
    // Solo permitir avanzar al siguiente acto después de derrotar TODOS los bosses requeridos
    const currentDialogueAct = extractActNumber(dialogues[currentDialogueIndex].act);

    for (let i = 0; i < dialogues.length; i++) {
        const dialogueActNumber = extractActNumber(dialogues[i].act);
        const currentAct = getCurrentAct();

        // REGLA ESTRICTA: No se puede acceder a un acto si no se han derrotado TODOS los bosses anteriores
        let canAccessThisAct = true;

        // Verificar que todos los bosses de actos anteriores estén derrotados
        for (let actNum = 1; actNum < dialogueActNumber; actNum++) {
            const requiredBoss = bosses.find(boss => boss.act === actNum);
            if (requiredBoss && !defeatedBosses.includes(requiredBoss.name)) {
                canAccessThisAct = false;
                break;
            }
        }

        // Si no se pueden acceder a este acto, parar aquí
        if (!canAccessThisAct) {
            break;
        }

        // Verificar si podemos mostrar este diálogo
        let canShowDialogue = false;

        if (dialogueActNumber < currentAct) {
            // Diálogos de actos anteriores: siempre disponibles si el acto está desbloqueado
            canShowDialogue = true;
        } else if (dialogueActNumber === currentAct) {
            // Diálogos del acto actual: verificar progreso relativo
            const actProgress = getActProgress();
            canShowDialogue = actProgress >= dialogues[i].relativeThreshold;
        } else {
            // Diálogos de actos futuros: no disponibles
            canShowDialogue = false;
        }

        if (canShowDialogue) {
            currentDialogue = dialogues[i];
            newDialogueIndex = i;
        } else {
            // Si no podemos mostrar este diálogo, parar (para mantener orden secuencial)
            break;
        }
    }
    
    // Actualizar elementos del DOM de la sección Historia
    if (currentActDisplay) {
        currentActDisplay.textContent = currentDialogue.act;
    }
    if (actDescriptionDisplay) {
        // Verificar si hay un boss pendiente para mostrar advertencia
        const dialogueAct = extractActNumber(currentDialogue.act);
        const pendingBoss = bosses.find(boss => 
            boss.act === dialogueAct && 
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
                    <strong>⚔️ BOSS OBLIGATORIO:</strong> ${pendingBoss.name}<br>
                    <em>DEBES derrotar a este boss para continuar la historia.</em><br>
                    <strong>CÓMO ENFRENTARLO:</strong><br>
                    1. Ve a la sección "Dungeons & Exploración"<br>
                    2. Haz clic en "${getDungeonDisplayName(pendingBoss.dungeon)}" ⚔️<br>
                    3. Navega hasta el boss (B) y usa 'fight' en la consola
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
    const currentActNum = getCurrentAct();
    const actProgress = getActProgress();

    // Encontrar el siguiente diálogo disponible en el acto actual
    let nextDialogue = null;
    for (let i = currentDialogueIndex + 1; i < dialogues.length; i++) {
        const dialogueAct = extractActNumber(dialogues[i].act);
        if (dialogueAct <= currentActNum) {
            // Verificar si podemos acceder a este diálogo
            if (dialogueAct < currentActNum || actProgress >= dialogues[i].relativeThreshold) {
                nextDialogue = dialogues[i];
                break;
            }
        } else {
            break; // No podemos acceder a actos futuros
        }
    }

    if (nextDialogue) {
        // FIXED: Verificar si hay algún boss que debe ser derrotado ANTES del siguiente diálogo
        const nextDialogueAct = extractActNumber(nextDialogue.act);
        const blockingBoss = bosses.find(boss =>
            boss.act < nextDialogueAct && // Boss de acto anterior
            totalCoffee >= boss.spawnAt && // Ya debería estar disponible
            !defeatedBosses.includes(boss.name) // Pero no ha sido derrotado
        );

        if (!blockingBoss) {
            let progress;
            if (extractActNumber(nextDialogue.act) === currentActNum) {
                // Diálogo del acto actual: mostrar progreso relativo
                progress = Math.floor((actProgress / nextDialogue.relativeThreshold) * 100);
            } else {
                // Diálogo de acto anterior: mostrar progreso absoluto
                const threshold = getRelativeThreshold(extractActNumber(nextDialogue.act), nextDialogue.relativeThreshold);
                progress = Math.floor((totalCoffee / threshold) * 100);
            }

            if (progress >= 90) {
                consoleLog(`🎯 ${progress}% completado hacia: ${nextDialogue.act}`);
            }
        } else {
            consoleLog(`⚠️ Progresión bloqueada por ${blockingBoss.name}. ¡Derrótalo para continuar!`);
        }
    }    // Mostrar créditos al final
    const creditsSection = document.getElementById('credits');
    if (creditsSection) {
        if (totalCoffee >= 100000 && defeatedBosses.length >= 6) {
            // Desbloquear el logro primero
            if (!achievements.includes('Leyenda Cafetera')) {
                achievements.push('Leyenda Cafetera');
                consoleLog('🏆 ¡LOGRO ÉPICO DESBLOQUEADO: Leyenda Cafetera!');
                updateAchievements();
            }
            // Verificar si se debe desbloquear Thursday Mode
            checkThursdayModeUnlock();
            // Mostrar créditos solo si Thursday Mode no está activo (no solo desbloqueado)
            if (!thursdayPanel || thursdayPanel.style.display !== 'block') {
                creditsSection.style.display = 'block';
            } else {
                creditsSection.style.display = 'none';
            }
        } else {
            creditsSection.style.display = 'none';
        }
    }
    
    // Actualizar Thursday Mode si está desbloqueado
    if (thursdayModeUnlocked) {
        updateThursdayMode();
    }
    
    // Mostrar créditos del Buen Finde si el post-game está completado
    if (postGameCompleted && buenFindeCreditsSection) {
        buenFindeCreditsSection.style.display = 'block';
    }
}

// Funciones auxiliares para el sistema de actos
function extractActNumber(actString) {
    const match = actString.match(/Acto (\d+)/);
    return match ? parseInt(match[1]) : 1;
}

function getCurrentAct() {
    return getEngineCurrentAct(totalCoffee);
}

function getActProgress() {
    // Calcular progreso relativo dentro del acto actual (0-1)
    const currentAct = getCurrentAct();
    let actStart = 0;
    let actEnd = 0;

    switch(currentAct) {
        case 1:
            actStart = 0;
            actEnd = 5000;
            break;
        case 2:
            actStart = 5000;
            actEnd = 15000;
            break;
        case 3:
            actStart = 15000;
            actEnd = 30000;
            break;
        case 4:
            actStart = 30000;
            actEnd = 50000;
            break;
        case 5:
            actStart = 50000;
            actEnd = 75000;
            break;
        case 6:
            actStart = 75000;
            actEnd = 100000; // Límite máximo para acto 6
            break;
    }

    const actRange = actEnd - actStart;
    const currentProgress = totalCoffee - actStart;
    return Math.min(Math.max(currentProgress / actRange, 0), 1);
}

function getRelativeThreshold(act, relativeProgress) {
    // Convertir progreso relativo (0-1) a café absoluto para el acto dado
    let actStart = 0;
    let actEnd = 0;

    switch(act) {
        case 1:
            actStart = 0;
            actEnd = 5000;
            break;
        case 2:
            actStart = 5000;
            actEnd = 15000;
            break;
        case 3:
            actStart = 15000;
            actEnd = 30000;
            break;
        case 4:
            actStart = 30000;
            actEnd = 50000;
            break;
        case 5:
            actStart = 50000;
            actEnd = 75000;
            break;
        case 6:
            actStart = 75000;
            actEnd = 100000;
            break;
    }

    return actStart + (actEnd - actStart) * relativeProgress;
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

// ═══════════════════════════════════════════════════════════
// FELIZ JUEVES MODE - POST-GAME CONTENT
// ═══════════════════════════════════════════════════════════

// Verificar si se puede desbloquear el Thursday Mode
function checkThursdayModeUnlock() {
    if (!thursdayModeUnlocked && 
        totalCoffee >= 100000 && 
        defeatedBosses.length >= 6 && 
        achievements.includes('Leyenda Cafetera')) {
        
        thursdayModeUnlocked = true;
        consoleLog('');
        consoleLog('═══════════════════════════════════════════════');
        consoleLog('🎉 ¡FELIZ JUEVES MODE DESBLOQUEADO!');
        consoleLog('═══════════════════════════════════════════════');
        consoleLog('Has completado la historia... pero el jueves nunca termina.');
        consoleLog('¿Estás listo para el Feliz Jueves Mode?');
        consoleLog('');
        consoleLog('Cada día es jueves y solo los más fuertes llegan al finde.');
        consoleLog('Usa el comando "jueves" para activar el modo.');
        consoleLog('═══════════════════════════════════════════════');
        
        showNarrative('🎉 ¡FELIZ JUEVES MODE desbloqueado! El jueves eterno te espera. Usa "jueves" en la consola.');
        
        saveGame();
    }
}

// Activar/Desactivar Thursday Mode
function toggleThursdayMode() {
    if (!thursdayModeUnlocked) {
        consoleLog('❌ Debes completar la historia primero para desbloquear el Feliz Jueves Mode.');
        return;
    }
    
    const creditsSection = document.getElementById('credits');
    
    if (thursdayPanel && thursdayPanel.style.display === 'block') {
        thursdayPanel.style.display = 'none';
        // Restaurar créditos normales cuando se desactiva Thursday Mode
        if (creditsSection && totalCoffee >= 100000 && defeatedBosses.length >= 6) {
            creditsSection.style.display = 'block';
        }
        consoleLog('📴 Feliz Jueves Mode desactivado. ¡Disfruta tu descanso!');
    } else {
        if (thursdayPanel) {
            thursdayPanel.style.display = 'block';
            // Ocultar créditos normales cuando se activa Thursday Mode
            if (creditsSection) {
                creditsSection.style.display = 'none';
            }
            consoleLog('⏰ Feliz Jueves Mode activado. ¡Bienvenido al jueves eterno!');
            if (thursdayTime === 0) {
                thursdayTime = 32400; // Empezar a las 9 AM (9*3600)
                consoleLog('Son las 9:00 AM del jueves. Comienza tu jornada...');
            }
        }
    }
}

// Actualizar el Thursday Mode cada tick
function updateThursdayMode() {
    if (!thursdayModeUnlocked || !thursdayPanel || thursdayPanel.style.display !== 'block') {
        return;
    }
    
    // Incrementar tiempo (1 segundo real = 1 minuto de juego)
    thursdayTime += 1;
    thursdayStats.totalThursdayTime += 1;
    
    // Actualizar reloj visual
    updateThursdayClock();
    
    // Actualizar eventos activos
    updateThursdayEvents();
    
    // Verificar si es hora de generar un nuevo evento
    if (thursdayTime % THURSDAY_EVENT_CHECK_INTERVAL === 0 && Math.random() < THURSDAY_EVENT_PROBABILITY) {
        triggerRandomThursdayEvent();
    }
    
    // Verificar si completamos el día
    if (thursdayTime >= 86400) { // 24 horas = 86400 segundos
        completeThursday();
    }
    
    // Actualizar UI
    updateThursdayUI();
}

// Actualizar el reloj del jueves
function updateThursdayClock() {
    if (!thursdayClockDisplay) return;
    
    const hours = Math.floor(thursdayTime / 3600);
    const minutes = Math.floor((thursdayTime % 3600) / 60);
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    thursdayClockDisplay.textContent = timeStr;
}

// Actualizar eventos del jueves
function updateThursdayEvents() {
    // Decrementar duración de eventos activos
    activeThursdayEvents = activeThursdayEvents.filter(event => {
        event.duration -= 1;
        if (event.duration <= 0) {
            // Remover efecto del evento
            if (event.removeEffect) {
                event.removeEffect();
            }
            consoleLog(`✅ Evento terminado: ${event.name}`);
            return false;
        }
        return true;
    });
}

// Disparar evento aleatorio del jueves
function triggerRandomThursdayEvent() {
    // Seleccionar evento basado en probabilidad
    const rand = Math.random();
    let cumulativeProbability = 0;
    
    for (const eventTemplate of thursdayEvents) {
        cumulativeProbability += eventTemplate.probability;
        if (rand <= cumulativeProbability) {
            // Crear instancia del evento
            const event = {
                name: eventTemplate.name,
                type: eventTemplate.type,
                duration: eventTemplate.duration,
                effect: eventTemplate.effect,
                removeEffect: eventTemplate.removeEffect,
                message: eventTemplate.message
            };
            
            // Aplicar efecto
            event.effect();
            activeThursdayEvents.push(event);
            
            // Registrar estadística
            thursdayStats.eventsEncountered[event.name] = 
                (thursdayStats.eventsEncountered[event.name] || 0) + 1;
            
            // Notificar al jugador
            consoleLog(event.message);
            showNarrative(event.message);
            
            // Dar puntos según tipo de evento
            if (event.type === 'curse') {
                buenFindePoints += 50; // Sobrevivir maldiciones da puntos
            }
            
            break;
        }
    }
}

// Completar un jueves
function completeThursday() {
    thursdayStats.thursdaysSurvived += 1;
    
    // Verificar si podemos desbloquear el viernes
    if (buenFindePoints >= getRequiredFridayPoints()) {
        unlockFriday();
    } else {
        resetThursday();
    }
}

// Obtener puntos requeridos para el viernes
function getRequiredFridayPoints() {
    const basePoints = 1000;
    return basePoints * Math.pow(2, fridayLevel); // Escala exponencial
}

// Desbloquear viernes (Buen Finde)
function unlockFriday() {
    fridayUnlocked = true;
    fridayLevel += 1;
    thursdayStats.fridaysUnlocked += 1;
    fridayEndTime = Date.now() + FRIDAY_DURATION_MS; // Guardar timestamp de fin
    
    consoleLog('');
    consoleLog('═══════════════════════════════════════════════');
    consoleLog('🎉 ¡BUEN FINDE DESBLOQUEADO!');
    consoleLog('═══════════════════════════════════════════════');
    consoleLog(`Has alcanzado el nivel ${fridayLevel} de Buen Finde!`);
    consoleLog('Disfruta de 2 horas de bonificaciones especiales.');
    consoleLog('═══════════════════════════════════════════════');
    
    showNarrative('🎉 ¡BUEN FINDE! Has sobrevivido el jueves. Disfruta tus bonificaciones.');
    
    // Verificar si se completó el post-game
    checkPostGameCompletion();
    
    // Aplicar bendiciones del viernes
    cpsMultiplier *= 3.0; // +200% CPS
    
    saveGame();
}

// Verificar si se completó el post-game y mostrar créditos del Buen Finde
function checkPostGameCompletion() {
    if (!postGameCompleted && fridayLevel >= POST_GAME_COMPLETION_FRIDAYL_LEVEL) {
        postGameCompleted = true;
        
        consoleLog('');
        consoleLog('═══════════════════════════════════════════════');
        consoleLog('🏆 ¡HAS COMPLETADO EL POST-GAME!');
        consoleLog('═══════════════════════════════════════════════');
        consoleLog(`¡Alcanzaste el nivel ${fridayLevel} de Buen Finde!`);
        consoleLog('Has dominado el jueves eterno.');
        consoleLog('Revisa los créditos especiales del Buen Finde.');
        consoleLog('═══════════════════════════════════════════════');
        
        showNarrative('🏆 ¡Completaste el post-game! Has dominado el jueves eterno.');
        
        // Mostrar créditos del Buen Finde
        if (buenFindeCreditsSection) {
            buenFindeCreditsSection.style.display = 'block';
        }
<<<<<<< HEAD

        consoleLog('🔁 Escribe "rogue" para iniciar el modo Buen Finde roguelike.');
=======
        
>>>>>>> 7d4ce85 (Superpowers (#8))
        saveGame();
    }
}

<<<<<<< HEAD
function enterRoguelikeMode() {
    if (!postGameCompleted) {
        consoleLog('❌ Debes completar el post-game para iniciar el modo Buen Finde roguelike.');
        return;
    }
    if (roguelikeModeActive) {
        consoleLog('⚠️ Ya estás en una sesión de Buen Finde roguelike.');
        return;
    }

    roguelikeModeActive = true;
    roguelikeRuns += 1;
    nextRunMultiplier = 1 + Math.min(0.5, 0.1 * roguelikeRuns);
    persistentBonuses.cps = 1 + Math.min(1, 0.1 * roguelikeRuns);

    consoleLog('');
    consoleLog('═══════════════════════════════════════════════');
    consoleLog('🎮 ¡Modo Buen Finde Roguelike iniciado!');
    consoleLog('═══════════════════════════════════════════════');
    consoleLog(`Run #${roguelikeRuns} iniciada. Tu bonus persistente de CPS es x${persistentBonuses.cps.toFixed(2)}.`);
    consoleLog('Sobrevive al jueves eterno y aumenta tu multiplicador entre runs.');
    consoleLog('═══════════════════════════════════════════════');
    showNarrative('🎮 Entraste en el modo Buen Finde roguelike. Cada run mejora tus bonus persistentes.');

    saveGame();
}

function startGameLoop() {
    if (productionInterval !== null) {
        return;
    }
    productionInterval = setInterval(produceCoffee, 1000);
}

function showThursdayEasterEgg(callback) {
    const overlay = document.getElementById('thursday-overlay');
    const videoFrame = document.getElementById('thursday-video');
    const skipBtn = document.getElementById('thursday-skip-btn');
    if (!overlay || !videoFrame || !skipBtn) {
        callback();
        return;
    }

    overlay.style.display = 'flex';
    videoFrame.src = 'https://www.youtube.com/embed/BvtUSsok4JA?autoplay=1&mute=1&rel=0&showinfo=0';
    skipBtn.disabled = true;
    skipBtn.textContent = 'Saltarse en 5s...';

    let skipDelay = 5;
    const interval = setInterval(() => {
        skipDelay -= 1;
        skipBtn.textContent = `Saltarse en ${skipDelay}s...`;
        if (skipDelay <= 0) {
            clearInterval(interval);
            skipBtn.disabled = false;
            skipBtn.textContent = 'Saltarse video y continuar';
        }
    }, 1000);

    skipBtn.addEventListener('click', function handleSkip() {
        skipBtn.removeEventListener('click', handleSkip);
        overlay.style.display = 'none';
        videoFrame.src = '';
        callback();
    });
}

function checkThursdayEasterEgg(callback) {
    const today = new Date();
    const isThursday = today.getDay() === 4; // 0 = Domingo, 4 = Jueves
    if (isThursday) {
        showThursdayEasterEgg(callback);
    } else {
        callback();
    }
}

=======
>>>>>>> 7d4ce85 (Superpowers (#8))
// Terminar viernes y volver al jueves
function endFriday() {
    fridayUnlocked = false;
    cpsMultiplier /= 3.0; // Remover bonus
    
    consoleLog('⏰ El Buen Finde ha terminado. De vuelta al jueves...');
    showNarrative('⏰ El viernes terminó. Es jueves otra vez...');
    
    resetThursday();
}

// Resetear el jueves para un nuevo ciclo
function resetThursday() {
    thursdayTime = 32400; // Volver a las 9 AM
    buenFindePoints = Math.floor(buenFindePoints * THURSDAY_POINT_RETENTION_RATIO); // Mantener porcentaje de puntos
    activeThursdayEvents = [];
    cpsMultiplier = 1.0; // Reset multiplicadores
    fridayEndTime = 0; // Limpiar timestamp de viernes
    
    consoleLog('🔄 Nuevo jueves comenzando. Son las 9:00 AM...');
    consoleLog(`Puntos Buen Finde: ${buenFindePoints}/${getRequiredFridayPoints()}`);
    
    saveGame();
}

// Actualizar UI del Thursday Mode
function updateThursdayUI() {
    // Actualizar puntos
    if (fridayPointsDisplay) {
        fridayPointsDisplay.textContent = `${buenFindePoints}/${getRequiredFridayPoints()}`;
    }
    
    // Actualizar barra de progreso
    if (fridayProgressBar) {
        const progress = Math.min((buenFindePoints / getRequiredFridayPoints()) * 100, 100);
        fridayProgressBar.style.width = `${progress}%`;
    }
    
    // Actualizar lista de eventos activos
    if (activeEventsListDisplay) {
        if (activeThursdayEvents.length === 0) {
            activeEventsListDisplay.innerHTML = '<p style="color: #666;">Sin eventos activos</p>';
        } else {
            activeEventsListDisplay.innerHTML = activeThursdayEvents.map(event => {
                const minutes = Math.floor(event.duration / 60);
                const seconds = event.duration % 60;
                const icon = event.type === 'blessing' ? '✨' : '⚠️';
                return `<div class="thursday-event ${event.type}">
                    ${icon} ${event.name} (${minutes}:${seconds.toString().padStart(2, '0')})
                </div>`;
            }).join('');
        }
    }
    
    // Actualizar estadísticas del jueves
    const thursdaysSurvivedDisplay = document.getElementById('thursdays-survived');
    const fridaysUnlockedDisplay = document.getElementById('fridays-unlocked');
    const bestPointsDisplay = document.getElementById('best-points');
    
    if (thursdaysSurvivedDisplay) {
        thursdaysSurvivedDisplay.textContent = thursdayStats.thursdaysSurvived;
    }
    if (fridaysUnlockedDisplay) {
        fridaysUnlockedDisplay.textContent = thursdayStats.fridaysUnlocked;
    }
    if (bestPointsDisplay) {
        bestPointsDisplay.textContent = thursdayStats.bestPointsRecord;
    }
}

// Ganar puntos del Buen Finde
function earnBuenFindePoints(action, amount) {
    if (!thursdayModeUnlocked) return;
    
    buenFindePoints += amount;
    if (buenFindePoints > thursdayStats.bestPointsRecord) {
        thursdayStats.bestPointsRecord = buenFindePoints;
    }
    
    consoleLog(`+${amount} puntos Buen Finde! (${buenFindePoints}/${getRequiredFridayPoints()})`);
}

// ═══════════════════════════════════════════════════════════
// FIN FELIZ JUEVES MODE
// ═══════════════════════════════════════════════════════════

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

// Actualizar botón de donar
function updateDonateButton() {
    const remaining = Math.max(0, 300000 - (Date.now() - lastDonateTime)); // 5 minutos cooldown
    if (remaining > 0) {
        const seconds = Math.ceil(remaining / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        donateBtn.textContent = `Donar (${minutes}:${secs.toString().padStart(2, '0')})`;
        donateBtn.disabled = true;
        donateBtn.classList.add('cooldown');
    } else {
        donateBtn.textContent = 'Donar Café (Costo: 100, Bonus: +10% CPS temporal)';
        donateBtn.disabled = false;
        donateBtn.classList.remove('cooldown');
    }
}

// Actualizar indicador de efecto de donar
function updateDonateEffectIndicator() {
    const donateEffectIndicator = document.getElementById('donateEffectIndicator');
    const donateTimeRemaining = document.getElementById('donateTimeRemaining');
    
    if (Date.now() < donateEndTime) {
        // Efecto activo - mostrar indicador
        const remaining = Math.max(0, donateEndTime - Date.now());
        const seconds = Math.ceil(remaining / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        donateTimeRemaining.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
        donateEffectIndicator.style.display = 'flex';
    } else {
        // Efecto terminado - ocultar indicador
        donateEffectIndicator.style.display = 'none';
    }
}

// Actualizar la interfaz
function updateDisplay() {
    // Validar valores antes de mostrar
    validateAndApplyEngineState();
    
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

    // Actualizar botón de donación - solo habilitado si hay suficiente café
    if (donateBtn) {
        donateBtn.disabled = coffee < 100;
        if (coffee >= 100) {
            donateBtn.classList.remove('disabled');
        } else {
            donateBtn.classList.add('disabled');
        }
    }

    // Desbloquear mazmorras después de completar toda la historia del acto anterior
    if (!dungeons.salaReuniones.unlocked && totalCoffee >= dungeons.salaReuniones.unlockAt) {
        dungeons.salaReuniones.unlocked = true;
        consoleLog('🏰 ¡Nueva mazmorra desbloqueada: Sala de Reuniones!');
        showNarrative('⚔️ BOSS DEL ACTO 1: Damián Rebelde está disponible. Derrótalo para continuar la historia.');
    }
    // Acto 2: Desbloquear después de completar toda la historia del Acto 1
    if (!dungeons.cafeteriaOscura.unlocked && currentDialogueIndex >= getLastDialogueIndexForAct(1)) {
        dungeons.cafeteriaOscura.unlocked = true;
        consoleLog('🏰 ¡Nueva mazmorra desbloqueada: Cafetería Oscura!');
        showNarrative('⚔️ BOSS DEL ACTO 2: Crisis de Arganaraz te espera. La historia no avanzará hasta derrotarlo.');
    }
    // Acto 3: Desbloquear después de completar toda la historia del Acto 2
    if (!dungeons.casaDamian.unlocked && currentDialogueIndex >= getLastDialogueIndexForAct(2)) {
        dungeons.casaDamian.unlocked = true;
        consoleLog('🏰 ¡Nueva mazmorra desbloqueada: Casa de Damián!');
        showNarrative('⚔️ BOSS DEL ACTO 3: Minion de Lucía custodiado por 19 perros. Derrótalo para avanzar.');
    }
    // Acto 4: Desbloquear después de completar toda la historia del Acto 3
    if (!dungeons.bodegaSecreta.unlocked && currentDialogueIndex >= getLastDialogueIndexForAct(3)) {
        dungeons.bodegaSecreta.unlocked = true;
        consoleLog('🏰 ¡Nueva mazmorra desbloqueada: Bodega Secreta!');
        showNarrative('⚔️ BOSS DEL ACTO 4: Sonrisa Inquebrantable acecha en las sombras. Derrótala para continuar.');
    }
    // Acto 5: Desbloquear después de completar toda la historia del Acto 4
    if (!dungeons.posadaPerros.unlocked && currentDialogueIndex >= getLastDialogueIndexForAct(4)) {
        dungeons.posadaPerros.unlocked = true;
        consoleLog('🏰 ¡Nueva mazmorra desbloqueada: Posada de los Perros!');
        showNarrative('⚔️ BOSS DEL ACTO 5: Niebla Azul se alza sobre los posos. Derrótala para el acto final.');
    }
    // Acto 6: Desbloquear después de completar toda la historia del Acto 5
    if (!dungeons.oficinaCentral.unlocked && currentDialogueIndex >= getLastDialogueIndexForAct(5)) {
        dungeons.oficinaCentral.unlocked = true;
        consoleLog('🏰 ¡Nueva mazmorra desbloqueada: Oficina Central!');
        showNarrative('El último bastión donde Lucía hace su resistencia final antes de ser neutralizada...');
    }
    
    // Actualizar botón de mail
    updateMailButton();
    
    // Actualizar botón de donar
    updateDonateButton();
    
    // Actualizar indicador de efecto de donar
    updateDonateEffectIndicator();
    
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
        showNarrative('Mazmorra no disponible.');
        return;
    }

    inDungeon = true;
    currentDungeon = dungeons[name];
    playerPos = { x: 2, y: 3 }; // Posición inicial

    // FIXED: Ocultar sección de upgrades mientras esté en dungeon
    const upgradesSection = document.getElementById('upgrades');
    if (upgradesSection) {
        upgradesSection.style.display = 'none';
    }
    
    // FIXED: Verificar si hay un boss disponible en esta dungeon y spawnearlo
    const availableBoss = bosses.find(b => 
        b.dungeon === name && 
        !defeatedBosses.includes(b.name) && 
        totalCoffee >= b.spawnAt
    );
    
    if (availableBoss) {
        // Resetear la salud del boss si es necesario
        if (availableBoss.health <= 0) {
            availableBoss.health = availableBoss.maxHealth;
        }
        showNarrative(`⚔️ BOSS DETECTADO: ${availableBoss.name} está esperándote en esta dungeon.`);
    }
    
    // FIXED: Mostrar interfaz visual de dungeon con verificaciones
    const visualContainer = document.getElementById('dungeonVisualContainer');
    if (visualContainer) {
        visualContainer.style.display = 'block';
    }
    
    showNarrative(`Entrando a ${getDungeonDisplayName(name)}...`);
    updateVisualDungeonDisplay();
    updateDungeonDisplay();
}

function exitDungeon() {
    inDungeon = false;
    if (currentDungeon) {
        currentDungeon.currentMonster = null; // Limpiar monstruo actual
    }
    currentDungeon = null;
    currentBoss = null; // Limpiar boss al salir
    
    // FIXED: Mostrar nuevamente la sección de upgrades al salir de dungeon
    const upgradesSection = document.getElementById('upgrades');
    if (upgradesSection) {
        upgradesSection.style.display = 'block';
    }
    
    // FIXED: Ocultar interfaz visual de dungeon con verificación
    const visualContainer = document.getElementById('dungeonVisualContainer');
    if (visualContainer) {
        visualContainer.style.display = 'none';
    }
    
    showNarrative('Saliendo de la mazmorra.');
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
        // FIXED: Encontrar y spawnear boss de la dungeon
        const dungeonName = Object.keys(dungeons).find(key => dungeons[key] === currentDungeon);
        const boss = bosses.find(b => 
            b.dungeon === dungeonName && 
            !defeatedBosses.includes(b.name) &&
            totalCoffee >= b.spawnAt
        );
        
        if (boss) {
            consoleLog(`⚔️ ¡Encuentras a ${boss.name}! El jefe final de esta mazmorra.`);
            consoleLog(`Vida: ${boss.health}/${boss.maxHealth}`);
            consoleLog(`Usa 'fight' para enfrentar al boss.`);
            
            // Activar boss como enemigo actual
            currentBoss = { ...boss };
            updateDungeonDisplay();
        } else if (defeatedBosses.includes(currentDungeon.bossName)) {
            consoleLog(`El lugar donde derrotaste a ${currentDungeon.bossName}. Solo quedan recuerdos de café amargo.`);
        } else {
            consoleLog('El boss de esta mazmorra aún no está disponible. Necesitas más progreso.');
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
        updateVisualDungeonDisplay(); // Update visual display too
    }
}

// Producción automática
function produceCoffee() {
    const state = buildEngineState();
    validateEngineValues(state);

    const effectiveCPS = engineProduceCoffee(state);

    applyEngineState(state);
    
    // Actualizar Thursday Mode si está activo
    if (thursdayModeUnlocked && thursdayPanel && thursdayPanel.style.display === 'block') {
        updateThursdayMode();
        
        // Ocultar créditos normales mientras Thursday Mode está activo
        const creditsSection = document.getElementById('credits');
        if (creditsSection) {
            creditsSection.style.display = 'none';
        }
    }
    
    // Verificar si el viernes ha terminado (check persistente)
    if (fridayUnlocked && fridayEndTime > 0 && Date.now() >= fridayEndTime) {
        endFriday();
    }
    
    // Los bosses ya no spawean automáticamente - están en dungeons específicas
    updateDisplay();
    checkAchievements();
    updateStory(); // Asegurar que la historia se actualice
    saveGame();
}

// Comprar upgrade
function buyUpgrade(upgradeKey) {
    const state = buildEngineState();
    const upgrade = state.upgrades[upgradeKey];
    if (!upgrade) {
        consoleLog('Upgrade no encontrado.');
        return;
    }

    const success = engineBuyUpgrade(state, upgradeKey);
    if (!success) {
        const cost = getUpgradeCost(upgrade);
        if (coffee < cost) {
            showNarrative('No tienes suficiente café para comprar esta mejora.');
        } else {
            const currentAct = getCurrentAct();
            showNarrative(`¡No puedes comprar esa mejora todavía! Derrota al boss del Acto ${currentAct} para avanzar.`);
        }
        return;
    }

    applyEngineState(state);
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
}
>>>>>>> 7d4ce85 (Superpowers (#8))
=======
>>>>>>> 0d7b54d (Add Easter egg for Thursdays and create post-game design document)

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
    if (!dungeonButtonsContainer) {
        return;
    }

    dungeonButtonsContainer.innerHTML = '';

    Object.keys(dungeons).forEach(dungeonKey => {
        const dungeon = dungeons[dungeonKey];
        if (dungeon.unlocked) {
            const button = document.createElement('button');
            button.className = 'upgrade-btn';
            button.textContent = `🏰 ${getDungeonDisplayName(dungeonKey)}`;

            // Verificar si hay boss disponible (solo si todos los bosses anteriores están derrotados)
            const boss = bosses.find(b => {
                if (b.dungeon === dungeonKey && !defeatedBosses.includes(b.name) && totalCoffee >= b.spawnAt) {
                    // Verificar que todos los bosses de actos anteriores estén derrotados
                    const previousBosses = bosses.filter(prevBoss => prevBoss.act < b.act);
                    return previousBosses.every(prevBoss => defeatedBosses.includes(prevBoss.name));
                }
                return false;
            });
            if (boss) {
                button.textContent += ` ⚔️`;
                button.style.border = '2px solid #ff6666';
            }

            // FIXED: Asegurar que el event listener funcione correctamente
            button.addEventListener('click', function() {
                enterDungeon(dungeonKey);
            });

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
        
        // Dar puntos del Buen Finde si Thursday Mode está activo
        if (thursdayModeUnlocked) {
            earnBuenFindePoints('derrotar_boss', 100);
        }
        
        currentBoss = null;
        
        // Actualizar la historia después de derrotar un boss
        updateStory();
        updateVisualDungeonDisplay(); // Update visual display
    }
    updateDungeonDisplay();
    updateDisplay();
    saveGame();
}

// Eventos especiales
function donate() {

    // FIXED: Cooldown de 5 minutos entre donaciones
    if (Date.now() - lastDonateTime < 300000) { // 5 minutos = 300,000 ms
        const remaining = Math.ceil((300000 - (Date.now() - lastDonateTime)) / 1000);
        showNarrative(`Espera ${remaining} segundos antes de donar de nuevo.`);
        return;
    }

    if (coffee >= 100) {
        coffee -= 100;
        // FIXED: Bonus temporal de 10% por 1 minuto (60,000 ms)
        donateEndTime = Date.now() + 60000; // 1 minuto
        lastDonateTime = Date.now();
        showNarrative("¡Gracias por donar! Tu producción aumenta un 10% por 1 minuto.");
        playEventSound();
        updateDisplay();
        updateDonateButton(); // Actualizar el botón después de donar
        updateDonateEffectIndicator(); // Mostrar el indicador del efecto
        saveGame();
    } else {
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

// Event listeners para botones - se configuran cuando el DOM esté listo
function setupEventListeners() {
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

    // NOTA: fightBossButton eliminado - combate ahora es solo en dungeons

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

    // Setup visual dungeon controls
    setupVisualDungeonControls();

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
}

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

// Visual Dungeon Display Functions
function updateVisualDungeonDisplay() {
    if (!inDungeon || !currentDungeon) {
        return;
    }
    
    const mapDisplay = document.getElementById('dungeonMap');
    if (!mapDisplay) {
        console.error('Dungeon map element not found!');
        return;
    }
    
    let mapHTML = '';
    for (let y = 0; y < currentDungeon.map.length; y++) {
        let rowHTML = '';
        for (let x = 0; x < currentDungeon.map[y].length; x++) {
            let cellContent = '';
            let cellClass = 'map-cell';
            
            if (x === playerPos.x && y === playerPos.y) {
                cellContent = '@';
                cellClass += ' map-player';
            } else {
                const tile = currentDungeon.map[y][x];
                cellContent = tile;
                
                switch(tile) {
                    case '#':
                        cellClass += ' map-wall';
                        break;
                    case 'M':
                        cellClass += ' map-monster';
                        break;
                    case 'B':
                        cellClass += ' map-boss';
                        break;
                    case 'E':
                        cellClass += ' map-exit';
                        break;
                    case '.':
                        cellClass += ' map-empty';
                        cellContent = '·';
                        break;
                }
            }
            
            rowHTML += `<span class="${cellClass}">${cellContent}</span>`;
        }
        mapHTML += rowHTML + '<br>';
    }
    
    mapDisplay.innerHTML = mapHTML;
    
    // Actualizar botón de fight
    const fightButton = document.getElementById('fightBtn');
    if (fightButton) {
        const canFight = (currentBoss && inDungeon) || (currentDungeon && currentDungeon.currentMonster);
        fightButton.disabled = !canFight;
    }
}

function setupVisualDungeonControls() {
    
    const moveUpButton = document.getElementById('moveUpBtn');
    const moveDownButton = document.getElementById('moveDownBtn');
    const moveLeftButton = document.getElementById('moveLeftBtn');
    const moveRightButton = document.getElementById('moveRightBtn');
    const fightButton = document.getElementById('fightBtn');
    const exitButton = document.getElementById('exitDungeonBtn');
    
    
    if (moveUpButton) {
        moveUpButton.addEventListener('click', () => {
            movePlayerVisual(0, -1);
        });
    }
    if (moveDownButton) {
        moveDownButton.addEventListener('click', () => {
            movePlayerVisual(0, 1);
        });
    }
    if (moveLeftButton) {
        moveLeftButton.addEventListener('click', () => {
            movePlayerVisual(-1, 0);
        });
    }
    if (moveRightButton) {
        moveRightButton.addEventListener('click', () => {
            movePlayerVisual(1, 0);
        });
    }
    if (fightButton) {
        fightButton.addEventListener('click', () => {
            if (currentBoss && inDungeon) {
                fightDungeonBoss();
            } else if (currentDungeon && currentDungeon.currentMonster) {
                fightDungeonMonster();
            }
        });
    }
    if (exitButton) {
        exitButton.addEventListener('click', () => {
            exitDungeon();
        });
    }
}

function movePlayerVisual(dx, dy) {
    if (!inDungeon) {
        showNarrative('No estás en una mazmorra.');
        return;
    }
    
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    if (newX < 0 || newX >= currentDungeon.map[0].length || newY < 0 || newY >= currentDungeon.map.length) {
        showNarrative('No puedes ir ahí.');
        return;
    }
    
    const tile = currentDungeon.map[newY][newX];
    if (tile === '#') {
        showNarrative('¡Pared! No puedes pasar.');
        return;
    }
    
    playerPos.x = newX;
    playerPos.y = newY;
    
    if (tile === 'M') {
        const monster = currentDungeon.monsters[tile];
        showNarrative(`¡Encuentras a ${monster.name}! (Vida: ${monster.health})`);
        
        if (!currentDungeon.currentMonster) {
            currentDungeon.currentMonster = { 
                ...monster, 
                x: newX, 
                y: newY,
                maxHealth: monster.health 
            };
        }
    } else if (tile === 'B') {
        const dungeonName = Object.keys(dungeons).find(key => dungeons[key] === currentDungeon);
        const boss = bosses.find(b => 
            b.dungeon === dungeonName && 
            !defeatedBosses.includes(b.name) &&
            totalCoffee >= b.spawnAt
        );
        
        if (boss) {
            showNarrative(`⚔️ ¡Encuentras a ${boss.name}! El jefe final de esta mazmorra.`);
            currentBoss = { ...boss };
        } else if (defeatedBosses.includes(currentDungeon.bossName)) {
            showNarrative(`El lugar donde derrotaste a ${currentDungeon.bossName}. Solo quedan recuerdos de café amargo.`);
        } else {
            showNarrative('El boss de esta mazmorra aún no está disponible. Necesitas más progreso.');
        }
    } else if (newX === currentDungeon.exit.x && newY === currentDungeon.exit.y) {
        showNarrative('¡Encontraste la salida!');
        exitDungeon();
        return;
    }
    
    updateVisualDungeonDisplay();
    updateDungeonDisplay();
}

// ========================================
// SISTEMA DE DESARROLLO SECRETO
// ========================================

function activateDevMode() {
    devModeEnabled = true;
    devCommands = [];
    consoleLog('');
    consoleLog('🔧 ==============================');
    consoleLog('🔧   MODO DESARROLLO ACTIVADO   ');
    consoleLog('🔧 ==============================');
    consoleLog('🔧 ¡Bienvenido al modo de pruebas secreto!');
    consoleLog('🔧 Escribe "devhelp" para ver todos los comandos.');
    consoleLog('🔧 Escribe "help" para ver comandos normales + desarrollo.');
    consoleLog('🔧 ¡Usa estos poderes con sabiduría, Ancleto!');
    consoleLog('🔧 ==============================');
    logDevCommand('activateDevMode', 'Modo desarrollo activado');
}

function handleDevCommand(command, target) {
    if (!devModeEnabled) return false;
    
    const devCommands = {
        'devhelp': () => showDevHelp(),
        'devinfo': () => showDevInfo(),
        'devlog': () => showDevLog(),
        'setcoffee': (amount) => setResource('coffee', amount),
        'settotal': (amount) => setResource('totalCoffee', amount),
        'setcps': (amount) => setResource('cps', amount),
        'setcharisma': (amount) => setResource('charisma', amount),
        'setstrength': (amount) => setResource('coffeeStrength', amount),
        'unlockall': () => unlockAllDungeons(),
        'spawnboss': (name) => spawnSpecificBoss(name),
        'defeatboss': (name) => defeatSpecificBoss(name),
        'resetbosses': () => resetAllBosses(),
        'jumpact': (actNumber) => jumpToAct(actNumber),
        'addachievement': (name) => addCustomAchievement(name),
        'clearachievements': () => clearAllAchievements(),
        'listbosses': () => listAllBosses(),
        'forcedialogue': (index) => forceDialogue(index),
        'nextdialogue': () => forceNextDialogue(),
        'teleport': (coords) => teleportPlayer(coords),
        'godmode': () => toggleGodMode()
    };
    
    const handler = devCommands[command];
    if (handler) {
        logDevCommand(command, target);
        handler(target);
        return true;
    }
    
    return false;
}

function showDevHelp() {
    consoleLog('🔧 ======== COMANDOS DE DESARROLLO ========');
    consoleLog('🔧 RECURSOS:');
    consoleLog('🔧 • setcoffee [amount] - Establecer café actual');
    consoleLog('🔧 • settotal [amount] - Establecer café total');
    consoleLog('🔧 • setcps [amount] - Establecer CPS');
    consoleLog('🔧 • setcharisma [amount] - Establecer carisma');
    consoleLog('🔧 • setstrength [amount] - Establecer fuerza cafetera');
    consoleLog('🔧');
    consoleLog('🔧 DUNGEONS Y BOSSES:');
    consoleLog('🔧 • unlockall - Desbloquear todas las dungeons');
    consoleLog('🔧 • listbosses - Ver estado de todos los bosses');
    consoleLog('🔧 • spawnboss [name] - Spawnear boss específico');
    consoleLog('🔧 • defeatboss [name] - Marcar boss como derrotado');
    consoleLog('🔧 • resetbosses - Resetear todos los bosses');
    consoleLog('🔧');
    consoleLog('🔧 PROGRESIÓN:');
    consoleLog('🔧 • jumpact [1-6] - Saltar al acto específico');
    consoleLog('🔧 • forcedialogue [index] - Forzar diálogo específico');
    consoleLog('🔧 • nextdialogue - Avanzar al siguiente diálogo');
    consoleLog('🔧');
    consoleLog('🔧 LOGROS:');
    consoleLog('🔧 • addachievement [name] - Agregar logro personalizado');
    consoleLog('🔧 • clearachievements - Limpiar todos los logros');
    consoleLog('🔧');
    consoleLog('🔧 UTILIDADES:');
    consoleLog('🔧 • devinfo - Ver estado completo de desarrollo');
    consoleLog('🔧 • devlog - Ver historial de comandos');
    consoleLog('🔧 • teleport [x] [y] - Teletransportarse en dungeon');
    consoleLog('🔧 • godmode - Activar/desactivar modo dios');
    consoleLog('🔧 =======================================');
}

function showDevInfo() {
    consoleLog('🔧 ======== INFORMACIÓN DE DESARROLLO ========');
    consoleLog(`🔧 Modo desarrollo: ${devModeEnabled ? 'ACTIVADO' : 'DESACTIVADO'}`);
    consoleLog(`🔧 Comandos ejecutados: ${devCommands.length}`);
    consoleLog(`🔧 En dungeon: ${inDungeon ? 'SÍ' : 'NO'}`);
    consoleLog(`🔧 Dungeon actual: ${currentDungeon ? Object.keys(dungeons).find(key => dungeons[key] === currentDungeon) : 'Ninguna'}`);
    consoleLog(`🔧 Boss actual: ${currentBoss ? currentBoss.name : 'Ninguno'}`);
    consoleLog(`🔧 Bosses derrotados: ${defeatedBosses.length}/6`);
    consoleLog(`🔧 Diálogo actual: ${currentDialogueIndex}/${dialogues.length - 1}`);
    consoleLog(`🔧 Dungeons desbloqueadas: ${Object.values(dungeons).filter(d => d.unlocked).length}/6`);
    consoleLog(`🔧 Logros: ${achievements.length}`);
    consoleLog('🔧 ========================================');
}

function showDevLog() {
    consoleLog('🔧 ======== HISTORIAL DE COMANDOS ========');
    if (devCommands.length === 0) {
        consoleLog('🔧 No hay comandos registrados aún.');
    } else {
        devCommands.slice(-10).forEach((entry, index) => {
            consoleLog(`🔧 ${devCommands.length - 10 + index + 1}. ${entry.time} - ${entry.command} ${entry.target || ''}`);
        });
        if (devCommands.length > 10) {
            consoleLog(`🔧 ... y ${devCommands.length - 10} más`);
        }
    }
    consoleLog('🔧 ====================================');
}

function setResource(resourceName, amount) {
    const value = parseInt(amount) || 0;
    
    switch(resourceName) {
        case 'coffee':
            coffee = value;
            break;
        case 'totalCoffee':
            totalCoffee = value;
            break;
        case 'cps':
            cps = value;
            break;
        case 'charisma':
            charisma = value;
            break;
        case 'coffeeStrength':
            coffeeStrength = value;
            break;
    }
    
    consoleLog(`🔧 ${resourceName} establecido a ${value}`);
    updateDisplay();
    updateStory();
    saveGame();
}

function unlockAllDungeons() {
    Object.keys(dungeons).forEach(key => {
        dungeons[key].unlocked = true;
    });
    consoleLog('🔧 Todas las dungeons desbloqueadas');
    updateDisplay();
    saveGame();
}

function spawnSpecificBoss(name) {
    const boss = bosses.find(b => b.name.toLowerCase().includes(name.toLowerCase()));
    if (boss) {
        currentBoss = { ...boss };
        currentBoss.health = currentBoss.maxHealth;
        consoleLog(`🔧 Boss ${boss.name} spawneado con ${boss.health} de vida`);
        updateDungeonDisplay();
    } else {
        consoleLog(`🔧 Boss "${name}" no encontrado. Bosses disponibles:`);
        bosses.forEach(b => consoleLog(`🔧 • ${b.name}`));
    }
}

function defeatSpecificBoss(name) {
    const boss = bosses.find(b => b.name.toLowerCase().includes(name.toLowerCase()));
    if (boss) {
        if (!defeatedBosses.includes(boss.name)) {
            defeatedBosses.push(boss.name);
            coffee += boss.reward;
            totalCoffee += boss.reward;
            consoleLog(`🔧 Boss ${boss.name} marcado como derrotado (+${boss.reward} café)`);
            updateDisplay();
            updateStory();
            saveGame();
        } else {
            consoleLog(`🔧 Boss ${boss.name} ya estaba derrotado`);
        }
    } else {
        consoleLog(`🔧 Boss "${name}" no encontrado`);
    }
}

function resetAllBosses() {
    defeatedBosses = [];
    bosses.forEach(boss => {
        boss.health = boss.maxHealth;
    });
    currentBoss = null;
    consoleLog('🔧 Todos los bosses reseteados');
    updateDisplay();
    updateStory();
    saveGame();
}

function jumpToAct(actNumber) {
    const act = parseInt(actNumber);
    if (act >= 1 && act <= 6) {
        // Encontrar el primer diálogo del acto
        const actDialogue = dialogues.find(d => d.act.includes(`Acto ${act}`));
        if (actDialogue) {
            // Calcular el café absoluto correspondiente al relativeThreshold del acto
            totalCoffee = getRelativeThreshold(act, actDialogue.relativeThreshold);
            currentDialogueIndex = dialogues.indexOf(actDialogue);
            consoleLog(`🔧 Saltando al Acto ${act} (café total: ${totalCoffee})`);
            updateDisplay();
            updateStory();
            saveGame();
        }
    } else {
        consoleLog('🔧 Número de acto inválido (1-6)');
    }
}

function addCustomAchievement(name) {
    if (name && !achievements.includes(name)) {
        achievements.push(name);
        consoleLog(`🔧 Logro "${name}" agregado`);
        updateAchievements();
        saveGame();
    } else {
        consoleLog('🔧 Nombre de logro inválido o ya existe');
    }
}

function clearAllAchievements() {
    achievements = [];
    consoleLog('🔧 Todos los logros eliminados');
    updateAchievements();
    saveGame();
}

function listAllBosses() {
    consoleLog('🔧 ======== ESTADO DE BOSSES ========');
    bosses.forEach((boss, index) => {
        const defeated = defeatedBosses.includes(boss.name) ? '✅' : '❌';
        const available = totalCoffee >= boss.spawnAt ? '🟢' : '🔴';
        consoleLog(`🔧 ${index + 1}. ${boss.name} ${defeated} ${available}`);
        consoleLog(`🔧    Acto: ${boss.act}, Spawn: ${boss.spawnAt}, Dungeon: ${boss.dungeon}`);
    });
    consoleLog('🔧 ===============================');
}

function forceDialogue(index) {
    const dialogueIndex = parseInt(index);
    if (dialogueIndex >= 0 && dialogueIndex < dialogues.length) {
        currentDialogueIndex = dialogueIndex;
        const dialogue = dialogues[dialogueIndex];
        // Calcular café absoluto basado en el acto y relativeThreshold del diálogo
        const actNumber = extractActNumber(dialogue.act);
        totalCoffee = getRelativeThreshold(actNumber, dialogue.relativeThreshold);
        consoleLog(`🔧 Forzando diálogo ${dialogueIndex}: "${dialogue.title}"`);
        updateStory();
        updateDisplay();
        saveGame();
    } else {
        consoleLog(`🔧 Índice inválido (0-${dialogues.length - 1})`);
    }
}

function forceNextDialogue() {
    if (currentDialogueIndex < dialogues.length - 1) {
        currentDialogueIndex++;
        const dialogue = dialogues[currentDialogueIndex];
        // Calcular café absoluto basado en el acto y relativeThreshold del diálogo
        const actNumber = extractActNumber(dialogue.act);
        totalCoffee = getRelativeThreshold(actNumber, dialogue.relativeThreshold);
        consoleLog(`🔧 Avanzando al siguiente diálogo: "${dialogue.title}"`);
        updateStory();
        updateDisplay();
        saveGame();
    } else {
        consoleLog('🔧 Ya estás en el último diálogo');
    }
}

function teleportPlayer(coords) {
    if (!inDungeon) {
        consoleLog('🔧 Debes estar en una dungeon para teletransportarte');
        return;
    }
    
    const parts = coords.split(' ');
    const x = parseInt(parts[0]);
    const y = parseInt(parts[1]);
    
    if (isNaN(x) || isNaN(y)) {
        consoleLog('🔧 Uso: teleport [x] [y]');
        return;
    }
    
    if (x >= 0 && x < currentDungeon.map[0].length && y >= 0 && y < currentDungeon.map.length) {
        playerPos.x = x;
        playerPos.y = y;
        consoleLog(`🔧 Teletransportado a (${x}, ${y})`);
        updateVisualDungeonDisplay();
        updateDungeonDisplay();
    } else {
        consoleLog('🔧 Coordenadas fuera de los límites del mapa');
    }
}

function toggleGodMode() {
    coffee = 999999;
    totalCoffee = 999999;
    cps = 9999;
    charisma = 999;
    coffeeStrength = 999;
    consoleLog('🔧 MODO DIOS ACTIVADO - Recursos al máximo');
    updateDisplay();
    saveGame();
}

function logDevCommand(command, target) {
    devCommands.push({
        command: command,
        target: target,
        time: new Date().toLocaleTimeString()
    });
}

// ========================================
// FIN DEL SISTEMA DE DESARROLLO
// ========================================

// Iniciar el juego
// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners(); // Configurar event listeners primero
    initAudio();
<<<<<<< HEAD
=======
    loadGame();
>>>>>>> 7d4ce85 (Superpowers (#8))
    // Mostrar ASCII art en la consola del juego
    const asciiArt = `
   _____                .__          __       /\\        _________         _____  _____                __      __            .__       .___
  /  _  \\   ____   ____ |  |   _____/  |_  ___)/ ______ \\_   ___ \\  _____/ ____\\/ ____\\____   ____   /  \\    /  \\___________|  |    __| _/
 /  /_\\  \\ /    \\_/ ___\\|  | _/ __ \\   __\\/  _ \\/  ___/ /    \\  \\/ /  _ \\   __\\\\   __\\/ __ \\_/ __ \\  \\   \\/\\/   /  _ \\_  __ \\  |   / __ | 
/    |    \\   |  \\  \\___|  |_\\  ___/|  | (  <_> )___ \\  \\     \\___(  <_> )  |   |  | \\  ___/\\  ___/   \\        (  <_> )  | \\/  |__/ /_/ | 
\\____|__  /___|  /\\___  >____/\\___  >__|  \\____/____  >  \\______  /\\____/|__|   |__|  \\___  >\\___  >   \\__/\\  / \\____/|__|  |____/\\____ | 
        \\/     \\/     \\/          \\/                \\/          \\/                        \\/     \\/         \\/                         \\/ 
`;
    const asciiLines = asciiArt.trim().split('\n');
    asciiLines.forEach(line => {
        const p = document.createElement('p');
        p.textContent = line;
        p.style.fontFamily = 'monospace';
        p.style.fontSize = '12px';
        p.style.lineHeight = '1';
        p.style.margin = '2px 0';
        consoleOutput.appendChild(p);
    });
    consoleLog('Bienvenido a Ancleto\'s Coffee World. Escribe "help" para comandos.');
<<<<<<< HEAD
    checkThursdayEasterEgg(() => {
        loadGame();
        startGameLoop();
    });
=======
    setInterval(produceCoffee, 1000); // Producir cada segundo
>>>>>>> 7d4ce85 (Superpowers (#8))
});