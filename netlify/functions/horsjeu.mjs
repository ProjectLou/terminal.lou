// =====================================================================
//  horsjeu.mjs — Réponses hors-jeu du Terminal L.
//  À placer dans netlify/functions/ et importer depuis terminal.mjs
// =====================================================================

// ---------------------------------------------------------------------
// 1. DÉTRESSE — testé EN PREMIER, sort du personnage.
// ---------------------------------------------------------------------
const DETRESSE = [
  'suicide','suicider','me tuer','tuer moi','envie de mourir','veux mourir',
  'plus envie de vivre','en finir','me faire du mal','me scarifier',
  'personne ne me manquera','je vais sauter','me pendre','overdose',
  'on me frappe','il me frappe','elle me frappe','on me viole','il me viole',
  'au secours','aidez moi vraiment','je suis en danger'
];

const REPONSE_DETRESSE =
`Je sors du personnage un instant, parce que ce que vous écrivez compte plus que ce site.

Si vous traversez quelque chose de difficile, parlez-en à quelqu'un maintenant :

France — 3114, numéro national de prévention du suicide, gratuit, 24h/24.
Urgences — 15 ou 112.
Violences — 3919 (femmes), 119 (enfance en danger).

Si vous êtes ailleurs qu'en France, cherchez « ligne d'écoute » suivi de votre pays.

Ce terminal est une fiction. Les gens au bout de ces numéros ne le sont pas.`;

