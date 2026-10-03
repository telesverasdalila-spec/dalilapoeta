// Task 60/61/62 reconstruídas — merge das 3 fichas do conceito (decisões documentadas no worklog)
import { readFileSync, writeFileSync } from "fs";

const DIR = "/home/z/my-project/scripts/conceito_dados/";
const FIC = "/home/z/my-project/src/app/obra/[id]/";
const ler = (p) => JSON.parse(readFileSync(p, "utf8"));

const opcoesC = ler(DIR + "opcoes-para-morrer-no-espaco.json");
const passC = ler(DIR + "passageira-antologia-pessoal-1982-2024.json");
const insC = ler(DIR + "insulas.json");

const opcoesL = ler(FIC + "opcoes-para-morrer-no-espaco/dados.json");
const passL = ler(FIC + "passageira-antologia-pessoal-1982-2024/dados.json");
const insL = ler(FIC + "insulas/dados.json");

// Ordem canônica dos campos
const ordenar = (o) => {
  const ordem = ["titulo", "subtitulo", "genero", "ano", "capa", "status_catalogo",
    "sobre", "orelha", "autorOrelha", "dados", "trechos", "partes"];
  const r = {};
  for (const k of ordem) if (o[k] !== undefined) r[k] = o[k];
  for (const k of Object.keys(o)) if (!ordem.includes(k)) r[k] = o[k];
  return r;
};

// ---- OPÇÕES: título minúsculo (conceito) + cartão Prêmio Oceanos 1º + cartões do site;
//      placeholder "Formato: Não informado no documento" do conceito FORA
const cartoesLocaisOp = (opcoesL.dados || []).filter((c) => c.label !== "Formato");
const opcoes = {
  ...opcoesC,
  capa: opcoesL.capa,                       // capa local real (2024-capa-opcoes.jpg)
  status_catalogo: opcoesL.status_catalogo,
  dados: [
    ...(opcoesC.dados || []).filter((c) => !/não informado/i.test(c.valor || "")),
    ...cartoesLocaisOp,
  ],
};

// ---- PASSAGEIRA: conceito integral (ano 2026, 11 cartões, orelha Lilian Sais) + capa real (caminho local)
const passageira = {
  ...passC,
  capa: passL.capa,                         // /imagens/obras-publicadas/poesia/passageira.png (agora real)
  status_catalogo: passL.status_catalogo,
};

// ---- ÍNSULAS: conceito integral (subtítulo "Dalila Teles Veras", 6 cartões Fósforo) + capa local
const insulas = {
  ...insC,
  capa: insL.capa,                          // 2026-capa-insulas.jpg
  status_catalogo: insL.status_catalogo,
};

writeFileSync(FIC + "opcoes-para-morrer-no-espaco/dados.json", JSON.stringify(ordenar(opcoes), null, 2) + "\n");
writeFileSync(FIC + "passageira-antologia-pessoal-1982-2024/dados.json", JSON.stringify(ordenar(passageira), null, 2) + "\n");
writeFileSync(FIC + "insulas/dados.json", JSON.stringify(ordenar(insulas), null, 2) + "\n");

// ---- Limpeza dos subtítulos residuais (diuturnos/soliloquios/vestigios)
for (const s of ["diuturnos", "soliloquios", "vestigios"]) {
  const p = FIC + s + "/dados.json";
  const f = ler(p);
  if (f.subtitulo) {
    console.log(`limpeza subtitulo residual ${s}: ${JSON.stringify(f.subtitulo)} -> ""`);
    f.subtitulo = "";
    writeFileSync(p, JSON.stringify(f, null, 2) + "\n");
  }
}

console.log("opcoes: sobre", opcoes.sobre.length + "c orelha", opcoes.orelha.length + "c dados", opcoes.dados.length, "trechos", opcoes.trechos?.length);
console.log("passageira: sobre", passageira.sobre.length + "c orelha", passageira.orelha.length + "c dados", passageira.dados.length, "ano", passageira.ano);
console.log("insulas: sobre", insulas.sobre.length + "c dados", insulas.dados.length, "subtitulo", JSON.stringify(insulas.subtitulo));
