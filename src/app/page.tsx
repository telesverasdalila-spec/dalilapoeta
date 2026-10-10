"use client";
import { useState, useEffect } from "react";
import Hero from "./Hero";
import CabecalhoFixo from "./components/CabecalhoFixo";
import EstradaVida from "./components/EstradaVida";
import SecaoPremios from "./components/SecaoPremios";
import SecaoObras from "./components/SecaoObras";
import SecaoMovimento from "./components/SecaoMovimento";
import SecaoImprensa from "./components/SecaoImprensa";

export default function Home() {
  const [eixoAtivo, setEixoAtivo] = useState<string>("vida");
  const [abaVida, setAbaVida] = useState<string>("crono");

  // Link de volta das páginas de texto (/texto/[id]) usa ?eixo=obra
  // para reabrir a home direto no eixo certo (Hero usa estado, não âncoras).
  useEffect(() => {
    const eixo = new URLSearchParams(window.location.search).get("eixo");
    if (eixo === "obra" || eixo === "vida" || eixo === "movimento") {
      setEixoAtivo(eixo);
    }
  }, []);

  const mudarEixo = (novoEixo: string) => {
    setEixoAtivo(novoEixo);
  };

  return (
    <>
      {/* Hero com navegação por eixos */}
      <Hero eixoAtivo={eixoAtivo} mudarEixo={mudarEixo} />

      {/* EIXO VIDA */}
      {eixoAtivo === "vida" && (
        <>
          <CabecalhoFixo abaAtiva={abaVida} mudarAba={setAbaVida} />
          {abaVida === "crono" && <EstradaVida />}
          {abaVida === "premios" && <SecaoPremios />}
          {abaVida === "imprensa" && <SecaoImprensa />}
        </>
      )}

      {/* EIXO OBRA */}
      {eixoAtivo === "obra" && (
        <SecaoObras />
      )}

      {/* EIXO MOVIMENTO */}
      {eixoAtivo === "movimento" && (
        <SecaoMovimento />
      )}

      {/* Rodapé — cinza fotográfico (tons das fotos P&B) com letras douradas;
          simplificado a pedido da usuária: nome em minúsculas + © ano, sem filigrana,
          com a mesma fonte das tabs principais (Inter 500, 0.95rem) */}
      <footer style={{
        background: 'linear-gradient(180deg, #6b6b6b 0%, #5a5a5a 100%)',
        color: '#F7D179',
        padding: '1.05rem 2rem 1rem',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: '0.95rem' }}>
          dalila teles veras—© {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}
