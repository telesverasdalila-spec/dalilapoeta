"use client";
import { useState } from "react";
import Hero from "./Hero";
import CabecalhoFixo from "./components/CabecalhoFixo";
import EstradaVida from "./components/EstradaVida";
import SecaoPremios from "./components/SecaoPremios";
import SecaoObras from "./components/SecaoObras";
import SecaoMovimento from "./components/SecaoMovimento";
import SecaoImprensa from "./components/SecaoImprensa";

export default function Home() {
  const [eixoAtivo, setEixoAtivo] = useState<string>("vida");

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
          <CabecalhoFixo abaAtiva="vida" mudarAba={() => {}} />
          <EstradaVida />
          <SecaoPremios />
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

      {/* Rodapé */}
      <footer style={{
        backgroundColor: '#2D3748',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <p style={{ margin: 0, fontFamily: 'Georgia, serif' }}>
          Dalila Teles Veras — © {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}
