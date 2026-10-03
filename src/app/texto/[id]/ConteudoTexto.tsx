// ============================================
// PÁGINA DE LEITURA DE TEXTOS — layout idêntico ao da ficha de obra
// (ConteudoObra): faixa FaixaObras.png no topo, imagem fixa da
// categoria à esquerda (no lugar da capa), título em Georgia itálico,
// metadados em Inter uppercase e corpo em Georgia.
// Serve para: Ensaios, Crônicas, Traduções
// Dados: src/app/texto/[id]/{slug}/dados.json, lidos no server (page.tsx)
// ============================================

import Link from "next/link";
import { cssCorpoTexto } from "./css-corpo";

interface DadosTexto {
  id: string;
  titulo: string;
  tipo: "ensaio" | "cronica" | "traducao" | "livro" | "artigo" | "leitura-critica" | "estudo-critico";
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

// Imagem fixa por categoria (no lugar da capa do livro) — fornecidas pela usuária
const imagemPorTipo: Record<string, string> = {
  ensaio: "/imagens/obras-publicadas/ensaios/placeholder-ensaios.png",
  cronica: "/imagens/obras-publicadas/cronicas/placeholder-cronicas.png",
  traducao: "/imagens/obras-publicadas/traducoes/placeholder-traducoes.png",
  "leitura-critica": "/imagens/obras-publicadas/ensaios/placeholder-ensaios.png",
  "estudo-critico": "/imagens/obras-publicadas/ensaios/placeholder-ensaios.png",
};

const tipoRotulo: Record<string, string> = {
  ensaio: "Ensaio",
  cronica: "Crônica",
  traducao: "Tradução",
  livro: "Texto",
  artigo: "Artigo",
  "leitura-critica": "Leitura Crítica",
  "estudo-critico": "Estudo Crítico",
};

// Rótulo plural para a faixa (mesmo padrão de "Dalila Teles Veras • Obras")
const tipoFaixa: Record<string, string> = {
  ensaio: "Ensaios",
  cronica: "Crônicas",
  traducao: "Traduções",
  "leitura-critica": "Leituras Críticas",
  "estudo-critico": "Estudos Críticos",
};

export default function ConteudoTexto({ dados }: { dados: DadosTexto }) {
  const rotulo = tipoRotulo[dados.tipo] || "Texto";
  const faixa = tipoFaixa[dados.tipo] || "Escritos";

  // Imagem fixa da categoria (override opcional por texto via dados.imagem.url)
  const imagem =
    dados.imagem?.url || imagemPorTipo[dados.tipo] || "/imagens/obras-publicadas/ensaios/placeholder-ensaios.png";

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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fdfcf8" }}>

      {/* FAIXA SUPERIOR — idêntica à da ficha de obra */}
      <div style={{
        width: "100%",
        height: "80px",
        background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 60%, rgba(255,255,255,0.1) 100%), url('/FaixaObras.png') center/cover no-repeat",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase" }}>Dalila Teles Veras • {faixa}</p>
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
                src={imagem}
                alt={`Imagem da seção ${faixa} de Dalila Teles Veras`}
                style={{ width: "100%", height: "auto", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>

          {/* COLUNA DE CONTEÚDO — título e metadados como na ficha de obra */}
          <div style={{ flex: "1 1 300px", minWidth: "280px" }}>

            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h1 style={{ fontSize: "2.2rem", lineHeight: "1.1", margin: "0 0 10px 0", color: "#1a1a1a", fontStyle: "italic" }}>
                {dados.titulo}
              </h1>
            </div>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "2px", color: "#999", textTransform: "uppercase", marginBottom: "20px", textAlign: "center" }}>
              {rotulo}{anoVisivel ? ` • ${anoVisivel}` : ""}
            </p>

            {dados.subtitulo && (
              <p style={{ fontFamily: "Georgia", fontSize: "1.05rem", fontStyle: "italic", color: "#666", marginBottom: "20px", textAlign: "center" }}>
                {dados.subtitulo}
              </p>
            )}

            {contextoItens.length > 0 && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#666", lineHeight: "1.6", textAlign: "center", marginBottom: "0" }}>
                {contextoItens.join(" • ")}
              </p>
            )}

            {/* CORPO DO TEXTO — fluxo na coluna de conteúdo, como as abas da ficha */}
            <div style={{ marginTop: "40px", borderTop: "1px solid #e0e0e0", paddingTop: "35px" }}>
              <main
                className="corpo-texto"
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

      <style dangerouslySetInnerHTML={{ __html: cssCorpoTexto }} />
    </div>
  );
}
