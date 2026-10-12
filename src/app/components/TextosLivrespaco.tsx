"use client";
import React from "react";

// ============================================================================
// TextosLivrespaco — Task 112 (recupera o layout do commit 2fbe94b, 6/out/2026)
// ----------------------------------------------------------------------------
// ⚠️ ARQUIVO PROTEGIDO — NÃO REMOVER NEM SOBRESCREVER ⚠️
// História: este layout já foi apagado uma vez (commit 2683a34, ajuste de abas
// do menu partiu de uma versão antiga do SecaoMovimento.tsx). Por isso ele
// mora NESTE arquivo separado: edições no SecaoMovimento não o apagam.
// Se a aba "Revista Livrespaço" um dia aparecer só com texto corrido, verifique
// no SecaoMovimento.tsx se o import e o desvio `tabAtiva === "livrespaco"`
// continuam lá.
//
// Layout aprovado pela dona do site ("tinha ficado bacana"):
//   1º parágrafo → recorte de jornal de 1983 + página do manifesto (lado a lado)
//   2º e 3º parágrafos → texto corrido
//   Fim → as 4 capas da revista, lado a lado, com a legenda "Capas da revista
//   Livrespaço"
// Imagens: public/images/livrespaco/ (minúsculas, já no repositório).
// Legendas em #333 (padrão de contraste da Task 103).
// ============================================================================

const estiloCapa: React.CSSProperties = {
  width: "178px",
  maxWidth: "100%",
  height: "auto",
  borderRadius: "4px",
  border: "1px solid #e3dccf",
  boxShadow: "0 3px 12px rgba(60,40,20,0.16)",
  background: "#fff"
};

export default function TextosLivrespaco() {
  return (
    <>
      <div className="trecho" key="li1"><p>Mais do que uma publicação literária, a Livrespaço foi um sopro de <strong>resistência e descentralização cultural</strong> que marcou a história da literatura brasileira entre 1983 e 1994. Idealizada e capitaneada por Dalila Teles Veras na região do Grande ABC, a revista nasceu como um manifesto vivo contra o monopólio cultural do eixo Rio-São Paulo e o engessamento da crítica universitária tradicional.</p></div>

      <figure key="li-fig1" style={{ margin: "30px 0", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "26px", flexWrap: "wrap" }}>
          <img
            src="/images/livrespaco/imp07azul.jpg"
            alt="Recorte de jornal de 17 de dezembro de 1983: Grupo Livrespaço quer atuar mais nas escolas"
            loading="lazy"
            style={{ width: "440px", maxWidth: "100%", height: "auto", borderRadius: "4px", border: "1px solid #e3dccf", boxShadow: "0 3px 12px rgba(60,40,20,0.16)", background: "#fff" }}
          />
          <img
            src="/images/livrespaco/revis02.jpg"
            alt="Página da Revista Livrespaço com o manifesto A (boa) Poesia Brasileira que não está nos cadernos literários da grande imprensa do eixo Rio-S.Paulo"
            loading="lazy"
            style={{ width: "300px", maxWidth: "100%", height: "auto", borderRadius: "4px", border: "1px solid #e3dccf", boxShadow: "0 3px 12px rgba(60,40,20,0.16)", background: "#fff" }}
          />
        </div>
        <figcaption style={{ marginTop: "12px", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", color: "#333" }}>
          Revista Livrespaço
        </figcaption>
      </figure>

      <div className="trecho" key="li2"><p>Sob o lema de que o Brasil é feito de muitas vozes e de que <em>"na poesia, ninguém substitui ninguém, acrescenta"</em>, a Livrespaço abriu suas páginas para o novo, o independente e a pluralidade de vozes que a grande imprensa insistia em ignorar.</p></div>

      <div className="trecho" key="li3"><p>Esse trabalho incansável de mapeamento, edição e fomento à poesia viva e marginal foi reconhecido nacionalmente em 1993, quando o projeto foi agraciado com o prestigiado <strong>Prêmio APCA</strong> (Associação Paulista de Críticos de Arte) na categoria de Melhor Realização Cultural.</p></div>

      <figure key="li-fig2" style={{ margin: "34px 0 10px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "22px", flexWrap: "wrap" }}>
          <img src="/images/livrespaco/le4a.jpg" alt="Capa da Revista Livrespaço" loading="lazy" style={estiloCapa} />
          <img src="/images/livrespaco/le8.jpg" alt="Capa da Revista Livrespaço" loading="lazy" style={estiloCapa} />
          <img src="/images/livrespaco/le7a.jpg" alt="Capa da Revista Livrespaço" loading="lazy" style={estiloCapa} />
          <img src="/images/livrespaco/le5a.jpg" alt="Capa da Revista Livrespaço" loading="lazy" style={estiloCapa} />
        </div>
        <figcaption style={{ marginTop: "12px", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", color: "#333" }}>
          Capas da revista Livrespaço
        </figcaption>
      </figure>
    </>
  );
}
