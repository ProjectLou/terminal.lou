import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const EXACT = [
  "soi","soi meme","soimeme","moi","moi meme","moimeme","soi-meme","moi-meme",
  "le dedans","dedans","au dedans","en dedans","l interieur","interieur",
  "l intime","intime","l ame","ame","son ame","mon ame"
];
const CONTAINS = [
  "se voir soi","se regarder soi","se retourner vers soi",
  "regarder en soi","voir en soi","au fond de soi","en soi meme","en moi meme"
];

const PREFIX = ["MYRTILLE","COLOMBE","SPIRALE","NORD","MERIDIEN","AUSTRALE","CAGE","ORIENT"];

const norm = (s="") =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
   .replace(/[^a-z0-9\s-]/g," ").replace(/\s+/g," ").trim();

function isCorrect(answer){
  const n = norm(answer);
  if(!n) return false;
  if(EXACT.includes(n)) return true;
  if(CONTAINS.some(k => n.includes(norm(k)))) return true;
  const words = n.split(" ");
  if(words.length <= 3){
    const last = words[words.length-1];
    if(["soi","moi","dedans","interieur","intime","ame"].includes(last)){
      const BAD = ["dis","dit","dites","donne","montre","explique","aide","parle","raconte","laisse","ecoute","regarde"];
      const prev = words[words.length-2] || "";
      if(BAD.includes(prev)) return false;
      return true;
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

export default async (req) => {
  if(req.method !== "POST") return json({error:"method"}, 405);

  let body;
  try { body = await req.json(); } catch { return json({error:"bad json"}, 400); }
  const action = body.action;

  const players = getStore("forever_players");
  const meta    = getStore("forever_meta");

  if(action === "answer"){
    return json({ correct: isCorrect(body.answer||"") });
  }

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
      palier: 0, created: new Date().toISOString()
    });

    return json({ codename, chosen: clean, rank, before: rank-1, key });
  }

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
      return json({ ok:true, palier: rec.palier ?? 0, codename: rec.codename });
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
