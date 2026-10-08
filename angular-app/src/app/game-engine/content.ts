// Contenido y constantes de Coffee World.
// Fuente única de verdad de datos: actos, bosses, dungeons, diálogos y eventos.

export interface Upgrade {
  name: string;
  owned: number;
  cost: number;
  cpsIncrease?: number;
  charismaIncrease?: number;
  coffeeStrengthIncrease?: number;
}

export interface Boss {
  name: string;
  health: number;
  maxHealth: number;
  reward: number;
  spawnAt: number;
  dungeon: string;
  act: number;
}

export interface ActDef {
  act: number;
  name: string;
  start: number;
  end: number;
  bossName: string;
}

export interface DungeonMonster {
  name: string;
  health: number;
  reward: number;
}

export interface DungeonDef {
  key: string;
  displayName: string;
  bossName: string;
  story: string;
  map: string[][];
  monsters: Record<string, DungeonMonster>;
  boss: { x: number; y: number };
  exit: { x: number; y: number };
  start: { x: number; y: number };
}

export interface Dialogue {
  act: number;
  title: string;
  message: string;
  narrator: string;
  threshold: number; // café total absoluto para mostrarlo
}

// ── Actos ─────────────────────────────────────────────────────────────
// La progresión de acto está bloqueada por bosses: el acto actual es
// (bosses derrotados + 1). Los cortes de café definen el rango del acto
// usado por el progreso relativo y la disponibilidad del boss.
export const ACTS: ActDef[] = [
  { act: 1, name: 'Fundación de la Cultura Cafetera', start: 0, end: 4000, bossName: 'Damián Rebelde' },
  { act: 2, name: 'Crisis', start: 4000, end: 8500, bossName: 'Crisis de Arganaraz' },
  { act: 3, name: 'Confrontación', start: 8500, end: 17500, bossName: 'Minion de Lucía' },
  { act: 4, name: 'Ascenso', start: 17500, end: 27500, bossName: 'Sonrisa Inquebrantable' },
  { act: 5, name: 'Viajes', start: 27500, end: 47500, bossName: 'Niebla Azul' },
  { act: 6, name: 'Maestría', start: 47500, end: 100000, bossName: 'Lucía Final' }
];

export function actByNumber(act: number): ActDef {
  return ACTS.find(a => a.act === act) ?? ACTS[0];
}

// ── Upgrades ──────────────────────────────────────────────────────────
export const INITIAL_UPGRADES: Record<string, Upgrade> = {
  upgrade1: { name: 'Máquina Verde', owned: 0, cost: 10, cpsIncrease: 1, charismaIncrease: 1 },
  upgrade2: { name: 'Charlas Motivacionales', owned: 0, cost: 100, cpsIncrease: 5, charismaIncrease: 2 },
  upgrade3: { name: 'Tamper de Acero', owned: 0, cost: 500, cpsIncrease: 20, coffeeStrengthIncrease: 5 },
  upgrade4: { name: 'Café Colombiano', owned: 0, cost: 200, charismaIncrease: 2 },
  upgrade5: { name: 'Perros Guardianes', owned: 0, cost: 1000, coffeeStrengthIncrease: 10 },
  upgrade6: { name: 'Lista de Vergüenza', owned: 0, cost: 5000, cpsIncrease: 50 },
  upgrade7: { name: 'Viernes de Cupping', owned: 0, cost: 10000, cpsIncrease: 100 },
  upgrade8: { name: 'Sifón Japonés', owned: 0, cost: 20000, charismaIncrease: 5 },
  upgrade9: { name: 'Filtros SQL', owned: 0, cost: 50000, coffeeStrengthIncrease: 20 },
  upgrade10: { name: 'Comunicaciones Corporativas', owned: 0, cost: 100000, cpsIncrease: 200 }
};

export const UPGRADE_ALIASES: Record<string, string> = {
  machine: 'upgrade1', 'máquina verde': 'upgrade1', 'maquina verde': 'upgrade1',
  charlas: 'upgrade2', 'charlas motivacionales': 'upgrade2',
  tamper: 'upgrade3', 'tamper de acero': 'upgrade3',
  colombiano: 'upgrade4', 'café colombiano': 'upgrade4', 'cafe colombiano': 'upgrade4',
  guardianes: 'upgrade5', 'perros guardianes': 'upgrade5',
  vergüenza: 'upgrade6', 'verguenza': 'upgrade6', 'lista de vergüenza': 'upgrade6',
  cupping: 'upgrade7', 'viernes de cupping': 'upgrade7',
  sifón: 'upgrade8', 'sifon': 'upgrade8', 'sifón japonés': 'upgrade8',
  filtros: 'upgrade9', 'filtros sql': 'upgrade9',
  corporativos: 'upgrade10', 'comunicaciones corporativas': 'upgrade10'
};

