"use client";
import Link from "next/link";

// ============================================
// LISTA DE ENSAIOS DE DALILA TELES VERAS
// Cada item linka para /ensaios/[id]
// ============================================

interface EnsaioItem {
  id: string;
  titulo: string;
  data?: string;
  evento_origem?: string;
  local?: string;
}

// Lista de ensaios (será populada com dados reais)
const ensaios: EnsaioItem[] = [
  { 
    id: "cafe-verso-e-historia", 
    titulo: "Café, Verso e História", 
    data: "2000",
    evento_origem: "Projeto Estação Café - SESC São Caetano do Sul"
  },
  // Adicione mais ensaios aqui conforme forem sendo migrados
];

export default function PaginaEnsaios() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fdfcf8'
    }}>
      {/* Cabeçalho */}
      <header style={{ 
        width: "100%", 
        height: "80px", 
        background: "linear-gradient(to right, rgba(122,59,90,0.9) 0%, rgba(122,59,90,0.7) 60%, rgba(255,255,255,0.1) 100%)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        position: "relative"
      }}>
        {/* Detalhe amarelo */}
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
          Dalila Teles Veras • Ensaios
        </p>
      </header>

      {/* Conteúdo Principal */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 25px" }}>
        {/* Título da Seção */}
        <h1 style={{ 
          fontSize: "2.5rem", 
          color: "#7a3b5a", // Cor diferenciada para ensaios
          marginBottom: "10px",
          fontFamily: "'Georgia', serif"
        }}>
          Ensaios
        </h1>
        
        <p style={{
          fontSize: "1.1rem",
          color: "#666",
          fontFamily: "'Georgia', serif",
          fontStyle: "italic",
          marginBottom: "40px"
        }}>
          Reflexões sobre literatura, cultura e sociedade
        </p>

        {/* Lista de Ensaios */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {ensaios.map((ensaio) => (
            <Link 
              key={ensaio.id}
              href={`/ensaios/${ensaio.id}`}
              style={{
                display: "block",
                padding: "25px 30px",
                backgroundColor: "#ffffff",
                border: "2px solid #e8e8e8",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#7a3b5a";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(122,59,90,0.15)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#e8e8e8";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px"
              }}>
                <h2 style={{
                  fontSize: "1.4rem",
                  fontFamily: "'Georgia', serif",
                  color: "#7a3b5a",
                  margin: 0,
                  fontWeight: "500"
                }}>
                  {ensaio.titulo}
                </h2>
                
                {ensaio.data && (
                  <span style={{
                    fontSize: "0.9rem",
                    color: "#999999",
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    📅 {ensaio.data}
                  </span>
                )}
              </div>
              
              {ensaio.evento_origem && (
                <p style={{
                  marginTop: "12px",
                  fontSize: "0.9rem",
                  color: "#888",
                  fontFamily: "'Inter', sans-serif",
                  margin: "12px 0 0 0"
                }}>
                  📍 {ensaio.evento_origem}
                </p>
              )}
              
              <div style={{
                marginTop: "12px",
                color: "#F7D179",
                fontSize: "0.85rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontFamily: "'Inter', sans-serif"
              }}>
                Ler ensaio →
              </div>
            </Link>
          ))}
        </div>

        {/* Mensagem se não houver ensaios */}
        {ensaios.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#999"
          }}>
            <p style={{ fontSize: "1.2rem", fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
              Em breve novos ensaios serão adicionados...
            </p>
          </div>
        )}
      </div>

      {/* Navegação */}
      <nav style={{
        maxWidth: "800px",
        margin: "50px auto 0",
        padding: "0 25px 40px"
      }}>
        <Link 
          href="/#obra"
          style={{ 
            color: "#7a3b5a", 
            textDecoration: "none",
            fontWeight: "500",
            padding: "12px 24px",
            border: "1px solid #7a3b5a",
            borderRadius: "5px",
            transition: "all 0.3s ease",
            fontFamily: "'Inter', sans-serif",
            display: "inline-block"
          }}
        >
          ← Voltar ao início
        </Link>
      </nav>
    </div>
  );
}
