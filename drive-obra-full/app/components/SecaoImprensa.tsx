"use client";

export default function SecaoImprensa() {
  return (
    <div className="container-vida">
      <div className="estrada" style={{ paddingTop: "30px" }}>

        <div className="trecho">
          
          <p style={{ textAlign: "center", fontSize: "1.1rem", color: "#555", marginBottom: "40px" }}>
            Acompanhe o trabalho de Dalila Teles Veras através dos canais oficiais:
          </p>
        </div>

        {/* BLOGS */}
        <div className="trecho" style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "1.4rem", fontWeight: "600", color: "#d4af37", borderBottom: "2px solid #ebebeb", paddingBottom: "10px", marginBottom: "20px" }}>
            ✍️ Blogs
          </h3>
          <p>
            <a href="https://dalilatelesveras.blogspot.com" target="_blank" rel="noopener noreferrer" style={{ color: "#7a3b5a", textDecoration: "none", fontWeight: "500", borderBottom: "1px solid transparent", transition: "0.3s" }}
               onMouseOver={(e) => e.currentTarget.style.borderBottomColor = "#7a3b5a"}
               onMouseOut={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>
              📖 À Janela dos Dias
            </a>
            <span style={{ display: "block", fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Blog literário e cultural desde 2009.
            </span>
          </p>
          <p style={{ marginTop: "15px" }}>
            <a href="https://blog.alpharrabio.com.br" target="_blank" rel="noopener noreferrer" style={{ color: "#7a3b5a", textDecoration: "none", fontWeight: "500", borderBottom: "1px solid transparent", transition: "0.3s" }}
               onMouseOver={(e) => e.currentTarget.style.borderBottomColor = "#7a3b5a"}
               onMouseOut={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>
              📚 Blog do Alpharrabio
            </a>
            <span style={{ display: "block", fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
              Caderno de registros, apropriações, inquietudes e intervenções (2006-2023).
            </span>
          </p>
        </div>

        {/* REDES SOCIAIS E SITES */}
        <div className="trecho" style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "1.4rem", fontWeight: "600", color: "#d4af37", borderBottom: "2px solid #ebebeb", paddingBottom: "10px", marginBottom: "20px" }}>
            🔗 Sites e Redes Sociais
          </h3>
          <p>
            <a href="https://www.alpharrabio.com.br" target="_blank" rel="noopener noreferrer" style={{ color: "#7a3b5a", textDecoration: "none", fontWeight: "500", borderBottom: "1px solid transparent", transition: "0.3s" }}
               onMouseOver={(e) => e.currentTarget.style.borderBottomColor = "#7a3b5a"}
               onMouseOut={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>
              🏛️ Alpharrabio — Livraria, Editora e Espaço Cultural
            </a>
          </p>
          <p style={{ marginTop: "15px" }}>
            <a href="https://www.instagram.com/dalilatelesveras" target="_blank" rel="noopener noreferrer" style={{ color: "#7a3b5a", textDecoration: "none", fontWeight: "500", borderBottom: "1px solid transparent", transition: "0.3s" }}
               onMouseOver={(e) => e.currentTarget.style.borderBottomColor = "#7a3b5a"}
               onMouseOut={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>
              📸 Instagram
            </a>
          </p>
          <p style={{ marginTop: "15px" }}>
            <a href="https://www.facebook.com/dalilatelesveras" target="_blank" rel="noopener noreferrer" style={{ color: "#7a3b5a", textDecoration: "none", fontWeight: "500", borderBottom: "1px solid transparent", transition: "0.3s" }}
               onMouseOver={(e) => e.currentTarget.style.borderBottomColor = "#7a3b5a"}
               onMouseOut={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>
              👍 Facebook
            </a>
          </p>
        </div>

        {/* CONTATO */}
        <div className="trecho" style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "1.4rem", fontWeight: "600", color: "#d4af37", borderBottom: "2px solid #ebebeb", paddingBottom: "10px", marginBottom: "20px" }}>
            📧 Contato
          </h3>
          <p>
            <a href="mailto:dalila@alpharrabio.com.br" style={{ color: "#7a3b5a", textDecoration: "none", fontWeight: "500", borderBottom: "1px solid transparent", transition: "0.3s" }}
               onMouseOver={(e) => e.currentTarget.style.borderBottomColor = "#7a3b5a"}
               onMouseOut={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>
              📧 dalila@alpharrabio.com.br
            </a>
          </p>
          <p style={{ marginTop: "15px", fontSize: "0.95rem", color: "#666" }}>
            <strong>Alpharrabio Livraria, Editora e Espaço Cultural</strong><br />
            📍 Santo André, SP — Brasil
          </p>
        </div>

      </div>
    </div>
  );
}