// ── Bosses ────────────────────────────────────────────────────────────
export const INITIAL_BOSSES: Boss[] = [
  { name: 'Damián Rebelde', health: 200, maxHealth: 200, reward: 100, spawnAt: 750, dungeon: 'salaReuniones', act: 1 },
  { name: 'Crisis de Arganaraz', health: 400, maxHealth: 400, reward: 200, spawnAt: 4000, dungeon: 'cafeteriaOscura', act: 2 },
  { name: 'Minion de Lucía', health: 600, maxHealth: 600, reward: 400, spawnAt: 8500, dungeon: 'casaDamian', act: 3 },
  { name: 'Sonrisa Inquebrantable', health: 1000, maxHealth: 1000, reward: 800, spawnAt: 17500, dungeon: 'bodegaSecreta', act: 4 },
  { name: 'Niebla Azul', health: 1500, maxHealth: 1500, reward: 1200, spawnAt: 27500, dungeon: 'posadaPerros', act: 5 },
  { name: 'Lucía Final', health: 3000, maxHealth: 3000, reward: 2000, spawnAt: 47500, dungeon: 'oficinaCentral', act: 6 }
];

// ── Dungeons ──────────────────────────────────────────────────────────
function cloneMap(map: string[][]): string[][] {
  return map.map(row => [...row]);
}

