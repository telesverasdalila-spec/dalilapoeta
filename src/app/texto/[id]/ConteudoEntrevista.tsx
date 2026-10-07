"use client";

// ============================================
// PÁGINA DE LEITURA DE ENTREVISTAS — mesmo pacote visual dos Ensaios:
// faixa FaixaObras.png no topo, SELO dtv (poeta · cronista · memorialista
// — Alpharrabio editora) na coluna da esquerda, título em Georgia itálico
// e linha de metadados. O selo foi recortado da prova de borrachão
// enviada pela usuária (upload/dtv-selo-1.png), ficando apenas o
// carimbo central, completo.
// Diferencial (pedido da usuária): PERGUNTAS em cor própria — o azul
// #2050A0 do site legado, onde as perguntas eram azuis e as respostas
// pretas — via classes ent-pergunta / ent-resposta gravadas no
// dados.json. Poesia embutida usa classes ent-* (versos à esquerda,
// epígrafes recuadas, títulos dourados finos da paleta).
// ============================================

import Link from "next/link";
import { cssCorpoTexto } from "./css-corpo";

interface DadosTexto {
  id: string;
  titulo: string;
  tipo: "entrevista";
  subtitulo?: string;
  ano?: number | string;
  texto: string; // HTML limpo do site legado (com classes ent-*)
  imagem?: { url: string; credito?: string; legenda?: string };
  fonte_original?: { url?: string; texto: string; nota?: string };
}

const imagemEntrevistas = "/imagens/entrevistas/dtv-selo.png";

const cssEntrevistas = `
  /* Perguntas em azul — herança do site legado (perguntas azuis,
     respostas na cor do texto). Pedido da usuária na restauração da
     subtab Entrevistas.
     Refino Task 73 (pedido da usuária): perguntas MENOS enfáticas
     (peso 500) e alinhadas à direita, como os títulos — assim não
     herdam a justificação e não criam vácuos quando quebram linha. */
  .corpo-texto p.ent-pergunta {
    color: #2050A0;
    font-weight: 500;
    text-align: right;
    margin-top: 30px;
    margin-bottom: 16px;
  }
  .corpo-texto p.ent-resposta { margin-bottom: 16px; }

  /* Linha-lead do site legado (a frase de abertura da entrevista) */
  .corpo-texto p.ent-intro {
    font-style: italic;
    text-align: center;
    color: #555;
  }
  .corpo-texto hr.ent-separador {
    border: none;
    border-top: 1px solid #d4af37;
    margin: 30px 0 35px;
  }

  /* Poesia embutida (Selmo Vasconcellos, Tarso de Melo): versos à
     esquerda, encadeados, sem a justificação da prosa; títulos e
     epígrafes com o tratamento dourado fino da paleta */
  .corpo-texto p.ent-titulo-poema {
    font-family: var(--font-cormorant), Georgia, 'Times New Roman', serif;
    font-size: 1.3rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #8b6914;
    text-align: left;
    margin: 34px 0 10px 0;
  }
  .corpo-texto p.ent-linha {
    text-align: left;
    margin-bottom: 2px;
  }
  .corpo-texto p.ent-pausa {
    height: 0.9em;
    margin: 10px 0;
  }
  .corpo-texto p.ent-epigrafo {
    margin-left: 2em;
    margin-bottom: 2px;
    text-align: left;
  }
  .corpo-texto p.ent-assinatura {
    text-align: right;
    font-style: italic;
    margin-top: 36px;
  }

  /* Selo dtv na coluna da esquerda: quadrado no desktop; no celular
     fica centralizado e um pouco menor, sem empurrar o título pra baixo */
  .ent-selo-wrap { flex: 0 0 300px; max-width: 100%; }
  @media (max-width: 768px) {
    .ent-selo-wrap { flex: 0 0 auto; width: 230px; margin: 0 auto 10px; }
  }
`;

export default function ConteudoEntrevista({ dados }: { dados: DadosTexto }) {
  const anoVisivel =
    dados.ano && Number(dados.ano) !== 0 ? String(dados.ano) : null;
  const linhaMeta =
    dados.subtitulo || `Entrevista${anoVisivel ? ` • ${anoVisivel}` : ""}`;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fdfcf8" }}>

      {/* FAIXA SUPERIOR — idêntica à da ficha de obra */}
      <div style={{
        width: "100%",
        height: "80px",
        background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 60%, rgba(255,255,255,0.1) 100%), url('/FaixaObras.png') center/cover no-repeat",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase" }}>Dalila Teles Veras • Entrevistas</p>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px 60px", fontFamily: "Georgia", color: "#333" }}>

        <Link href="/?eixo=obra" style={{ fontSize: "0.9rem", color: "#7a3b5a", textDecoration: "none", fontWeight: "500", display: "inline-block", marginBottom: "25px" }}>
          ← Voltar para Escritos &amp; Leituras
        </Link>

        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* SELO DTV — carimbo central recortado da prova enviada pela usuária */}
          <div className="ent-selo-wrap">
            <div style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.18)", backgroundColor: "#f5f2ec" }}>
              <img
                src={dados.imagem?.url || imagemEntrevistas}
                alt="Selo dtv — poeta, cronista e memorialista — Alpharrabio editora"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </div>

          {/* COLUNA DE CONTEÚDO */}
          <div style={{ flex: "1 1 300px", minWidth: "280px" }}>

            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h1 style={{ fontSize: "1.9rem", lineHeight: "1.1", margin: "0 0 10px 0", color: "#1a1a1a", fontStyle: "italic" }}>
                {dados.titulo}
              </h1>
            </div>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "2px", color: "#999", textTransform: "uppercase", marginBottom: "20px", textAlign: "center" }}>
              {linhaMeta}
            </p>

            {/* CORPO DO TEXTO — perguntas azuis, respostas na cor do texto */}
            <div style={{
              marginTop: "40px",
              borderTop: "1px solid #e0e0e0",
              paddingTop: "35px"
            }}>
              <main
                className="corpo-texto corpo-entrevistas"
                dangerouslySetInnerHTML={{ __html: dados.texto }}
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

      <style dangerouslySetInnerHTML={{ __html: cssCorpoTexto + cssEntrevistas }} />
    </div>
  );
}
