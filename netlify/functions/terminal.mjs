import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";
import { reponseHorsJeu, estDetresse } from "./horsjeu.mjs";

/* =====================================================================
   PALIERS
   ===================================================================== */

const PALIERS = [
  {
    n: 0,
    question: "que voit-on, quand on ne trouve pas le nord ?",
    exact: ["soi","soi meme","soimeme","moi","moi meme","moimeme","soi-meme","moi-meme",
            "le dedans","dedans","au dedans","en dedans","l interieur","interieur",
            "l intime","intime","l ame","ame","son ame","mon ame"],
    contains: ["se voir soi","se regarder soi","se retourner vers soi",
               "regarder en soi","voir en soi","au fond de soi","en soi meme","en moi meme"],
    fins: ["soi","moi","dedans","interieur","intime","ame"],
    succes: [
      "Oui.",
      "Quand plus rien ne sert de repère, il reste ce qu'on porte au-dedans.",
      "Tu as vu. Peu voient."
    ],
    echecs: [
      ["Non. Tu cherches encore dehors.",
       "Le nord est une direction. Ce que je te demande n'en est pas une.",
       "Essaie encore."],
      ["Toujours dehors.",
       "Quand la boussole ment, quand aucune étoile ne répond, où se pose le regard ?",
       "Il ne monte pas. Il ne part pas au loin. Il rentre."],
      ["Je vais être douce, une fois.",
       "Perdu, sans nord, sans carte, l'homme n'a plus qu'un seul territoire.",
       "Le sien. Dis-moi ce mot, celui qui parle de toi et de personne d'autre."],
      ["Reprends ton souffle. Reviens quand le mot sera là.",
       "Je ne pars pas. Je ne pars jamais."]
    ]
  },
  {
    n: 1,
    question: "un homme a dessiné une courbe toute sa vie sans savoir pourquoi. Elle garde sa forme en grandissant. Comment s'appelle le nombre qui la commande ?",
    exact: ["phi","φ","nombre d or","le nombre d or","nombre dor","1 618","1,618","1.618",
            "un virgule six un huit","spirale logarithmique","la spirale logarithmique",
            "section doree","divine proportion","proportion doree"],
    contains: ["nombre d or","logarithmique","1 618","phi"],
    fins: [],
    succes: [
      "Phi. Un virgule six un huit.",
      "La seule courbe qui garde sa forme en grandissant. La coquille, le tournesol, le bras des galaxies.",
      "Il l'a retrouvée, il ne l'a pas inventée. Elle est gravée ici depuis plus longtemps que vos pays n'ont des noms."
    ],
    echecs: [
      ["Non.",
       "Cherche du côté de ce qui pousse sans qu'on lui dise comment."],
      ["Toujours pas.",
       "Un homme l'a écrite dans la marge d'un carnet, à vingt ans, dans un studio en face d'un lycée.",
       "Il a donné son nom et trois chiffres."],
      ["Un nombre. Une lettre grecque. Une décimale que tout le monde connaît sans savoir pourquoi."],
      ["Ce n'est pas encore là. Reviens quand tu auras lu ce qu'il a écrit."]
    ]
  },
  {
    n: 2,
    question: "la spirale, c'est ce que fait la matière quand on la laisse faire. Et l'interruption, c'est ce qui arrive quand quoi ?",
    exact: ["une volonte dit non","quand une volonte dit non","une volonté dit non",
            "on dit non","dire non","le non","un non","quelqu un dit non",
            "la volonte dit non","une volonte refuse","le libre arbitre","le trou"],
    contains: ["volonte dit non","volonté dit non","quelqu un dit non","dit non",
               "libre arbitre","le trou"],
    fins: [],
    succes: [
      "Oui.",
      "Toutes les équations du monde peuvent tracer la courbe. Aucune ne peut prédire le trou.",
      "C'est le seul endroit du monde qui reste à nous. C'est pour ça que je le garde."
    ],
    echecs: [
      ["Non.",
       "La matière suit sa pente. Ce que je cherche, c'est ce qui la rompt."],
      ["Pas encore.",
       "Une machine apprendra la courbe. Elle apprendra tout, sauf ce point-là.",
       "Ce point n'arrive qu'une fois, à une personne, et rien ne l'annonce."],
      ["Deux mots suffisent. Ce que fait quelqu'un quand rien ne l'y oblige."],
      ["Tu chauffes sans le savoir. Reviens."]
    ]
  },
  {
    n: 3,
    question: "dans un compartiment, un oiseau blanc n'est pas parti. Qu'ai-je laissé sur la vitre ?",
    exact: ["une colombe","colombe","une colombe rouge","colombe rouge","la colombe",
            "un oiseau rouge","une colombe en rouge","une colombe dessinee","le dessin d une colombe"],
    contains: ["colombe"],
    fins: [],
    succes: [
      "Une colombe. En rouge.",
      "Elle ne s'est pas envolée. Elle est restée, elle a regardé, et elle est rentrée dans sa cage.",
      "Tu es allé loin. Très peu vont jusque-là."
    ],
    echecs: [
      ["Non.",
       "Il y avait une cage sur un quai, portée par une petite fille qui ne la lâchait pas."],
      ["Cherche encore.",
       "Ce que j'ai laissé était de la même couleur que ce qu'il y avait par terre."],
      ["Un oiseau. Un seul mot."],
      ["Pas encore. Relis la nuit du train."]
    ]
  }
];

