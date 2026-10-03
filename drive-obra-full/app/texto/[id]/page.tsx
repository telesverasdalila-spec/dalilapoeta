"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

// ============================================
// MODELO PADRONIZADO PARA TEXTOS
// Serve para: Ensaios, Crônicas, Livros com texto
// ============================================

interface DadosTexto {
  id: string;
  titulo: string;
  tipo: "ensaio" | "cronica" | "livro" | "artigo";
  subtitulo?: string;
  
  // Conteúdo principal
  texto: string;  // HTML completo
  
  // Metadados (opcionais)
  data_publicacao?: string;
  data_evento?: string;
  
  // Contexto do evento (opcional - principalmente para ensaios)
  contexto?: {
    evento?: string;
    local?: string;
    cidade?: string;
    organizador?: string;
  };
  
  // Imagem de capa (específica por tipo/tema)
  imagem?: {
    url: string;
    credito?: string;
    legenda?: string;
  };
  
  // Fonte original
  fonte_original?: {
    url?: string;
    texto: string;
    nota?: string;
  };
  
  // Configuração visual (opcional - sobrescreve padrão)
  estilo?: {
    cor_destaque?: string;      // Cor de títulos e destaques
    cor_fundo_citacao?: string; // Cor de fundo de citações
    manter_cores_originais?: boolean; // true = usa cores do HTML original
  };
}

// ============================================
// ESTILOS PADRONIZADOS (CSS Variables)
// Fáceis de personalizar depois!
// ============================================
const estilosPadrao = {
  // Cores principais (podem ser sobrescritas por texto.estilo)
  cores: {
    primaria: "#2050A0",       // Azul principal (títulos, links)
    secundaria: "#F7D179",     // Dourado (destaques, bordas)
    texto: "#333333",          // Cor do texto principal
    texto_secundario: "#666666", // Texto secundário
    fundo_citacao: "#f8f4e9",  // Fundo de citações (creme suave)
    borda_citacao: "#F7D179",  // Borda de citações
  },
  
  // Tipografia
  fontes: {
    titulo: "'Georgia', 'Times New Roman', serif",
    corpo: "'Georgia', 'Times New Roman', serif",
    meta: "'Inter', 'Arial', sans-serif",
  },
  
  // Tamanhos
  tamanhos: {
    titulo_principal: "clamp(2rem, 4vw, 2.8rem)",
    titulo_secao: "1.5rem",
    corpo: "1.15rem",
    citacao: "1.25rem",
    meta: "0.9rem",
  }
};

