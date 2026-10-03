"use client";

import dadosPremios from "../data/vida/premios.json";
import { extrairAnoBase } from "../lib/tempo";

interface Premio { ano: number; descricao: string; }

export default function SecaoPremios() {
  // Ordena do mais novo para o mais velho
  const premiosOrdenados = [...dadosPremios].sort((a, b) => b.ano - a.ano);

  // Agrupa os prêmios por DÉCADA (mesmo padrão usado em Obras e Movimento),
  // pra régua do tempo funcionar do mesmo jeito em todas as seções.
  const premiosAgrupados: { decada: number; itens: Premio[] }[] = [];
  premiosOrdenados.forEach((premio) => {
    const decada = Math.floor(extrairAnoBase(premio.ano) / 10) * 10;
    const ultimo = premiosAgrupados[premiosAgrupados.length - 1];
    if (!ultimo || ultimo.decada !== decada) {
      premiosAgrupados.push({ decada, itens: [premio] });
    } else {
      ultimo.itens.push(premio);
    }
  });

  return (
    <div className="header-obra">
      <div style={{maxWidth: "850px", margin: "0 auto", position: "relative"}}>
        <div className="estrada estrada-obra">
          {premiosAgrupados.map((grupo, gIndex) => (
            <div key={grupo.decada}>
              <div
                id={`c-${grupo.decada}`}
                className="separador-genero"
                style={{ marginTop: gIndex === 0 ? '0' : '30px' }}
              >
                {grupo.decada}-{grupo.decada + 9}
              </div>

              {grupo.itens.map((item, index) => (
                <div className="trecho" key={index}>
                  <p style={{ fontSize: "1.1rem", margin: "0 0 15px", textAlign: "justify" }}>
                    <strong>{item.ano}</strong> — {item.descricao}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
