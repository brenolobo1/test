/* ==========================================================================
   PC Booster — dados MOCKADOS
   Nada aqui é lido do sistema. Números de requisito seguem o formato de tiers
   do PCGamingWiki (minimum / recommended / alt) apenas para dar veracidade
   aos 3 níveis de gravidade do alerta.
   ========================================================================== */

const HARDWARE = {
  cpu: { label: 'CPU', value: 'Intel Core i5-13420H', meta: '8C / 12T · 4.6 GHz' },
  gpu: { label: 'GPU', value: 'NVIDIA GeForce RTX 5060 Laptop', meta: '8 GB GDDR7 · driver 581.42' },
  ram: { label: 'Memória', value: '8 GB DDR5', meta: '1×8 GB · single channel · 4800 MHz' }
};

/* Otimização de nível SISTEMA — vale para a máquina inteira, não para um jogo específico.
   Escopo distinto da otimização por jogo (camadas de engine + driver GPU por jogo). */
const SYSTEM_LAYERS = [
  {
    name: 'Tier de otimização do sistema',
    desc: 'Prioridade de processo elevada para o jogo em primeiro plano'
  },
  {
    name: 'Perfil de driver GPU — global',
    desc: 'Perfil aplicado à máquina inteira, fora do escopo de um jogo específico'
  }
];

/* Status possíveis:
   ok      → roda bem
   tune    → otimização recomendada
   below   → abaixo do recomendado
   Gravidade do alerta: 'leve' | 'moderado' | 'severo' | null  */

const GAMES = [
  {
    id: 'tarkov',
    name: 'Escape from Tarkov',
    engine: 'Unity',
    engineLayer: true,
    installPath: 'C:\\Battlestate Games\\EFT',
    status: 'below',
    severity: 'severo',
    running: false,
    bottlenecks: ['ram'],
    requirements: [
      { part: 'CPU',     min: 'Intel Core i5-6600K', rec: 'Intel Core i7-9700K', you: 'Intel Core i5-13420H', verdict: 'pass' },
      { part: 'GPU',     min: 'GTX 1060 6 GB',       rec: 'RTX 2070',            you: 'RTX 5060 Laptop 8 GB', verdict: 'pass' },
      { part: 'Memória', min: '12 GB',               rec: '32 GB',               you: '8 GB',                 verdict: 'fail' }
    ],
    adjustments: null   // conteúdo real ainda não mapeado
  },
  {
    id: 'thefinals',
    name: 'THE FINALS',
    engine: 'Unreal Engine 5',
    engineLayer: true,
    installPath: 'C:\\Program Files\\Steam\\steamapps\\common\\THE FINALS',
    status: 'below',
    severity: 'moderado',
    running: true,
    bottlenecks: ['ram'],
    requirements: [
      { part: 'CPU',     min: 'Intel Core i5-6600K', rec: 'Intel Core i5-11600K', you: 'Intel Core i5-13420H', verdict: 'pass' },
      { part: 'GPU',     min: 'GTX 1050 Ti',         rec: 'RTX 2070',             you: 'RTX 5060 Laptop 8 GB', verdict: 'pass' },
      { part: 'Memória', min: '8 GB',                rec: '16 GB',                you: '8 GB',                 verdict: 'warn' }
    ],
    /* ÚNICO conjunto de ajustes com conteúdo real (medido no build de teste) */
    adjustments: [
      { name: 'View Distance',   value: 'Low',    kind: 'down' },
      { name: 'Anti-Aliasing',   value: 'Low',    kind: 'down' },
      { name: 'Shadows',         value: 'Low',    kind: 'down' },
      { name: 'Post-Processing', value: 'Low',    kind: 'down' },
      { name: 'Effects',         value: 'Low',    kind: 'down' },
      { name: 'Foliage',         value: 'Low',    kind: 'down' },
      { name: 'Texture',         value: 'Medium', kind: 'down' },
      { name: 'Reflections',     value: 'High',   kind: 'keep' }
    ],
    gpuMetric: { label: 'GPU Clock', from: '210 MHz', to: '2805 MHz' }
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    engine: 'Unreal Engine 5',
    engineLayer: true,
    installPath: 'C:\\Program Files\\Epic Games\\Fortnite',
    status: 'tune',
    severity: 'leve',
    running: false,
    bottlenecks: ['ram'],
    requirements: [
      { part: 'CPU',     min: 'Intel Core i3-8100',  rec: 'Intel Core i5-7300U', you: 'Intel Core i5-13420H', verdict: 'pass' },
      { part: 'GPU',     min: 'Intel UHD 630',       rec: 'GTX 960 4 GB',        you: 'RTX 5060 Laptop 8 GB', verdict: 'pass' },
      { part: 'Memória', min: '8 GB',                rec: '16 GB',               you: '8 GB',                 verdict: 'warn' }
    ],
    adjustments: null
  },
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    engine: 'Source 2',
    engineLayer: false,          // engine sem camada de config global mapeada
    installPath: 'C:\\Program Files\\Steam\\steamapps\\common\\Counter-Strike Global Offensive',
    status: 'ok',
    severity: null,
    running: false,
    bottlenecks: [],
    requirements: [
      { part: 'CPU',     min: 'Intel Core i5-750',   rec: 'Intel Core i5-9400',  you: 'Intel Core i5-13420H', verdict: 'pass' },
      { part: 'GPU',     min: 'GTX 660',             rec: 'GTX 1060 6 GB',       you: 'RTX 5060 Laptop 8 GB', verdict: 'pass' },
      { part: 'Memória', min: '8 GB',                rec: '8 GB',                you: '8 GB',                 verdict: 'pass' }
    ],
    adjustments: null
  }
];

/* Rótulos de status da lista */
const STATUS = {
  ok:    { label: 'Roda bem',                 cls: 'badge--ok' },
  tune:  { label: 'Otimização recomendada',   cls: 'badge--warn' },
  below: { label: 'Abaixo do recomendado',    cls: 'badge--danger' }
};

/* Gravidade do alerta — copy ainda não definida, títulos/descrições são placeholder */
const SEVERITY = {
  leve: {
    label: 'Gravidade leve',
    title: 'Título do alerta — nível leve',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Texto explicando o gap de hardware neste nível.'
  },
  moderado: {
    label: 'Gravidade moderada',
    title: 'Título do alerta — nível moderado',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Texto explicando o gap de hardware neste nível.'
  },
  severo: {
    label: 'Gravidade severa',
    title: 'Título do alerta — nível severo',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore. Texto explicando o gap de hardware neste nível.'
  }
};

/* Ajustes placeholder — usados quando o conteúdo real do jogo ainda não foi mapeado */
const PLACEHOLDER_ADJUSTMENTS = [
  { name: 'Atributo 01', value: '—', kind: 'ph' },
  { name: 'Atributo 02', value: '—', kind: 'ph' },
  { name: 'Atributo 03', value: '—', kind: 'ph' },
  { name: 'Atributo 04', value: '—', kind: 'ph' },
  { name: 'Atributo 05', value: '—', kind: 'ph' }
];
