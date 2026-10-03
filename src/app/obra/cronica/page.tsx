"use client";
import Link from "next/link";

// Lista de crônicas - cada uma tem seu próprio JSON em [id]/dados.json
const cronicas = [
  { id: "a-cidade-do-meu-desejo", titulo: "A Cidade do Meu Desejo" },
  { id: "cronica-2", titulo: "Crônica 2" },
  { id: "cronica-3", titulo: "Crônica 3" },
  { id: "cronica-4", titulo: "Crônica 4" },
  { id: "cronica-5", titulo: "Crônica 5" },
  { id: "cronica-6", titulo: "Crônica 6" },
  { id: "cronica-7", titulo: "Crônica 7" },
  { id: "cronica-8", titulo: "Crônica 8" },
  { id: "cronica-9", titulo: "Crônica 9" },
];

export default function CronicasPage() {
  return (
    <div className="cronicas-container" style={{
      padding: '40px 20px',
      maxWidth: '900px',
      margin: '0 auto',
      minHeight: '60vh'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: '#1a1a1a',
          fontFamily: 'serif',
          marginBottom: '10px'
        }}>
          Crônicas
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          fontStyle: 'italic',
          fontFamily: 'Georgia, serif'
        }}>
          Escritas do cotidiano, prosa memorialista
        </p>
      </header>

      <div className="cronicas-lista" style={{
        display: 'grid',
        gap: '20px'
      }}>
        {cronicas.map((cronica) => (
          <Link 
            key={cronica.id} 
            href={`/obra/cronica/${cronica.id}`}
            className="cronica-card"
            style={{
              display: 'block',
              padding: '20px 25px',
              backgroundColor: '#fff',
              borderLeft: '4px solid #F7D179',
              textDecoration: 'none',
              color: '#1a1a1a',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(8px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: '500',
              marginBottom: '5px',
              fontFamily: 'Georgia, serif',
              color: '#2050A0'
            }}>
              {cronica.titulo}
            </h2>
            <span style={{ 
              fontSize: '0.85rem', 
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Ler crônica →
            </span>
          </Link>
        ))}
      </div>

      <nav style={{
        marginTop: '50px',
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #e0e0e0'
      }}>
        <Link 
          href="/#obra" 
          style={{
            color: '#2050A0',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          ← Voltar para Obra
        </Link>
      </nav>
    </div>
  );
}
