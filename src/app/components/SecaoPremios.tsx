"use client";

import dadosPremios from "../data/vida/premios.json";

interface Premio { ano: number; texto: string; }

export default function SecaoPremios() {
  // Ordem crescente, igual à CronoBiografia (1984 -> 2024)
  const itens: Premio[] = [...dadosPremios].sort((a, b) => a.ano - b.ano);

  // Agrupa por década em secao-decada — a MESMA estrutura da CronoBiografia:
  // .estrada (linha vertical dourada) > .secao-decada[id=c-XXXX] (âncora da
  // régua do tempo) > .trecho (círculo dourado na linha) > .trecho-citacao
  // (card com ano em cima, texto abaixo).
  const grupos: { decada: number; itens: Premio[] }[] = [];
  for (const item of itens) {
    const decada = Math.floor(item.ano / 10) * 10;
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.decada === decada) {
      ultimo.itens.push(item);
    } else {
      grupos.push({ decada, itens: [item] });
    }
  }

  return (
    <div className="container-vida">
      <div className="estrada">
        {grupos.map((grupo) => (
          <div key={grupo.decada} id={`c-${grupo.decada}`} className="secao-decada">
            {grupo.itens.map((item, i) => (
              <div key={i} className="trecho">
                <div className="trecho-citacao">
                  <span className="ano">{item.ano}</span>
                  <p>{item.texto}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
