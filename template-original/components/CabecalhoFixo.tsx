"use client";
import { useMemo, useEffect } from "react";
import ReguaTempo from "./ReguaTempo";
import { calcularDecadas } from "../lib/tempo";
import premios from "../data/vida/premios.json";

interface CabecalhoFixoProps {
  abaAtiva: string;
  mudarAba: (novaAba: string) => void;
}

const ANOS_BIOGRAFIA = [1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, new Date().getFullYear()];

export default function CabecalhoFixo({ abaAtiva, mudarAba }: CabecalhoFixoProps) {
  const decadasCrono = useMemo(() => calcularDecadas(ANOS_BIOGRAFIA, "crescente"), []);

  const decadasPremios = useMemo(() => {
    const anos = premios.map((p) => p.ano).sort((a, b) => a - b);
    return calcularDecadas(anos, "crescente");
  }, []);

  // ✅ Ilumina os anos (data-iluminada) usando IntersectionObserver também.
  // Antes era um addEventListener("scroll") que fazia getBoundingClientRect()
  // em todos os [data-ano] a cada pixel de scroll — isso causava reflows
  // e competia com o scroll handler da régua do tempo.
  useEffect(() => {
    const elementos = document.querySelectorAll('[data-ano]');
    if (elementos.length === 0) return;

    const header = document.querySelector('.header-vida') as HTMLElement | null;
    const headerHeight = header ? header.offsetHeight + 10 : 200;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const span = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            span.classList.add('data-iluminada');
          } else {
            span.classList.remove('data-iluminada');
          }
        }
      },
      {
        // Zona de detecção: elementos que estão acima de headerHeight
        // (ou seja, que já passaram por baixo do header fixo)
        rootMargin: `-${headerHeight}px 0px 0px 0px`,
        threshold: 0,
      }
    );

    elementos.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [abaAtiva]); // re-observa quando troca de aba (conteúdo muda)

  return (
    <div className="header-vida">
        <h1 id="titulo-pagina">
          {abaAtiva === "premios" ? "Prêmios e Reconhecimentos" : abaAtiva === "imprensa" ? "Mídia" : "CronoBiografia"}
        </h1>
        <div className="header-subtitle" id="subtitulo-pagina">
          {abaAtiva === "premios"
            ? "Prêmios, láureas, homenagens, títulos"
            : abaAtiva === "imprensa"
            ? "Presença digital da autora"
            : "Da Madeira ao Brasil: A poesia como ato de resistência"}
        </div>

        <div className="tabs-principal">
            <button 
                className={"tab-btn " + (abaAtiva === "crono" ? "ativa" : "")}
                onClick={() => mudarAba("crono")}
            >CronoBiografia</button>
            
            <button 
                className={"tab-btn " + (abaAtiva === "premios" ? "ativa" : "")}
                onClick={() => mudarAba("premios")}
            >Prêmios e<br/>Reconhecimentos</button>
            
            <button 
                className={"tab-btn " + (abaAtiva === "imprensa" ? "ativa" : "")}
                onClick={() => mudarAba("imprensa")}
            >Mídia</button>
        </div>

        {abaAtiva === "crono" && <ReguaTempo modo="decadas" decadas={decadasCrono} />}
        {abaAtiva === "premios" && <ReguaTempo modo="decadas" decadas={decadasPremios} ordemScroll="decrescente" />}
    </div>
  );
}
