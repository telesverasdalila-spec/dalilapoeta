"use client";

// ============================================
// PÁGINA DE LEITURA DE ENTREVISTAS — formato pergunta/resposta
// herdado do site legado (perguntas azuis, respostas na cor
// do texto). Reconstruído do deploy em produção (forense do chunk JS
// + HTML da página /texto/entrevista-tarso-de-melo) após a regressão
// do pacote anterior; CSS das classes .ent-* resgatado verbatim.
// Task 93: perguntas à esquerda; +5 entrevistas do legado (IMES,
// PD Literatura, Floriano Martins, Álvaro Alves de Faria, Simka).
// ============================================

import Link from "next/link";
import { cssCorpoTexto } from "./css-corpo";

interface DadosTexto {
  id: string;
  titulo: string;
  tipo: "entrevista";
  subtitulo?: string;
  ano?: number | string;
  texto: string; // HTML completo (com classes ent-* do legado)
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

const imagemEntrevistas = "/imagens/entrevistas/maosescrita2.jpg";

// CSS específico das entrevistas (resgatado verbatim do deploy —
// histórico de Task 73 (perguntas menos enfáticas) e Task 82 (seletor
// com .corpo-entrevistas para vencer a justificação do CSS base).
// Task 93: perguntas alinhadas à ESQUERDA (pedido da usuária — o
// alinhamento à direita do legado dificultava a leitura).
const cssEntrevistas = `
  .corpo-texto p.ent-pergunta {
    color: #2050A0;
    font-weight: 500;
    text-align: left;
    margin-top: 30px;
    margin-bottom: 16px;
  }
  .corpo-texto.corpo-entrevistas p.ent-pergunta {
    text-align: left;
  }
  .corpo-texto p.ent-resposta {
    margin-bottom: 16px;
    /* Pedido da usuária: o texto inteiro da entrevista (perguntas e
       respostas) alinhado à esquerda, não justificado/direita */
    text-align: left;
  }

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
`;

export default function ConteudoEntrevista({ dados }: { dados: DadosTexto }) {
  const anoVisivel =
    dados.data_evento || dados.data_publicacao ||
    (dados.ano && dados.ano !== 0 ? String(dados.ano).replace("-", "–") : null);

  // Linha sob o título: subtitulo do caderno/portal, com fallback
  // para o rótulo "Entrevista • ano"
  const linhaMeta = dados.subtitulo || `Entrevista${anoVisivel ? ` • ${anoVisivel}` : ""}`;

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

          {/* IMAGEM FIXA DA CATEGORIA — mesma moldura da capa do livro */}
          <div style={{ flex: "0 0 375px", maxWidth: "100%" }}>
            <div style={{ boxShadow: "0 15px 40px rgba(0,0,0,0.15)", backgroundColor: "#f5f5f5" }}>
              <img
                src={dados.imagem?.url || imagemEntrevistas}
                alt="Imagem da seção Entrevistas de Dalila Teles Veras"
                style={{ width: "100%", height: "auto", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
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

            {/* CORPO DO TEXTO — perguntas/respostas do legado */}
            <div style={{
              marginTop: "40px",
              borderTop: "1px solid #e0e0e0",
              paddingTop: "35px"
            }}>
              {/* Selo dtv — assinatura da editora, canto superior direito */}
              <div style={{ display: "flex", justifyContent: "flex-end", margin: "0 0 4px" }}>
                <img
                  src="/imagens/entrevistas/dtv-selo.jpg"
                  alt="Selo dtv — poeta, cronista, memorialista — Alpharrabio editora"
                  style={{ width: "92px", height: "auto", display: "block", borderRadius: "50%", opacity: 0.9, mixBlendMode: "multiply", transform: "rotate(-5deg)" }}
                />
              </div>

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
