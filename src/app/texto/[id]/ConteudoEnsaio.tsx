"use client";

// ============================================
// PÁGINA DE LEITURA DE ENSAIOS — mesmo pacote visual das Crônicas e
// Traduções: faixa FaixaObras.png no topo, imagem fixa da categoria,
// título em Georgia itálico e linha de metadados com o veículo/evento
// (padrão da linha "Coluna Viaverbo" e "Revista A Cigarra").
// Subtab Bibliografia (pedido da usuária): quando o ensaio tem a seção
// "Bibliografia:" no fim, ela migra para uma subtab própria; as notas
// finais (roteiro, publicação, asteriscos) permanecem no texto principal.
// ============================================

import Link from "next/link";
import { useMemo, useState } from "react";
import { cssCorpoTexto } from "./css-corpo";

// Marcador da seção de bibliografia (parágrafo só com "Bibliografia:")
const RE_BIBLIO = /<p[^>]*>(?:<b>|<strong>)?\s*Bibliografia:?\s*(?:<\/b>|<\/strong>)?<\/p>/i;
const RE_P = /<p[^>]*>[\s\S]*?<\/p>/g;
// Notas finais que NÃO são entradas: começam com "(", "*" ou "Roteiro..."
const RE_NOTA_FINAL = /^(?:\(|\*|roteiro\b)/i;

interface SecoesEnsaio {
  principal: string;
  bibliografia: string;
}

interface DadosTexto {
  id: string;
  titulo: string;
  tipo: "ensaio";
  subtitulo?: string;
  ano?: number | string;
  texto: string; // HTML completo (limpo do site legado)
  data_publicacao?: string;
  data_evento?: string;
  contexto?: {
    evento?: string;
    local?: string;
    cidade?: string;
    organizador?: string;
  };
  imagem?: { url: string; credito?: string; legenda?: string };
  fonte_original?: { url?: string; texto: string; nota?: string };
}

const imagemEnsaios = "/imagens/obras-publicadas/ensaios/placeholder-ensaios.png";

export default function ConteudoEnsaio({ dados }: { dados: DadosTexto }) {
  const anoVisivel =
    dados.data_evento || dados.data_publicacao ||
    (dados.ano && dados.ano !== 0 ? String(dados.ano).replace("-", "–") : null);

  const contextoItens: string[] = [];
  if (dados.contexto?.evento) contextoItens.push(dados.contexto.evento);
  if (dados.contexto?.local)
    contextoItens.push(
      dados.contexto.local + (dados.contexto.cidade ? `, ${dados.contexto.cidade}` : "")
    );
  if (dados.contexto?.organizador) contextoItens.push(dados.contexto.organizador);

  // Linha sob o título: veículo/evento de publicação (padrão das crônicas
  // e traduções); fallback para o rótulo "Ensaio • ano" se não houver
  const linhaMeta =
    contextoItens.length > 0
      ? contextoItens.join(" • ")
      : `Ensaio${anoVisivel ? ` • ${anoVisivel}` : ""}`;

  // Subtab Bibliografia: separa a seção "Bibliografia:" do texto principal.
  // Entradas: parágrafos começando com "-" (ou linhas de continuação);
  // paramos nas notas finais ("(", "*", "Roteiro...") que ficam no texto.
  const secoes = useMemo<SecoesEnsaio | null>(() => {
    const m = dados.texto.match(RE_BIBLIO);
    if (!m || m.index === undefined) return null;
    const inicio = m.index;
    const ps = Array.from(dados.texto.slice(inicio).matchAll(RE_P));
    if (ps.length === 0) return null;
    let fim = inicio + (ps[0].index ?? 0) + ps[0][0].length; // inclui o marcador
    for (let i = 1; i < ps.length; i++) {
      const pl = ps[i][0].replace(/<[^>]+>/g, "").trim();
      const ehEntrada = pl.startsWith("-");
      const ehContinuacao = !RE_NOTA_FINAL.test(pl);
      if (ehEntrada || ehContinuacao) {
        fim = inicio + (ps[i].index ?? 0) + ps[i][0].length;
      } else {
        break;
      }
    }
    return {
      principal: dados.texto.slice(0, inicio) + dados.texto.slice(fim),
      bibliografia: dados.texto.slice(inicio, fim),
    };
  }, [dados.texto]);

  const [aba, setAba] = useState<"texto" | "bibliografia">("texto");
  const htmlCorpo =
    secoes && aba === "bibliografia" ? secoes.bibliografia : secoes ? secoes.principal : dados.texto;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fdfcf8" }}>

      {/* FAIXA SUPERIOR — idêntica à da ficha de obra */}
      <div style={{
        width: "100%",
        height: "80px",
        background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 60%, rgba(255,255,255,0.1) 100%), url('/FaixaObras.png') center/cover no-repeat",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase" }}>Dalila Teles Veras • Ensaios</p>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px 60px", fontFamily: "Georgia", color: "#333" }}>

        <Link href="/?eixo=obra" style={{ fontSize: "0.9rem", color: "#7a3b5a", textDecoration: "none", fontWeight: "500", display: "inline-block", marginBottom: "25px" }}>
          ← Voltar para Escritos &amp; Leituras
        </Link>

        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* IMAGEM FIXA DA CATEGORIA — mesma moldura da capa do livro */}
          <div style={{ flex: "0 0 375px", maxWidth: "100%" }}>
            <div style={{ boxShadow: "0 15px 40px rgba(0,0,0,0.15)", backgroundColor: "#f5f5f5" }}>
              <img
                src={dados.imagem?.url || imagemEnsaios}
                alt="Imagem da seção Ensaios de Dalila Teles Veras"
                style={{ width: "100%", height: "auto", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>

          {/* COLUNA DE CONTEÚDO */}
          <div style={{ flex: "1 1 300px", minWidth: "280px" }}>

            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h1 style={{ fontSize: "2.2rem", lineHeight: "1.1", margin: "0 0 10px 0", color: "#1a1a1a", fontStyle: "italic" }}>
                {dados.titulo}
              </h1>
            </div>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "2px", color: "#999", textTransform: "uppercase", marginBottom: "20px", textAlign: "center" }}>
              {linhaMeta}
            </p>

            {dados.subtitulo && (
              <p style={{ fontFamily: "Georgia", fontSize: "1.05rem", fontStyle: "italic", color: "#666", marginBottom: "20px", textAlign: "center" }}>
                {dados.subtitulo}
              </p>
            )}

            {/* CORPO DO TEXTO — subtab Texto | Bibliografia (se houver) */}
            <div style={{
              marginTop: "40px",
              borderTop: "1px solid #e0e0e0",
              paddingTop: "35px"
            }}>
              {secoes && (
                <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #e0e0e0", marginBottom: "35px", overflowX: "auto", scrollbarWidth: "none" }}>
                  {([["texto", "Texto"], ["bibliografia", "Bibliografia"]] as const).map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setAba(id)}
                      style={{
                        background: "none", border: "none",
                        fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 400,
                        letterSpacing: "2px", textTransform: "uppercase",
                        color: aba === id ? "#8b6914" : "#999",
                        padding: "10px 18px", cursor: "pointer",
                        borderBottom: aba === id ? "2px solid #d4af37" : "2px solid transparent",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <main
                className={
                  "corpo-texto corpo-ensaios" +
                  (aba === "bibliografia" && secoes ? " corpo-bibliografia" : "")
                }
                dangerouslySetInnerHTML={{ __html: htmlCorpo }}
              />

              {/* FONTE ORIGINAL */}
              {dados.fonte_original && (
                <div style={{
                  marginTop: "45px", paddingTop: "20px", borderTop: "1px solid #e0e0e0",
                  fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#999", lineHeight: "1.6"
                }}>
                  <span style={{ textTransform: "uppercase", letterSpacing: "1.5px", fontSize: "0.7rem" }}>Fonte</span>
                  <br />
                  {/* link removido: o site legado será desativado (pedido da usuária) */}
                  <span>{dados.fonte_original.texto}</span>
                  {dados.fonte_original.nota && (
                    <p style={{ fontStyle: "italic", marginTop: "8px" }}>{dados.fonte_original.nota}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: cssCorpoTexto }} />
    </div>
  );
}
