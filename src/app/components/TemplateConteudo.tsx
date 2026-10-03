"use client";
import React from "react";
import Link from "next/link";

// ============================================
// TEMPLATE UNIVERSAL PARA CONTEÚDO DE TEXTO
// Reutilizável para: Obras, Crônicas e Ensaios
// ============================================

interface TemplateConteudoProps {
  // Identificador do tipo de conteúdo
  tipoConteudo: "obra" | "cronica" | "ensaio";
  
  // Dados do conteúdo
  titulo: string;
  texto: string; // HTML completo
  data?: string;
  fonte?: string;
  nota_rodape?: string;
  
  // Configurações de navegação
  voltarUrl: string;
  voltarTexto: string;
  
  // Estado de carregamento/erro (opcional)
  carregando?: boolean;
  erro?: boolean;
}

// Labels por tipo de conteudo
const LABELS: Record<TemplateConteudoProps["tipoConteudo"], { 
  header: string; 
  secao: string;
  corDestaque: string;
}> = {
  obra: {
    header: "Obras",
    secao: "Obra",
    corDestaque: "#2050A0"
  },
  cronica: {
    header: "Crônicas",
    secao: "Crônica",
    corDestaque: "#2050A0"
  },
  ensaio: {
    header: "Ensaios",
    secao: "Ensaio",
    corDestaque: "#7a3b5a" // Tom diferente para ensaios
  }
};

// Classe CSS baseada no tipo
const CSS_CLASS: Record<TemplateConteudoProps["tipoConteudo"], string> = {
  obra: "conteudo-obra",
  cronica: "conteudo-cronica",
  ensaio: "conteudo-ensaio"
};

export default function TemplateConteudo({
  tipoConteudo,
  titulo,
  texto,
  data,
  fonte,
  nota_rodape,
  voltarUrl,
  voltarTexto,
  carregando = false,
  erro = false
}: TemplateConteudoProps) {
  
  const labels = LABELS[tipoConteudo];
  const cssClass = CSS_CLASS[tipoConteudo];

  // Estado de carregamento
  if (carregando) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#fdfcf8",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontFamily: "'Inter', sans-serif", color: "#999" }}>
          Carregando {labels.secao.toLowerCase()}...
        </p>
      </div>
    );
  }

  // Estado de erro
  if (erro) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fdfcf8" }}>
        {/* Header */}
        <HeaderUniversal tipo={tipoConteudo} />
        
        <div style={{ 
          maxWidth: "850px", 
          margin: "0 auto", 
          padding: "100px 20px", 
          textAlign: "center", 
          fontFamily: "'Georgia', serif" 
        }}>
          <Link 
            href={voltarUrl} 
            style={{ 
              fontSize: "1rem", 
              color: labels.corDestaque, 
              textDecoration: "none", 
              marginBottom: "40px", 
              display: "inline-block" 
            }}
          >
            ← Voltar para {labels.header}
          </Link>
          <h1 style={{ fontSize: "2rem", color: "#999", marginBottom: "20px" }}>
            {labels.secao} não encontrada
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#bbb" }}>
            Este {labels.secao.toLowerCase()} ainda não está disponível.
          </p>
        </div>
      </div>
    );
  }

  // Renderizar conteúdo principal
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fdfcf8" }}>
      {/* Header Universal */}
      <HeaderUniversal tipo={tipoConteudo} />

      {/* Conteúdo Principal */}
      <main style={{ maxWidth: "750px", margin: "0 auto", padding: "40px 25px" }}>
        {/* Link de volta */}
        <Link 
          href={voltarUrl} 
          style={{ 
            fontSize: "0.9rem", 
            color: labels.corDestaque, 
            textDecoration: "none", 
            marginBottom: "30px", 
            display: "inline-block",
            fontFamily: "'Inter', sans-serif",
            transition: "opacity 0.2s ease"
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          ← Voltar para {voltarTexto || labels.header}
        </Link>

        {/* Título */}
        <header style={{ marginBottom: "25px" }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            color: "#1a1a1a", 
            marginBottom: "15px", 
            fontStyle: "italic",
            fontFamily: "'Georgia', serif",
            lineHeight: "1.2"
          }}>
            {titulo}
          </h1>
          
          {/* Linha decorativa amarela (referência ao legado) */}
          <div style={{
            width: "80px",
            height: "4px",
            background: "linear-gradient(to right, #F7D179, transparent)",
            borderRadius: "2px"
          }} />
        </header>

        {/* Data (se houver) */}
        {data && (
          <div style={{ 
            backgroundColor: "#f0f4f8", 
            padding: "12px 20px", 
            borderLeft: `3px solid ${labels.corDestaque}`,
            marginBottom: "35px",
            borderRadius: "0 5px 5px 0"
          }}>
            <p style={{ 
              margin: 0, 
              fontFamily: "'Inter', sans-serif", 
              fontSize: "0.9rem", 
              color: "#666" 
            }}>
              📅 {data}
            </p>
          </div>
        )}

        {/* Texto Principal - HTML com suporte a cores legadas */}
        <article 
          className={cssClass}
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.95",
            color: "#333",
            fontFamily: "'Georgia', serif",
            textAlign: "justify"
          }}
          dangerouslySetInnerHTML={{ __html: texto }} 
        />

        {/* Fonte/Referência (se houver) */}
        {fonte && (
          <aside style={{
            marginTop: "50px",
            paddingTop: "25px",
            borderTop: "1px solid #e0e0e0",
            fontSize: "0.85rem",
            color: "#888",
            fontFamily: "'Inter', sans-serif"
          }}>
            <p style={{ margin: "5px 0" }}>
              <strong>Fonte:</strong> {fonte}
            </p>
          </aside>
        )}

        {/* Nota de rodapé (se houver) */}
        {nota_rodape && (
          <aside style={{
            marginTop: "20px",
            padding: "15px 20px",
            backgroundColor: "#f9f9f9",
            borderLeft: "3px solid #F7D179",
            fontSize: "0.9rem",
            color: "#666",
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
            borderRadius: "0 5px 5px 0"
          }}>
            {nota_rodape}
          </aside>
        )}
      </main>

      {/* Estilos CSS universais para suportar formatação legada */}
      <EstilosLegados cssClass={cssClass} corDestaque={labels.corDestaque} />
    </div>
  );
}