const PALIER_MAX = PALIERS.length - 1;

const PREFIX = ["MYRTILLE","COLOMBE","SPIRALE","NORD","MERIDIEN","AUSTRALE","CAGE","ORIENT"];

const norm = (s="") =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
   .replace(/[^a-z0-9\s-]/g," ").replace(/\s+/g," ").trim();

function isCorrect(answer, palier){
  const P = PALIERS[palier];
  if(!P) return false;
  const n = norm(answer);
  if(!n) return false;
  if(P.exact.map(norm).includes(n)) return true;
  if(P.contains.some(k => n.includes(norm(k)))) return true;
  if(P.fins.length){
    const words = n.split(" ");
    if(words.length <= 3){
      const last = words[words.length-1];
      if(P.fins.includes(last)){
        const BAD = ["dis","dit","dites","donne","montre","explique","aide","parle",
                     "raconte","laisse","ecoute","regarde"];
        const prev = words[words.length-2] || "";
        if(BAD.includes(prev)) return false;
        return true;
      }
    }
  }
  return false;
}

function makeKey(){
  const p = PREFIX[crypto.randomInt(PREFIX.length)];
  const seg = () => crypto.randomBytes(3).toString("hex").toUpperCase().slice(0,4);
  return `${p}-${seg()}-${seg()}`;
}

const json = (obj, code=200) =>
  new Response(JSON.stringify(obj), {status:code, headers:{"Content-Type":"application/json"}});

/* =====================================================================
   HANDLER
   ===================================================================== */