export default function TextoIndividualPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [dados, setDados] = useState<DadosTexto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  useEffect(() => {
    async function carregarTexto() {
      if (!id) {
        setNaoEncontrado(true);
        setCarregando(false);
        return;
      }

      try {
        const modulo = await import(`./dados.json`);
        setDados(modulo.default || modulo);
      } catch (erro) {
        console.error("Erro ao carregar texto:", erro);
        setNaoEncontrado(true);
      } finally {
        setCarregando(false);
      }
    }

    carregarTexto();
  }, [id]);

  // Estado de carregamento
  if (carregando) {
    return (
      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center',
        fontFamily: estilosPadrao.fontes.meta,
        color: estilosPadrao.cores.texto_secundario
      }}>
        <p>Carregando texto...</p>
      </div>
    );
  }

  // Texto não encontrado
  if (naoEncontrado || !dados) {
    return (
      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center',
        fontFamily: estilosPadrao.fontes.meta,
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ 
          color: estilosPadrao.cores.primaria, 
          marginBottom: '20px',
          fontSize: estilosPadrao.tamanhos.titulo_principal
        }}>
          Texto não encontrado
        </h1>
        <p style={{ color: estilosPadrao.cores.texto_secundario, marginBottom: '30px' }}>
          O texto que você procura não existe ou foi removido.
        </p>
        <Link 
          href="/#obra"
          style={{ 
            color: estilosPadrao.cores.primaria, 
            textDecoration: 'none',
            fontWeight: '500',
            padding: '12px 24px',
            border: `2px solid ${estilosPadrao.cores.primaria}`,
            borderRadius: '5px',
            transition: 'all 0.3s ease'
          }}
        >
          ← Voltar para Obra
        </Link>
      </div>
    );
  }

  // Mesclar estilos personalizados com padrão
  const cores = { ...estilosPadrao.cores, ...dados.estilo };

  // Determinar rótulo do tipo
  const tipoRotulo = {
    ensaio: "Ensaio",
    cronica: "Crônica",
    livro: "Texto",
    artigo: "Artigo"
  }[dados.tipo] || "Texto";

  return (
    <article className="texto-conteudo" style={{
      minHeight: '100vh',
      backgroundColor: '#fefefe'
    }>
      {/* ============================================ */}
      {/* CABEÇALHO COM IMAGEM E TÍTULO */}
      {/* ============================================ */}
      <header style={{
        position: 'relative',
        backgroundImage: dados.imagem?.url 
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${dados.imagem.url})`
          : `linear-gradient(135deg, ${cores.primaria} 0%, #1a3a6b 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 20px 60px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {/* Rótulo do tipo */}
          <span style={{
            display: 'inline-block',
            fontSize: estilosPadrao.tamanhos.meta,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: cores.secundaria,
            marginBottom: '15px',
            fontWeight: '600',
            fontFamily: estilosPadrao.fontes.meta
          }}>
            {tipoRotulo}
          </span>

          {/* Título principal */}
          <h1 style={{
            fontSize: estilosPadrao.tamanhos.titulo_principal,
            fontFamily: estilosPadrao.fontes.titulo,
            lineHeight: '1.2',
            marginBottom: '15px',
            textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
          }}>
            {dados.titulo}
          </h1>

          {/* Subtítulo (se houver) */}
          {dados.subtitulo && (
            <p style={{
              fontSize: '1.2rem',
              fontStyle: 'italic',
              opacity: 0.95,
              fontFamily: estilosPadrao.fontes.titulo,
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              {dados.subtitulo}
            </p>
          )}

          {/* Data de publicação/evento */}
          {(dados.data_publicacao || dados.data_evento) && (
            <time style={{
              display: 'inline-block',
              marginTop: '20px',
              fontSize: estilosPadrao.tamanhos.meta,
              opacity: 0.85,
              fontFamily: estilosPadrao.fontes.meta
            }}>
              {dados.data_evento || dados.data_publicacao}
            </time>
          )}
        </div>

        {/* Crédito da imagem */}
        {dados.imagem?.credito && (
          <p style={{
            position: 'absolute',
            bottom: '10px',
            right: '20px',
            fontSize: '0.75rem',
            opacity: 0.7,
            fontFamily: estilosPadrao.fontes.meta
          }}>
            📷 {dados.imagem.credito}
          </p>
        )}
      </header>

      {/* ============================================ */}
      {/* CONTEXTO DO EVENTO (se houver - para ensaios) */}
      {/* ============================================ */}
      {dados.contexto && (
        <section style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '25px 20px',
          backgroundColor: '#f9f9f9',
          borderBottom: `3px solid ${cores.secundaria}`
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            fontFamily: estilosPadrao.fontes.meta,
            fontSize: estilosPadrao.tamanhos.meta,
            color: cores.texto_secundario
          }}>
            {dados.contexto.evento && (
              <span>
                <strong>Evento:</strong> {dados.contexto.evento}
              </span>
            )}
            {dados.contexto.local && (
              <span>
                <strong>Local:</strong> {dados.contexto.local}{dados.contexto.cidade ? `, ${dados.contexto.cidade}` : ''}
              </span>
            )}
            {dados.contexto.organizador && (
              <span>
                <strong>Organização:</strong> {dados.contexto.organizador}
              </span>
            )}
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* CONTEÚDO PRINCIPAL DO TEXTO */}
      {/* ============================================ */}
      <main 
        className="corpo-texto"
        style={{
          maxWidth: '750px',
          margin: '0 auto',
          padding: '50px 25px',
          fontSize: estilosPadrao.tamanhos.corpo,
          lineHeight: '1.9',
          color: dados.estilo?.manter_cores_originais ? undefined : cores.texto,
          fontFamily: estilosPadrao.fontes.corpo,
        }}
        dangerouslySetInnerHTML={{ __html: dados.texto }} 
      />

      {/* Estilos CSS para o conteúdo HTML */}
      <style jsx global>{`
        .corpo-texto h2 {
          font-size: ${estilosPadrao.tamanhos.titulo_secao};
          color: ${cores.primaria};
          font-family: ${estilosPadrao.fontes.titulo};
          margin-top: 40px;
          margin-bottom: 15px;
          border-bottom: 2px solid ${cores.secundaria};
          padding-bottom: 10px;
        }
        
        .corpo-texto h3 {
          font-size: 1.3rem;
          color: ${cores.primaria};
          font-family: ${estilosPadrao.fontes.titulo};
          margin-top: 30px;
          margin-bottom: 10px;
        }
        
        .corpo-texto p {
          margin-bottom: 20px;
          text-align: justify;
        }
        
        /* CITAÇÕES EM BLOCO */
        .corpo-texto blockquote {
          margin: 30px 0;
          padding: 25px 30px;
          background-color: ${cores.fundo_citacao};
          border-left: 5px solid ${cores.borda_citacao};
          font-style: italic;
          font-size: ${estilosPadrao.tamanhos.citacao};
          color: #444;
          border-radius: 0 8px 8px 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .corpo-texto blockquote p {
          margin-bottom: 10px;
        }
        
        /* ITÁLICO */
        .corpo-texto em, .corpo-texto i {
          font-style: italic;
          color: #555;
        }
        
        /* NEGRITO */
        .corpo-texto strong, .corpo-texto b {
          font-weight: 600;
          color: #222;
        }
        
        /* LINKS */
        .corpo-texto a {
          color: ${cores.primaria};
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s ease;
        }
        
        .corpo-texto a:hover {
          border-bottom-color: ${cores.primaria};
        }
        
        /* LISTAS */
        .corpo-texto ul, .corpo-texto ol {
          margin: 20px 0;
          padding-left: 30px;
        }
        
        .corpo-texto li {
          margin-bottom: 10px;
        }
      `}</style>

      {/* ============================================ */}
      {/* RODAPÉ COM FONTE E NAVEGAÇÃO */}
      {/* ============================================ */}
      <footer style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '30px 20px 50px',
        borderTop: '1px solid #e0e0e0'
      }}>
        {/* Fonte/Referência */}
        {dados.fonte_original && (
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '25px',
            fontSize: estilosPadrao.tamanhos.meta,
            fontFamily: estilosPadrao.fontes.meta,
            color: cores.texto_secundario
          }}>
            <p style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '1.1em' }}>📚</span>{' '}
              <strong>Fonte:</strong>{' '}
              {dados.fonte_original.url ? (
                <a 
                  href={dados.fonte_original.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: cores.primaria }}
                >
                  {dados.fonte_original.texto}
                </a>
              ) : (
                <span>{dados.fonte_original.texto}</span>
              )}
            </p>
            {dados.fonte_original.nota && (
              <p style={{ 
                fontStyle: 'italic', 
                marginTop: '10px',
                paddingLeft: '15px',
                borderLeft: `3px solid ${cores.secundaria}`
              }}>
                {dados.fonte_original.nota}
              </p>
            )}
          </div>
        )}

        {/* Navegação */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '15px',
          paddingTop: '20px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Link 
            href="/#obra"
            style={{ 
              color: cores.primaria, 
              textDecoration: 'none',
              fontWeight: '500',
              padding: '10px 20px',
              border: `1px solid ${cores.primaria}`,
              borderRadius: '5px',
              transition: 'all 0.3s ease'
            }}
          >
            ← Voltar ao início
          </Link>
          
          <Link 
            href="/obra"
            style={{ 
              color: cores.primaria, 
              textDecoration: 'none',
              fontWeight: '500',
              padding: '10px 20px',
              border: `1px solid ${cores.primaria}`,
              borderRadius: '5px',
              transition: 'all 0.3s ease'
            }}
          >
            Ver todas as obras →
          </Link>
        </nav>
      </footer>
    </article>
  );
}
