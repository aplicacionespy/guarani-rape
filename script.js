'use strict';
/* =========================================================
   GUARANI RAPE — lógica del juego
   3 juegos x 10 niveles, con desbloqueo progresivo.
   ========================================================= */

/* ---------- Utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
/* Normaliza una palabra guaraní a letras A-Z (+Ñ): quita acentos, tildes nasales y apóstrofos */
const norm = s => s.toLowerCase().replace(/ñ/g, '\u0001').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z\u0001]/g, '').replace(/\u0001/g, 'ñ').toUpperCase();
const normCross = s => norm(s).replace(/Ñ/g, 'N');
const slug = s => norm(s).toLowerCase();

/* ---------- Datos ---------- */
/* Juego 1: animales. "e" = emoji que hace de imagen (puedes cambiarlo por <img> propias) */
const ANIMALS = [
  { g: 'Jagua', es: 'Perro', e: '🐕' }, { g: 'Mbarakaja', es: 'Gato', e: '🐈' },
  { g: 'Ryguasu', es: 'Gallina', e: '🐔' }, { g: 'Ype', es: 'Pato', e: '🦆' },
  { g: 'Kavaju', es: 'Caballo', e: '🐴' }, { g: 'Ovecha', es: 'Oveja', e: '🐑' },
  { g: 'Kure', es: 'Cerdo / Chancho', e: '🐖' }, { g: 'Vaka', es: 'Vaca', e: '🐄' },
  { g: 'Mberu', es: 'Mosca', e: '🪰' }, { g: 'Ñati’û', es: 'Mosquito', e: '🦟' },
  { g: 'Ambu’a', es: 'Milpiés', e: '🐛' }, { g: 'Anguja', es: 'Ratón / Rata', e: '🐁' },
  { g: 'Kavara', es: 'Cabra / Chivo', e: '🐐' }, { g: 'Mbói', es: 'Serpiente / Culebra', e: '🐍' },
  { g: 'Ambere', es: 'Lagartija', e: '🦎' }, { g: 'Teju', es: 'Lagarto', e: '🐊' },
  { g: 'Kururu', es: 'Sapo', e: '🐸' }, { g: 'Ju’i', es: 'Rana', e: '🐸' },
  { g: 'Kuju', es: 'Lechuza / Mochuelo', e: '🦉' }, { g: 'Tuku', es: 'Langosta / Saltamontes', e: '🦗' },
  { g: 'Ynambu', es: 'Perdiz', e: '🐦' }, { g: 'Guasu', es: 'Venado / Ciervo', e: '🦌' },
  { g: 'Ka’i', es: 'Mono', e: '🐒' }, { g: 'Jaguarete', es: 'Jaguar / Yaguareté', e: '🐆' },
  { g: 'Káva', es: 'Avispa', e: '🐝' }, { g: 'Muâ', es: 'Luciérnaga', e: '✨🪲' },
  { g: 'Yryvu', es: 'Cuervo / Buitre / Gallinazo', e: '🦅' }, { g: 'Ñakyrâ', es: 'Cigarra', e: '🎶🦗' },
  { g: 'Pira', es: 'Pez / Pescado', e: '🐟' }, { g: 'Ñandú', es: 'Ñandú / Avestruz americano', e: '🦃' },
  { g: 'Tahýi', es: 'Hormiga', e: '🐜' }, { g: 'Mbopi', es: 'Murciélago', e: '🦇' },
  { g: 'Jatyta', es: 'Caracol', e: '🐌' }, { g: 'Ky', es: 'Piojo', e: '🔬' },
  { g: 'Tû', es: 'Pique (pulga de la arena)', e: '🪰' }, { g: 'Aguara', es: 'Zorro', e: '🦊' }
];

/* Juego 2: plantas y frutas */
const PLANTS = [
  { g: 'Takuare’ê', es: 'Caña de azúcar' }, { g: 'Mandyju', es: 'Algodón' }, { g: 'Pety', es: 'Tabaco' },
  { g: 'Avati', es: 'Maíz' }, { g: 'Manduvi', es: 'Maní' }, { g: 'Pindo', es: 'Palmera / Pindó' },
  { g: 'Mandi’o', es: 'Mandioca' }, { g: 'Aguape', es: 'Camalote / Jacinto de agua' }, { g: 'Pacholi', es: 'Pachulí' },
  { g: 'Jety', es: 'Batata / Camote' }, { g: 'Mba’ysyvo', es: 'Tártago / Higuerilla' }, { g: 'Andai', es: 'Calabaza / Zapallo' },
  { g: 'Kurapepê', es: 'Zapallito / Calabacín' }, { g: 'Kapi’i', es: 'Pasto / Paja' }, { g: 'Kapi’ipe', es: 'Gramilla / Césped' },
  { g: 'Takuára', es: 'Tacuara / Bambú' }, { g: 'Amambái', es: 'Helecho' }, { g: 'Sevói', es: 'Cebolla' },
  { g: 'Mbokaja', es: 'Coco / Fruto del cocotero' }, { g: 'Merô', es: 'Melón' }, { g: 'Sandia', es: 'Sandía' },
  { g: 'Arasa', es: 'Guayaba' }, { g: 'Limô', es: 'Limón' }, { g: 'Pakova', es: 'Banana / Plátano' },
  { g: 'Avakachi', es: 'Piña / Ananá' }, { g: 'Aratiku', es: 'Chirimoya / Araticú' }, { g: 'Mamone', es: 'Mamón / Papaya' }
];

/* Juego 3: cuerpo humano. "es" = significado corto para la pregunta; "d" = diálogo o situación */
const BODY = [
  { g: 'Tera', es: 'Nombre', d: '—¿Mba’éichapa nde rera? —Che rera Adriana.' },
  { g: 'Tete', es: 'Cuerpo', d: 'Después de correr mucho, Juan dice: «Che rete hasy».' },
  { g: 'Akâ', es: 'Cabeza', d: 'Ana se golpeó con la puerta y dice: «Che akâ hasy».' },
  { g: 'Akârague', es: 'Cabello / Pelo', d: 'Su mamá le peina el pelo de la cabeza antes de ir a la escuela.' },
  { g: 'Tova', es: 'Cara / Rostro', d: 'Se lavó la cara con agua fría para despertarse: «Che rova».' },
  { g: 'Syva', es: 'Frente', d: 'Tenía fiebre, y su abuela le puso un paño húmedo en la frente.' },
  { g: 'Tî', es: 'Nariz', d: 'Huele el perfume de las flores con la nariz: «Che tî».' },
  { g: 'Tesa', es: 'Ojo / Ojos', d: 'Mariana se frota los ojos porque tiene sueño: «Che resa».' },
  { g: 'Topepi', es: 'Párpado', d: 'Cierra y abre el párpado para parpadear.' },
  { g: 'Topea', es: 'Pestaña', d: 'Las pestañas protegen al ojo del polvo.' },
  { g: 'Tembe', es: 'Labio', d: 'Se pintó los labios de rojo para la fiesta: «Che rembe».' },
  { g: 'Tâi', es: 'Diente', d: 'Pedro va al dentista y dice: «Che tâi hasy».' },
  { g: 'Nambi', es: 'Oreja', d: 'Lucía se puso aros en las orejas: «Che nambi».' },
  { g: 'Apysa', es: 'Oído', d: 'Escucha música con auriculares; su oído está atento a cada sonido.' },
  { g: 'Ajúra', es: 'Cuello', d: 'Hace frío y se pone una bufanda alrededor del cuello.' },
  { g: 'Ahy’u', es: 'Garganta', d: 'Toma té con miel porque le duele la garganta: «Che ahy’u hasy».' },
  { g: 'Tenypy’â', es: 'Rodilla', d: 'Se cayó de la bicicleta y se raspó la rodilla.' },
  { g: 'Py', es: 'Pie', d: 'Después de caminar todo el día: «Che py hasy».' },
  { g: 'Ati’y', es: 'Hombro', d: 'Carga la mochila pesada sobre el hombro.' },
  { g: 'Tañykâ', es: 'Mandíbula / Quijada', d: 'Mastica un pan duro con fuerza usando la mandíbula.' },
  { g: 'Atúa', es: 'Nuca', d: 'El peluquero le corta el pelo de la nuca con la máquina.' },
  { g: 'Ape', es: 'Espalda', d: 'Duerme boca arriba, con la espalda sobre la cama.' },
  { g: 'Jyva', es: 'Brazo', d: 'Levanta el brazo para saludar: «Che jyva».' }
];

