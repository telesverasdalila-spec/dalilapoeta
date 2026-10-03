"use client";
import React, { useState, use } from "react";
import Link from "next/link";

interface Palestra {
  titulo: string;
  data: string;
  local: string;
  descricao?: string;
}

export default function ConteudoPalestra({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // Dados das palestras (poderiam vir de JSONs como as obras)
  const palestras: Record<string, Palestra> = {
    "palestra-1": {
      titulo: "A Poesia Contemporânea Brasileira",
      data: "15 de março de 2024",
      local: "USP - Universidade de São Paulo",
      descricao: "Uma reflexão sobre os caminhos da poesia brasileira no século XXI, abordando autores e tendências atuais."
    },
    "palestra-2": {
      titulo: "Literatura e Memória",
      data: "20 de abril de 2024",
      local: "FL - Fundação Library",
      descricao: "Sobre o papel da literatura na preservação da memória individual e coletiva."
    }
  };

  const palestra = palestras[id];

  if (palestra) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fdfcf8" }}>
        <div style={{ 
          width: "100%", 
          height: "80px", 
          background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 60%, rgba(255,255,255,0.1) 100%)", 
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase" }}>Dalila Teles Veras • Palestras</p>
        </div>

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: "'Cormorant Garamond', serif" }}>
          <Link href="/?eixo=palestra" style={{ fontSize: "0.9rem", color: "#7a3b5a", textDecoration: "none", marginBottom: "30px", display: "inline-block" }}>
            ← Voltar para Palestras
          </Link>

          <h1 style={{ fontSize: "2.5rem", color: "#1a1a1a", marginBottom: "20px", fontStyle: "italic" }}>
            {palestra.titulo}
          </h1>

          <div style={{ 
            backgroundColor: "#f8f4f0", 
            padding: "20px", 
            borderLeft: "3px solid #d4af37",
            marginBottom: "30px"
          }}>
            <p style={{ margin: "5px 0", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#666" }}>
              📅 {palestra.data}
            </p>
            <p style={{ margin: "5px 0", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#666" }}>
              📍 {palestra.local}
            </p>
          </div>

          {palestra.descricao && (
            <p style={{ fontSize: "1.1rem", lineHeight: "1.9", color: "#333", textAlign: "justify" }}>
              {palestra.descricao}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fdfcf8" }}>
      <div style={{ 
        width: "100%", 
        height: "120px", 
        background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 60%, rgba(255,255,255,0.1) 100%)", 
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase" }}>Dalila Teles Veras • Palestras</p>
      </div>
      <div style={{ maxWidth: "850px", margin: "0 auto", padding: "100px 20px", textAlign: "center", fontFamily: '"Cormorant Garamond", serif' }}>
        <Link href="/?eixo=palestra" style={{ fontSize: "1rem", color: "#d4af37", textDecoration: "none", marginBottom: "40px", display: "inline-block" }}>← Voltar para Palestras</Link>
        <h1 style={{ fontSize: "2rem", color: "#999", marginBottom: "20px" }}>Palestra não encontrada</h1>
        <p style={{ fontSize: "1.1rem", color: "#bbb" }}>Esta palestra ainda não está disponível.</p>
      </div>
    </div>
  );
}
