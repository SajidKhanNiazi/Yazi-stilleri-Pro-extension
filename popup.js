/* =============================================
   FANCY TEXT GENERATOR — Core Engine
   ============================================= */

(() => {
  'use strict';

  // ─── CONSTANTS ──────────────────────────────
  const WEBSITE_URL = 'https://yazı-stilleripro.com.tr/';
  const MAX_HISTORY = 20;
  const DEBOUNCE_MS = 80;
  const LAZY_BATCH  = 20;

  // ─── CHARACTER MAPS ─────────────────────────

  function buildMap(source, target) {
    const srcArr = [...source];
    const tgtArr = [...target];
    const map = {};
    for (let i = 0; i < srcArr.length; i++) {
      map[srcArr[i]] = tgtArr[i];
    }
    return map;
  }

  const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const DIGITS = '0123456789';
  const ALPHA_DIGITS = ALPHA_UPPER + DIGITS;

  // Unicode Mathematical Alphanumeric Symbols
  const MAPS = {
    bold: buildMap(ALPHA_DIGITS,
      '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'),

    italic: buildMap(ALPHA_UPPER,
      '𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧'),

    boldItalic: buildMap(ALPHA_UPPER,
      '𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛'),

    script: buildMap(ALPHA_UPPER,
      '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'),

    boldScript: buildMap(ALPHA_UPPER,
      '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃'),

    fraktur: buildMap(ALPHA_UPPER,
      '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷'),

    boldFraktur: buildMap(ALPHA_UPPER,
      '𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟'),

    doubleStruck: buildMap(ALPHA_DIGITS,
      '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'),

    monospace: buildMap(ALPHA_DIGITS,
      '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'),

    sansBold: buildMap(ALPHA_DIGITS,
      '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'),

    sansItalic: buildMap(ALPHA_UPPER,
      '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻'),

    sansBoldItalic: buildMap(ALPHA_UPPER,
      '𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯'),

    sansSerif: buildMap(ALPHA_DIGITS,
      '𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫'),

    circled: buildMap(ALPHA_UPPER + DIGITS,
      'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨'),

    negCircled: buildMap('ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩'),

    squared: buildMap('ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉'),

    negSquared: buildMap('ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉'),

    fullwidth: buildMap(ALPHA_DIGITS + ' ',
      'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９　'),

    smallCaps: buildMap(ALPHA_LOWER,
      'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'),

    superscript: buildMap('abcdefghijklmnoprstuvwxyz0123456789',
      'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹'),

    subscript: buildMap('aehijklmnoprstuvx0123456789',
      'ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓ₀₁₂₃₄₅₆₇₈₉'),
  };

  // Upside-down map
  const flipMap = buildMap(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?\'\"()[]{}',
    'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ860˙\'¡¿,„)(][}{'
  );

  // ─── TRANSFORM FUNCTIONS ────────────────────

  function mapText(text, charMap) {
    return [...text].map(c => charMap[c] ?? c).join('');
  }

  function addCombining(text, combinator) {
    return [...text].map(c => c + combinator).join('');
  }

  function upsideDown(text) {
    return [...text].reverse().map(c => flipMap[c] ?? c).join('');
  }

  // ─── STYLE DEFINITIONS (51 styles) ──────────

  const STYLES = [
    // ── BASIC ──
    { id: 'upper',       label: 'UPPERCASE',       icon: '🔠', category: 'basic',      transform: t => t.toUpperCase() },
    { id: 'lower',       label: 'lowercase',       icon: '🔡', category: 'basic',      transform: t => t.toLowerCase() },
    { id: 'capitalize',  label: 'Capitalized',     icon: '🔤', category: 'basic',      transform: t => t.replace(/\b\w/g, c => c.toUpperCase()) },
    { id: 'alternating', label: 'aLtErNaTiNg',     icon: '🔀', category: 'basic',      transform: t => [...t].map((c,i) => i%2 ? c.toUpperCase() : c.toLowerCase()).join('') },
    { id: 'reversed',    label: 'Reversed',        icon: '🔄', category: 'basic',      transform: t => [...t].reverse().join('') },
    { id: 'spaced',      label: 'S p a c e d',     icon: '↔️', category: 'basic',      transform: t => [...t].join(' ') },

    // ── UNICODE ──
    { id: 'bold',           label: 'Bold',              icon: '🅱️', category: 'unicode',  transform: t => mapText(t, MAPS.bold) },
    { id: 'italic',         label: 'Italic',            icon: '𝐼',  category: 'unicode',  transform: t => mapText(t, MAPS.italic) },
    { id: 'boldItalic',     label: 'Bold Italic',       icon: '𝑩',  category: 'unicode',  transform: t => mapText(t, MAPS.boldItalic) },
    { id: 'script',         label: 'Script',            icon: '✍️', category: 'unicode',  transform: t => mapText(t, MAPS.script) },
    { id: 'boldScript',     label: 'Bold Script',       icon: '🖋️', category: 'unicode',  transform: t => mapText(t, MAPS.boldScript) },
    { id: 'fraktur',        label: 'Fraktur',           icon: '🏰', category: 'unicode',  transform: t => mapText(t, MAPS.fraktur) },
    { id: 'boldFraktur',    label: 'Bold Fraktur',      icon: '⚔️', category: 'unicode',  transform: t => mapText(t, MAPS.boldFraktur) },
    { id: 'doubleStruck',   label: 'Double-Struck',     icon: '🔲', category: 'unicode',  transform: t => mapText(t, MAPS.doubleStruck) },
    { id: 'monospace',      label: 'Monospace',         icon: '💻', category: 'unicode',  transform: t => mapText(t, MAPS.monospace) },
    { id: 'sansSerif',      label: 'Sans-Serif',        icon: '📃', category: 'unicode',  transform: t => mapText(t, MAPS.sansSerif) },
    { id: 'sansBold',       label: 'Sans Bold',         icon: '📄', category: 'unicode',  transform: t => mapText(t, MAPS.sansBold) },
    { id: 'sansItalic',     label: 'Sans Italic',       icon: '📑', category: 'unicode',  transform: t => mapText(t, MAPS.sansItalic) },
    { id: 'sansBoldItalic', label: 'Sans Bold Italic',  icon: '📋', category: 'unicode',  transform: t => mapText(t, MAPS.sansBoldItalic) },

    // ── DECORATIVE ──
    { id: 'sparkles',   label: '✨ Sparkles ✨',        icon: '✨', category: 'decorative', transform: t => `✨ ${t} ✨` },
    { id: 'stars',      label: '★ Stars ★',             icon: '⭐', category: 'decorative', transform: t => `★彡 ${t} 彡★` },
    { id: 'hearts',     label: '♡ Hearts ♡',            icon: '💖', category: 'decorative', transform: t => `♡ ${t} ♡` },
    { id: 'arrows',     label: '» Arrows «',            icon: '➡️', category: 'decorative', transform: t => `»»— ${t} —««` },
    { id: 'flowers',    label: '✿ Flowers ✿',           icon: '🌸', category: 'decorative', transform: t => `✿ ${t} ✿` },
    { id: 'brackets',   label: '【Brackets】',          icon: '🔰', category: 'decorative', transform: t => `【${t}】` },
    { id: 'clouds',     label: '☁ Clouds ☁',            icon: '☁️', category: 'decorative', transform: t => `☁️ ${t} ☁️` },
    { id: 'swords',     label: '⚔ Swords ⚔',            icon: '⚔️', category: 'decorative', transform: t => `⚔️ ${t} ⚔️` },
    { id: 'lightning',  label: '⚡ Lightning ⚡',        icon: '⚡', category: 'decorative', transform: t => `⚡ ${t} ⚡` },
    { id: 'fire',       label: '🔥 Fire 🔥',            icon: '🔥', category: 'decorative', transform: t => `🔥 ${t} 🔥` },
    { id: 'snow',       label: '❄ Snow ❄',              icon: '❄️', category: 'decorative', transform: t => `❄️ ${t} ❄️` },
    { id: 'music',      label: '♪ Music ♪',             icon: '🎵', category: 'decorative', transform: t => `♪♫ ${t} ♫♪` },
    { id: 'diamonds',   label: '◈ Diamonds ◈',          icon: '💎', category: 'decorative', transform: t => `◈ ${t} ◈` },
    { id: 'crown',      label: '♛ Crown ♛',             icon: '👑', category: 'decorative', transform: t => `♛ ${t} ♛` },
    { id: 'wings',      label: '༺ Wings ༻',            icon: '🦅', category: 'decorative', transform: t => `༺ ${t} ༻` },
    { id: 'aesthetic',  label: 'A e s t h e t i c',    icon: '🌊', category: 'decorative', transform: t => mapText([...t].join(' '), MAPS.fullwidth) },

    // ── SYMBOL ──
    { id: 'circled',      label: 'Circled',             icon: '🔵', category: 'symbol',   transform: t => mapText(t, MAPS.circled) },
    { id: 'negCircled',   label: 'Negative Circled',    icon: '⚫', category: 'symbol',   transform: t => mapText(t.toUpperCase(), MAPS.negCircled) },
    { id: 'squared',      label: 'Squared',             icon: '🟦', category: 'symbol',   transform: t => mapText(t.toUpperCase(), MAPS.squared) },
    { id: 'negSquared',   label: 'Negative Squared',    icon: '🟥', category: 'symbol',   transform: t => mapText(t.toUpperCase(), MAPS.negSquared) },
    { id: 'fullwidth',    label: 'Fullwidth',           icon: '🅰️', category: 'symbol',   transform: t => mapText(t, MAPS.fullwidth) },
    { id: 'parenthesized',label: 'Parenthesized',       icon: '🔤', category: 'symbol',   transform: t => [...t].map(c => c === ' ' ? ' ' : `(${c})`).join('') },

    // ── SPECIAL ──
    { id: 'smallCaps',         label: 'Small Caps',            icon: 'ᴀ',  category: 'special', transform: t => mapText(t, MAPS.smallCaps) },
    { id: 'superscript',       label: 'Superscript',           icon: '²',  category: 'special', transform: t => mapText(t.toLowerCase(), MAPS.superscript) },
    { id: 'upsideDown',        label: 'Upside Down',           icon: '🙃', category: 'special', transform: t => upsideDown(t) },
    { id: 'strikethrough',     label: 'S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶',      icon: '✂️', category: 'special', transform: t => addCombining(t, '\u0336') },
    { id: 'doubleStrike',      label: 'D̷o̷u̷b̷l̷e̷ ̷S̷t̷r̷i̷k̷e̷',     icon: '🗡️', category: 'special', transform: t => addCombining(t, '\u0337') },
    { id: 'underline',         label: 'U̲n̲d̲e̲r̲l̲i̲n̲e̲',              icon: '📏', category: 'special', transform: t => addCombining(t, '\u0332') },
    { id: 'dotSep',            label: 'Dot · Separator',       icon: '•',  category: 'special', transform: t => [...t].join(' • ') },
    { id: 'starSep',           label: 'Star ✦ Separator',      icon: '✦',  category: 'special', transform: t => [...t].join(' ✦ ') },
    { id: 'dashSep',           label: 'Dash — Separator',      icon: '—',  category: 'special', transform: t => [...t].join(' — ') },
  ];

  // ─── STATE ──────────────────────────────────

  let favorites = new Set();
  let copyHistory = [];
  let currentTab = 'all';
  let currentCategory = 'all';
  let searchQuery = '';
  let selectedEmoji = '⭐';
  let lazyIndex = 0;
  let currentText = '';
  let allCards = [];

  // ─── DOM REFERENCES ─────────────────────────

  const $ = id => document.getElementById(id);
  const textInput      = $('ftg-text-input');
  const clearBtn       = $('ftg-clear-btn');
  const searchInput    = $('ftg-search-input');
  const resultsArea    = $('ftg-results');
  const copyAllWrap    = $('ftg-copy-all-wrap');
  const copyAllBtn     = $('ftg-copy-all');
  const historyPanel   = $('ftg-history-panel');
  const historyList    = $('ftg-history-list');
  const clearHistoryBtn= $('ftg-clear-history');
  const favoritesPanel = $('ftg-favorites-panel');
  const filterBar      = $('ftg-filters');
  const themeToggle    = $('ftg-theme-toggle');
  const viralToggle    = $('ftg-viral-toggle');
  const viralContent   = $('ftg-viral-content');
  const toast          = $('ftg-toast');

  // Modal references
  const bioModal       = $('ftg-modal-bio');
  const nickModal      = $('ftg-modal-nickname');
  const emojiModal     = $('ftg-modal-emoji');

  // ─── UTILITY ────────────────────────────────

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  function showToast(msg, duration = 1200) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  function timeAgo(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  // ─── STORAGE ────────────────────────────────

  async function loadStorage() {
    try {
      const data = await chrome.storage.local.get(['favorites', 'copyHistory', 'theme']);
      if (data.favorites) favorites = new Set(data.favorites);
      if (data.copyHistory) copyHistory = data.copyHistory;
      if (data.theme) setTheme(data.theme);
    } catch {
      // Non-Chrome environment fallback
      const saved = localStorage.getItem('ftg-data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.favorites) favorites = new Set(data.favorites);
        if (data.copyHistory) copyHistory = data.copyHistory;
        if (data.theme) setTheme(data.theme);
      }
    }
  }

  function saveStorage() {
    const data = {
      favorites: [...favorites],
      copyHistory,
      theme: document.documentElement.getAttribute('data-theme'),
    };
    try {
      chrome.storage.local.set(data);
    } catch {
      localStorage.setItem('ftg-data', JSON.stringify(data));
    }
  }

  function addToHistory(text) {
    copyHistory.unshift({ text, ts: Date.now() });
    if (copyHistory.length > MAX_HISTORY) copyHistory.pop();
    saveStorage();
  }

  // ─── THEME ──────────────────────────────────

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.querySelector('.ftg-theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
    saveStorage();
  }

  // ─── RENDERING ──────────────────────────────

  function getFilteredStyles() {
    let styles = STYLES;

    // Category filter
    if (currentCategory !== 'all') {
      styles = styles.filter(s => s.category === currentCategory);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      styles = styles.filter(s =>
        s.label.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    }

    // Favorites tab
    if (currentTab === 'favorites') {
      styles = styles.filter(s => favorites.has(s.id));
    }

    return styles;
  }

  function createCard(style, text) {
    const value = style.transform(text);
    const card = document.createElement('div');
    card.className = 'ftg-card';
    card.dataset.styleId = style.id;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Copy ${style.label} text`);

    const isFav = favorites.has(style.id);

    card.innerHTML = `
      <div class="ftg-card-header">
        <span class="ftg-card-label">
          <span class="ftg-card-label-icon">${style.icon}</span>
          ${escapeHtml(style.label)}
        </span>
        <span class="ftg-card-actions">
          <button class="ftg-action-btn ftg-fav-btn ${isFav ? 'favorited' : ''}"
                  type="button" aria-label="Toggle favorite" title="Toggle favorite">
            ${isFav ? '⭐' : '☆'}
          </button>
          <button class="ftg-action-btn ftg-copy-btn"
                  type="button" aria-label="Copy text" title="Copy to clipboard">
            📋
          </button>
        </span>
      </div>
      <div class="ftg-card-text">${escapeHtml(value)}</div>
    `;

    // Copy on card click
    card.addEventListener('click', (e) => {
      if (e.target.closest('.ftg-fav-btn') || e.target.closest('.ftg-copy-btn')) return;
      handleCopy(value, card);
    });

    // Copy button
    card.querySelector('.ftg-copy-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      handleCopy(value, card);
    });

    // Favorite button
    card.querySelector('.ftg-fav-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(style.id, e.currentTarget);
    });

    // Keyboard
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCopy(value, card);
      }
    });

    return card;
  }

  async function handleCopy(text, cardEl) {
    await copyToClipboard(text);
    addToHistory(text);
    showToast('✅ Copied!');

    cardEl.classList.add('copied');
    setTimeout(() => cardEl.classList.remove('copied'), 800);
  }

  function toggleFavorite(styleId, btnEl) {
    if (favorites.has(styleId)) {
      favorites.delete(styleId);
      btnEl.classList.remove('favorited');
      btnEl.textContent = '☆';
    } else {
      favorites.add(styleId);
      btnEl.classList.add('favorited');
      btnEl.textContent = '⭐';
    }
    saveStorage();

    // If on favorites tab, re-render
    if (currentTab === 'favorites') {
      renderStyles(currentText);
    }
  }

  function renderStyles(text) {
    currentText = text;
    resultsArea.innerHTML = '';
    allCards = [];
    lazyIndex = 0;

    if (currentTab === 'history') {
      showHistoryPanel();
      return;
    }

    historyPanel.style.display = 'none';
    favoritesPanel.style.display = 'none';
    resultsArea.style.display = 'flex';

    if (!text.trim()) {
      copyAllWrap.style.display = 'none';
      resultsArea.innerHTML = `
        <div class="ftg-placeholder">
          <span class="ftg-placeholder-icon">✨</span>
          Type something to generate<br/>50+ fancy text styles instantly!
        </div>`;
      return;
    }

    const styles = getFilteredStyles();

    if (styles.length === 0) {
      copyAllWrap.style.display = 'none';
      resultsArea.innerHTML = `
        <div class="ftg-placeholder">
          <span class="ftg-placeholder-icon">🔍</span>
          No styles found for your search.
        </div>`;
      return;
    }

    copyAllWrap.style.display = 'block';

    // Lazy rendering: create all cards but append in batches
    const fragment = document.createDocumentFragment();
    const batchEnd = Math.min(LAZY_BATCH, styles.length);

    for (let i = 0; i < batchEnd; i++) {
      const card = createCard(styles[i], text);
      fragment.appendChild(card);
      allCards.push(card);
    }

    resultsArea.appendChild(fragment);
    lazyIndex = batchEnd;

    // Render remaining on scroll or immediately if few
    if (styles.length > LAZY_BATCH) {
      const renderMore = () => {
        if (lazyIndex >= styles.length) return;
        const frag = document.createDocumentFragment();
        const end = Math.min(lazyIndex + LAZY_BATCH, styles.length);
        for (let i = lazyIndex; i < end; i++) {
          const card = createCard(styles[i], text);
          frag.appendChild(card);
          allCards.push(card);
        }
        resultsArea.appendChild(frag);
        lazyIndex = end;
      };

      // Use IntersectionObserver for lazy loading
      const sentinel = document.createElement('div');
      sentinel.style.height = '1px';
      resultsArea.appendChild(sentinel);

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && lazyIndex < styles.length) {
          renderMore();
          if (lazyIndex >= styles.length) {
            observer.disconnect();
            sentinel.remove();
          }
        }
      }, { root: null, threshold: 0 });

      observer.observe(sentinel);
    }
  }

  const debouncedRender = debounce((text) => renderStyles(text), DEBOUNCE_MS);

  // ─── COPY ALL ───────────────────────────────

  async function copyAll() {
    const text = currentText;
    if (!text.trim()) return;

    const styles = getFilteredStyles();
    const allText = styles.map(s => `${s.label}: ${s.transform(text)}`).join('\n\n');
    await copyToClipboard(allText);
    addToHistory(allText);
    showToast('✅ All styles copied!');
  }

  // ─── HISTORY PANEL ──────────────────────────

  function showHistoryPanel() {
    resultsArea.style.display = 'none';
    favoritesPanel.style.display = 'none';
    copyAllWrap.style.display = 'none';
    historyPanel.style.display = 'block';
    renderHistory();
  }

  function renderHistory() {
    historyList.innerHTML = '';

    if (copyHistory.length === 0) {
      historyList.innerHTML = '<p class="ftg-empty">No copy history yet.</p>';
      return;
    }

    const frag = document.createDocumentFragment();
    copyHistory.forEach(item => {
      const el = document.createElement('div');
      el.className = 'ftg-history-item';
      el.innerHTML = `
        <span class="ftg-history-text">${escapeHtml(item.text)}</span>
        <span class="ftg-history-meta">${timeAgo(item.ts)}</span>
      `;
      el.addEventListener('click', async () => {
        await copyToClipboard(item.text);
        showToast('✅ Copied!');
        el.style.borderColor = 'var(--success)';
        setTimeout(() => el.style.borderColor = '', 600);
      });
      frag.appendChild(el);
    });

    historyList.appendChild(frag);
  }

  function clearHistory() {
    copyHistory = [];
    saveStorage();
    renderHistory();
    showToast('🗑️ History cleared');
  }

  // ─── TABS ───────────────────────────────────

  function switchTab(tab) {
    currentTab = tab;

    // Update active tab UI
    document.querySelectorAll('.ftg-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
      t.setAttribute('aria-selected', t.dataset.tab === tab);
    });

    // Show/hide filters (only on "all" and "favorites" tabs)
    filterBar.style.display = (tab === 'history') ? 'none' : 'flex';

    renderStyles(currentText);
  }

  // ─── CATEGORY FILTER ────────────────────────

  function switchCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.ftg-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.category === cat);
    });
    renderStyles(currentText);
  }

  // ─── VIRAL SECTION ──────────────────────────

  function toggleViral() {
    const open = viralContent.style.display !== 'none';
    viralContent.style.display = open ? 'none' : 'flex';
    viralToggle.classList.toggle('open', !open);
  }

  // ─── BIO GENERATOR ─────────────────────────

  const BIO_TEMPLATES = [
    (n,p,h) => `✨ ${n} | ${p} | ${h} lover ✨`,
    (n,p,h) => `🔥 ${mapText(n, MAPS.bold)} 🔥\n${p} | Passionate about ${h}`,
    (n,p,h) => `♛ ${mapText(n, MAPS.boldScript)} ♛\n─── ${p} ───\n⭐ ${h} enthusiast`,
    (n,p,h) => `【${mapText(n, MAPS.bold)}】\n${p} by day 🌞\n${h} by night 🌙`,
    (n,p,h) => `༺ ${mapText(n, MAPS.fraktur)} ༻\n☆ ${p}\n☆ ${h}\n☆ Living my best life`,
    (n,p,h) => `🌟 ${n} 🌟\n💼 ${p}\n🎯 ${h}\n📍 Follow for more!`,
    (n,p,h) => `⚡ ${mapText(n, MAPS.sansBold)} ⚡\n${p} | ${h} | Dream chaser 🚀`,
    (n,p,h) => `❤️ ${n}\n✦ ${p} ✦ ${h}\n✦ Creating magic daily ✦`,
    (n,p,h) => `┃ ${mapText(n, MAPS.doubleStruck)}\n┃ ${p}\n┃ Fueled by ${h}\n┃ Never stop creating 💡`,
    (n,p,h) => `🦋 ${mapText(n, MAPS.script)} 🦋\n❝ ${p} who loves ${h} ❞`,
  ];

  function generateBios() {
    const name = $('ftg-bio-name').value.trim();
    const prof = $('ftg-bio-profession').value.trim();
    const hobby = $('ftg-bio-hobby').value.trim();
    const results = $('ftg-bio-results');

    if (!name) { showToast('⚠️ Enter your name'); return; }

    results.innerHTML = '';
    const frag = document.createDocumentFragment();

    BIO_TEMPLATES.forEach(tmpl => {
      const bio = tmpl(name, prof || 'Creator', hobby || 'Life');
      const item = document.createElement('div');
      item.className = 'ftg-modal-result-item';
      item.textContent = bio;
      item.style.whiteSpace = 'pre-line';
      item.addEventListener('click', async () => {
        await copyToClipboard(bio);
        showToast('✅ Bio copied!');
        item.classList.add('copied');
        setTimeout(() => item.classList.remove('copied'), 600);
      });
      frag.appendChild(item);
    });

    results.appendChild(frag);
  }

  // ─── NICKNAME GENERATOR ─────────────────────

  function generateNicknames() {
    const name = $('ftg-nick-name').value.trim();
    const results = $('ftg-nick-results');

    if (!name) { showToast('⚠️ Enter a name'); return; }

    const nickStyles = [
      n => `✦ ${mapText(n, MAPS.boldScript)} ✦`,
      n => `『${mapText(n, MAPS.bold)}』`,
      n => `乂 ${n} 乂`,
      n => `☆ ${mapText(n, MAPS.fraktur)} ☆`,
      n => `◤ ${n} ◢`,
      n => `╰☆${mapText(n, MAPS.italic)}☆╮`,
      n => `⚡${mapText(n, MAPS.sansBold)}⚡`,
      n => `☬ ${mapText(n, MAPS.boldFraktur)} ☬`,
      n => `✰ ${mapText(n, MAPS.doubleStruck)} ✰`,
      n => `ᚙ ${mapText(n, MAPS.smallCaps)} ᚙ`,
      n => `×${addCombining(n, '\u0336')}×`,
      n => `【${mapText(n, MAPS.monospace)}】`,
    ];

    results.innerHTML = '';
    const frag = document.createDocumentFragment();

    nickStyles.forEach(fn => {
      const nick = fn(name);
      const item = document.createElement('div');
      item.className = 'ftg-modal-result-item';
      item.textContent = nick;
      item.addEventListener('click', async () => {
        await copyToClipboard(nick);
        showToast('✅ Nickname copied!');
        item.classList.add('copied');
        setTimeout(() => item.classList.remove('copied'), 600);
      });
      frag.appendChild(item);
    });

    results.appendChild(frag);
  }

  // ─── EMOJI COMBINER ─────────────────────────

  function generateEmojiCombinations() {
    const text = $('ftg-emoji-text').value.trim();
    const results = $('ftg-emoji-results');

    if (!text) { showToast('⚠️ Enter some text'); return; }

    const combos = [
      [...text].join(` ${selectedEmoji} `),
      `${selectedEmoji} ${text} ${selectedEmoji}`,
      [...text].join(selectedEmoji),
      `${selectedEmoji}${selectedEmoji}${selectedEmoji} ${text} ${selectedEmoji}${selectedEmoji}${selectedEmoji}`,
      [...text].map((c, i) => i % 2 === 0 ? c : selectedEmoji).join(''),
    ];

    results.innerHTML = '';
    const frag = document.createDocumentFragment();

    combos.forEach(combo => {
      const item = document.createElement('div');
      item.className = 'ftg-modal-result-item';
      item.textContent = combo;
      item.addEventListener('click', async () => {
        await copyToClipboard(combo);
        showToast('✅ Copied!');
        item.classList.add('copied');
        setTimeout(() => item.classList.remove('copied'), 600);
      });
      frag.appendChild(item);
    });

    results.appendChild(frag);
  }

  // ─── MODAL MANAGEMENT ──────────────────────

  function openModal(name) {
    const modal = $(`ftg-modal-${name}`);
    if (modal) modal.style.display = 'flex';
  }

  function closeModal(name) {
    const modal = $(`ftg-modal-${name}`);
    if (modal) modal.style.display = 'none';
  }

  // ─── EVENT LISTENERS ────────────────────────

  function init() {
    // Text input
    textInput.addEventListener('input', (e) => {
      const val = e.target.value;
      clearBtn.classList.toggle('visible', val.length > 0);
      debouncedRender(val);
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
      textInput.value = '';
      textInput.focus();
      clearBtn.classList.remove('visible');
      renderStyles('');
    });

    // Search
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderStyles(currentText);
    });

    // Tabs
    document.querySelectorAll('.ftg-tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Category filters
    document.querySelectorAll('.ftg-chip').forEach(chip => {
      chip.addEventListener('click', () => switchCategory(chip.dataset.category));
    });

    // Copy all
    copyAllBtn.addEventListener('click', copyAll);

    // Clear history
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Viral toggle
    viralToggle.addEventListener('click', toggleViral);

    // Viral cards → open modals
    document.querySelectorAll('.ftg-viral-card').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.tool));
    });

    // Modal close buttons
    document.querySelectorAll('.ftg-modal-close').forEach(btn => {
      btn.addEventListener('click', () => closeModal(btn.dataset.close));
    });

    // Modal overlays close on click
    document.querySelectorAll('.ftg-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Bio generator
    $('ftg-bio-generate').addEventListener('click', generateBios);

    // Nickname generator
    $('ftg-nick-generate').addEventListener('click', generateNicknames);

    // Emoji picker
    document.querySelectorAll('.ftg-emoji-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.ftg-emoji-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedEmoji = opt.dataset.emoji;
        // Auto-regenerate if text exists
        if ($('ftg-emoji-text').value.trim()) {
          generateEmojiCombinations();
        }
      });
    });

    // Emoji text input → auto generate
    $('ftg-emoji-text').addEventListener('input', () => {
      if ($('ftg-emoji-text').value.trim()) {
        generateEmojiCombinations();
      }
    });

    // Open site link (for non-<a> fallback)
    const openSite = $('ftg-open-site');
    if (openSite) {
      openSite.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          chrome.tabs.create({ url: WEBSITE_URL });
        } catch {
          window.open(WEBSITE_URL, '_blank');
        }
      });
    }

    // Focus text input on load
    textInput.focus();

    // Initial render
    renderStyles('');
  }

  // ─── BOOT ───────────────────────────────────

  loadStorage().then(init);

})();