/* ---------- Configuración de los 10 niveles de cada juego ---------- */
const GAMES = {
  quiz:   { name: 'Jaguarete sabio', short: 'Selección múltiple' },
  cross:  { name: 'Enigma guaraní',  short: 'Crucigrama' },
  search: { name: 'Sopa de letras',  short: 'Sopa de letras' }
};
const QUIZ_CFG = {
  n:     [5, 6, 6, 7, 8, 8, 9, 10, 10, 12],
  opts:  [3, 3, 3, 4, 4, 4, 4, 5, 5, 5],
  pool:  [12, 14, 16, 18, 20, 22, 26, 30, 34, 34],
  time:  [0, 0, 0, 0, 0, 0, 0, 20, 15, 12],
  types: [['img'], ['img'], ['img', 'es2gn'], ['img', 'es2gn'], ['img', 'es2gn', 'gn2es'], ['img', 'es2gn', 'gn2es'],
          ['es2gn', 'gn2es', 'img'], ['es2gn', 'gn2es'], ['es2gn', 'gn2es'], ['es2gn', 'gn2es']]
};
const SEARCH_CFG = {
  size:  [6, 7, 7, 8, 9, 9, 10, 10, 11, 12],
  count: [3, 4, 5, 5, 6, 6, 7, 7, 8, 8],
  tier:  [1, 1, 2, 2, 3, 3, 3, 4, 4, 4]
};
const CROSS_CFG = {
  pool:  [6, 8, 9, 11, 13, 15, 17, 19, 21, 23],
  count: [3, 4, 4, 5, 5, 6, 7, 8, 9, 10]
};

/* ---------- Progreso guardado ---------- */
const SAVE_KEY = 'guaranirape.v1';
const defaultSave = () => ({
  unlocked: { quiz: 1, cross: 1, search: 1 },
  stars: { quiz: {}, cross: {}, search: {} },
  sound: true
});
let save = (() => {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && s.unlocked && s.stars) return Object.assign(defaultSave(), s);
  } catch (e) { /* sin almacenamiento */ }
  return defaultSave();
})();
const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* ignorar */ } };

