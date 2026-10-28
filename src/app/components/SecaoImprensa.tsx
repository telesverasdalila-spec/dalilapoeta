"use client";

import type { CSSProperties } from "react";
import dadosImprensa from "../data/vida/imprensa.json";

// Task 105: Mídia/Imprensa dadificada — o conteúdo agora vive na ficha
// "Mídia e Contato" do painel (src/app/data/vida/imprensa.json).
// Estilos idênticos ao JSX original (hardcoded) — pixel a pixel.

interface LinkCanal { rotulo: string; url: string; descricao: string; }
interface GrupoCanal { titulo: string; links: LinkCanal[]; }

const estiloIntro: CSSProperties = { textAlign: "center", fontSize: "1.1rem", color: "#2b2b2b", marginBottom: "40px" };
const estiloH3: CSSProperties = { fontSize: "1.4rem", fontWeight: "600", color: "#8b6914", borderBottom: "2px solid #ebebeb", paddingBottom: "10px", marginBottom: "20px" };
const estiloA: CSSProperties = { color: "#7a3b5a", textDecoration: "none", fontWeight: "500", borderBottom: "1px solid transparent", transition: "0.3s" };
const estiloDescricao: CSSProperties = { display: "block", fontSize: "0.9rem", color: "#2b2b2b", marginTop: "5px" };
const estiloEndereco: CSSProperties = { marginTop: "15px", fontSize: "0.95rem", color: "#2b2b2b" };

export default function SecaoImprensa() {
  const { introducao, grupos, enderecoTitulo, enderecoLinha } = dadosImprensa as {
    introducao: string;
    grupos: GrupoCanal[];
    enderecoTitulo: string;
    enderecoLinha: string;
  };

  return (
    <div className="container-vida">
      <div className="estrada" style={{ paddingTop: "30px" }}>

        <div className="trecho">
          <p style={estiloIntro}>
            {introducao}
          </p>
        </div>

        {grupos.map((grupo: GrupoCanal, gi: number) => (
          <div key={gi} className="trecho" style={{ marginBottom: "40px" }}>
            <h3 style={estiloH3}>{grupo.titulo}</h3>
            {grupo.links.map((link: LinkCanal, li: number) => {
              const externo = link.url.startsWith("http");
              return (
                <p key={li} style={li > 0 ? { marginTop: "15px" } : undefined}>
                  <a href={link.url}
                     {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                     style={estiloA}
                     onMouseOver={(e) => e.currentTarget.style.borderBottomColor = "#7a3b5a"}
                     onMouseOut={(e) => e.currentTarget.style.borderBottomColor = "transparent"}>
                    {link.rotulo}
                  </a>
                  {link.descricao ? (
                    <span style={estiloDescricao}>
                      {link.descricao}
                    </span>
                  ) : null}
                </p>
              );
            })}
            {gi === grupos.length - 1 && enderecoTitulo ? (
              <p style={estiloEndereco}>
                <strong>{enderecoTitulo}</strong><br />
                {enderecoLinha}
              </p>
            ) : null}
          </div>
        ))}

      </div>
    </div>
  );
}
