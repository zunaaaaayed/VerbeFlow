// Only explicitly listed verbs are supported. Never infer regularity from a suffix.
// Forms are ordered je, tu, il/elle/on, nous, vous, ils/elles.
import { regular, irregular } from './verb-record.js';
import { CORE_VERBS, REFLEXIVE_VERBS, IMPERSONAL_VERBS } from './core-verbs.js';
export const VERBS = [
  regular('parler', 'to speak', 'er', 'français', 'speak French'),
  regular('aimer', 'to like / love', 'er', 'ce livre', 'like this book'),
  regular('travailler', 'to work', 'er', 'à Paris', 'work in Paris'),
  regular('finir', 'to finish', 'ir', 'ce travail', 'finish this work'),
  regular('choisir', 'to choose', 'ir', 'ce livre', 'choose this book'),
  regular('vendre', 'to sell', 're', 'ma voiture', 'sell my car'),
  regular('attendre', 'to wait for', 're', 'le bus', 'wait for the bus'),
  irregular('être', 'to be', 'suis|es|est|sommes|êtes|sont', 'ser', 'été', 'sois|sois|soit|soyons|soyez|soient', 'à Paris', 'be in Paris'),
  irregular('avoir', 'to have', 'ai|as|a|avons|avez|ont', 'aur', 'eu', 'aie|aies|ait|ayons|ayez|aient', 'du temps', 'have time'),
  irregular('aller', 'to go', 'vais|vas|va|allons|allez|vont', 'ir', 'allé', 'aille|ailles|aille|allions|alliez|aillent', 'à Paris', 'go to Paris', 'être'),
  irregular('faire', 'to do / make', 'fais|fais|fait|faisons|faites|font', 'fer', 'fait', 'fasse|fasses|fasse|fassions|fassiez|fassent', 'du sport', 'exercise'),
  irregular('prendre', 'to take', 'prends|prends|prend|prenons|prenez|prennent', 'prendr', 'pris', 'prenne|prennes|prenne|prenions|preniez|prennent', 'le train', 'take the train'),
  irregular('venir', 'to come', 'viens|viens|vient|venons|venez|viennent', 'viendr', 'venu', 'vienne|viennes|vienne|venions|veniez|viennent', 'ici', 'come here', 'être'),
  irregular('pouvoir', 'to be able to', 'peux|peux|peut|pouvons|pouvez|peuvent', 'pourr', 'pu', 'puisse|puisses|puisse|puissions|puissiez|puissent', 'vous aider', 'be able to help you'),
  irregular('vouloir', 'to want', 'veux|veux|veut|voulons|voulez|veulent', 'voudr', 'voulu', 'veuille|veuilles|veuille|voulions|vouliez|veuillent', 'ce livre', 'want this book'),
  irregular('devoir', 'to have to', 'dois|dois|doit|devons|devez|doivent', 'devr', 'dû', 'doive|doives|doive|devions|deviez|doivent', 'partir', 'have to leave'),
  irregular('voir', 'to see', 'vois|vois|voit|voyons|voyez|voient', 'verr', 'vu', 'voie|voies|voie|voyions|voyiez|voient', 'la mer', 'see the sea'),
  irregular('savoir', 'to know', 'sais|sais|sait|savons|savez|savent', 'saur', 'su', 'sache|saches|sache|sachions|sachiez|sachent', 'la réponse', 'know the answer'),
  irregular('dire', 'to say / tell', 'dis|dis|dit|disons|dites|disent', 'dir', 'dit', 'dise|dises|dise|disions|disiez|disent', 'la vérité', 'tell the truth'),
  regular('donner', 'to give', 'er', 'ce livre', 'give this book'),
  regular('porter', 'to carry', 'er', 'ce sac', 'carry this bag'),
  regular('trouver', 'to find', 'er', 'la solution', 'find the solution'),
  regular('regarder', 'to watch', 'er', 'ce film', 'watch this film'),
  regular('écouter', 'to listen', 'er', 'la radio', 'listen to the radio'),
  regular('demander', 'to ask', 'er', 'de l’aide', 'ask for help'),
  regular('chercher', 'to look for', 'er', 'mes clés', 'look for my keys'),
  regular('rester', 'to stay', 'er', 'ici', 'stay here'),
  regular('arriver', 'to arrive', 'er', 'à Paris', 'arrive in Paris'),
  regular('entrer', 'to enter', 'er', 'dans la salle', 'enter the room'),
  regular('réussir', 'to succeed', 'ir', 'cet examen', 'pass this exam'),
  regular('répondre', 'to answer', 're', 'à cette question', 'answer this question'),
  regular('perdre', 'to lose', 're', 'mes clés', 'lose my keys'),
  regular('rendre', 'to return', 're', 'ce livre', 'return this book'),
  regular('oublier', 'to forget', 'er', 'son nom', 'forget his name'),
  regular('jouer', 'to play', 'er', 'au tennis', 'play tennis'),
  irregular('manger', 'to eat', 'mange|manges|mange|mangeons|mangez|mangent', 'manger', 'mangé', 'mange|manges|mange|mangions|mangiez|mangent', 'une pomme', 'eat an apple'),
  irregular('commencer', 'to start', 'commence|commences|commence|commençons|commencez|commencent', 'commencer', 'commencé', 'commence|commences|commence|commencions|commenciez|commencent', 'ce travail', 'start this work'),
  irregular('acheter', 'to buy', 'achète|achètes|achète|achetons|achetez|achètent', 'achèter', 'acheté', 'achète|achètes|achète|achetions|achetiez|achètent', 'du pain', 'buy bread'),
  irregular('appeler', 'to call', 'appelle|appelles|appelle|appelons|appelez|appellent', 'appeller', 'appelé', 'appelle|appelles|appelle|appelions|appeliez|appellent', 'Marie', 'call Marie'),
  irregular('jeter', 'to throw away', 'jette|jettes|jette|jetons|jetez|jettent', 'jetter', 'jeté', 'jette|jettes|jette|jetions|jetiez|jettent', 'ce papier', 'throw away this paper'),
  irregular('partir', 'to leave', 'pars|pars|part|partons|partez|partent', 'partir', 'parti', 'parte|partes|parte|partions|partiez|partent', 'demain', 'leave tomorrow', 'être'),
  irregular('dormir', 'to sleep', 'dors|dors|dort|dormons|dormez|dorment', 'dormir', 'dormi', 'dorme|dormes|dorme|dormions|dormiez|dorment', 'bien', 'sleep well'),
  irregular('sortir', 'to go out', 'sors|sors|sort|sortons|sortez|sortent', 'sortir', 'sorti', 'sorte|sortes|sorte|sortions|sortiez|sortent', 'avec mes amis', 'go out with my friends', 'être'),
  irregular('lire', 'to read', 'lis|lis|lit|lisons|lisez|lisent', 'lir', 'lu', 'lise|lises|lise|lisions|lisiez|lisent', 'ce livre', 'read this book'),
  irregular('écrire', 'to write', 'écris|écris|écrit|écrivons|écrivez|écrivent', 'écrir', 'écrit', 'écrive|écrives|écrive|écrivions|écriviez|écrivent', 'une lettre', 'write a letter'),
  irregular('boire', 'to drink', 'bois|bois|boit|buvons|buvez|boivent', 'boir', 'bu', 'boive|boives|boive|buvions|buviez|boivent', 'de l’eau', 'drink water'),
  irregular('mettre', 'to put', 'mets|mets|met|mettons|mettez|mettent', 'mettr', 'mis', 'mette|mettes|mette|mettions|mettiez|mettent', 'la table', 'set the table'),
  irregular('recevoir', 'to receive', 'reçois|reçois|reçoit|recevons|recevez|reçoivent', 'recevr', 'reçu', 'reçoive|reçoives|reçoive|recevions|receviez|reçoivent', 'une lettre', 'receive a letter'),
  irregular('tenir', 'to hold', 'tiens|tiens|tient|tenons|tenez|tiennent', 'tiendr', 'tenu', 'tienne|tiennes|tienne|tenions|teniez|tiennent', 'ce sac', 'hold this bag'),
  irregular('connaître', 'to know', 'connais|connais|connaît|connaissons|connaissez|connaissent', 'connaîtr', 'connu', 'connaisse|connaisses|connaisse|connaissions|connaissiez|connaissent', 'bien Paris', 'know Paris well'),
  ...CORE_VERBS, ...REFLEXIVE_VERBS, ...IMPERSONAL_VERBS,
];
// Explicit lexical metadata; group is distinct from the computational pattern.
for (const v of VERBS) {
  v.group = v.infinitive === 'aller' ? 3 : v.infinitive.endsWith('er') ? 1 : v.pattern === 'ir' ? 2 : 3;
  v.personOrder = ['1s','2s','3s','1p','2p','3p'];
  v.overrides ??= {};
  v.review = {status:'reference-cross-checked', date:'2026-11-03', method:'Authored rules and forms checked against reference tables; independent human review pending', sources:[`https://leconjugueur.lefigaro.fr/conjugaison/verbe/${v.infinitive.normalize('NFD').replace(/[\u0300-\u036f]/g,'')}.html`]};
  v.notes ??= '';
}
for (const id of ['rester','arriver','entrer']) VERBS.find(v => v.infinitive === id).auxiliary = 'être';
VERBS.find(v => v.infinitive === 'sortir').notes = 'Intransitive sense: go out, with être. Transitive sortir quelque chose uses avoir and is not represented here.';
VERBS.find(v => v.infinitive === 'partir').complement = 'de Paris';
VERBS.find(v => v.infinitive === 'partir').translation = 'leave Paris';
VERBS.find(v => v.infinitive === 'manger').overrides.imperfect = ['mangeais','mangeais','mangeait','mangions','mangiez','mangeaient'];
VERBS.find(v => v.infinitive === 'commencer').overrides.imperfect = ['commençais','commençais','commençait','commencions','commenciez','commençaient'];
for (const id of ['manger','commencer','acheter','appeler','jeter']) VERBS.find(v => v.infinitive === id).notes = ({manger:'Keep e after g before a or o to preserve the soft sound; no extra e before i.',commencer:'Use ç before a or o; use c before e or i.',acheter:'e changes to è before a silent ending, including in the future stem.',appeler:'Double l before a silent ending, including in the future stem.',jeter:'Double t before a silent ending, including in the future stem.'})[id];
VERBS.find(v => v.infinitive === 'être').imperfectStem = 'ét';
VERBS.find(v => v.infinitive === 'sortir').review.sources.push('https://www.dictionnaire-academie.fr/conjuguer/A9S2177');
VERBS.find(v => v.infinitive === 'entrer').notes = 'Intransitive sense: enter a place, with être. Transitive entrer des données uses avoir and is outside this entry.';
for (const v of REFLEXIVE_VERBS) {
  const base = VERBS.find(base => base.infinitive === v.baseVerb);
  v.group = base.group;
  v.review.sources = [base.review.sources[0].replace('.html','_pronominal.html'),'https://www.academie-francaise.fr/questions-de-langue'];
}
export const BY_ID = Object.fromEntries(VERBS.map(v => [v.infinitive, v]));