// ============================================
// SUB-COMPONENTE: HEADER UNIVERSAL
// ============================================
function HeaderUniversal({ tipo }: { tipo: TemplateConteudoProps["tipoConteudo"] }) {
  const label = LABELS[tipo];
  
  return (
    <header style={{ 
      width: "100%", 
      height: "80px", 
      background: "linear-gradient(to right, rgba(32,80,160,0.9) 0%, rgba(32,80,160,0.7) 60%, rgba(255,255,255,0.1) 100%)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      /* Detalhe amarelo de referência (canto inferior) */
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "150px",
        height: "3px",
        background: "#F7D179"
      }} />
      
      <p style={{ 
        color: "rgba(255,255,255,0.9)", 
        fontFamily: "'Inter', sans-serif", 
        fontSize: "0.8rem", 
        letterSpacing: "4px", 
        textTransform: "uppercase" 
      }}>
        Dalila Teles Veras • {label.header}
      </p>
    </header>
  );
}

// ============================================
// SUB-COMPONENTE: ESTILOS CSS LEGADOS
// Suporte para formatação do site antigo
// ============================================
function EstilosLegados({ cssClass, corDestaque }: { cssClass: string; corDestaque: string }) {
  return (
    <style jsx global>{`
      /* ===== BASE DO CONTEÚDO ===== */
      .${cssClass} p {
        margin-bottom: 20px;
      }
      
      .${cssClass} p:last-child {
        margin-bottom: 0;
      }

      /* ===== SUPORTE A CORES DO LEGADO ===== */
      
      /* Tags <font color> - Azul principal */
      .${cssClass} font[color="#2050A0"],
      .${cssClass} font[color="#2050a0"],
      .${cssClass} font[color="#000080"],
      .${cssClass} font[color="#00008"] {
        color: ${corDestaque} !important;
        font-weight: 500;
      }

      /* Spans e elementos inline com cor */
      .${cssClass} span[style*="color:#2050A0"],
      .${cssClass} span[style*="color: #2050A0"],
      .${cssClass} span[style*="color:#2050a0"],
      .${cssClass} span[style*="color:#000080"] {
        color: ${corDestaque} !important;
      }

      /* Parágrafos com cor azul */
      .${cssClass} p[style*="color:#2050A0"],
      .${cssClass} p[style*="color: #2050A0"],
      .${cssClass} p[style*="color:#000080"] {
        color: ${corDestaque} !important;
      }

      /* ===== LINKS ===== */
      .${cssClass} a {
        color: ${corDestaque};
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: border-color 0.2s ease;
      }

      .${cssClass} a:hover {
        border-bottom-color: ${corDestaque};
      }

      /* ===== BLOCKQUOTES (CITAÇÕES/POEMAS) ===== */
      .${cssClass} blockquote {
        margin: 30px 0;
        padding: 25px 30px;
        background-color: #f8f4e9;
        border-left: 4px solid #F7D179;
        font-style: italic;
        color: #555;
        border-radius: 0 8px 8px 0;
      }
      
      .${cssClass} blockquote p {
        margin-bottom: 12px;
      }
      
      /* Poemas (parágrafos sem margem, como no legado) */
      .${cssClass} blockquote p[style*="margin: 0"],
      .${cssClass} blockquote p[style*="margin:0"] {
        margin-bottom: 8px;
        line-height: 1.6;
      }

      /* ===== FORMATAÇÃO DE TEXTO ===== */
      .${cssClass} em,
      .${cssClass} i {
        font-style: italic;
        color: #444;
      }

      .${cssClass} strong,
      .${cssClass} b {
        font-weight: 600;
        color: #222;
      }

      .${cssClass} u {
        text-decoration: underline;
        text-decoration-color: ${corDestaque};
      }

      /* ===== TÍTULOS INTERNOS ===== */
      .${cssClass} h2,
      .${cssClass} h3 {
        color: ${corDestaque};
        font-family: "'Georgia', serif";
        margin-top: 35px;
        margin-bottom: 15px;
      }
      
      .${cssClass} h2 { font-size: 1.6rem; }
      .${cssClass} h3 { font-size: 1.3rem; }

      /* ===== LISTAS ===== */
      .${cssClass} ul,
      .${cssClass} ol {
        margin: 20px 0;
        padding-left: 30px;
      }
      
      .${cssClass} li {
        margin-bottom: 10px;
      }

      /* ===== SEPARADORES ===== */
      .${cssClass} hr {
        border: none;
        height: 1px;
        background: linear-gradient(to right, #F7D179, transparent);
        margin: 40px 0;
      }
    `}</style>
  );
}
