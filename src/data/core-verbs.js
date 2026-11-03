// Curated everyday/student vocabulary. No suffix-based admission of unknown verbs.
import { regular, irregular } from './verb-record.js';
const r = (id,gloss,fr,en) => regular(id,gloss,'er',fr,en);
export const CORE_VERBS = [
 r('étudier','to study','le français','study French'),
 r('penser','to think','à mon avenir','think about my future'),
 r('passer','to spend (time)','du temps ici','spend time here'),
 r('marcher','to walk','dans le parc','walk in the park'),
 r('aider','to help','mon frère','help my brother'),
 r('utiliser','to use','ce dictionnaire','use this dictionary'),
 r('raconter','to tell (a story)','une histoire','tell a story'),
 r('montrer','to show','mon travail','show my work'),
 r('apporter','to bring','du pain','bring bread'),
 r('habiter','to live (reside)','à Lyon','live in Lyon'),
 r('visiter','to visit (a place)','ce musée','visit this museum'),
 r('déjeuner','to have lunch','avec mes amis','have lunch with my friends'),
 r('dîner','to have dinner','avec Marie','have dinner with Marie'),
 r('préparer','to prepare','le dîner','prepare dinner'),
 r('fermer','to close','la porte','close the door'),
 r('garder','to keep','ce livre','keep this book'),
 r('habiller','to dress (someone)','mon fils','dress my son'),
 r('laver','to wash','la voiture','wash the car'),
 r('coucher','to put to bed','mon fils','put my son to bed'),
 r('réveiller','to wake (someone)','mon frère','wake my brother'),
 r('tomber','to fall','par terre','fall to the ground'),
 r('quitter','to leave (a place/person)','Paris','leave Paris'),
 irregular('voyager','to travel','voyage|voyages|voyage|voyageons|voyagez|voyagent','voyager','voyagé','voyage|voyages|voyage|voyagions|voyagiez|voyagent','en train','travel by train'),
 irregular('croire','to believe','crois|crois|croit|croyons|croyez|croient','croir','cru','croie|croies|croie|croyions|croyiez|croient','cette histoire','believe this story'),
 irregular('vivre','to live','vis|vis|vit|vivons|vivez|vivent','vivr','vécu','vive|vives|vive|vivions|viviez|vivent','à Paris','live in Paris'),
 irregular('suivre','to follow','suis|suis|suit|suivons|suivez|suivent','suivr','suivi','suive|suives|suive|suivions|suiviez|suivent','ce cours','take this course'),
 irregular('rire','to laugh','ris|ris|rit|rions|riez|rient','rir','ri','rie|ries|rie|riions|riiez|rient','avec mes amis','laugh with my friends'),
 irregular('ouvrir','to open','ouvre|ouvres|ouvre|ouvrons|ouvrez|ouvrent','ouvrir','ouvert','ouvre|ouvres|ouvre|ouvrions|ouvriez|ouvrent','la fenêtre','open the window'),
 irregular('offrir','to offer / give','offre|offres|offre|offrons|offrez|offrent','offrir','offert','offre|offres|offre|offrions|offriez|offrent','un cadeau','give a gift'),
 irregular('apprendre','to learn','apprends|apprends|apprend|apprenons|apprenez|apprennent','apprendr','appris','apprenne|apprennes|apprenne|apprenions|appreniez|apprennent','le français','learn French'),
 irregular('comprendre','to understand','comprends|comprends|comprend|comprenons|comprenez|comprennent','comprendr','compris','comprenne|comprennes|comprenne|comprenions|compreniez|comprennent','cette phrase','understand this sentence'),
 irregular('conduire','to drive','conduis|conduis|conduit|conduisons|conduisez|conduisent','conduir','conduit','conduise|conduises|conduise|conduisions|conduisiez|conduisent','une voiture','drive a car'),
 irregular('traduire','to translate','traduis|traduis|traduit|traduisons|traduisez|traduisent','traduir','traduit','traduise|traduises|traduise|traduisions|traduisiez|traduisent','ce texte','translate this text'),
 irregular('envoyer','to send','envoie|envoies|envoie|envoyons|envoyez|envoient','enverr','envoyé','envoie|envoies|envoie|envoyions|envoyiez|envoient','une lettre','send a letter'),
 irregular('payer','to pay','paie|paies|paie|payons|payez|paient','paier','payé','paie|paies|paie|payions|payiez|paient','le loyer','pay the rent'),
 irregular('préférer','to prefer','préfère|préfères|préfère|préférons|préférez|préfèrent','préférer','préféré','préfère|préfères|préfère|préférions|préfériez|préfèrent','le thé','prefer tea'),
 irregular('espérer','to hope','espère|espères|espère|espérons|espérez|espèrent','espérer','espéré','espère|espères|espère|espérions|espériez|espèrent','réussir','hope to succeed'),
 irregular('lever','to raise','lève|lèves|lève|levons|levez|lèvent','lèver','levé','lève|lèves|lève|levions|leviez|lèvent','la main','raise my hand'),
 irregular('promener','to take for a walk','promène|promènes|promène|promenons|promenez|promènent','promèner','promené','promène|promènes|promène|promenions|promeniez|promènent','mon chien','walk my dog'),
 irregular('mourir','to die','meurs|meurs|meurt|mourons|mourez|meurent','mourr','mort','meure|meures|meure|mourions|mouriez|meurent','en paix','die peacefully','être'),
 irregular('naître','to be born','nais|nais|naît|naissons|naissez|naissent','naîtr','né','naisse|naisses|naisse|naissions|naissiez|naissent','à Paris','be born in Paris','être'),
 irregular('devenir','to become','deviens|deviens|devient|devenons|devenez|deviennent','deviendr','devenu','devienne|deviennes|devienne|devenions|deveniez|deviennent','médecin','become a doctor','être'),
 irregular('revenir','to come back','reviens|reviens|revient|revenons|revenez|reviennent','reviendr','revenu','revienne|reviennes|revienne|revenions|reveniez|reviennent','ici','come back here','être'),
 irregular('obtenir','to obtain','obtiens|obtiens|obtient|obtenons|obtenez|obtiennent','obtiendr','obtenu','obtienne|obtiennes|obtienne|obtenions|obteniez|obtiennent','une réponse','get an answer'),
 irregular('sentir','to smell / feel','sens|sens|sent|sentons|sentez|sentent','sentir','senti','sente|sentes|sente|sentions|sentiez|sentent','le parfum des fleurs','smell the flowers'),
 irregular('servir','to serve','sers|sers|sert|servons|servez|servent','servir','servi','serve|serves|serve|servions|serviez|servent','le dîner','serve dinner'),
 irregular('courir','to run','cours|cours|court|courons|courez|courent','courr','couru','coure|coures|coure|courions|couriez|courent','dans le parc','run in the park'),
 irregular('valoir','to be worth','vaux|vaux|vaut|valons|valez|valent','vaudr','valu','vaille|vailles|vaille|valions|valiez|vaillent','mieux que cela','be worth more than that'),
 irregular('permettre','to allow','permets|permets|permet|permettons|permettez|permettent','permettr','permis','permette|permettes|permette|permettions|permettiez|permettent','cette visite','allow this visit'),
 irregular('battre','to beat','bats|bats|bat|battons|battez|battent','battr','battu','batte|battes|batte|battions|battiez|battent','ce record','beat this record'),
];
CORE_VERBS.find(v => v.infinitive === 'tomber').auxiliary = 'être';
CORE_VERBS.find(v => v.infinitive === 'voyager').overrides = {imperfect:['voyageais','voyageais','voyageait','voyagions','voyagiez','voyageaient']};
const notes = {
 passer:'Supported transitive sense: spend time, with avoir. Passing through a place may use être.',
 voyager:'Keep e after g before a or o; omit the extra e before i.',
 préférer:'Traditional future spelling préférer- is shown; préfèrer- is also accepted under the 1990 spelling reforms.',
 espérer:'Traditional future spelling espérer- is shown; espèrer- is also accepted under the 1990 spelling reforms.',
 habiter:'The h is mute: je becomes j’habite.',
};
for (const v of CORE_VERBS) v.notes = notes[v.infinitive] ?? '';
const reflexive = (infinitive,baseVerb,meaning,complement,translation) => ({
 infinitive,baseVerb,meaning,complement,translation,pattern:'reflexive',auxiliary:'être',
 agreement:'subject',notes:'Supported reflexive use has the reflexive pronoun as its direct object: the participle agrees with the subject. A following direct object can change this rule (elle s’est lavé les mains); those constructions are not represented by these tables.',
});
export const REFLEXIVE_VERBS = [
 reflexive('se lever','lever','to get up','à sept heures','get up at seven'),
 reflexive('s’habiller','habiller','to get dressed','pour sortir','get dressed to go out'),
 reflexive('se laver','laver','to wash oneself','le matin','wash in the morning'),
 reflexive('se coucher','coucher','to go to bed','tôt','go to bed early'),
 reflexive('se réveiller','réveiller','to wake up','tôt','wake up early'),
 reflexive('se promener','promener','to go for a walk','dans le parc','go for a walk in the park'),
 reflexive('s’appeler','appeler','to be called','Alex','be called Alex'),
 reflexive('se préparer','préparer','to get ready','pour le voyage','get ready for the trip'),
];
const impersonal = (infinitive,meaning,forms,complement,translation) => ({
 infinitive,meaning,pattern:'impersonal',auxiliary:'avoir',impersonalForms:Object.fromEntries(['present','passe','imperfect','future','conditional','subjunctive'].map((t,i)=>[t,forms[i]])),complement,translation,
 notes:'Only impersonal il is represented. A dash means that person is not used in the supported sense; no personal forms are invented.',
});
export const IMPERSONAL_VERBS = [
 impersonal('falloir','to be necessary',['faut','a fallu','fallait','faudra','faudrait','faille'],'partir','be necessary to leave'),
 impersonal('pleuvoir','to rain',['pleut','a plu','pleuvait','pleuvra','pleuvrait','pleuve'],'','rain'),
];