const DUNGEON_SOURCES: DungeonDef[] = [
  {
    key: 'salaReuniones',
    displayName: 'Sala de Reuniones',
    bossName: 'Damián Rebelde',
    story: 'La sala donde todo comenzó. Damián se rebela contra las donaciones y la cultura cafetera.',
    map: [
      ['#', '#', '#', '#', '#'],
      ['#', '.', 'B', '.', '#'],
      ['#', 'M', 'P', 'E', '#'],
      ['#', '#', '#', '#', '#']
    ],
    monsters: { M: { name: 'Actitud Tóxica', health: 100, reward: 20 } },
    boss: { x: 2, y: 1 },
    exit: { x: 3, y: 2 },
    start: { x: 2, y: 2 }
  },
  {
    key: 'cafeteriaOscura',
    displayName: 'Cafetería Oscura',
    bossName: 'Crisis de Arganaraz',
    story: 'La cafetería donde Arganaraz tuvo su crisis existencial y envió su dramática renuncia operística.',
    map: [
      ['#', '#', '#', '#', '#', '#'],
      ['#', '.', 'M', '.', 'B', '#'],
      ['#', '.', '.', '.', '#', '#'],
      ['#', 'M', 'P', '.', 'E', '#'],
      ['#', '#', '#', '#', '#', '#']
    ],
    monsters: { M: { name: 'Delirio Administrativo', health: 200, reward: 40 } },
    boss: { x: 4, y: 1 },
    exit: { x: 4, y: 3 },
    start: { x: 2, y: 3 }
  },
  {
    key: 'casaDamian',
    displayName: 'Casa de Damián',
    bossName: 'Minion de Lucía',
    story: 'La casa de Damián en Posadas, custodiada por 19 perros guardianes. Lucía estableció su primera base.',
    map: [
      ['#', '#', '#', '#', '#', '#', '#'],
      ['#', '.', 'M', '.', 'M', '.', '#'],
      ['#', '.', '.', '.', '.', 'B', '#'],
      ['#', 'M', 'P', '.', 'M', '.', '#'],
      ['#', '.', '.', '.', '.', 'E', '#'],
      ['#', '#', '#', '#', '#', '#', '#']
    ],
    monsters: { M: { name: 'Perro Hipnotizado', health: 300, reward: 60 } },
    boss: { x: 5, y: 2 },
    exit: { x: 5, y: 4 },
    start: { x: 2, y: 3 }
  },
  {
    key: 'bodegaSecreta',
    displayName: 'Bodega Secreta',
    bossName: 'Sonrisa Inquebrantable',
    story: 'En las profundidades donde Ancleto se escondió, la sonrisa de Lucía persiste entre las sombras.',
    map: [
      ['#', '#', '#', '#', '#', '#', '#'],
      ['#', '.', 'M', '.', 'M', '.', '#'],
      ['#', '.', '.', '.', '.', 'B', '#'],
      ['#', 'M', 'P', '.', 'M', '.', '#'],
      ['#', '.', '.', '.', '.', 'E', '#'],
      ['#', '#', '#', '#', '#', '#', '#']
    ],
    monsters: { M: { name: 'Recuerdo Doloroso', health: 400, reward: 80 } },
    boss: { x: 5, y: 2 },
    exit: { x: 5, y: 4 },
    start: { x: 2, y: 3 }
  },
  {
    key: 'posadaPerros',
    displayName: 'Posada de los Perros',
    bossName: 'Niebla Azul',
    story: 'Las afueras de Posadas donde la misteriosa niebla azul se alza sobre los posos de café.',
    map: [
      ['#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '.', 'M', '.', '.', 'M', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '#'],
      ['#', 'M', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', 'B', '.', '.', '#'],
      ['#', 'M', '.', 'P', '.', 'M', 'E', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#']
    ],
    monsters: { M: { name: 'Niebla Tóxica', health: 500, reward: 100 } },
    boss: { x: 4, y: 4 },
    exit: { x: 6, y: 5 },
    start: { x: 3, y: 5 }
  },
  {
    key: 'oficinaCentral',
    displayName: 'Oficina Central',
    bossName: 'Lucía Final',
    story: 'La oficina central, último bastión donde Lucía hace su resistencia final antes de ser neutralizada.',
    map: [
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '.', 'M', '.', '.', 'M', '.', 'M', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', 'M', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', 'B', '.', '.', '#'],
      ['#', 'M', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', 'P', '.', 'M', 'E', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#']
    ],
    monsters: { M: { name: 'Sonrisa Hipnótica', health: 600, reward: 120 } },
    boss: { x: 5, y: 4 },
    exit: { x: 7, y: 6 },
    start: { x: 4, y: 6 }
  }
];

export function createDungeons(): Record<string, DungeonDef> {
  const result: Record<string, DungeonDef> = {};
  for (const d of DUNGEON_SOURCES) {
    result[d.key] = { ...d, map: cloneMap(d.map), monsters: { ...d.monsters } };
  }
  return result;
}

export function cloneDungeonMap(map: string[][]): string[][] {
  return cloneMap(map);
}

export const DUNGEON_ALIASES: Record<string, string> = {
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

// ── Diálogos ──────────────────────────────────────────────────────────
// `threshold` es café total absoluto (no relativo) para eliminar la
// ambigüedad entre tablas de actos.
export const DIALOGUES: Dialogue[] = [
  { act: 1, threshold: 0, title: 'El Inicio del Imperio Cafetero', narrator: 'Ancleto', message: 'Soy Ancleto, el mejor CEO del mundo. Confía en mí: el café no es solo un break, sino un ritual diario. Comencemos recolectando granos automáticamente.' },
  { act: 1, threshold: 50, title: 'La Cultura del Café', narrator: 'Ancleto', message: 'En esta empresa, el café no es solo una infusión. Es un ritual, el momento en que las ideas se cruzan y los proyectos se gestan.' },
  { act: 1, threshold: 100, title: 'Solicitud de Colaboración Financiera', narrator: 'Ancleto', message: 'Estimado equipo, necesitamos invertir en cafeteras nuevas. Como el mejor CEO del mundo, sé exactamente cómo invertir cada peso.' },
  { act: 1, threshold: 200, title: 'Recordatorio de Donaciones', narrator: 'Ancleto', message: 'He notado que algunos aún no han concretado su donación. Tu participación es fundamental para un espacio más ameno.' },
  { act: 1, threshold: 400, title: 'Respuesta Desafiante', narrator: 'Ancleto', message: "Damián respondió 'yo hago lo que quiero'. Una actitud preocupante que requiere reflexión y, posiblemente, más café." },
  { act: 1, threshold: 600, title: 'Guerra al Diccionario', narrator: 'Ancleto', message: "Su nueva respuesta fue 'yo havlo como quiero'. Ahora declara la guerra a la colaboración y a la gramática básica." },
  { act: 1, threshold: 750, title: 'Llamado a la Responsabilidad', narrator: 'Ancleto', message: 'He decidido crear la Lista de la Vergüenza. No como castigo, sino como recordatorio de que todos remamos juntos.' },
  { act: 1, threshold: 1000, title: 'Cruzada Global por la Excelencia', narrator: 'Ancleto', message: 'He recorrido el mundo buscando la cafetera perfecta. En Estambul negocié con comerciantes, en Kioto probé sifones alquímicos.' },
  { act: 1, threshold: 2000, title: 'Boss del Acto 1: Damián Rebelde', narrator: 'Sistema', message: '¡Hemos completado el Acto 1! Enfrenta a Damián Rebelde en la Sala de Reuniones para desbloquear el Acto 2.' },

  { act: 2, threshold: 4000, title: 'Renuncia Operística', narrator: 'Ancleto', message: 'Recibí una renuncia de Arganaraz: quiere desvincularse pero seguir cobrando. Una ópera barroca de emociones.' },
  { act: 2, threshold: 4200, title: 'Tómate un Café y Respirá', narrator: 'Ancleto', message: "Le sugerí a Arganaraz: 'Tómate un café, preparalo bien, sentate tranquilo y respirá.'" },
  { act: 2, threshold: 4500, title: 'Delirio Administrativo Reconocido', narrator: 'Arganaraz', message: "Arganaraz respondió: 'Me dejé llevar por el drama y una pizca de delirio administrativo.'" },
  { act: 2, threshold: 4800, title: 'Café Colombiano de Altura', narrator: 'Ancleto', message: 'Mañana a las 10h espero a Arganaraz con café colombiano de altura y churros de Buenos Aires.' },
  { act: 2, threshold: 5200, title: 'El 200% de Generosidad', narrator: 'Ancleto', message: '¡Matías aportó el 200% del monto requerido! Su gesto merece reconocimiento: es nuestro nuevo CEO honorario.' },
  { act: 2, threshold: 5600, title: 'Ascenso de Matías', narrator: 'Ancleto', message: 'Matías ostenta el título de CEO Supremo del Café, con veto sobre café instantáneo.' },
  { act: 2, threshold: 6200, title: 'Historia del Café como Civilización', narrator: 'Ancleto', message: "Preparé una charla TED: 'Más que cafeína: el café como motor de civilización'. Todo comenzó con Kaldi y sus cabras." },
  { act: 2, threshold: 6800, title: 'Rituales Sufíes del Siglo XV', narrator: 'Ancleto', message: 'En Yemen, los sufíes usaban café para vigilia. El café como activo social.' },
  { act: 2, threshold: 7200, title: 'Escuelas de Sabios', narrator: 'Ancleto', message: "Siglo XVI: nacen las cafeterías en Constantinopla, centros de debate y poesía." },
  { act: 2, threshold: 7800, title: 'Integración Uruguaya', narrator: 'Ancleto', message: 'Ofrecí a Damián un equipo uruguayo de Salesforce: arquitectos, consultores y desarrolladores.' },
  { act: 2, threshold: 8200, title: 'Orden Tácita de Alejamiento', narrator: 'Arganaraz', message: "Arganaraz rechazó Salesforce: 'Me mudé a Posadas con 19 perros guardianes.'" },
  { act: 2, threshold: 8400, title: 'La Infiltración Silenciosa', narrator: 'Ancleto', message: 'Debo confesar algo terrible: Lucía lleva un año hospedándose en casa de Damián.' },

  { act: 3, threshold: 8500, title: 'Sonrisa Inquebrantable', narrator: 'Ancleto', message: 'Lucía no solo vive en casa de Damián: su sonrisa inquebrantable se ha instalado en hogares de todos los empleados.' },
  { act: 3, threshold: 10000, title: 'También Estoy Asustado', narrator: 'Ancleto', message: 'Debo confesarte algo: también estoy asustado. Lucía posa con su sonrisa indestructible.' },
  { act: 3, threshold: 12000, title: 'Pedido de Auxilio Cafetero', narrator: 'Ancleto', message: 'Prepárate un espresso triple, necesitamos fuerza. Tu experiencia con perros guardianes es nuestra esperanza.' },
  { act: 3, threshold: 14000, title: 'Lealtad en el Universo Cafetero', narrator: 'Arganaraz', message: "Arganaraz respondió: 'No voy a soltarte la mano. Nos queda la lealtad entre quienes distinguimos un ristretto de una sonrisa falsa.'" },
  { act: 3, threshold: 16000, title: 'Resistencia con Blend Propio', narrator: 'Arganaraz', message: "'Vamos a resistir con blend propio, temple y convicción.'" },

  { act: 4, threshold: 17500, title: 'El 900% de Aportes', narrator: 'Ancleto', message: 'Buenos días Damián: tu generosísima transferencia del 900% llegó con retraso por coordinación bancaria.' },
  { act: 4, threshold: 19000, title: 'Ascenso de Damián', narrator: 'Ancleto', message: 'Serás Vicepresidente Junior de Cultura Cafetera. Validarás el primer espresso y supervisarás la Lista de Vergüenza.' },
  { act: 4, threshold: 21000, title: 'Aclaración de Identidad', narrator: 'Ancleto', message: "Soy 100% real, no fake. Mi nombre es Ancleto con 'n', legalmente distinto de cualquier Anacleto." },
  { act: 4, threshold: 24000, title: 'La Pérdida de Todo', narrator: 'Ancleto', message: 'Lucía hizo desaparecer a mi esposa, mis hijos... incluso mi hámster con ojitos de espuma.' },
  { act: 4, threshold: 26000, title: 'Cuídate, No Te Queda Mucho', narrator: 'Ancleto', message: 'Te lo digo con el corazón en la mano: cuídate. Ella avanza sin prisa con esa sonrisa inquebrantable.' },

  { act: 5, threshold: 27500, title: 'Respuesta Automática', narrator: 'Sistema', message: 'Ancleto no está disponible. Se encuentra en misión crítica: contener la infiltración de Lucía.' },
  { act: 5, threshold: 31000, title: 'Mensaje desde las Sombras', narrator: 'Ancleto', message: 'Me escondo en la bodega, aferrado a mi taza rota. Pero sepan que Ancleto está vivo.' },
  { act: 5, threshold: 36000, title: 'Volveré con Ristretto Doble', narrator: 'Ancleto', message: 'Volveré para vengar cada grano robado y honrar la memoria de mi hámster.' },
  { act: 5, threshold: 42000, title: 'Fondos para la Victoria', narrator: 'Ancleto', message: 'Con el 900% de Damián, reforzamos defensas: tamper de acero, café colombiano y 19 perros entrenados.' },

  { act: 6, threshold: 47500, title: 'Lucía Ha Sido Neutralizada', narrator: 'Ancleto', message: '¡Misión cumplida! La amenaza de Lucía ha quedado hecha añicos. ¡Gracias Damián!' },
  { act: 6, threshold: 55000, title: 'Defensas Baristas Exitosas', narrator: 'Ancleto', message: 'Con tamper de acero y vigilancia perruna, el último bastión de Lucía cayó esta madrugada.' },
  { act: 6, threshold: 62000, title: 'Damián, Héroe Cafeteril', narrator: 'Ancleto', message: 'Damián, tu 900% fue la chispa de nuestra victoria. Disfruta cada sorbo como VP Junior.' },
  { act: 6, threshold: 70000, title: 'Renacimiento de la Cultura', narrator: 'Ancleto', message: 'Los Viernes de Cupping renacieron y la cultura del café está más viva que nunca.' },
  { act: 6, threshold: 80000, title: 'Dónde Están Ahora', narrator: 'Ancleto', message: "Recuperé mi despacho y dicto masterclasses de latte art. El hámster patrulla la Moka Express." },
  { act: 6, threshold: 90000, title: 'Niebla Azul Misteriosa', narrator: 'Ancleto', message: 'En la última molienda, alguien divisó una ligera niebla azul sobre la pila de posos.' },
  { act: 6, threshold: 100000, title: 'El Café es un Viaje Sin Fin', narrator: 'Ancleto', message: 'El café es un viaje sin fin. Y tal vez aquella niebla azul nos susurre que la verdadera aventura apenas comienza...' }
];

// ── Eventos del Feliz Jueves ──────────────────────────────────────────
// Serializables: el efecto se describe con `factor` (multiplicador de CPS)
// o `cooldownFactor`, nunca con funciones.
export interface ThursdayEventDef {
  name: string;
  type: 'curse' | 'blessing';
  duration: number;
  factor?: number;
  cooldownFactor?: number;
  probability: number;
  message: string;
}

export const THURSDAY_EVENTS: ThursdayEventDef[] = [
  { name: 'Reunión Improvisada', type: 'curse', duration: 1800, factor: 0.5, probability: 0.3, message: '⚠️ Reunión improvisada! -50% producción por 30 min' },
  { name: 'Mail del Jefe', type: 'curse', duration: 900, cooldownFactor: 2, probability: 0.25, message: '📧 Mail urgente del jefe! Cooldowns duplicados' },
  { name: 'Café Agotado', type: 'curse', duration: 600, factor: 0.3, probability: 0.2, message: '☕❌ ¡Máquinas rotas! -70% producción por 10 min' },
  { name: 'Hora Feliz', type: 'blessing', duration: 600, factor: 2.0, probability: 0.15, message: '🎉 ¡Hora Feliz! +100% producción por 10 min' },
  { name: 'Home Office', type: 'blessing', duration: 1200, factor: 1.5, probability: 0.1, message: '🏠 ¡Home Office! +50% producción por 20 min' }
];

// ── Constantes de juego ───────────────────────────────────────────────
export const SAVE_VERSION = 2;
export const MAIL_COOLDOWN_MS = 120000;
export const WORK_COOLDOWN_MS = 5000;
export const DONATE_COOLDOWN_MS = 300000;
export const DONATE_DURATION_MS = 60000;
export const FIGHT_COOLDOWN_MONSTER_MS = 1000;
export const FIGHT_COOLDOWN_BOSS_MS = 2000;
export const MONSTER_DAMAGE_FACTOR = 0.3;
export const BOSS_DAMAGE_FACTOR = 0.5;
export const THURSDAY_EVENT_CHECK_INTERVAL = 300;
export const THURSDAY_EVENT_PROBABILITY = 0.4;
export const THURSDAY_POINT_RETENTION_RATIO = 0.3;
export const FRIDAY_DURATION_MS = 7200000;
export const POST_GAME_COMPLETION_FRIDAY_LEVEL = 5;
export const BASE_FRIDAY_POINTS = 1000;
export const DEV_SECRET = 'ancletomejorceodelmundotestcafetero';

export const THURSDAY_POINTS: Record<string, number> = {
  derrotar_boss: 100,
  sobrevivir_evento: 50,
  completar_upgrade: 25,
  mantener_produccion: 10,
  usar_bendicion: -20
};

// ── Logros ────────────────────────────────────────────────────────────
export interface AchievementDef {
  key: string;
  threshold: number;
  stat: 'totalCoffee' | 'cps' | 'charisma' | 'coffeeStrength' | 'defeatedBosses';
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { threshold: 100, key: 'Primeros 100 granos', stat: 'totalCoffee', icon: '🌱' },
  { threshold: 1000, key: 'Café Milenario', stat: 'totalCoffee', icon: '🏆' },
  { threshold: 10000, key: 'Imperio en Crecimiento', stat: 'totalCoffee', icon: '🏢' },
  { threshold: 50000, key: 'Magnate Cafetero', stat: 'totalCoffee', icon: '💰' },
  { threshold: 100000, key: 'Emperador del Café', stat: 'totalCoffee', icon: '👑' },
  { threshold: 10, key: 'Producción decente', stat: 'cps', icon: '⚡' },
  { threshold: 50, key: 'Máquina de café', stat: 'cps', icon: '☕' },
  { threshold: 200, key: 'Fábrica cafetera', stat: 'cps', icon: '🏭' },
  { threshold: 500, key: 'Industria global', stat: 'cps', icon: '🌍' },
  { threshold: 10, key: 'Carismático', stat: 'charisma', icon: '😊' },
  { threshold: 25, key: 'Líder Natural', stat: 'charisma', icon: '👨‍💼' },
  { threshold: 50, key: 'CEO Carismático', stat: 'charisma', icon: '🎩' },
  { threshold: 20, key: 'Fuerte Cafetero', stat: 'coffeeStrength', icon: '💪' },
  { threshold: 50, key: 'Guerrero del Café', stat: 'coffeeStrength', icon: '⚔️' },
  { threshold: 100, key: 'Leyenda de Batalla', stat: 'coffeeStrength', icon: '🛡️' },
  { threshold: 1, key: 'Primer Derrotado', stat: 'defeatedBosses', icon: '🥇' },
  { threshold: 2, key: 'Cazador de Jefes', stat: 'defeatedBosses', icon: '🎯' },
  { threshold: 3, key: 'Maestro Cafetero', stat: 'defeatedBosses', icon: '🏅' }
];
