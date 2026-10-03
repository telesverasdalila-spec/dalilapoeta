"use client";
import { useState } from "react";

interface HeroProps {
  eixoAtivo: string;
  mudarEixo: (novoEixo: string) => void;
}

export default function Hero({ eixoAtivo, mudarEixo }: HeroProps) {
  return (
    <section className="hero-container" style={{
      position: 'relative', width: '100%', height: '88vh',
      minHeight: '520px', overflow: 'hidden', background: '#1a1a1a'
    }}>
      <img src="/dalila-pb.png" alt="Dalila P&B" className="hero-img hero-img-pb" />
      <img src="/dalila-colorida.png" alt="Dalila Colorida" className="hero-img hero-img-colorida" />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.88) 100%)', zIndex: 1
      }} />
      
      <div className="hero-text-wrapper" style={{
        position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', width: '100%',
        color: 'white', fontFamily: 'serif',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)', letterSpacing: 'clamp(2px, 1vw, 6px)', textTransform: 'uppercase', textAlign: 'center', width: '100%', padding: '0 20px' }}>
          Dalila Teles Veras
        </h1>
        <p style={{ fontSize: 'clamp(0.85rem, 2vw, 1.2rem)', opacity: 0.7, fontStyle: 'italic', marginTop: '10px', textAlign: 'center', width: '100%', padding: '0 20px' }}>
          Poeta · Cronista · Memorialista
        </p>
      </div>
      
      <nav className="hero-menu">
        <a href="#" className={eixoAtivo === "vida" ? "ativo" : "inativo"} onClick={(e) => { e.preventDefault(); mudarEixo("vida"); }}>Vida</a>
        <a href="#" className={eixoAtivo === "obra" ? "ativo" : "inativo"} onClick={(e) => { e.preventDefault(); mudarEixo("obra"); }}>Obra</a>
        <a href="#" className={eixoAtivo === "movimento" ? "ativo" : "inativo"} onClick={(e) => { e.preventDefault(); mudarEixo("movimento"); }}>Movimento</a>
      </nav>
    </section>
  );
}