"use client";
import React from "react";

// ============================================================================
// TrechosDiuturnos — Task 108 (restaura a Task 86, commit b99c590)
// ----------------------------------------------------------------------------
// ⚠️ ARQUIVO PROTEGIDO — NÃO REMOVER NEM SOBRESCREVER ⚠️
// História: este layout já foi apagado uma vez (commit 031056f, inserção do
// livro 70 anos partiu de uma versão antiga do ConteudoObra.tsx). Por isso
// ele mora NESTE arquivo separado: edições no ConteudoObra.tsx não o apagam.
// Se um dia a página do Diuturnos voltar a mostrar abinhas por mês, verifique
// no ConteudoObra.tsx se o import e o desvio `id === "diuturnos"` continuam lá.
//
// Layout aprovado pela dona do site (12/out/2026):
//   • Meses EMPILHADOS, sem abinhas por mês
//   • Título do mês dourado (#8b6914) com traço dourado (#d4af37)
//   • Imagens intercaladas: esquerda / direita / esquerda / direita...
//   • A ÚLTIMA imagem (dezembro, réplica da de janeiro) fecha À ESQUERDA
//     — mesmo lado do primeiro poema, fechando o ciclo do ano.
// ============================================================================

interface TrechoMes {
  titulo: string;
  texto: string;
  imagem_mes?: string;
}

const IMAGEM_JANEIRO = "/imagens/obras-publicadas/poesia/diuturnos/diuturnos-janeiro.jpg";

export default function TrechosDiuturnos({ trechos }: { trechos: TrechoMes[] }) {
  return (
    <div>
      <style>{`
        .diu-mes { max-width: 800px; margin: 0 auto; padding: 4px 0 14px; }
        .diu-titulo { font-family: Georgia, serif; font-size: 2rem; font-weight: 400; letter-spacing: 5px; color: #8b6914; text-transform: uppercase; text-align: center; margin: 0 0 10px 0; }
        .diu-traco { width: 64px; height: 2px; background: #d4af37; margin: 0 auto 26px auto; }
        .diu-linha { display: flex; gap: 35px; align-items: flex-start; }
        .diu-direita { flex-direction: row-reverse; }
        .diu-imagem { flex: 0 0 280px; }
        .diu-imagem-card { background: #faf8f3; padding: 20px; border: 1px solid #e8e0d0; }
        .diu-imagem-card img { width: 100%; height: auto; display: block; }
        .diu-poema { flex: 1; font-size: 1.05rem; line-height: 1.85; font-family: Georgia, serif; color: #333; margin: 0; text-align: left; }
        .diu-separador { margin-top: 40px; height: 1px; background: linear-gradient(to right, transparent, #d4af37, transparent); }
        @media (max-width: 768px) {
          .diu-linha, .diu-linha.diu-direita { flex-direction: column; gap: 22px; }
          .diu-imagem { flex: none; width: 100%; max-width: 340px; margin: 0 auto; }
          .diu-titulo { font-size: 1.4rem; letter-spacing: 3px; }
        }
      `}</style>
      {trechos.map((t, i: number) => {
        const ehUltimo = i === trechos.length - 1;
        // Cinto de segurança: se o JSON do último mês apontar para outra imagem,
        // o código garante a réplica da de janeiro (fechamento do ciclo do ano).
        const imagemExibida = ehUltimo ? IMAGEM_JANEIRO : t.imagem_mes;
        // Zigzag: pares à esquerda, ímpares à direita — EXCETO o último,
        // que a dona pediu à ESQUERDA (eco do primeiro poema).
        const imagemADireita = i % 2 === 1 && !ehUltimo;
        return (
          <div key={i} className="diu-mes">
            <h2 className="diu-titulo">{t.titulo}</h2>
            <div className="diu-traco"></div>
            <div className={imagemADireita ? "diu-linha diu-direita" : "diu-linha"}>
              <div className="diu-imagem">
                <div className="diu-imagem-card">
                  {imagemExibida && <img src={imagemExibida} alt={t.titulo} />}
                </div>
              </div>
              <p className="diu-poema">
                {t.texto.split(/(\*\*[^*]+\*\*)/g).map((parte, j) => {
                  if (parte.startsWith("**") && parte.endsWith("**")) {
                    return (
                      <span key={j} style={{ fontWeight: "700", color: "#1a1a1a" }}>
                        {parte.slice(2, -2)}
                      </span>
                    );
                  }
                  return parte;
                })}
              </p>
            </div>
            {!ehUltimo && <div className="diu-separador"></div>}
          </div>
        );
      })}
    </div>
  );
}
