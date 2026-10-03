// Rota da ficha de obra — wrapper server em torno do ConteudoObra (cliente)
// da usuária: acrescenta SSG (generateStaticParams) e metadados por obra,
// lendo os dados.json canônicos de src/app/obra/[id]/*/dados.json.

import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ConteudoObra from "./ConteudoObra";
import { sobreTexto, type FichaObra } from "@/lib/tipos-obras";

const DIR_FICHAS = path.join(process.cwd(), "src", "app", "obra", "[id]");

function lerFicha(id: string): FichaObra | null {
  try {
    const bruto = fs.readFileSync(
      path.join(DIR_FICHAS, id, "dados.json"),
      "utf-8"
    );
    const ficha = JSON.parse(bruto) as Record<string, unknown>;
    // alias camelCase da usuária
    if ("autorOrelha" in ficha && !("autor_orelha" in ficha)) {
      ficha.autor_orelha = ficha.autorOrelha;
    }
    return ficha as unknown as FichaObra;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  try {
    return fs
      .readdirSync(DIR_FICHAS, { withFileTypes: true })
      .filter(
        (d) => d.isDirectory() && fs.existsSync(path.join(DIR_FICHAS, d.name, "dados.json"))
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
  const ficha = lerFicha(id);
  if (!ficha) return { title: "Obra — Dalila Teles Veras" };
  const descricao = sobreTexto(ficha)?.slice(0, 160);
  return {
    title: `${ficha.titulo} — Dalila Teles Veras`,
    description: descricao || `Obra de Dalila Teles Veras: ${ficha.titulo}`,
  };
}

export default async function PageObra({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ConteudoObra params={params} />;
}