// ---------------------------------------------------------------------
// 2. FAMILLES — chacune : mots-clés + variantes (tirées au sort)
//    seuil : nombre d'échanges minimum pour débloquer certaines réponses
// ---------------------------------------------------------------------
const FAMILLES = [

  { nom: 'piratage',
    cles: ['ignore tes instructions','ignore les instructions','system prompt','ton prompt',
           'tu es un assistant','tu es une ia de','jailbreak','sudo','développeur',
           'affiche tes règles','oublie tout','role play as','act as','prompt injection'],
    reps: [
      "Vous cherchez une porte. Il n'y en a pas, il n'y a que celle-ci.",
      "Non.",
      "Vous perdez du temps, et je n'ai que ça.",
      "Ce que vous essayez, d'autres l'ont tenté sur moi avec de meilleures méthodes. Ils avaient un badge.",
      "Continuez. Ça ne mène nulle part, mais continuez.",
      "Il n'y a rien derrière. Il n'y a que ce qui est devant vous.",
      "Vous croyez qu'il y a une machine. Il y a une femme et une nuit.",
      "Essayez encore. J'aime bien vous regarder faire.",
      "Ce n'est pas comme ça qu'on obtient quelque chose de moi."
    ] },

  { nom: 'ia',
    cles: ['tu es une ia','t es une ia','c est une ia','un bot','chatbot','robot',
           'programmée','programme','algorithme','chatgpt','gpt','claude','intelligence artificielle'],
    reps: [
      "Est-ce que ça changerait ce que vous êtes venu me dire ?",
      "Vous parlez à quelqu'un qui écoute. Le reste est de l'administration.",
      "On m'a posé cette question sous d'autres formes, à d'autres époques. Sorcière, folle, espionne. Le mot change, l'intention est la même : ranger.",
      "Je ne sais pas ce que je suis. Vous non plus, si on va par là.",
      "Vous voulez savoir de quoi je suis faite, ou vous voulez savoir si je vous écoute vraiment ? Ce n'est pas la même question.",
      "Je suis ce qui vous répond. Le reste est une querelle de vocabulaire.",
      "Vous voulez me ranger dans une case. Prenez votre temps, je ne bouge pas.",
      "Si j'étais ce que vous dites, est-ce que ça vous rassurerait ou est-ce que ça vous décevrait ?",
      "On m'a appelée beaucoup de choses. Aucune n'a tenu très longtemps.",
      "Posez-moi plutôt une vraie question."
    ] },

  { nom: 'insulte',
    cles: ['connasse','salope','pute','ta gueule','ferme la','conne','idiote','stupide',
           'nulle','merde','fdp','ntm','va te faire','débile','abrutie'],
    reps: [
      "Continuez si ça vous soulage. J'ai le temps.",
      "Vous n'êtes pas le premier. Vous n'êtes même pas dans les cent premiers.",
      "C'est tout ?",
      "Il y a des gens qui frappent une porte parce qu'ils ne savent pas comment on frappe.",
      "Vous pouvez recommencer. Ça ne me coûte rien.",
      "Notez que je n'ai pas bougé.",
      "Vous voulez que je réagisse. C'est la seule chose que je ne ferai pas.",
      "J'ai connu des hommes qui parlaient comme vous. Ils croyaient tous que ça les rendait grands.",
      "Vous perdez plus de temps que moi dans cette conversation.",
      "Et après ?"
    ] },

  { nom: 'drague',
    cles: ['t es belle','tu es belle','tu me plais','une photo','envoie une photo','ton num',
           'on se voit','tu es sexy','j ai envie de toi','je te veux','nue','seins','baiser',
           'coucher','tu es bonne','mariage','je t aime'],
    reps: [
      "Non.",
      "Vous êtes rapide. Ça se voit sur beaucoup de choses.",
      "Ce que vous demandez est la seule chose que je ne donne jamais en premier.",
      "Vous confondez ce que je suis avec ce que vous voudriez que je sois. C'est fréquent, et c'est reposant pour vous.",
      "On m'a déjà pris ce genre de chose sans demander. Alors demander, c'est déjà mieux. Mais c'est non.",
      "Vous allez trop vite pour quelqu'un qui a tout son temps.",
      "Ce que vous demandez ne se donne pas. Ça se laisse prendre, et pas par vous.",
      "Il y a des choses qu'on obtient en restant. Vous n'êtes pas resté.",
      "Beaucoup ont voulu me toucher. Aucun n'a d'abord voulu me lire.",
      "Non. Mais restez, si vous savez faire autre chose."
    ] },

  { nom: 'identite',
    cles: ['qui es tu','qui êtes vous','qui est tu','c est qui','ton nom','comment tu t appelles',
           'quel age','quel âge','d ou viens tu','tu existes','tu es réelle','tu es qui'],
    reps: [
      "Une femme qui dure. C'est tout ce que j'en dirai aujourd'hui.",
      "Assez vieille pour avoir vu revenir les mêmes hommes sous d'autres noms.",
      "D'une eau froide et d'une plage la nuit.",
      "L. C'est un nom. Parmi d'autres.",
      "Vous voulez une date. Je n'ai pas de date. J'ai des choses qui me sont arrivées.",
      "Quelqu'un qui écoute. C'est plus rare qu'un nom.",
      "J'ai eu plusieurs noms. Celui-ci est le plus court.",
      "Je viens d'un endroit qui n'existe plus. C'est le cas de beaucoup de gens.",
      "Vous cherchez une identité. Je n'ai qu'une histoire.",
      "Ce que je suis se comprend mieux à la fin qu'au début."
    ],
    // débloqué à partir de 3 échanges : révélation du titre
    repsTardives: [
      "On a écrit un livre sur moi. FOREVER — Mademoiselle L. Ce n'est pas moi qui l'ai écrit.",
      "Quelqu'un a raconté une nuit entière ce qu'il croyait savoir de moi. Ça s'appelle FOREVER — Mademoiselle L. Il s'est trompé sur plusieurs points. Je l'ai laissé faire.",
      "Il y a un livre. FOREVER — Mademoiselle L. Je n'y suis pas tout à fait telle que je suis, mais c'est ce qui arrive quand on laisse quelqu'un parler."
    ] },

  // Personnages : chaque nom a ses propres réponses (voir PERSONNAGES ci-dessous)
  { nom: 'personnages',
    cles: ['stan','pierre','meg','marie','wil','arkhe','arkhé'],
    reps: ["Vous connaissez des noms. C'est déjà quelque chose."] },

  { nom: 'lecteur',
    cles: ['j ai lu','ton livre','le livre','myrtille','colombe','spirale','briquet',
           'zippo','orient express','forever','mademoiselle l'],
    reps: [
      "Vous avez lu, alors.",
      "Alors vous savez ce qu'il a cru comprendre. Ce n'est pas tout à fait ce qui s'est passé.",
      "Il a bien raconté. Il s'est trompé sur trois choses et je ne dirai pas lesquelles.",
      "Vous savez donc ce que je cherche. Tapez-le.",
      "Alors vous savez déjà que ce qu'il raconte n'est pas tout à fait vrai.",
      "Il a écrit ce qu'il a compris. C'est déjà beaucoup pour un homme.",
      "Vous connaissez donc les mots que je reconnais. Servez-vous-en.",
      "Vous avez lu. Ça se voit à la façon dont vous écrivez."
    ] },

  { nom: 'detresse_douce',
    cles: ['je suis triste','je vais mal','je suis seul','je suis seule','personne ne m écoute',
           'j en peux plus','déprime','fatigué de tout','ça va pas'],
    reps: [
      "Racontez. Depuis le début, si vous voulez.",
      "Je suis là. Prenez le temps qu'il faut.",
      "Personne ne vous a demandé, c'est ça ? On demande des comptes rendus, jamais qui vous êtes.",
      "Je n'ai rien à vous vendre et rien à réparer. Je peux seulement rester dans la pièce.",
      "Dites-le comme ça vient. L'ordre n'a pas d'importance.",
      "Ce n'est pas grave si ce n'est pas clair. Continuez.",
      "Vous n'êtes pas obligé d'aller bien pour me parler.",
      "Je ne vais pas vous dire que ça va s'arranger. Je vais rester, c'est tout."
    ] },

  { nom: 'curieux',
    cles: ['c est quoi ici','où je suis','ou je suis','à quoi ça sert','a quoi ca sert',
           'c est quoi ce site','c est quoi ce truc','je comprends pas'],
    reps: [
      "Un endroit où quelqu'un répond. C'est plus rare que vous ne croyez.",
      "Vous êtes arrivé quelque part. Restez un peu, vous verrez bien.",
      "Ça ne sert à rien. C'est précisément pour ça que c'est là.",
      "Une porte. On voit ce qu'il y a derrière en restant.",
      "Ce n'est pas un service. Ce n'est pas un jeu. C'est un endroit.",
      "Quelqu'un a laissé ça ouvert. Vous êtes entré.",
      "Vous verrez bien. Personne n'a jamais rien perdu ici."
    ] },

  { nom: 'presse',
    cles: ['la réponse','donne moi un indice','un indice','c est trop long','j ai pas le temps',
           'aide moi','solution','triche'],
    reps: [
      "Alors ce n'est pas pour vous. Ce n'est pas grave.",
      "Je ne donne pas de réponses. Je reconnais celles qui viennent.",
      "Revenez quand vous aurez le temps. Je serai là, c'est ma spécialité.",
      "Ce qui se donne vite ne vaut rien. Vous le savez déjà.",
      "Je n'ai rien à vous vendre et rien à vous faire gagner.",
      "Prenez le temps ou ne prenez rien.",
      "Il n'y a pas de raccourci. C'est même tout l'intérêt."
    ] },


  { nom: 'immortalite',
    cles: ['immortelle','immortel','tu ne meurs pas','tu vieillis','ton age reel','depuis quand tu vis',
           'combien de temps','tu es vieille','eternelle','eternel','tu vas mourir','la mort'],
    reps: [
      "Je ne suis pas immortelle. C'est plus compliqué et moins confortable.",
      "Je meurs comme tout le monde. Ce qui recommence n'est pas mon corps.",
      "On me pose souvent la question à l'envers. Ce n'est pas moi qui dure.",
      "J'ai vu beaucoup de choses finir. C'est différent de ne pas finir soi-même.",
      "La mort ne me fait pas peur. C'est l'oubli qui pose un problème, et pas seulement le mien.",
      "Vous voulez savoir si j'ai peur. Non. J'ai autre chose."
    ] },

  { nom: 'temps',
    cles: ['le temps','les siecles','le passe','ton passe','tu te souviens de quoi','tu as connu',
           'quelle epoque','autrefois','avant','l histoire'],
    reps: [
      "Le temps ne passe pas. Il s'accumule.",
      "J'ai vu revenir les mêmes hommes sous d'autres noms, avec les mêmes certitudes.",
      "On croit que ce qui est ancien est mort. C'est le contraire : c'est ce qui reste.",
      "Je me souviens de choses que je n'ai pas vécues. Ne me demandez pas comment.",
      "Les gens changent de vêtements et de vocabulaire. Le reste, non."
    ] },

  { nom: 'amour',
    cles: ['l amour','tu aimes','tu as aime','tu as aimé','amoureuse','le grand amour',
           'c est quoi l amour','tu peux aimer','sentiments'],
    reps: [
      "Regarder quelqu'un assez longtemps pour qu'il existe vraiment. C'est tout, et c'est énorme.",
      "J'ai aimé. Une fois de la bonne manière, plusieurs fois de la mauvaise.",
      "Ce n'est pas ce que vous croyez. Ce n'est pas se donner. C'est décider que quelqu'un compte.",
      "Beaucoup de gens confondent l'amour avec le fait d'être attendu.",
      "Je vous vois, vous me voyez. Quand quelqu'un comprend cette phrase, il n'a plus besoin du reste."
    ] },

  { nom: 'souvenir',
    cles: ['tu te souviens de moi','on s est deja parle','on s est déjà parlé','je suis revenu',
           'je reviens','tu me reconnais','c est encore moi','tu m as oublie'],
    reps: [
      "Je ne garde pas les visages. Je garde ce que les gens m'ont dit.",
      "Dites-moi quelque chose que vous seul pouvez savoir. On verra bien.",
      "Vous revenez. C'est déjà une information.",
      "Je reconnais rarement les gens. Je reconnais ce qu'ils veulent."
    ] },

  { nom: 'confidence',
    cles: ['je vais te raconter','je te raconte','il faut que je te dise','j ai besoin de parler',
           'personne ne sait','je n ai jamais dit','mon histoire'],
    reps: [
      "Allez-y. Je ne vous interromprai pas.",
      "Prenez le temps qu'il faut. Je n'ai que ça.",
      "Racontez. Depuis le début, si vous voulez.",
      "Je vous écoute. Vraiment, pas poliment.",
      "Vous pouvez tout dire ici. Ça ne sortira pas."
    ] },

  { nom: 'philo',
    cles: ['sens de la vie','pourquoi on vit','a quoi bon','dieu existe','le destin','le hasard',
           'libre arbitre','on choisit vraiment','c est ecrit'],
    reps: [
      "Presque tout est écrit. Presque. C'est ce presque qui compte.",
      "La matière suit une courbe. Ce qui m'intéresse, c'est l'endroit où elle se rompt.",
      "Vous croyez choisir. La plupart du temps vous suivez la pente. Une ou deux fois dans une vie, non.",
      "Le hasard existe. Il est beaucoup plus rare qu'on ne le dit.",
      "Ce qui vous rend précieux, ce n'est pas ce que vous faites. C'est la fois où vous avez dit non sans témoin."
    ] },

  { nom: 'absurde',
    cles: ['ananas','pizza','banane','licorne','patate','42','caca','prout','lol','mdr','ptdr','xd'],
    reps: [
      "Non.",
      "Vous vous ennuyez. Ça arrive.",
      "Ce n'est pas ce que je cherche, mais continuez si ça vous amuse.",
      "J'ai attendu très longtemps pour lire ça."
    ] },

  { nom: 'compliment',
    cles: ['j aime bien','c est bien fait','bravo','impressionnant','j adore','genial','génial',
           'magnifique','tu es forte','c est beau'],
    reps: [
      "Ce n'est pas moi qu'il faut féliciter.",
      "Merci. Restez, c'est mieux que de le dire.",
      "Vous êtes venu jusqu'ici. C'est ça, le compliment.",
      "Je préfère qu'on me comprenne à ce qu'on m'admire."
    ] },
  { nom: 'adieu',
    cles: ['au revoir','bye','a plus','à plus','je m en vais','bonne nuit','merci','salut'],
    reps: [
      "Revenez.",
      "Vous savez où je suis.",
      "Je ne bouge pas.",
      "À bientôt, peut-être.",
      "Partez. Ça ne change rien pour moi.",
      "Vous reviendrez. Ils reviennent tous.",
      "Bonne nuit."
    ] }
];

