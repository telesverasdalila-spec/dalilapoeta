// Rota de leitura de textos (Ensaios, Crônicas, Traduções) — wrapper server
// em torno do ConteudoTexto (cliente, modelo da usuária). Espelha o padrão
// da ficha de obra: SSG (generateStaticParams) + metadados por texto,
// lendo os dados.json de src/app/texto/[id]/{slug}/dados.json.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import ConteudoTexto from "./ConteudoTexto";
import ConteudoCronica from "./ConteudoCronica";
import ConteudoTraducao from "./ConteudoTraducao";
import ConteudoEnsaio from "./ConteudoEnsaio";
import ConteudoEntrevista from "./ConteudoEntrevista";

const DIR_TEXTOS = path.join(process.cwd(), "src", "app", "texto", "[id]");

interface DadosTexto {
  titulo: string;
  subtitulo?: string;
  tipo?: string;
  [k: string]: unknown;
}

function lerTexto(id: string): DadosTexto | null {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(DIR_TEXTOS, id, "dados.json"), "utf-8")
    ) as DadosTexto;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  try {
    return fs
      .readdirSync(DIR_TEXTOS, { withFileTypes: true })
      .filter(
        (d) => d.isDirectory() && fs.existsSync(path.join(DIR_TEXTOS, d.name, "dados.json"))
      )
      .map((d) => ({ id: d.name }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const dados = lerTexto(id);
  if (!dados) return { title: "Texto — Dalila Teles Veras" };
  const descricao =
    dados.subtitulo || `Texto de Dalila Teles Veras: ${dados.titulo}`;
  return {
    title: `${dados.titulo} — Dalila Teles Veras`,
    description: String(descricao).slice(0, 160),
  };
}

export default async function PageTexto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dados = lerTexto(id);
  if (!dados) notFound();
  // Cada categoria tem componente próprio (refinamentos independentes):
  // Crônicas (dias empilhados dourados), Traduções (subtabs por autor),
  // Ensaios (metadado com veículo/evento), Entrevistas (pergunta/resposta
  // do legado, perguntas azuis). Outros tipos: modelo padrão.
  if (dados.tipo === "cronica") return <ConteudoCronica dados={dados} />;
  if (dados.tipo === "traducao") return <ConteudoTraducao dados={dados} />;
  if (dados.tipo === "ensaio") return <ConteudoEnsaio dados={dados} />;
  if (dados.tipo === "entrevista") return <ConteudoEntrevista dados={dados} />;
  return <ConteudoTexto dados={dados} />;
}