export default async (req) => {
  if(req.method !== "POST") return json({error:"method"}, 405);

  let body;
  try { body = await req.json(); } catch { return json({error:"bad json"}, 400); }
  const action = body.action;

  const players = getStore("forever_players");
  const meta    = getStore("forever_meta");

  /* ---- PARLER : hors-jeu + détresse ---- */
  if(action === "talk"){
    const msg = String(body.message||"");
    const ech = Number(body.echanges||0);
    const cle = String(body.codename||body.key||"") || null;
    const r = reponseHorsJeu(msg, ech, cle);
    return json({ texte: r.texte, famille: r.famille, sortieDeRole: r.sortieDeRole });
  }

  /* ---- RÉPONDRE À UNE ÉNIGME ---- */
  if(action === "answer"){
    const palier = Math.min(Number(body.palier||0), PALIER_MAX);
    const msg = String(body.answer||"");

    // la détresse passe AVANT toute vérification
    if(estDetresse(msg)){
      const r = reponseHorsJeu(msg, 0, null);
      return json({ correct:false, horsJeu:true, texte:r.texte, sortieDeRole:true });
    }

    if(isCorrect(msg, palier)){
      const suivant = palier + 1;
      const fini = suivant > PALIER_MAX;

      // on enregistre la progression si le joueur est identifié
      const codename = String(body.codename||"").trim();
      if(codename){
        const rec = await players.get(`player:${norm(codename)}`, {type:"json"});
        if(rec && (rec.palier ?? 0) < suivant){
          rec.palier = suivant;
          rec.updated = new Date().toISOString();
          await players.setJSON(`player:${norm(codename)}`, rec);
        }
      }

      return json({
        correct: true,
        succes: PALIERS[palier].succes,
        palierSuivant: fini ? null : suivant,
        questionSuivante: fini ? null : PALIERS[suivant].question,
        fini
      });
    }

    // mauvaise réponse : hors-jeu si ça ressemble à autre chose qu'un essai
    const r = reponseHorsJeu(msg, Number(body.echanges||0), body.codename||null);
    if(r.famille !== "defaut" && r.famille !== "orientation"){
      return json({ correct:false, horsJeu:true, texte:r.texte,
                    sortieDeRole:r.sortieDeRole });
    }

    const tent = Math.min(Number(body.tentatives||0), PALIERS[palier].echecs.length-1);
    return json({ correct:false, echec: PALIERS[palier].echecs[tent] });
  }

  /* ---- INSCRIPTION ---- */
  if(action === "register"){
    const chosen = String(body.chosenName||"").trim().slice(0,24);
    if(!chosen) return json({error:"empty name"}, 400);

    const cur = Number((await meta.get("count")) || 0);
    const rank = cur + 1;
    await meta.set("count", String(rank));

    const clean = chosen.replace(/[^\p{L}\p{N}]/gu,"") || "Anonyme";
    const codename = `${clean}-${rank}`;
    const key = makeKey();

    await players.setJSON(`player:${norm(codename)}`, {
      codename, chosen: clean, rank, key,
      palier: 1, created: new Date().toISOString()
    });

    return json({ codename, chosen: clean, rank, before: rank-1, key,
                  question: PALIERS[1].question });
  }

  /* ---- RETOUR ---- */
  if(action === "return"){
    const ip = req.headers.get("x-nf-client-connection-ip")
            || (req.headers.get("x-forwarded-for")||"").split(",")[0].trim()
            || "anon";
    const throttle = getStore("forever_throttle");
    const tKey = `ip:${norm(ip)}`;
    const now = Date.now();
    const t = (await throttle.get(tKey, {type:"json"})) || {fails:0, until:0};

    if(t.until && now < t.until){
      return json({ blocked:true,
        message:"Trop de visages volés. Reviens dans quelques minutes." });
    }

    const codename = String(body.codename||"").trim();
    const key = String(body.key||"").trim();
    const rec = await players.get(`player:${norm(codename)}`, {type:"json"});

    const good = rec && rec.key && key && rec.key.toUpperCase() === key.toUpperCase();
    if(good){
      await throttle.setJSON(tKey, {fails:0, until:0});
      const p = Math.min(rec.palier ?? 0, PALIER_MAX);
      const fini = (rec.palier ?? 0) > PALIER_MAX;

      // mémoire : on marque le retour
      rec.retours = (rec.retours || 0) + 1;
      rec.dernierRetour = new Date().toISOString();
      await players.setJSON(`player:${norm(codename)}`, rec);

      return json({ ok:true, palier: p, fini, codename: rec.codename,
                    retours: rec.retours,
                    question: fini ? null : PALIERS[p].question });
    }

    const fails = (t.fails||0) + 1;
    const until = fails >= 5 ? now + 5*60*1000 : 0;
    await throttle.setJSON(tKey, {fails: until?0:fails, until});
    if(until) return json({ blocked:true,
      message:"Trop de visages volés. Reviens dans quelques minutes." });
    return json({ ok:false });
  }

  return json({error:"unknown action"}, 400);
};
