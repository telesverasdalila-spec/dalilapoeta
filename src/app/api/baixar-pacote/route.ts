// API de download do pacote do site (mecanismo da era v14, recriado a
// pedido da usuária para baixar o ZIP final). Serve o pacote zip mais
// recente de download/ em streaming — sem buffer na memória (o arquivo
// tem ~300MB). Rota fora do conteúdo do site memorial: não aparece no
// menu nem nas páginas; é um utilitário de entrega.
//
// Task 78: painel e proxy de preview rejeitam respostas de ~309 MB
// (a v15 com 306 MB passava; a v16 não). O pacote foi dividido em 4
// partes de <= 90 MiB (scripts/gera_partes_v16.py) e esta rota também
// as serve individualmente:
//   GET /api/baixar-pacote            -> zip completo (309 MB)
//   GET /api/baixar-pacote?parte=2    -> parte 2 de N (<= 90 MB)
//   GET /api/baixar-pacote?lista      -> JSON com pacote e partes
// As partes seguem o padrão "<nome-do-pacote>.parteKdeN.zip" ao lado do
// zip em download/ e ordenam ANTES dele lexicograficamente ("parte" <
// "zip"), então o pacote completo continua sendo o "mais recente".

import { createReadStream, existsSync, readdirSync, statSync } from "fs";
import path from "path";
import { Readable } from "stream";

export const dynamic = "force-dynamic";

function pacoteMaisRecente(): { caminho: string; nome: string } | null {
  const dir = path.join(process.cwd(), "download");
  try {
    const zips = existsSync(dir)
      ? readdirSync(dir)
          .filter((f) => f.endsWith(".zip"))
          .sort() // v16 > v15 lexicograficamente
      : [];
    if (zips.length === 0) return null;
    const nome = zips[zips.length - 1];
    return { caminho: path.join(dir, nome), nome };
  } catch {
    return null;
  }
}

// Partes "<base>.parteKdeN.zip" do pacote informado, em ordem de K
function partesDoPacote(nomePacote: string): { nome: string; tamanho: number }[] {
  const dir = path.join(process.cwd(), "download");
  const base = nomePacote.replace(/\.zip$/, "");
  const regex = new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.parte(\\d+)de(\\d+)\\.zip$`);
  try {
    return readdirSync(dir)
      .map((f) => {
        const m = regex.exec(f);
        if (!m) return null;
        return { nome: f, k: Number(m[1]), n: Number(m[2]) };
      })
      .filter((p): p is { nome: string; k: number; n: number } => p !== null)
      .sort((a, b) => a.k - b.k)
      .map(({ nome, ...resto }) => ({
        nome,
        tamanho: statSync(path.join(dir, nome)).size,
        ...resto,
      }));
  } catch {
    return [];
  }
}

function servirArquivo(caminho: string, nome: string) {
  const tamanho = statSync(caminho).size;
  // Readable Node -> Web ReadableStream (streaming, sem carregar 300MB)
  const stream = Readable.toWeb(
    createReadStream(caminho)
  ) as unknown as ReadableStream<Uint8Array>;
  return new Response(stream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(tamanho),
      "Content-Disposition": `attachment; filename="${nome}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request: Request) {
  const pacote = pacoteMaisRecente();
  if (!pacote || !existsSync(pacote.caminho)) {
    return Response.json(
      { erro: "Pacote não encontrado em download/" },
      { status: 404 }
    );
  }

  const params = new URL(request.url).searchParams;

  // ?lista -> inventário do pacote e das partes (sem baixar nada)
  if (params.has("lista")) {
    const partes = partesDoPacote(pacote.nome);
    return Response.json({
      pacote: { nome: pacote.nome, tamanho: statSync(pacote.caminho).size },
      partes: partes.map((p, i) => ({
        ordem: i + 1,
        nome: p.nome,
        tamanho: p.tamanho,
        url: `/api/baixar-pacote?parte=${i + 1}`,
      })),
      instrucoes:
        "Baixe todas as partes, coloque-as na mesma pasta e rejunte: " +
        'Windows: copy /b "arquivo.parte1deN.zip+..." "pacote.zip" | ' +
        'macOS/Linux: cat "arquivo.parte"*.zip > "pacote.zip" — ' +
        "instruções completas em LEIA-ME-pacote-v16.txt",
    });
  }

  // ?parte=K -> serve a K-ésima parte do pacote (<= ~90 MB)
  const parteParam = params.get("parte");
  if (parteParam) {
    const k = Number(parteParam);
    const partes = partesDoPacote(pacote.nome);
    const parte = Number.isInteger(k) && k >= 1 ? partes[k - 1] : undefined;
    if (!parte || !existsSync(path.join(process.cwd(), "download", parte.nome))) {
      return Response.json(
        {
          erro: `Parte ${parteParam} inexistente`,
          pacote: pacote.nome,
          totalPartes: partes.length,
        },
        { status: 404 }
      );
    }
    return servirArquivo(
      path.join(process.cwd(), "download", parte.nome),
      parte.nome
    );
  }

  return servirArquivo(pacote.caminho, pacote.nome);
}

export async function HEAD(request: Request) {
  const pacote = pacoteMaisRecente();
  if (!pacote || !existsSync(pacote.caminho)) return new Response(null, { status: 404 });

  const parteParam = new URL(request.url).searchParams.get("parte");
  if (parteParam) {
    const k = Number(parteParam);
    const partes = partesDoPacote(pacote.nome);
    const parte = Number.isInteger(k) && k >= 1 ? partes[k - 1] : undefined;
    if (!parte) return new Response(null, { status: 404 });
    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Length": String(parte.tamanho),
        "Content-Disposition": `attachment; filename="${parte.nome}"`,
      },
    });
  }

  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(statSync(pacote.caminho).size),
      "Content-Disposition": `attachment; filename="${pacote.nome}"`,
    },
  });
}
