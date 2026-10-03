"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

// Interface para os dados da crônica
interface DadosCronica {
  id: string;
  titulo: string;
  tipo: string;
  texto: string;
  data_publicacao: string | null;
  fonte_original: string | null;
  fonte?: {
    url?: string;
    texto?: string;
    nota?: string;
  };
}

// Mapeamento de IDs para importar os JSONs dinamicamente
const cronicasDisponiveis = [
  "a-cidade-do-meu-desejo",
  "cronica-2",
  "cronica-3",
  "cronica-4",
  "cronica-5",
  "cronica-6",
  "cronica-7",
  "cronica-8",
  "cronica-9",
];

export default function CronicaIndividualPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [dados, setDados] = useState<DadosCronica | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  useEffect(() => {
    async function carregarCronica() {
      if (!id || !cronicasDisponiveis.includes(id)) {
        setNaoEncontrado(true);
        setCarregando(false);
        return;
      }

      try {
        // Importa o JSON dinamicamente baseado no ID
        const modulo = await import(`./dados.json`);
        setDados(modulo.default || modulo);
      } catch (erro) {
        console.error("Erro ao carregar crônica:", erro);
        setNaoEncontrado(true);
      } finally {
        setCarregando(false);
      }
    }

    carregarCronica();
  }, [id]);

  // Estado de carregamento
  if (carregando) {
    return (
      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <p style={{ color: '#666' }}>Carregando crônica...</p>
      </div>
    );
  }

  // Crônica não encontrada
  if (naoEncontrado || !dados) {
    return (
      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        minHeight: '60vh'
      }}>
        <h1 style={{ color: '#1a1a1a', marginBottom: '20px' }}>
          Crônica não encontrada
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          A crônica que você procura não existe ou foi removida.
        </p>
        <Link 
          href="/obra/cronica"
          style={{ 
            color: '#2050A0', 
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          ← Ver todas as crônicas
        </Link>
      </div>
    );
  }

  return (
    <article className="cronica-conteudo" style={{
      padding: '40px 20px',
      maxWidth: '750px',
      margin: '0 auto',
      minHeight: '60vh'
    }}>
      {/* Cabeçalho */}
      <header style={{ 
        marginBottom: '40px', 
        paddingBottom: '20px',
        borderBottom: '2px solid #F7D179'
      }}>
        <span style={{
          display: 'inline-block',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: '#888',
          marginBottom: '10px'
        }}>
          Crônica
        </span>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          color: '#1a1a1a',
          fontFamily: 'Georgia, serif',
          lineHeight: '1.3',
          marginBottom: '15px'
        }}>
          {dados.titulo}
        </h1>
        {dados.data_publicacao && (
          <time style={{ 
            fontSize: '0.95rem', 
            color: '#666',
            fontStyle: 'italic'
          }}>
            {new Date(dados.data_publicacao).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long'
            })}
          </time>
        )}
      </header>

      {/* Conteúdo da crônica */}
      <div 
        className="texto-cronica"
        style={{
          fontSize: '1.1rem',
          lineHeight: '1.8',
          color: '#333',
          fontFamily: 'Georgia, serif'
        }}
        dangerouslySetInnerHTML={{ __html: dados.texto }}
      />

      {/* Fonte/Referência (se houver) */}
      {dados.fonte && (
        <footer style={{
          marginTop: '50px',
          paddingTop: '20px',
          borderTop: '1px dashed #ccc',
          fontSize: '0.9rem',
          color: '#666',
          fontStyle: 'italic'
        }}>
          <p>
            <span>📚 Fonte: </span>
            {dados.fonte.url ? (
              <a 
                href={dados.fonte.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#2050A0' }}
              >
                {dados.fonte.texto || dados.fonte.url}
              </a>
            ) : (
              <span>{dados.fonte.texto}</span>
            )}
          </p>
          {dados.fonte.nota && (
            <p style={{ marginTop: '8px' }}>{dados.fonte.nota}</p>
          )}
        </footer>
      )}

      {/* Navegação */}
      <nav style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <Link 
          href="/obra/cronica"
          style={{ 
            color: '#2050A0', 
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          ← Todas as crônicas
        </Link>
        <Link 
          href="/#obra"
          style={{ 
            color: '#2050A0', 
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Voltar ao início →
        </Link>
      </nav>
    </article>
  );
}