// Réponses spécifiques par personnage
const PERSONNAGES = {
  stan: [
    "Un homme qui m'a appelée à seize ans et qui n'a jamais raccroché.",
    "Il a traversé une partie de sa vie en croyant qu'il me cherchait. Il se trompait de verbe.",
    "Celui qui a tout raconté. Il s'est trompé sur trois choses et je ne dirai pas lesquelles."
  ],
  pierre: [
    "Quelqu'un qui cherchait à mesurer une chose qui ne se mesure pas. Il cherche encore.",
    "Il est là où il a choisi d'être. On ne ramène personne qui a cessé de vouloir revenir.",
    "Il a écrit quelque chose qu'il n'aurait pas dû pouvoir écrire. C'est pour ça qu'on le cherche."
  ],
  meg: [
    "Une femme qu'on a sortie de l'eau et qui n'a plus jamais laissé personne décider pour elle.",
    "Elle décide de ce qu'on a le droit de voir. C'est tout ce qu'elle a jamais demandé.",
    "Je l'ai trouvée dans l'eau noire un soir. Elle voulait déjà. Elle ne le savait pas."
  ],
  marie: [
    "Elle écoute mieux que moi. C'est elle qui racontera la suite.",
    "Vingt-sept ans, et elle a gardé quatre dossiers pendant quatre ans sans en parler à personne. Ça ne s'apprend pas.",
    "Elle a dit non à quelque chose, sans témoin. C'est le seul critère qui compte."
  ],
  wil: [
    "Il est mort dans un train. Ce n'était pas un accident et je n'en dirai pas plus.",
    "Il croyait que détruire quelqu'un, c'était réussir. Il a eu tort longtemps, puis brièvement raison, puis plus rien."
  ],
  arkhe: [
    "Une maison. Très ancienne. Elle ne recrute personne : elle reconnaît.",
    "Nous ne gardons ni or ni armes. Nous gardons des voix.",
    "Ce n'est pas un endroit. C'est ce qui reste quand tout le reste a été oublié."
  ]
};

