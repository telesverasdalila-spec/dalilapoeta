"use client";
import React, { useState, use } from "react";
import TemplateConteudo from "../../components/TemplateConteudo";

// ============================================
// PÁGINA DE CRÔNICA INDIVIDUAL
// Usa o TemplateConteudo universal
// ============================================

interface Cronica {
  id: string;
  titulo: string;
  data?: string;
  texto: string; // HTML completo
  fonte?: string;
  nota_rodape?: string;
}

export default function ConteudoCronica({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [cronica, setCronica] = useState<Cronica | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  // Carregar dados do JSON
  React.useEffect(() => {
    async function carregarCronica() {
      try {
        const modulo = await import(`./dados.json`);
        setCronica(modulo.default || modulo);
      } catch (e) {
        console.error("Erro ao carregar crônica:", e);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    carregarCronica();
  }, [id]);

  // Renderizar usando o Template Universal
  return (
    <TemplateConteudo
      tipoConteudo="cronica"
      titulo={cronica?.titulo || ""}
      texto={cronica?.texto || ""}
      data={cronica?.data}
      fonte={cronica?.fonte}
      nota_rodape={cronica?.nota_rodape}
      voltarUrl="/cronicas"
      voltarTexto="Crônicas"
      carregando={carregando}
      erro={erro || !cronica}
    />
  );
}