/* ---------- Sonido ---------- */
let actx = null;
function audioCtx() {
  if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } }
  if (actx && actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(freq, start, dur, type = 'sine', vol = 0.18) {
  const c = audioCtx(); if (!c || !save.sound) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  const t = c.currentTime + start;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + dur + 0.05);
}
const SFX = {
  ok()    { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.25, 'triangle')); },
  bad()   { tone(220, 0, 0.18, 'sawtooth', 0.12); tone(165, 0.15, 0.32, 'sawtooth', 0.12); },
  click() { tone(660, 0, 0.06, 'square', 0.05); },
  win()   { [523, 659, 784, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle')); },
  lose()  { [392, 330, 262].forEach((f, i) => tone(f, i * 0.18, 0.3, 'triangle')); }
};

/* ---------- Pronunciación (solo para el audio; NO cambia lo que ve el jugador) ----------
   La voz del navegador es española, así que se le da una "escritura fonética":
   j→y, v→b, y→u (la «y» guaraní es una vocal), ’→guion, vocal nasal (â, û…)→vocal+m, acento al final.
   Para corregir una palabra, agrégala o edítala aquí. */
const PRONUNCIATION = {
  'Jagua': 'Yaguá', 'Mbarakaja': 'Mbarakay', 'Ryguasu': 'Ru-guasú', 'Ype': 'U-pé', 'Kavaju': 'Kabayú',
  'Ovecha': 'Obechá', 'Kure': 'Kuré', 'Vaka': 'Baká', 'Mberu': 'Mberú', 'Ñati’û': 'Ñati-úm',
  'Ambu’a': 'Ambu-á', 'Anguja': 'Anguyá', 'Kavara': 'Kabará', 'Mbói': 'Mbo-í', 'Ambere': 'Amberé',
  'Teju': 'Teyú', 'Kururu': 'Kururú', 'Ju’i': 'Yu-í', 'Kuju': 'Kuyú', 'Tuku': 'Tukú',
  'Ynambu': 'unambú', 'Guasu': 'Guasú', 'Ka’i': 'Ka-í', 'Jaguarete': 'Yaguareté', 'Káva': 'Kába',
  'Muâ': 'Mu-ám', 'Yryvu': 'U-ru-bú', 'Ñakyrâ': 'Ñaku-rám', 'Pira': 'Pirá', 'Ñandú': 'Ñandú',
  'Tahýi': 'Ta-hu-í', 'Mbopi': 'Mbopí', 'Jatyta': 'Yatutá', 'Tû': 'Tún', 'Aguara': 'Aguará',
  'Ky': 'Kú-i'   /* ← revisar: no estaba en tu lista */
};
const NASAL = { 'â': 'ám', 'ê': 'ém', 'î': 'ím', 'ô': 'óm', 'û': 'úm', 'Â': 'ám', 'Ê': 'ém', 'Î': 'ím', 'Ô': 'óm', 'Û': 'úm' };
function autoPron(g) {
  let s = g.toLowerCase().replace(/[’']/g, '-');
  s = s.replace(/j/g, '\u0002').replace(/y/g, 'u').replace(/ý/g, 'ú').replace(/\u0002/g, 'y').replace(/v/g, 'b');
  s = s.replace(/[âêîôû]/g, c => NASAL[c]);
  if (!/[áéíóú]/.test(s)) s = s.replace(/([aeiou])([^aeiou]*)$/, (m, v, rest) => ({ a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' })[v] + rest);
  return s;
}
const pronOf = g => PRONUNCIATION[g] || autoPron(g);

/* Pronunciación: si existe audio/<palabra>.mp3 (grabación real) lo usa; si no, la voz del navegador con la escritura fonética */
function speak(g) {
  if (!save.sound) return;
  let fell = false;
  const fallback = () => {
    if (fell) return; fell = true;
    if (!('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(pronOf(g));
      const v = speechSynthesis.getVoices().find(x => /^es/i.test(x.lang)) || null;
      if (v) u.voice = v;
      u.lang = v ? v.lang : 'es-ES'; u.rate = 0.7;
      speechSynthesis.speak(u);
    } catch (e) { /* ignorar */ }
  };
  try {
    const a = new Audio('audio/' + slug(g) + '.mp3');
    a.addEventListener('error', fallback);
    const p = a.play(); if (p && p.catch) p.catch(fallback);
  } catch (e) { fallback(); }
}
if ('speechSynthesis' in window) { try { speechSynthesis.getVoices(); } catch (e) { /* ignorar */ } }

/* ---------- Mascota: Jaguarete ---------- */
function mascot(mood = 'happy') {
  const mouth = {
    happy: '<path d="M89 108 Q100 120 111 108" fill="none" stroke="#7a3a1c" stroke-width="3.2" stroke-linecap="round"/>',
    cheer: '<path d="M88 106 Q100 130 112 106 Z" fill="#c2383d" stroke="#7a3a1c" stroke-width="3" stroke-linejoin="round"/>',
    sad:   '<path d="M90 116 Q100 106 110 116" fill="none" stroke="#7a3a1c" stroke-width="3.2" stroke-linecap="round"/>'
  }[mood] || '';
  return `<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Jaguarete">
    <path d="M140 170 Q190 160 178 118 Q174 104 166 112" fill="none" stroke="#f9a63a" stroke-width="14" stroke-linecap="round"/>
    <path d="M166 112 Q172 104 180 108" fill="none" stroke="#7a4a1c" stroke-width="14" stroke-linecap="round"/>
    <ellipse cx="100" cy="158" rx="46" ry="40" fill="#f9a63a"/>
    <ellipse cx="100" cy="168" rx="26" ry="28" fill="#ffe2a8"/>
    <ellipse cx="72" cy="196" rx="18" ry="9" fill="#f9a63a"/><ellipse cx="128" cy="196" rx="18" ry="9" fill="#f9a63a"/>
    <circle cx="60" cy="195" r="2.2" fill="#7a4a1c"/><circle cx="72" cy="199" r="2.2" fill="#7a4a1c"/><circle cx="116" cy="199" r="2.2" fill="#7a4a1c"/><circle cx="128" cy="195" r="2.2" fill="#7a4a1c"/>
    <circle cx="62" cy="150" r="5" fill="#7a4a1c"/><circle cx="76" cy="168" r="4" fill="#7a4a1c"/><circle cx="138" cy="148" r="5" fill="#7a4a1c"/><circle cx="130" cy="172" r="4" fill="#7a4a1c"/>
    <circle cx="58" cy="44" r="19" fill="#f9a63a"/><circle cx="142" cy="44" r="19" fill="#f9a63a"/>
    <circle cx="58" cy="46" r="10" fill="#f4a4a0"/><circle cx="142" cy="46" r="10" fill="#f4a4a0"/>
    <circle cx="100" cy="82" r="52" fill="#f9a63a"/>
    <ellipse cx="100" cy="102" rx="27" ry="20" fill="#ffe2a8"/>
    <circle cx="86" cy="34" r="4" fill="#7a4a1c"/><circle cx="102" cy="28" r="4.5" fill="#7a4a1c"/><circle cx="118" cy="34" r="4" fill="#7a4a1c"/>
    <circle cx="56" cy="76" r="4.5" fill="#7a4a1c"/><circle cx="148" cy="74" r="4.5" fill="#7a4a1c"/><circle cx="62" cy="96" r="4" fill="#7a4a1c"/><circle cx="142" cy="96" r="4" fill="#7a4a1c"/>
    <ellipse cx="79" cy="78" rx="12" ry="14" fill="#fff"/><ellipse cx="121" cy="78" rx="12" ry="14" fill="#fff"/>
    <circle cx="80" cy="80" r="8" fill="#2b2b4a"/><circle cx="120" cy="80" r="8" fill="#2b2b4a"/>
    <circle cx="83" cy="76" r="3" fill="#fff"/><circle cx="123" cy="76" r="3" fill="#fff"/>
    <path d="M93 94 Q100 90 107 94 Q104 101 100 102 Q96 101 93 94Z" fill="#d94b4b"/>
    ${mouth}
  </svg>`;
}
function renderMascots() { $$('[data-mascot]').forEach(n => { n.innerHTML = mascot(n.dataset.mascot); }); }
function setMascot(node, mood, anim) {
  if (!node) return;
  node.innerHTML = mascot(mood);
  node.classList.remove('cheer', 'sad'); void node.offsetWidth;
  if (anim) node.classList.add(anim);
}

/* ---------- Fondo decorativo ---------- */
function buildBackground() {
  const bg = $('#bg'); const frag = document.createDocumentFragment();
  for (let i = 0; i < 34; i++) {
    const d = document.createElement('span'); const t = i % 3;
    d.className = 'deco ' + (t === 0 ? 'leaf' : t === 1 ? 'clover' : (i % 2 ? 'star' : 'leaf'));
    const s = 14 + rnd(30);
    d.style.left = rnd(98) + '%'; d.style.top = rnd(96) + '%';
    if (d.classList.contains('leaf')) { d.style.width = s + 'px'; d.style.height = s * 1.2 + 'px'; d.style.transform = `rotate(${rnd(360)}deg)`; d.style.opacity = '.35'; }
    else if (d.classList.contains('clover')) { d.textContent = '☘\uFE0E'; d.style.fontSize = (s + 14) + 'px'; d.style.transform = `rotate(${rnd(50) - 25}deg)`; }
    else { d.textContent = '★'; d.style.fontSize = (s - 4) + 'px'; d.style.opacity = '.4'; }
    frag.appendChild(d);
  }
  bg.appendChild(frag);
}

/* ---------- Efectos visuales ---------- */
function confetti(n = 36) {
  const fx = $('#fx'); const em = ['⭐', '🍀', '🌟', '🎉', '🍃', '✨'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('span'); c.className = 'confetti'; c.textContent = pick(em);
    c.style.left = rnd(100) + 'vw'; c.style.animationDuration = (1.8 + Math.random() * 1.8) + 's'; c.style.animationDelay = (Math.random() * 0.5) + 's';
    fx.appendChild(c); setTimeout(() => c.remove(), 4200);
  }
}
function floatPoints(text, kind, x, y) {
  const f = document.createElement('div'); f.className = 'floatpts ' + kind; f.textContent = text;
  f.style.left = (x ?? window.innerWidth / 2) + 'px'; f.style.top = (y ?? window.innerHeight / 2) + 'px';
  document.body.appendChild(f); setTimeout(() => f.remove(), 1000);
}

/* ---------- Modal ---------- */
function showModal({ title, html = '', mascotMood, stars, buttons = [] }) {
  const card = $('#modal-card');
  card.innerHTML = '';
  if (mascotMood) { const m = document.createElement('div'); m.className = 'mascot-wrap'; m.innerHTML = mascot(mascotMood); card.appendChild(m); }
  const h = document.createElement('h2'); h.textContent = title; card.appendChild(h);
  if (stars !== undefined) { const s = document.createElement('div'); s.className = 'modal-big-stars'; s.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars); s.style.color = '#f5a623'; card.appendChild(s); }
  const b = document.createElement('div'); b.innerHTML = html; card.appendChild(b);
  const acts = document.createElement('div'); acts.className = 'modal-actions';
  buttons.forEach(bt => {
    const el = document.createElement('button'); el.className = 'btn' + (bt.alt ? ' alt' : ''); el.textContent = bt.label;
    el.addEventListener('click', () => { SFX.click(); if (bt.keep !== true) closeModal(); if (bt.onClick) bt.onClick(); });
    acts.appendChild(el);
  });
  card.appendChild(acts);
  $('#modal').hidden = false;
}
function closeModal() { $('#modal').hidden = true; }

/* ---------- Navegación ---------- */
const state = { game: null, level: 1, score: 0, cleanup: null };
function show(id) {
  if (state.cleanup) { state.cleanup(); state.cleanup = null; }
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo(0, 0);
}
function renderLevels() {
  const g = state.game; const info = GAMES[g];
  $('#levels-title').textContent = info.name.toUpperCase();
  $('#levels-sub').textContent = info.short + ' · Elige un nivel';
  const grid = $('#levels-grid'); grid.innerHTML = '';
  for (let l = 1; l <= 10; l++) {
    const b = document.createElement('button'); b.className = 'lvl';
    const open = l <= save.unlocked[g]; const st = save.stars[g][l] || 0;
    if (!open) { b.disabled = true; b.innerHTML = '🔒'; b.setAttribute('aria-label', 'Nivel ' + l + ' bloqueado'); }
    else {
      b.innerHTML = `<span>${l}</span><span class="stars">${st ? '★'.repeat(st) + '☆'.repeat(3 - st) : '&nbsp;'}</span>`;
      if (st) b.classList.add('done'); else b.classList.add('current');
      b.addEventListener('click', () => { SFX.click(); startLevel(g, l); });
    }
    grid.appendChild(b);
  }
}
function openLevels(g) { state.game = g; renderLevels(); show('screen-levels'); }
function setScore(v) { state.score = Math.max(0, v); $('#hud-score').textContent = state.score; }
function startLevel(g, l) {
  state.game = g; state.level = l; setScore(0);
  $('#hud-game').textContent = GAMES[g].name;
  $('#hud-level').textContent = 'Nivel ' + l + ' de 10';
  show('screen-play');
  const body = $('#play-body'); body.innerHTML = '';
  ({ quiz: startQuiz, cross: startCross, search: startSearch })[g](l, body);
}
function finishLevel(stars, extraHtml = '') {
  const g = state.game, l = state.level;
  save.stars[g][l] = Math.max(save.stars[g][l] || 0, stars);
  if (l < 10) save.unlocked[g] = Math.max(save.unlocked[g], l + 1);
  persist();
  SFX.win(); confetti(60);
  const last = l === 10;
  const buttons = [];
  if (!last) buttons.push({ label: 'Siguiente nivel ➜', onClick: () => startLevel(g, l + 1) });
  buttons.push({ label: 'Repetir', alt: true, onClick: () => startLevel(g, l) });
  buttons.push({ label: 'Niveles', alt: true, onClick: () => openLevels(g) });
  showModal({
    title: last ? '¡Completaste todos los niveles!' : '¡Nivel ' + l + ' completado!',
    mascotMood: 'cheer', stars,
    html: `<p>Puntos: <strong>${state.score}</strong></p>${extraHtml}${last ? '<p>🏆 ¡Aguyje, campeón del guaraní!</p>' : '<p>🔓 Se desbloqueó el nivel ' + (l + 1) + '.</p>'}`,
    buttons
  });
}
function feedbackBox(kind, inner) {
  const f = document.createElement('div'); f.className = 'feedback ' + kind; f.innerHTML = inner; return f;
}
const speakBtn = g => `<button class="btn alt btn-sound" data-speak="${g.replace(/"/g, '&quot;')}">🔊 Escuchar nuevamente</button>`;
function bindSpeak(root) { $$('[data-speak]', root).forEach(b => b.addEventListener('click', () => speak(b.dataset.speak))); }

/* =========================================================
   JUEGO 1 — JAGUARETE SABIO (selección múltiple)
   ========================================================= */
function startQuiz(level, root) {
  const L = level - 1;
  const pool = ANIMALS.slice(0, QUIZ_CFG.pool[L]);
  const items = shuffle(pool.slice()).slice(0, QUIZ_CFG.n[L]);
  const types = QUIZ_CFG.types[L];
  const k = QUIZ_CFG.opts[L];
  const timeLimit = QUIZ_CFG.time[L];
  const qs = items.map(it => {
    const type = pick(types);
    let options;
    if (type === 'gn2es') {
      const d = shuffle(pool.filter(p => p.es !== it.es)).slice(0, k - 1);
      options = shuffle([it, ...d]).map(p => ({ text: p.es, item: p, ok: p === it }));
    } else {
      const d = shuffle(pool.filter(p => p.g !== it.g && p.es !== it.es && p.e !== it.e)).slice(0, k - 1);
      options = shuffle([it, ...d]).map(p => ({ text: p.g, item: p, ok: p === it }));
    }
    return { item: it, type, options };
  });
  let i = 0, correct = 0, timer = null;
  state.cleanup = () => clearTimeout(timer);

  function render() {
    clearTimeout(timer);
    const q = qs[i]; const it = q.item;
    root.innerHTML = '';
    const prog = document.createElement('div'); prog.className = 'qz-progress'; prog.textContent = `Pregunta ${i + 1} de ${qs.length}`;
    const bar = document.createElement('div'); bar.className = 'qz-bar'; bar.innerHTML = `<i style="width:${(i / qs.length) * 100}%"></i>`;
    root.append(prog, bar);
    if (timeLimit) {
      const t = document.createElement('div'); t.className = 'qz-timer'; t.innerHTML = `<i style="animation-duration:${timeLimit}s"></i>`; root.appendChild(t);
    }
    const top = document.createElement('div'); top.className = 'qz-top';
    const m = document.createElement('div'); m.className = 'mascot-wrap'; m.innerHTML = mascot('happy'); top.appendChild(m);
    if (q.type === 'img') { const im = document.createElement('div'); im.className = 'qz-img'; im.textContent = it.e; im.setAttribute('role', 'img'); im.setAttribute('aria-label', it.es); top.appendChild(im); }
    root.appendChild(top);
    const qEl = document.createElement('div'); qEl.className = 'question';
    qEl.textContent = q.type === 'gn2es' ? `¿Qué significa «${it.g}» en español?` : `¿Cómo se dice «${it.es}» en guaraní?`;
    root.appendChild(qEl);
    const opts = document.createElement('div'); opts.className = 'options';
    q.options.forEach((o, idx) => {
      const b = document.createElement('button'); b.className = 'opt';
      b.innerHTML = `<span class="opt-l">${'ABCDEF'[idx]}</span><span></span>`; b.lastChild.textContent = o.text;
      b.addEventListener('click', () => answer(idx, m));
      opts.appendChild(b);
    });
    root.appendChild(opts);
    if (timeLimit) timer = setTimeout(() => answer(-1, m), timeLimit * 1000);
  }

  function answer(idx, mascotNode) {
    clearTimeout(timer);
    const q = qs[i]; const it = q.item;
    const btns = $$('.opt', root); btns.forEach(b => { b.disabled = true; });
    const tm = $('.qz-timer i', root); if (tm) tm.style.animationPlayState = 'paused';
    const okIdx = q.options.findIndex(o => o.ok);
    const chosen = idx >= 0 ? q.options[idx] : null;
    const isOk = idx === okIdx;
    btns.forEach((b, n) => { if (n === okIdx) b.classList.add('right'); else if (n === idx) b.classList.add('wrong'); else b.classList.add('dim'); });
    let fb;
    if (isOk) {
      correct++; setScore(state.score + 10);
      SFX.ok(); setMascot(mascotNode, 'cheer', 'cheer'); confetti(16); floatPoints('+10', 'plus');
      setTimeout(() => speak(it.g), 650);
      fb = feedbackBox('ok', `<div class="fb-title">🎉 ¡Correcto! +10 puntos</div>
        <div class="fb-word">${it.g} <small>= ${it.es}</small></div>
        <div class="fb-actions">${speakBtn(it.g)}<button class="btn" id="qz-next">${i === qs.length - 1 ? 'Terminar' : 'Continuar'}</button></div>`);
    } else {
      SFX.bad(); setMascot(mascotNode, 'sad', 'sad');
      let why;
      if (!chosen) why = '⏰ ¡Se acabó el tiempo!';
      else if (q.type === 'gn2es') why = `Elegiste «${chosen.text}», pero eso se dice <strong>${chosen.item.g}</strong> en guaraní.`;
      else why = `Elegiste «${chosen.text}», que significa <strong>${chosen.item.es}</strong>.`;
      fb = feedbackBox('bad', `<div class="fb-title">❌ Casi…</div>
        <div class="fb-text">${why}</div>
        <div class="fb-word">Respuesta correcta: ${it.g} <small>= ${it.es}</small></div>
        <div class="fb-actions">${speakBtn(it.g)}<button class="btn" id="qz-next">${i === qs.length - 1 ? 'Terminar' : 'Continuar'}</button></div>`);
    }
    root.appendChild(fb); bindSpeak(fb);
    $('#qz-next', fb).addEventListener('click', () => { SFX.click(); next(); });
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function next() {
    i++;
    if (i < qs.length) { render(); return; }
    const pct = correct / qs.length;
    if (pct >= 0.6) {
      const stars = pct >= 0.9 ? 3 : pct >= 0.75 ? 2 : 1;
      finishLevel(stars, `<p>Aciertos: <strong>${correct}/${qs.length}</strong></p>`);
    } else {
      SFX.lose();
      showModal({
        title: '¡Sigue practicando!', mascotMood: 'sad',
        html: `<p>Acertaste <strong>${correct}/${qs.length}</strong>. Necesitas al menos el 60% para pasar de nivel.</p>`,
        buttons: [{ label: 'Intentar de nuevo', onClick: () => startLevel('quiz', state.level) }, { label: 'Niveles', alt: true, onClick: () => openLevels('quiz') }]
      });
    }
  }
  render();
}

/* =========================================================
   JUEGO 2 — SOPA DE LETRAS
   ========================================================= */
const DIRS_BY_TIER = {
  1: [[0, 1], [1, 0]],
  2: [[0, 1], [1, 0], [1, 1], [-1, 1]],
  3: [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0]],
  4: [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]]
};
const FOUND_COLORS = ['#2e9e4f', '#e07b1a', '#3b82c4', '#c23b8d', '#8a5cd6', '#0e9aa7', '#c9a100', '#d9534f'];

function genSearch(level) {
  const L = level - 1, size = SEARCH_CFG.size[L], count = SEARCH_CFG.count[L], dirs = DIRS_BY_TIER[SEARCH_CFG.tier[L]];
  for (let attempt = 0; attempt < 200; attempt++) {
    const chosen = [];
    for (const p of shuffle(PLANTS.slice())) {
      const n = norm(p.g);
      if (n.length < 3 || n.length > size) continue;
      if (chosen.some(c => c.n.includes(n) || n.includes(c.n))) continue;
      chosen.push({ ...p, n });
      if (chosen.length === count) break;
    }
    if (chosen.length < count) continue;
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    let ok = true;
    for (const w of chosen.slice().sort((a, b) => b.n.length - a.n.length)) {
      let placed = false;
      for (let t = 0; t < 150 && !placed; t++) {
        const [dr, dc] = pick(dirs);
        const r0 = rnd(size), c0 = rnd(size);
        const r1 = r0 + dr * (w.n.length - 1), c1 = c0 + dc * (w.n.length - 1);
        if (r1 < 0 || r1 >= size || c1 < 0 || c1 >= size) continue;
        let fits = true;
        for (let k = 0; k < w.n.length; k++) { const ch = grid[r0 + dr * k][c0 + dc * k]; if (ch && ch !== w.n[k]) { fits = false; break; } }
        if (!fits) continue;
        for (let k = 0; k < w.n.length; k++) grid[r0 + dr * k][c0 + dc * k] = w.n[k];
        placed = true;
      }
      if (!placed) { ok = false; break; }
    }
    if (!ok) continue;
    const alphabet = 'AAAEEIIOOUUYKPTMNRGJVSCLBD'.split('');
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = pick(alphabet);
    return { size, grid, words: chosen };
  }
  return null;
}

function startSearch(level, root) {
  const data = genSearch(level);
  if (!data) { root.innerHTML = '<p>Ups, no se pudo generar la sopa de letras. Vuelve a intentarlo.</p>'; return; }
  const { size, grid, words } = data;
  const found = new Set(); const wrongSeen = new Set();
  let selCells = [], dragging = false, start = null, colorIdx = 0, msgTimer = null, lockInput = false;

  root.innerHTML = `
    <div class="ws-msg" id="ws-msg">Arrastra el dedo o el mouse sobre las letras</div>
    <div class="ws-layout">
      <div class="ws-board"><div id="ws-grid" style="--n:${size}"></div></div>
      <div class="ws-list"><h3>☘&#xFE0E; ENCONTRÁ ESTAS PALABRAS:</h3><ul id="ws-words"></ul></div>
    </div>
    <div id="ws-fb"></div>`;
  const gridEl = $('#ws-grid', root), listEl = $('#ws-words', root), msg = $('#ws-msg', root), fbHost = $('#ws-fb', root);

  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
    const d = document.createElement('div'); d.className = 'ws-cell'; d.dataset.r = r; d.dataset.c = c; d.textContent = grid[r][c]; gridEl.appendChild(d);
  }
  const cellAt = (r, c) => gridEl.children[r * size + c];
  words.forEach(w => {
    const li = document.createElement('li'); li.dataset.n = w.n;
    li.innerHTML = `<span class="box">✓</span><span>${w.n}</span><span class="tr">→ ${w.es}</span>`;
    listEl.appendChild(li);
  });
  state.cleanup = () => clearTimeout(msgTimer);

  function say(text, kind) { msg.textContent = text; msg.className = 'ws-msg ' + (kind || ''); }
  function cellFromPoint(x, y) { const e = document.elementFromPoint(x, y); return e && e.classList.contains('ws-cell') ? e : null; }
  function lineTo(r2, c2) {
    const [r1, c1] = start; const dr = r2 - r1, dc = c2 - c1;
    if (!dr && !dc) return [[r1, c1]];
    const step = Math.round(Math.atan2(dr, dc) / (Math.PI / 4));
    const dy = Math.round(Math.sin(step * Math.PI / 4)), dx = Math.round(Math.cos(step * Math.PI / 4));
    let len = Math.round((dr * dy + dc * dx) / (dy * dy + dx * dx));
    len = Math.max(0, len);
    while (len > 0 && (r1 + dy * len < 0 || r1 + dy * len >= size || c1 + dx * len < 0 || c1 + dx * len >= size)) len--;
    const out = []; for (let k = 0; k <= len; k++) out.push([r1 + dy * k, c1 + dx * k]); return out;
  }
  function paintSel() {
    $$('.ws-cell.sel', gridEl).forEach(e => e.classList.remove('sel'));
    selCells.forEach(([r, c]) => cellAt(r, c).classList.add('sel'));
  }
  gridEl.addEventListener('pointerdown', e => {
    if (lockInput) return;
    const cell = cellFromPoint(e.clientX, e.clientY) || e.target.closest('.ws-cell'); if (!cell) return;
    e.preventDefault(); dragging = true; start = [+cell.dataset.r, +cell.dataset.c];
    selCells = [start]; paintSel();
    try { gridEl.setPointerCapture(e.pointerId); } catch (err) { /* ignorar */ }
  });
  gridEl.addEventListener('pointermove', e => {
    if (!dragging) return;
    const cell = cellFromPoint(e.clientX, e.clientY); if (!cell) return;
    selCells = lineTo(+cell.dataset.r, +cell.dataset.c); paintSel();
  });
  const end = () => { if (!dragging) return; dragging = false; evaluate(); };
  gridEl.addEventListener('pointerup', end);
  gridEl.addEventListener('pointercancel', end);

  function evaluate() {
    const cells = selCells.slice(); selCells = []; 
    if (cells.length < 2) { paintSel(); return; }
    const word = cells.map(([r, c]) => grid[r][c]).join(''), rev = word.split('').reverse().join('');
    const hit = words.find(w => !found.has(w.n) && (w.n === word || w.n === rev));
    if (hit) {
      found.add(hit.n); paintSel();
      const col = FOUND_COLORS[colorIdx++ % FOUND_COLORS.length];
      cells.forEach(([r, c]) => { const e = cellAt(r, c); e.classList.remove('sel'); e.classList.add('found'); e.style.setProperty('--fc', col); });
      $$('li', listEl).find(li => li.dataset.n === hit.n).classList.add('found');
      setScore(state.score + 10); SFX.ok(); floatPoints('+10', 'plus');
      say(`✅ ${hit.n} → ${hit.es}  (+10 puntos)`, 'ok');
      setTimeout(() => speak(hit.g), 650);
      fbHost.innerHTML = ''; const fb = feedbackBox('ok', `<div class="fb-word">${hit.g} <small>= ${hit.es}</small></div><div class="fb-actions">${speakBtn(hit.g)}</div>`);
      fbHost.appendChild(fb); bindSpeak(fb);
      if (found.size === words.length) {
        lockInput = true;
        const maxPts = words.length * 10; const pct = state.score / maxPts;
        setTimeout(() => finishLevel(pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1, `<p>Palabras: <strong>${found.size}/${words.length}</strong></p>`), 1500);
      }
    } else {
      /* Selección incorrecta: se marca en rojo y se quita; la misma selección no resta dos veces */
      const a = cells[0].join(','), b = cells[cells.length - 1].join(',');
      const key = a < b ? a + '|' + b : b + '|' + a;
      const repeat = wrongSeen.has(key);
      cells.forEach(([r, c]) => cellAt(r, c).classList.add('bad'));
      paintSel(); SFX.bad();
      if (repeat) say('❌ Ya probaste esa selección', 'bad');
      else { wrongSeen.add(key); setScore(state.score - 5); floatPoints('-5', 'minus'); say('❌ Incorrecto  (-5 puntos)', 'bad'); }
      setTimeout(() => cells.forEach(([r, c]) => cellAt(r, c).classList.remove('bad')), 700);
    }
  }
}

/* =========================================================
   JUEGO 3 — ENIGMA GUARANÍ (crucigrama)
   ========================================================= */
function genCrossword(items, attempts = 60) {
  let bestPartial = null;
  for (let t = 0; t < attempts; t++) {
    const order = shuffle(items.slice()).sort((x, y) => y.a.length - x.a.length);
    const cells = new Map(); const placed = [];
    const K = (y, x) => y + ',' + x;
    const canPlace = (word, y, x, dir) => {
      const dy = dir === 'v' ? 1 : 0, dx = dir === 'h' ? 1 : 0;
      if (cells.has(K(y - dy, x - dx)) || cells.has(K(y + dy * word.length, x + dx * word.length))) return false;
      let cross = 0;
      for (let i = 0; i < word.length; i++) {
        const cy = y + dy * i, cx = x + dx * i; const ex = cells.get(K(cy, cx));
        if (ex) { if (ex.ch !== word[i] || ex.dirs[dir]) return false; cross++; }
        else if (cells.has(K(cy + dx, cx + dy)) || cells.has(K(cy - dx, cx - dy))) return false;
      }
      return cross > 0 || placed.length === 0;
    };
    const place = (w, y, x, dir) => {
      const dy = dir === 'v' ? 1 : 0, dx = dir === 'h' ? 1 : 0;
      for (let i = 0; i < w.a.length; i++) {
        const k = K(y + dy * i, x + dx * i); const ex = cells.get(k) || { ch: w.a[i], dirs: {} };
        ex.dirs[dir] = true; cells.set(k, ex);
      }
      placed.push({ ...w, y, x, dir });
    };
    place(order[0], 0, 0, 'h');
    let ok = true;
    for (let i = 1; i < order.length; i++) {
      const w = order[i]; const cands = [];
      for (let k = 0; k < w.a.length; k++) for (const p of placed) {
        const dir = p.dir === 'h' ? 'v' : 'h';
        for (let j = 0; j < p.a.length; j++) {
          if (p.a[j] !== w.a[k]) continue;
          const cy = p.dir === 'h' ? p.y : p.y + j, cx = p.dir === 'h' ? p.x + j : p.x;
          const sy = dir === 'v' ? cy - k : cy, sx = dir === 'h' ? cx - k : cx;
          if (canPlace(w.a, sy, sx, dir)) cands.push({ sy, sx, dir });
        }
      }
      if (!cands.length) { ok = false; break; }
      const c = pick(cands); place(w, c.sy, c.sx, c.dir);
    }
    if (!bestPartial || placed.length > bestPartial.length) bestPartial = placed.slice();
    if (ok) { bestPartial = placed.slice(); break; }
  }
  const placed = bestPartial;
  const minY = Math.min(...placed.map(p => p.y)), minX = Math.min(...placed.map(p => p.x));
  placed.forEach(p => { p.y -= minY; p.x -= minX; });
  const rows = Math.max(...placed.map(p => p.y + (p.dir === 'v' ? p.a.length : 1)));
  const cols = Math.max(...placed.map(p => p.x + (p.dir === 'h' ? p.a.length : 1)));
  /* Numeración por orden de lectura */
  const starts = [...new Set(placed.map(p => p.y + ',' + p.x))].sort((a, b) => { const [ay, ax] = a.split(',').map(Number), [by, bx] = b.split(',').map(Number); return ay - by || ax - bx; });
  placed.forEach(p => { p.num = starts.indexOf(p.y + ',' + p.x) + 1; p.cells = Array.from({ length: p.a.length }, (_, i) => ({ y: p.y + (p.dir === 'v' ? i : 0), x: p.x + (p.dir === 'h' ? i : 0) })); });
  placed.sort((a, b) => a.num - b.num || (a.dir === 'h' ? -1 : 1));
  return { rows, cols, words: placed };
}

function startCross(level, root) {
  const L = level - 1;
  const base = BODY.map(b => ({ ...b, a: normCross(b.g) })).sort((x, y) => x.a.length - y.a.length).slice(0, CROSS_CFG.pool[L]);
  /* Se prueban varios grupos de palabras hasta encontrar uno cuyas palabras se crucen todas */
  let best = null;
  for (let t = 0; t < 300; t++) {
    const items = shuffle(base.slice()).slice(0, CROSS_CFG.count[L]);
    const res = genCrossword(items, 40);
    if (!best || res.words.length > best.words.length) best = res;
    if (res.words.length === items.length) break;
  }
  const { rows, cols, words } = best;
  const key = (y, x) => y + ',' + x;
  const cellMap = new Map();   /* key -> { el, val, locked } */
  let active = 0, cursor = 0;

  root.innerHTML = `
    <div class="cw-layout">
      <div class="cw-board"><div id="cw-grid" style="--cols:${cols}"></div></div>
      <div class="cw-side">
        <div class="cw-clue" id="cw-clue"></div>
        <h3>➡ Horizontales</h3><ul class="cw-list" id="cw-h"></ul>
        <h3>⬇ Verticales</h3><ul class="cw-list" id="cw-v"></ul>
        <div class="cw-actions"><button class="btn alt" id="cw-clear">Borrar palabra</button></div>
        <div class="cw-help">Toca una casilla o una pista y escribe la palabra en guaraní (sin acentos ni apóstrofos).</div>
      </div>
    </div>
    <div id="cw-fb"></div>`;
  const gridEl = $('#cw-grid', root), clueEl = $('#cw-clue', root), fbHost = $('#cw-fb', root);

  const numAt = new Map(); words.forEach(w => { if (!numAt.has(key(w.y, w.x))) numAt.set(key(w.y, w.x), w.num); });
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const d = document.createElement('div'); d.className = 'cw-cell blank';
    const used = words.some(w => w.cells.some(c => c.y === y && c.x === x));
    if (used) {
      d.className = 'cw-cell fill'; d.dataset.y = y; d.dataset.x = x;
      if (numAt.has(key(y, x))) { const n = document.createElement('span'); n.className = 'cw-num'; n.textContent = numAt.get(key(y, x)); d.appendChild(n); }
      const letter = document.createElement('span'); d.appendChild(letter);
      cellMap.set(key(y, x), { el: d, letter, val: '', locked: false });
      d.addEventListener('click', () => clickCell(y, x));
    }
    gridEl.appendChild(d);
  }
  words.forEach((w, idx) => {
    const li = document.createElement('li'); const b = document.createElement('button'); b.textContent = w.num; b.dataset.idx = idx;
    b.addEventListener('click', () => { SFX.click(); setActive(idx, firstFree(idx)); focusKbd(); });
    li.appendChild(b); $(w.dir === 'h' ? '#cw-h' : '#cw-v', root).appendChild(li);
  });
  $('#cw-clear', root).addEventListener('click', () => { clearWord(active); focusKbd(); });

  const kbd = $('#kbd');
  function focusKbd() { kbd.value = ''; try { kbd.focus({ preventScroll: true }); } catch (e) { kbd.focus(); } }
  function firstFree(idx) { const w = words[idx]; const i = w.cells.findIndex(c => !cellMap.get(key(c.y, c.x)).locked); return i < 0 ? 0 : i; }
  function setActive(idx, pos) {
    active = idx; cursor = pos;
    $$('.cw-cell', gridEl).forEach(c => c.classList.remove('inword', 'cursor'));
    const w = words[idx];
    w.cells.forEach((c, i) => { const m = cellMap.get(key(c.y, c.x)); m.el.classList.add('inword'); if (i === cursor && !w.done) m.el.classList.add('cursor'); });
    $$('.cw-list button', root).forEach(b => { b.classList.toggle('active', +b.dataset.idx === idx); });
    clueEl.innerHTML = `<div class="cw-cn">${w.num} · ${w.dir === 'h' ? 'Horizontal ➡' : 'Vertical ⬇'} · ${w.a.length} letras</div>
      <div class="cw-dlg">💬 ${w.d}</div><div class="cw-q">¿Qué palabra significa «${w.es}»?</div>`;
  }
  function clickCell(y, x) {
    SFX.click();
    const through = words.map((w, i) => ({ w, i })).filter(o => o.w.cells.some(c => c.y === y && c.x === x));
    const inActive = through.find(o => o.i === active);
    let target;
    if (inActive && through.length > 1) {
      const curCell = words[active].cells[cursor];
      target = (curCell && curCell.y === y && curCell.x === x) ? through.find(o => o.i !== active) : inActive;
    } else target = inActive || through.find(o => !o.w.done) || through[0];
    setActive(target.i, target.w.cells.findIndex(c => c.y === y && c.x === x));
    focusKbd();
  }
  function render(m) { m.letter.textContent = m.val; }
  function typeLetter(ch) {
    const w = words[active]; if (w.done) return;
    let i = cursor;
    while (i < w.cells.length && cellMap.get(key(w.cells[i].y, w.cells[i].x)).locked) i++;
    if (i >= w.cells.length) i = w.cells.findIndex(c => !cellMap.get(key(c.y, c.x)).locked);
    if (i < 0) return;
    const m = cellMap.get(key(w.cells[i].y, w.cells[i].x)); m.val = ch; render(m);
    let n = i + 1; while (n < w.cells.length && cellMap.get(key(w.cells[n].y, w.cells[n].x)).locked) n++;
    setActive(active, Math.min(n, w.cells.length - 1));
    if (w.cells.every(c => cellMap.get(key(c.y, c.x)).val)) checkWord(active);
  }
  function backspace() {
    const w = words[active]; if (w.done) return;
    let i = cursor;
    const cur = cellMap.get(key(w.cells[i].y, w.cells[i].x));
    if (cur.val && !cur.locked) { cur.val = ''; render(cur); return; }
    i--; while (i >= 0 && cellMap.get(key(w.cells[i].y, w.cells[i].x)).locked) i--;
    if (i < 0) return;
    const m = cellMap.get(key(w.cells[i].y, w.cells[i].x)); m.val = ''; render(m); setActive(active, i);
  }
  function clearWord(idx) {
    const w = words[idx]; if (w.done) return;
    w.cells.forEach(c => { const m = cellMap.get(key(c.y, c.x)); if (!m.locked) { m.val = ''; render(m); } });
    setActive(idx, firstFree(idx));
  }
  function checkWord(idx) {
    const w = words[idx];
    const guess = w.cells.map(c => cellMap.get(key(c.y, c.x)).val).join('');
    if (guess === w.a) {
      w.done = true;
      w.cells.forEach(c => { const m = cellMap.get(key(c.y, c.x)); m.locked = true; m.el.classList.add('done'); });
      $$('.cw-list button', root).find(b => +b.dataset.idx === idx).classList.add('done');
      setScore(state.score + 10); SFX.ok(); floatPoints('+10', 'plus'); confetti(14);
      setTimeout(() => speak(w.g), 650);
      fbHost.innerHTML = '';
      const fb = feedbackBox('ok', `<div class="fb-title">✅ ¡Correcto! +10 puntos</div>
        <div class="mascot-wrap small cheer" style="width:90px"></div>
        <div class="fb-word">${w.g} <small>= ${w.es}</small></div>
        <div class="fb-actions">${speakBtn(w.g)}</div>`);
      $('.mascot-wrap', fb).innerHTML = mascot('cheer');
      fbHost.appendChild(fb); bindSpeak(fb);
      setActive(idx, cursor);
      if (words.every(x => x.done)) {
        const maxPts = words.length * 10; const pct = state.score / maxPts;
        setTimeout(() => finishLevel(pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1, `<p>Palabras: <strong>${words.length}/${words.length}</strong></p>`), 1500);
      }
    } else {
      SFX.bad(); setScore(state.score - 5); floatPoints('-5', 'minus');
      fbHost.innerHTML = '';
      const fb = feedbackBox('bad', `<div class="fb-title">❌ Respuesta incorrecta (-5 puntos)</div><div class="fb-text">¡Inténtalo otra vez! Lee la pista con calma.</div>`);
      fbHost.appendChild(fb);
      const flash = w.cells.map(c => cellMap.get(key(c.y, c.x))).filter(m => !m.locked);
      flash.forEach(m => m.el.classList.add('wrongflash'));
      setTimeout(() => { flash.forEach(m => m.el.classList.remove('wrongflash')); clearWord(idx); }, 600);
    }
  }

  /* Entrada de teclado (físico y de celular) */
  const onInput = () => {
    const v = kbd.value; kbd.value = '';
    for (const ch of v) { const c = norm(ch); if (c && /[A-ZÑ]/.test(c)) typeLetter(c === 'Ñ' ? 'N' : c); }
  };
  const onKey = e => {
    if (!$('#screen-play').classList.contains('active') || !$('#modal').hidden) return;
    if (e.key === 'Backspace') { e.preventDefault(); backspace(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setActive(active, Math.min(cursor + 1, words[active].cells.length - 1)); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setActive(active, Math.max(cursor - 1, 0)); }
    else if (e.key === 'Tab') { e.preventDefault(); const n = (active + (e.shiftKey ? words.length - 1 : 1)) % words.length; setActive(n, firstFree(n)); }
  };
  kbd.addEventListener('input', onInput);
  document.addEventListener('keydown', onKey);
  const docType = e => { if (document.activeElement !== kbd && /^[a-zA-ZñÑ]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey && $('#modal').hidden && $('#screen-play').classList.contains('active')) { typeLetter(norm(e.key) === 'Ñ' ? 'N' : norm(e.key)); } };
  document.addEventListener('keydown', docType);
  state.cleanup = () => { kbd.removeEventListener('input', onInput); document.removeEventListener('keydown', onKey); document.removeEventListener('keydown', docType); kbd.blur(); };

  setActive(0, 0);
}

/* =========================================================
   INICIO
   ========================================================= */
function updateSoundIcon() { $('#hud-sound').textContent = save.sound ? '🔊' : '🔇'; }
function init() {
  buildBackground(); renderMascots(); updateSoundIcon();

  $('#btn-play').addEventListener('click', () => { audioCtx(); SFX.click(); show('screen-games'); });
  $$('[data-game]').forEach(b => b.addEventListener('click', () => { SFX.click(); openLevels(b.dataset.game); }));
  $$('[data-back]').forEach(b => b.addEventListener('click', () => { SFX.click(); show('screen-' + b.dataset.back); }));
  $('#hud-back').addEventListener('click', () => { SFX.click(); openLevels(state.game); });
  $('#hud-sound').addEventListener('click', () => { save.sound = !save.sound; persist(); updateSoundIcon(); SFX.click(); });

  $('#btn-info').addEventListener('click', () => showModal({
    title: 'Cómo se juega', mascotMood: 'happy',
    html: `<ul>
      <li><strong>Jaguarete sabio:</strong> elige la palabra correcta en guaraní. Necesitas 60% de aciertos para pasar.</li>
      <li><strong>Sopa de letras:</strong> arrastra sobre las letras. +10 al acertar, −5 al fallar.</li>
      <li><strong>Enigma guaraní:</strong> lee la pista y escribe la palabra en el crucigrama.</li>
      <li>Cada nivel completado desbloquea el siguiente. ¡Son 10 por juego!</li></ul>`,
    buttons: [{ label: '¡Entendido!' }]
  }));
  $('#btn-settings').addEventListener('click', () => {
    showModal({
      title: 'Ajustes',
      html: `<div class="toggle-row"><span>Sonido</span><button class="btn alt" id="set-sound">${save.sound ? 'Activado 🔊' : 'Silenciado 🔇'}</button></div>
             <div class="toggle-row"><span>Progreso</span><button class="btn alt" id="set-reset">Reiniciar</button></div>`,
      buttons: [{ label: 'Cerrar' }]
    });
    $('#set-sound').addEventListener('click', e => { save.sound = !save.sound; persist(); updateSoundIcon(); e.target.textContent = save.sound ? 'Activado 🔊' : 'Silenciado 🔇'; SFX.click(); });
    $('#set-reset').addEventListener('click', () => {
      if (confirm('¿Seguro que quieres borrar todo tu progreso?')) { const snd = save.sound; save = defaultSave(); save.sound = snd; persist(); closeModal(); }
    });
  });
  $('#btn-exit').addEventListener('click', () => showModal({
    title: '¡Hasta pronto!', mascotMood: 'happy', html: '<p>¡Aguyje por jugar Guaraní Rape! 🍀</p>',
    buttons: [{ label: 'Seguir jugando' }]
  }));
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
}
document.addEventListener('DOMContentLoaded', init);