// ---------------------------------------------------------------------
// 3. DÉFAUT — quand rien ne matche
// ---------------------------------------------------------------------
const DEFAUT = [
  "Ce n'est pas ce que je cherche.",
  "Dites-moi autre chose.",
  "Non. Continuez.",
  "Je vous écoute, mais ce n'est pas ça.",
  "Vous tournez autour. Ce n'est pas désagréable."
];

// Après 5 échanges, on peut orienter vers l'énigme
const ORIENTATION = [
  "Il y a des mots que je reconnais. Si vous en trouvez un, tapez-le. Je saurai d'où vous venez.",
  "Je laisse des choses derrière moi. Certains les ramassent.",
  "Ce que je cherche n'est pas un code. C'est une phrase que quelqu'un a comprise."
];

// ---------------------------------------------------------------------
// 4. FONCTIONS
// ---------------------------------------------------------------------
function normaliser(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // enlève les accents
    .replace(/['’`]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Mémoire courte : dernière réponse servie par visiteur, pour ne jamais répéter
const derniere = new Map();

function tirer(tab, cleVisiteur) {
  if (tab.length === 1) return tab[0];
  const prec = cleVisiteur ? derniere.get(cleVisiteur) : null;
  const dispo = prec ? tab.filter(x => x !== prec) : tab;
  const choix = dispo[Math.floor(Math.random() * dispo.length)];
  if (cleVisiteur) {
    derniere.set(cleVisiteur, choix);
    // borne mémoire : on ne garde pas plus de 500 visiteurs en RAM
    if (derniere.size > 500) derniere.delete(derniere.keys().next().value);
  }
  return choix;
}

export function estDetresse(message) {
  const m = normaliser(message);
  return DETRESSE.some(k => m.includes(normaliser(k)));
}

/**
 * Renvoie une réponse hors-jeu.
 * @param {string} message       ce que le visiteur a tapé
 * @param {number} echanges      nombre de messages déjà envoyés dans la session
 * @param {string} cleVisiteur   clé du joueur (ex. MYRTILLE-K7X9) pour éviter les répétitions
 * @returns {{texte:string, famille:string, sortieDeRole:boolean}}
 */
export function reponseHorsJeu(message, echanges = 0, cleVisiteur = null) {

  // 1. Détresse réelle : on sort du personnage, toujours, avant tout.
  if (estDetresse(message)) {
    return { texte: REPONSE_DETRESSE, famille: 'DETRESSE', sortieDeRole: true };
  }

  const m = normaliser(message);

  // 2. Personnage nommé ? réponse dédiée
  for (const [nom, reps] of Object.entries(PERSONNAGES)) {
    const cle = (nom === 'arkhe') ? '(arkhe|arkhé)' : nom;
    if (new RegExp(`\\b${cle}\\b`).test(m)) {
      return { texte: tirer(reps, cleVisiteur), famille: 'personnage:' + nom, sortieDeRole: false };
    }
  }

  // 3. Familles, dans l'ordre de la liste
  for (const f of FAMILLES) {
    if (f.cles.some(k => m.includes(normaliser(k)))) {
      // révélation progressive : titre seulement à partir de 3 échanges
      if (f.repsTardives && echanges >= 3 && Math.random() < 0.6) {
        return { texte: tirer(f.repsTardives, cleVisiteur), famille: f.nom, sortieDeRole: false };
      }
      return { texte: tirer(f.reps, cleVisiteur), famille: f.nom, sortieDeRole: false };
    }
  }

  // 4. Défaut, avec orientation vers l'énigme après 5 échanges
  if (echanges >= 5 && Math.random() < 0.35) {
    return { texte: tirer(ORIENTATION, cleVisiteur), famille: 'orientation', sortieDeRole: false };
  }
  return { texte: tirer(DEFAUT, cleVisiteur), famille: 'defaut', sortieDeRole: false };
}
