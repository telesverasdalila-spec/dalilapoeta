// Task 62 reconstruída — extração string-aware do objeto d={...} do chunk 2bdy5z6zr5em0.js (vercel)
import { readFileSync, writeFileSync, mkdirSync } from "fs";

const CH = "/home/z/my-project/scripts/conceito_chunks/dados_2bdy5z6zr5em0.js";
const src = readFileSync(CH, "utf8");

const posD = src.indexOf("d={");
if (posD < 0) throw new Error("d={ não achado");

// brace-counting respeitando strings ("..." com escapes)
function extrairObjeto(s, ini) {
  let prof = 0, emStr = false, esc = false;
  for (let i = ini; i < s.length; i++) {
    const c = s[i];
    if (emStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') emStr = false;
      continue;
    }
    if (c === '"') emStr = true;
    else if (c === "{") prof++;
    else if (c === "}") { prof--; if (prof === 0) return s.slice(ini, i + 1); }
  }
  throw new Error("objeto sem fim");
}

const dTxt = extrairObjeto(src, posD + 2);
const d = new Function(`return (${dTxt})`)();

mkdirSync("/home/z/my-project/scripts/conceito_dados", { recursive: true });
for (const [chave, obj] of Object.entries(d)) {
  writeFileSync(`/home/z/my-project/scripts/conceito_dados/${chave}.json`,
    JSON.stringify(obj, null, 2));
  console.log(`${chave}: titulo=${JSON.stringify(obj.titulo)} subtitulo=${JSON.stringify(obj.subtitulo || "")} ano=${obj.ano} sobre=${(obj.sobre || "").length}c orelha=${(obj.orelha || "").length}c autorOrelha=${JSON.stringify(obj.autorOrelha || "")} dados=${(obj.dados || []).length} trechos=${(obj.trechos || []).length} capa=${obj.capa || "-"}`);
}
console.log(`TOTAL: ${Object.keys(d).length} fichas no conceito`);
