"use client";
import React, { useState, use } from "react";
import TemplateConteudo from "../../components/TemplateConteudo";

// ============================================
// PÁGINA DE ENSAIO INDIVIDUAL
// Usa o TemplateConteudo universal
// ============================================

interface Ensaio {
  id: string;
  titulo: string;
  data?: string;
  texto: string; // HTML completo
  fonte?: string;
  nota_rodape?: string;
  // Metadados específicos de ensaio
  evento_origem?: string; // Ex: "Palestra no SESC São Caetano"
  local?: string;
}

export default function ConteudoEnsaio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [ensaio, setEnsaio] = useState<Ensaio | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  // Carregar dados do JSON
  React.useEffect(() => {
    async function carregarEnsaio() {
      try {
        const modulo = await import(`./dados.json`);
        setEnsaio(modulo.default || modulo);
      } catch (e) {
        console.error("Erro ao carregar ensaio:", e);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    carregarEnsaio();
  }, [id]);

  // Renderizar usando o Template Universal
  return (
    <TemplateConteudo
      tipoConteudo="ensaio"
      titulo={ensaio?.titulo || ""}
      texto={ensaio?.texto || ""}
      data={ensaio?.data}
      fonte={ensaio?.fonte || ensaio?.evento_origem}
      nota_rodape={ensaio?.nota_rodape}
      voltarUrl="/#obra"  // Link de volta para Eixo Obra
      voltarTexto="Ensaios & Crônicas"
      carregando={carregando}
      erro={erro || !ensaio}
    />
  );
}
