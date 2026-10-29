"use client";
import { useEffect } from "react";

// Task 108: cores por Eixo na barra lateral do painel (Vida, Obra, Movimento).
// Painel de verdade nunca mais confuso: cada grupo ganha cor, borda e fundinho
// suave. Sobrevive a reordenação do menu (identifica pelo TEXTO do título,
// não pela posição) e acompanha o tema claro/escuro do Keystatic.

const CORES: { casa: (t: string) => boolean; cor: string; fundo: string }[] = [
  {
    casa: (t) => t.startsWith("VIDA"), // Task 109: grupos agora se chamam "Vida · <aba do site>"
    cor: "#3f7d54", // verde vida — brota, cresce
    fundo: "rgba(63, 125, 84, 0.08)",
  },
  {
    casa: (t) => t.startsWith("OBRA") || t.startsWith("ESCRI"),
    cor: "#9c4f6e", // vinho da Obra — cor do site das citações
    fundo: "rgba(156, 79, 110, 0.08)",
  },
  {
    casa: (t) => t.startsWith("MOVIMENTO"),
    cor: "#3f6d8e", // azul movimento — mar que atravessa
    fundo: "rgba(63, 109, 142, 0.09)",
  },
];

export default function PainelTema() {
  useEffect(() => {
    const pintar = () => {
      const titulos = document.querySelectorAll("h3");
      titulos.forEach((h) => {
        const texto = (h.textContent || "").trim().toUpperCase();
        const regra = CORES.find((r) => r.casa(texto));
        if (!regra) return;
        const el = h as HTMLElement;
        const grupo = (el.closest('[role="listitem"], li') as HTMLElement) ?? el;
        // grupo inteiro (título + gavetas) recebe a moldura
        grupo.style.borderLeft = `3px solid ${regra.cor}`;
        grupo.style.borderRadius = "6px";
        grupo.style.paddingLeft = "10px";
        grupo.style.backgroundColor = regra.fundo;
        el.style.color = regra.cor;
      });
    };

    pintar();
    // O Keystatic navega em SPA (sem recarregar a página): re-pinta quando o
    // DOM muda. childList não dispara com mudanças de style — sem laço.
    const observador = new MutationObserver(() => pintar());
    observador.observe(document.body, { childList: true, subtree: true });
    return () => observador.disconnect();
  }, []);

  return null;
}
