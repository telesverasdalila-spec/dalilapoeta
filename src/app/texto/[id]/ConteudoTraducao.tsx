"use client";

// ============================================
// PÁGINA DE LEITURA DE TRADUÇÕES — mesmo pacote visual das Crônicas:
// faixa FaixaObras.png no topo, imagem fixa da categoria, título em
// Georgia itálico e linha de metadados com o veículo de publicação
// (padrão da linha "Coluna Viaverbo" das crônicas).
// Subtabs por autor traduzido (pedido da usuária): o corpo é dividido
// nos <h2> de autores (Antonio Machado, Mario Benedetti); o nome do
// autor permanece no corpo como título dourado, como nos diários.
// ============================================

import Link from "next/link";
import { useMemo, useState } from "react";
import { cssCorpoTexto } from "./css-corpo";

interface DadosTexto {
  id: string;
  titulo: string;
  tipo: "traducao";
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

const imagemTraducoes = "/imagens/obras-publicadas/traducoes/placeholder-traducoes.png";

interface Secao {
  autor: string;
  html: string;
}

export default function ConteudoTraducao({ dados }: { dados: DadosTexto }) {
  // Subtabs por autor traduzido: divide o texto nos <h2> de autores.
  // O h2 permanece dentro do HTML da seção (título dourado no corpo).
  // Menos de 2 autores → sem tabs, texto verbatim (fallback seguro).
  const secoes = useMemo<Secao[] | null>(() => {
    const matches = Array.from(dados.texto.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g));
    if (matches.length < 2) return null;
    const fimTexto = dados.texto.length;
    return matches.map((m, i) => {
      const inicio = m.index ?? 0;
      const fim = i + 1 < matches.length ? matches[i + 1].index ?? fimTexto : fimTexto;
      // qualquer conteúdo anterior ao primeiro h2 entra na 1ª seção
      const pre = i === 0 ? dados.texto.slice(0, inicio) : "";
      return {
        autor: m[1].replace(/<[^>]+>/g, "").trim(),
        html: pre + dados.texto.slice(inicio, fim),
      };
    });
  }, [dados.texto]);

  const [autorAtivo, setAutorAtivo] = useState<string | null>(null);
  const autorVisivel =
    autorAtivo && secoes?.some((s) => s.autor === autorAtivo)
      ? autorAtivo
      : secoes?.[0]?.autor ?? null;
  const htmlCorpo =
    secoes && autorVisivel
      ? secoes.find((s) => s.autor === autorVisivel)?.html ?? dados.texto
      : dados.texto;

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

  // Linha sob o título: veículo de publicação (padrão das crônicas);
  // fallback para o rótulo "Tradução • ano" se não houver contexto
  const linhaMeta =
    contextoItens.length > 0
      ? contextoItens.join(" • ")
      : `Tradução${anoVisivel ? ` • ${anoVisivel}` : ""}`;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fdfcf8" }}>

      {/* FAIXA SUPERIOR — idêntica à da ficha de obra */}
      <div style={{
        width: "100%",
        height: "80px",
        background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 60%, rgba(255,255,255,0.1) 100%), url('/FaixaObras.png') center/cover no-repeat",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase" }}>Dalila Teles Veras • Traduções</p>
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
                src={dados.imagem?.url || imagemTraducoes}
                alt="Imagem da seção Traduções de Dalila Teles Veras"
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

            {/* CORPO DO TEXTO — subtabs por autor + poemas bilíngues */}
            <div style={{
              marginTop: "40px",
              borderTop: "1px solid #e0e0e0",
              paddingTop: "35px"
            }}>
              {secoes && (
                <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #e0e0e0", marginBottom: "35px", overflowX: "auto", scrollbarWidth: "none" }}>
                  {secoes.map((s) => (
                    <button
                      key={s.autor}
                      onClick={() => setAutorAtivo(s.autor)}
                      style={{
                        background: "none", border: "none",
                        fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 400,
                        letterSpacing: "2px", textTransform: "uppercase",
                        color: autorVisivel === s.autor ? "#8b6914" : "#999",
                        padding: "10px 18px", cursor: "pointer",
                        borderBottom: autorVisivel === s.autor ? "2px solid #d4af37" : "2px solid transparent",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {s.autor}
                    </button>
                  ))}
                </div>
              )}
              <main
                className="corpo-texto"
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
