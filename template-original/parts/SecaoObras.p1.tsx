"use client";
import { useState } from "react";
import Link from "next/link";
import CabecalhoObra from './CabecalhoObra';
import { extrairAnoBase, calcularDecadas } from "../lib/tempo";

type TabObra = "obras" | "coletaneas" | "colaboracoes" | "cronicas" | "resenhas";
interface Livro { ano: number | string; titulo: string; descricao: string; tipo: string; }

const dadosPoesia: Livro[] = [
  { titulo: "Opções para morrer no espaço", ano: 2024, descricao: "Semifinalista do Prêmio Oceanos 2025. Poemas que lutam contra inimigos modernos.", tipo: "Livro" },
  { titulo: "Passageira – Antologia Pessoal 1982-2024", ano: 2026, descricao: "Reúne poemas selecionados de dezoito títulos. Uma travessia por quatro décadas.", tipo: "Livro" },
  { titulo: "Ínsulas", ano: 2026, descricao: "Breves poemas que sintetizam as linhas de força de uma voz admirável.", tipo: "Plaquete" },
  { titulo: "ponto(s)", ano: 2022, descricao: "Alpharrabio Edições", tipo: "Plaquete" },
  { titulo: "fuga e urgências", ano: 2022, descricao: "Alpharrabio Edições", tipo: "Livro" },
  { titulo: "Tempo em Fúria", ano: 2019, descricao: "SP: Alpharrabio Edições", tipo: "Livro" },
  { titulo: "A Mulher Antiga", ano: 2017, descricao: "Coleção PerVersas", tipo: "Livro" },
  { titulo: "70 anos poemas leitores", ano: 2016, descricao: "SP: Alpharrabio Edições", tipo: "Livro" },
  { titulo: "Solidões da Memória", ano: 2015, descricao: "Dobra e Alpharrabio Edições", tipo: "Livro" },
  { titulo: "Estranhas Formas de Vida", ano: 2013, descricao: "Dobra e Alpharrabio Edições", tipo: "Livro" },
  { titulo: "Retratos Falhados", ano: 2008, descricao: "Editora Escrituras", tipo: "Livro" },
  { titulo: "Pecados", ano: 2006, descricao: "Caixa artística, 7 poemas ilustrados", tipo: "Caixa Artística" },
  { titulo: "Solilóquios", ano: 2005, descricao: "200 exemplares numerados", tipo: "Plaquete" },
  { titulo: "Poesia do Intervalo", ano: 2005, descricao: "Com desenhos de Guedo Gallet", tipo: "Edição Artística" },
  { titulo: "Vestígios", ano: 2003, descricao: "200 exemplares numerados", tipo: "Plaquete" },
  { titulo: "À Janela dos dias", ano: 2002, descricao: "SP: Alpharrabio Edições", tipo: "Livro" },
  { titulo: "A Palavraparte", ano: 1996, descricao: "SP: Alpharrabio Edições", tipo: "Livro" },
  { titulo: "Poética das Circunstâncias", ano: 1996, descricao: "SP: Alpharrabio Edições", tipo: "Plaquete" },
  { titulo: "Forasteiros Registros Nordestinos", ano: 1991, descricao: "SP: Livrespaço", tipo: "Plaquete" },
  { titulo: "Elemento em Fúria", ano: 1989, descricao: "Teresina, PI: Academia Piauiense de Letras", tipo: "Livro" },
  { titulo: "Madeira: do Vinho à Saudade", ano: 1989, descricao: "Funchal, Madeira (Portugal)", tipo: "Livro" },
  { titulo: "Inventário Precoce", ano: 1983, descricao: "SP: Pannartz", tipo: "Livro" },
  { titulo: "Lições de Tempo", ano: 1982, descricao: "SP: Pannartz", tipo: "Livro" }
];
