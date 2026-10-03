"use client";
import { useState } from "react";
import Link from "next/link";
import CabecalhoObra from './CabecalhoObra';
import { extrairAnoBase, calcularDecadas } from "../lib/tempo";

// ✅ ALTERADO: "ensaios" → "cronicas"
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
  { titulo: "Anotações de Leituras", ano: 2006, descricao: "Alpharrabio Edições", tipo: "Prosa" },
  { titulo: "Apontamentos – álbum de viagens", ano: 2009, descricao: "Edições MIMO / Tipografia Luar", tipo: "Prosa" },
  { titulo: "Sonho de Há Pouco", ano: 2013, descricao: "Dobra Editorial", tipo: "Livro" },
  { titulo: "Marielle Dalila", ano: 2018, descricao: "Dobra Editorial", tipo: "Livro" },
  { titulo: "Diuturnos", ano: 2012, descricao: "Alpharrabio Edições", tipo: "Prosa" },
  { titulo: "Iara", ano: 2015, descricao: "Dobra Editorial", tipo: "Livro" },
  { titulo: "Se", ano: 2012, descricao: "Alpharrabio Edições", tipo: "Livro" }
];

const dadosProsa: Livro[] = [
  { titulo: "Lições de Tempo", ano: 1982, descricao: "Poesia. SP: Pannartz.", tipo: "Livro" },
  { titulo: "Inventário Precoce", ano: 1983, descricao: "Poesia. SP: Pannartz.", tipo: "Livro" },
  { titulo: "Elemento Fúria", ano: 1989, descricao: "Poesia. Academia Piauiense de Letras.", tipo: "Livro" },
  { titulo: "Madeira - Do Vinho à Saudade", ano: 1989, descricao: "Poesia. José António Gonçaltes, Funchal (PT).", tipo: "Livro" },
  { titulo: "Forasteiros - Registros Nordestinos", ano: 1991, descricao: "Poesia. Livrespaço, SP.", tipo: "Livro" },
  { titulo: "A Palavraparte - Pequenas prosas em poemas", ano: 1996, descricao: "Poesia. Alpharrabio Edições, SP.", tipo: "Livro" },
  { titulo: "Meia Vida Inteira", ano: 1996, descricao: "Homenagem. Edição MIMO / Santo André, SP.", tipo: "Livro" },
  { titulo: "Poéticas das Circunstâncias", ano: 1996, descricao: "Poesia. Alpharrabio Edições, SP.", tipo: "Livro" },
  { titulo: "Caixa Poéticas", ano: 1996, descricao: "Antologia Coletiva. Alpharrabio Edições, SP.", tipo: "Caixa Artística" },
  { titulo: "A Vida Crônica", ano: 1999, descricao: "Crônicas. SP: Alpharrabio", tipo: "Livro" },
  { titulo: "As Artes do Ofício", ano: 2000, descricao: "Crônicas. SP: Alpharrabio", tipo: "Livro" },
  { titulo: "À Janela dos Dias - Poesia quase toda", ano: 2002, descricao: "Poesia. Alpharrabio Edições, SP.", tipo: "Livro" },
  { titulo: "Vestígios", ano: 2003, descricao: "Poesia. Alpharrabio Edições, SP.", tipo: "Livro" },
  { titulo: "Cidade Assassinada - Tributo a Celso Daniel", ano: 2005, descricao: "Poesia. Alpharrabio Edições, SP.", tipo: "Livro" },
  { titulo: "Solilóquios", ano: 2005, descricao: "Poesia. Alpharrabio Edições, SP.", tipo: "Livro" },
  { titulo: "Poesia do Intervalo", ano: 2005, descricao: "Poesia. Alpharrabio Edições, SP.", tipo: "Livro" },
  { titulo: "Pontos", ano: 2022, descricao: "Alpharrabio Edições", tipo: "Plaquete" }
];

// Dados mantidos para referência futura (movidos para Eixo Movimento)
const dadosEnsaios: Livro[] = [
  { ano: "1999-2004", titulo: "A Língua, a pátria possível", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica" },
  { ano: "1999-2004", titulo: "Anotações de Leituras IV", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica" },
  { ano: "1999-2004", titulo: "Anotações de Leituras III", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica" },
  { ano: "1999-2004", titulo: "Anotações de Leituras II", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica" },
  { ano: "1999-2004", titulo: "Anotações de Leituras I", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica" },
  { ano: "1999-2004", titulo: "Biblocasa", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica" },
  { ano: "1999-2004", titulo: "O Direito ao Silêncio", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica" },
  { ano: "1999-2004", titulo: "Crônica de Outono", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica" },
  { ano: "1999-2004", titulo: "A Cidade do Meu Desejo", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica" }
];

const dadosCronicas: Livro[] = [];

const coletaneasBrasil: Livro[] = [
  { ano: 2023, titulo: "Tempo de Voar", descricao: "Antologia de poesias, contos e crônicas. Scortecci Ed. SP.", tipo: "Coletânea" },
  { ano: 2019, titulo: "Mosaico de Palavras", descricao: "Antologia. Clube de Autores.", tipo: "Coletânea" },
  { ano: 2017, titulo: "Mulheres em Movimento", descricao: "Antologia de autoras do ABC. Organização: Mariléa R. Resende.", tipo: "Coletânea" },
  { ano: 2016, titulo: "Ponto de Encontro", descricao: "Poetas do ABCD. Organização: Dalila T. Veras e outros. Alpharrabio/SECULT.", tipo: "Coletânea" },
  { ano: 2014, titulo: "Rota dos Mares", descricao: "Antologia luso-brasiliera. Organização: Maria Teresa Roza. SP: Arte & Citação (PT/BR).", tipo: "Coletânea" },
  { ano: 2010, titulo: "A Terra Fala Sim", descricao: "Poetas pelo meio ambiente. Organização: Carlos Bezz. SP: Luador.", tipo: "Coletânea" },
  { ano: 2009, titulo: "Poesia do Magnificat", descricao: "Organização: Frei Pedro. Paulus.", tipo: "Coletânea" },
  { ano: 2008, titulo: "O Aroma das Palavras", descricao: "Antologia de poetas brasileiros atuais. Organização: Francisco Costa. Portugal: Editora Ambar.", tipo: "Coletânea" },
  { ano: 2007, titulo: "A Voz dos Poetas", descricao: "Antologia de poetas brasileiros contemporâneos. Organização: Francisco Costa. PT: Editorial Dvdivina Literatura.", tipo: "Coletânea" },
  { ano: 2006, titulo: "Poetas do Brasil", descricao: "Seleção de Alexei Bueno. Lisboa: Relógio D'Água Editores.", tipo: "Coletânea" },
  { ano: 2005, titulo: "Caminhos Cruzados", descricao: "Antologia luso-brasileira. Organização: Maria Teresa Roza. SP: Arte & Citação.", tipo: "Coletânea" },
  { ano: 2004, titulo: "O Avesso do Olhar", descricao: "Organização: Luis Augusto Cassol. SP: Escrituras.", tipo: "Coletânea" },
  { ano: 2003, titulo: "Antologia de Sonetos", descricao: "Organização: Cláudio Willian. SP: Editora Fundação Espartaco.", tipo: "Coletânea" },
  { ano: 2002, titulo: "Pelos Idos do Passado", descricao: "Contos. Organização: Dalila Teles Veras. Alpharrabio Edições.", tipo: "Coletânea" },
  { ano: 2001, titulo: "A Poesia dos Anos 80", descricao: "Organização: Manuel dos Santos Lima. PT: Editorial Dvdivina Literatura.", tipo: "Coletânea" },
  { ano: 2000, titulo: "O Brilho da Palavra", descricao: "Antologia de poetas brasileiros contemporâneos. Organização: Francisco Costa. PT: Editorial Dvdivina Literatura.", tipo: "Coletânea" },
  { ano: 1999, titulo: "Antologia Poética", descricao: "Organização: Dalila Teles Veras. Alpharrabio Edições.", tipo: "Coletânea" },
  { ano: 1998, titulo: "13 Projetos Poéticos", descricao: "Organização: Paulo Franchetti. SP: Ateliê Editorial / Unicamp / FAPESP.", tipo: "Coletânea" },
  { ano: 1997, titulo: "Saudade da Pátria", descricao: "Organização: Francisco Costa. PT: Editorial Dvdivina Literatura.", tipo: "Coletânea" },
  { ano: 1996, titulo: "Mulheres Poetas do Brasil", descricao: "Organização: Francisco Costa. PT: Editorial Dvdivina Literatura.", tipo: "Coletânea" },
  { ano: 1995, titulo: "Caderno de Poesias e Prosas", descricao: "Organização: Dalila Teles Veras. Alpharrabio Edições.", tipo: "Coletânea" },
  { ano: 1994, titulo: "Poesia Viva", descricao: "Organização: Francisco Costa. PT: Editorial Dvdivina Literatura.", tipo: "Coletânea" },
  { ano: 1987, titulo: "Língua Portuguesa: O Real e o Possível", descricao: "Organização: Ataliba de Castilho. SP: Contexto.", tipo: "Coletânea" }
];

const coletaneasPortugal: Livro[] = [
  { ano: 2024, titulo: "Encontros", descricao: "Antologia de poesia portuguesa e brasileira. Organização: Maria Teresa Roza. PT: Chiado Editora.", tipo: "Coletânea" },
  { ano: 2019, titulo: "Entre Margens e Horizontes", descricao: "Antologia de poetas de língua portuguesa. Organização: Maria Teresa Roza. PT: Chiado Editora.", tipo: "Coletânea" },
  { ano: 2018, titulo: "Palavras no Espelho", descricao: "Antologia luso-brasileira. Organização: Maria Teresa Roza. PT: Chiado Editora.", tipo: "Coletânea" },
  { ano: 2016, titulo: "Património Cultural Imaterial", descricao: "Antologia. Organização: Maria Teresa Roza. PT: Chiado Editora.", tipo: "Coletânea" },
  { ano: 2015, titulo: "Memórias do Futuro", descricao: "Antologia luso-brasileira. Organização: Maria Teresa Roza. PT: Chiado Editora.", tipo: "Coletânea" },
  { ano: 2013, titulo: "Raízes do Mesmo Ramo", descricao: "Antologia de poetas de língua portuguesa. Organização: Maria Teresa Roza. PT: Chiado Editora.", tipo: "Coletânea" },
  { ano: 2011, titulo: "Caminhos da Poesia", descricao: "Antologia luso-brasileira. Organização: Maria Teresa Roza. PT: Chiado Editora.", tipo: "Coletânea" },
  { ano: 2009, titulo: "Vozes do Atlântico", descricao: "Antologia de poetas de língua portuguesa. Organização: Maria Teresa Roza. PT: Chiado Editora.", tipo: "Coletânea" },
  { ano: 2007, titulo: "Pontes sobre o Oceano", descricao: "Antologia luso-brasileira. Organização: Maria Teresa Roza. PT: Chiado Editora.", tipo: "Coletânea" },
  { ano: 2005, titulo: "Horizontes Compartilhados", descricao: "Antologia de poetas de língua portuguesa. Organização: Maria Teresa Roza. PT: Chiado Editora.", tipo: "Coletânea" }
];

const coletaneasOutros: Livro[] = [
  { ano: 2012, titulo: "Poetry and Memory", descricao: "International Poetry Festival. Translation: R. Goulart. Bulgaria: Orpheus Publishing House.", tipo: "Coletânea" },
  { ano: 2008, titulo: "Trilhas da Memória", descricao: "Poetas do Brasil. Tradução: C. Navarro. Cuba: Ediciones Unión.", tipo: "Coletânea" },
  { ano: 2006, titulo: "Voix de la Poésie Brésilienne", descricao: "Traduction: C. Navarro. France: L'Harmattan.", tipo: "Coletânea" },
  { ano: 2004, titulo: "Anthologie de la Poésie Brésilienne", descricao: "Traduction: C. Navarro. France: L'Harmattan.", tipo: "Coletânea" },
  { ano: 2002, titulo: "Poesia de Aquém e Além-Mar", descricao: "Organização: Maria Teresa Roza. PT: Universitária Editora.", tipo: "Coletânea" },
  { ano: 1999, titulo: "Las Raices del Estanco", descricao: "Traducción: C. Navarro. Cuba: Ediciones Unión.", tipo: "Coletânea" },
  { ano: 1998, titulo: "Antología de Poesía Brasileña", descripcion: "Traducción: C. Navarro. República Dominicana: Editora Nacional.", tipo: "Coletânea" }
];

const dadosColaboracoes: Livro[] = [
  { ano: 2024, titulo: "Passageira – Antologia Pessoal 1982-2024", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2023, titulo: "Tempo de Voar", descricao: "Orelha. Scortecci Editora.", tipo: "Orelha" },
  { ano: 2022, titulo: "Ínsulas", descricao: "Posfácio. Alpharrabio Edições.", tipo: "Posfácio" },
  { ano: 2022, titulo: "fuga e urgências", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2019, titulo: "Tempo em Fúria", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2019, titulo: "Solidões da Memória", descricao: "Quarta Capa. Dobra Editorial.", tipo: "Adaptação" },
  { ano: 2018, titulo: "Marielle Dalila", descricao: "Orelha. Dobra Editorial.", tipo: "Orelha" },
  { ano: 2017, titulo: "A Mulher Antiga", descricao: "Orelha. Coleção PerVersas.", tipo: "Orelha" },
  { ano: 2016, titulo: "70 anos, poemas, leitores", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2015, titulo: "Solidões da Memória", descricao: "Orelha. Dobra Editorial.", tipo: "Orelha" },
  { ano: 2015, titulo: "Iara", descricao: "Orelha. Dobra Editorial.", tipo: "Orelha" },
  { ano: 2013, titulo: "Estranhas Formas de Vida", descricao: "Orelha. Dobra Editorial.", tipo: "Orelha" },
  { ano: 2013, titulo: "Sonho de Há Pouco", descricao: "Orelha. Dobra Editorial.", tipo: "Orelha" },
  { ano: 2012, titulo: "Diuturnos", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2012, titulo: "Se", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2009, titulo: "Apontamentos – álbum de viagens", descricao: "Orelha. Edições MIMO.", tipo: "Orelha" },
  { ano: 2008, titulo: "Retratos Falhados", descricao: "Orelha. Editora Escrituras.", tipo: "Orelha" },
  { ano: 2006, titulo: "Pecados", descricao: "Texto de abertura. Caixa artística.", tipo: "Apresentação" },
  { ano: 2006, titulo: "Anotações de Leituras", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2005, titulo: "Solilóquios", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2005, titulo: "Poesia do Intervalo", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2005, titulo: "Cidade Assassinada", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2003, titulo: "Vestígios", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2003, titulo: "À Janela dos Dias", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2002, titulo: "Pelos Idos do Passado", descricao: "Organização e apresentação. Alpharrabio Edições.", tipo: "Apresentação" },
  { ano: 2000, titulo: "As Artes do Ofício", descricao: "Apresentação. Alpharrabio Edições.", tipo: "Apresentação" },
  { ano: 1999, titulo: "A Vida Crônica", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 1999, titulo: "Antologia Poética", descricao: "Organização e apresentação. Alpharrabio Edições.", tipo: "Apresentação" },
  { ano: 1997, titulo: "Poéticas das Circunstâncias", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 1996, titulo: "Meia Vida Inteira", descricao: "Orelha. Edições MIMO.", tipo: "Orelha" },
  { ano: 1996, titulo: "A Palavraparte", descricao: "Orelha. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 1996, titulo: "Caderno de Poesias e Prosas", descricao: "Organização e apresentação. Alpharrabio Edições.", tipo: "Apresentação" },
  { ano: 1995, titulo: "Caixa Poéticas", descricao: "Texto de abertura. Caixa artística.", tipo: "Apresentação" },
  { ano: 1994, titulo: "Forasteiros", descricao: "Orelha. Livrespaço.", tipo: "Orelha" },
  { ano: 2023, titulo: "DA viagem à LILA", descricao: "Colagem com poemas, crônicas e diários. Grupo Ponto de Fiandeiras. (Museu de Santo André, Alpharrabio, UFABC).", tipo: "Adaptação" }
];

const dadosVerbetes: Livro[] = [
  { ano: 2010, titulo: "Gente do ABCD – 100 crônicas do jornal ABCD Maior", descricao: "Sobre lideranças populares na região. Verbete por Daniel Brazil. ABCDMaior.", tipo: "Verbete" },
  { ano: 2008, titulo: "Dicionário de Mulheres do Brasil", descricao: "Verbete biográfico. Organização: Schuma Schumacher & Erico Vital Brasil. Zahar.", tipo: "Verbete" },
  { ano: 2007, titulo: "Enciclopédia de Literatura Brasileira", descricao: "Verbete biográfico. Organização: Dora Isabel Sales. SP: Ateliê Editorial.", tipo: "Verbete" },
  { ano: 2005, titulo: "Mulheres do ABC", descricao: "Verbete biográfico. Organização: Mariléa R. Resende. Alpharrabio Edições.", tipo: "Verbete" }
];

const dadosFortunaCritica: Livro[] = [
  { ano: 1983, titulo: "Tantos caminhos ainda por seguir", descricao: "Francisco Miguel de Moura, Jornal da Manhã, pg.06, Teresina, PI.", tipo: "Resenha" },
  { ano: 1986, titulo: "A eterna curiosidade de descobrir o que está do outro lado", descricao: "Dalila Teles Veras – Uma poetisa madeirense no Brasil. Marina Caldas, Diário de Notícias, Funchal, pg.2.", tipo: "Resenha" },
  { ano: 1989, titulo: "Madeira: do vinho à saudade", descricao: "Nair Lacerda, A Tribuna, Santos, SP.", tipo: "Resenha" },
  { ano: 2000, titulo: "Em torno de um livro de crônicas", descricao: "Caio Porfírio Carneiro, Jornal Linguagem Viva, janeiro de 2000. (VC)", tipo: "Resenha" },
  { ano: 2001, titulo: "Poeta Crônica", descricao: "Fabiano Calixto, Jornal Linguagem Viva, fev. 2001. (VC)", tipo: "Resenha" },
  { ano: 2008, titulo: "Pintura do Cotidiano", descricao: "Álvaro Alves de Faria, Jornal Rascunho, 104, dez/2008. (RF)", tipo: "Resenha" },
  { ano: 2013, titulo: "A estranheza poética dos fatos no cotidiano em Dalila", descricao: "Luiz Roberto Alves, Jornal Linguagem Viva, junho de 2013. (EFV)", tipo: "Resenha" },
  { ano: 2016, titulo: "Paixão movida por compromisso", descricao: "Rubens Shirassu Júnior, Jornal Linguagem Viva, no. 328, dezembro de 2016. (70)", tipo: "Resenha" },
  { ano: 2016, titulo: "Solidões da memória", descricao: "Fernando Py, Tribuna de Petrópolis, 4.11.2016. (SM)", tipo: "Resenha" },
  { ano: 2017, titulo: "Geografia dos sentidos", descricao: "Valdomiro Santana, Suplemento Literário de Minas Gerais, Ed. 1.370, pgs. 12-15, Belo Horizonte, MG. (SM)", tipo: "Resenha" }
];

export default function SecaoObras() {
  const [tabAtiva, setTabAtiva] = useState<TabObra>("obras");
  const [subTabAtiva, setSubTabAtiva] = useState<string>("poesia");

  // ✅ ALTERADO: "ensaios" → "cronicas"
  const handleMudarTab = (novaTab: string) => {
    setTabAtiva(novaTab as TabObra);
    if (novaTab === "obras") setSubTabAtiva("poesia");
    else if (novaTab === "coletaneas") setSubTabAtiva("brasil");
    else if (novaTab === "colaboracoes") setSubTabAtiva("apresentacoes");
    else if (novaTab === "cronicas") setSubTabAtiva("cronicas");  // ✅ ALTERADO
    else if (novaTab === "resenhas") setSubTabAtiva("fortuna");
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  
  const handleMudarSubTab = (novaSubTab: string) => {
    setSubTabAtiva(novaSubTab);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  let obrasAtuais: Livro[] = [];
  if (tabAtiva === "obras") {
    obrasAtuais = subTabAtiva === "poesia" ? dadosPoesia : dadosProsa;
  } else if (tabAtiva === "coletaneas") {
    if (subTabAtiva === "brasil") obrasAtuais = coletaneasBrasil;
    else if (subTabAtiva === "portugal") obrasAtuais = coletaneasPortugal;
    else if (subTabAtiva === "outros") obrasAtuais = coletaneasOutros;
  } 
  // ✅ ALTERADO: "ensaios" → "cronicas"
  else if (tabAtiva === "cronicas") {
    // Link para página de crônicas individuais
    obrasAtuais = []; // Lista vazia porque tem página própria
  } 
  else if (tabAtiva === "resenhas") {
    if (subTabAtiva === "fortuna") obrasAtuais = dadosFortunaCritica;
    else if (subTabAtiva === "verbetes") obrasAtuais = dadosVerbetes;
  } else if (tabAtiva === "colaboracoes") {
    if (subTabAtiva === "apresentacoes") obrasAtuais = dadosColaboracoes.filter(c => c.tipo === "Apresentação" || c.tipo === "Ensaio" || c.tipo === "Resenha");
    else if (subTabAtiva === "prefacios") obrasAtuais = dadosColaboracoes.filter(c => c.tipo === "Prefácio" || c.tipo === "Orelha" || c.tipo === "Posfácio");
    else if (subTabAtiva === "adaptacoes") obrasAtuais = dadosColaboracoes.filter(c => c.tipo === "Adaptação");
  }

  const decadasFixos = calcularDecadas(obrasAtuais.map(l => extrairAnoBase(l.ano)), "crescente");

  const obrasOrdenadas = [...obrasAtuais].sort((a, b) => {
    const anoA = extrairAnoBase(a.ano);
    const anoB = extrairAnoBase(b.ano);
    return anoB - anoA;
  });

  const obrasAgrupadas: { decada: number; anoVisivel: number | string; livros: Livro[] }[] = [];
  obrasOrdenadas.forEach((obra) => {
    const anoBase = extrairAnoBase(obra.ano);
    const decada = anoBase === 0 ? 0 : Math.floor(anoBase / 10) * 10;
    if (obrasAgrupadas.length === 0 || obrasAgrupadas[obrasAgrupadas.length - 1].decada !== decada) {
      obrasAgrupadas.push({ decada, anoVisivel: obra.ano, livros: [obra] });
    } else {
      obrasAgrupadas[obrasAgrupadas.length - 1].livros.push(obra);
    }
  });

  return (
    <div className="header-obra">
      <div style={{maxWidth: "850px", margin: "0 auto", position: "relative"}}>
        <CabecalhoObra 
          tabAtiva={tabAtiva} mudarTab={handleMudarTab} 
          subTabAtiva={subTabAtiva} mudarSubTab={handleMudarSubTab}
          anos={decadasFixos}
        />

        {/* ✅ ALTERADO: "ensaios" → "cronicas" */}
        {(tabAtiva === "obras" || tabAtiva === "coletaneas" || tabAtiva === "colaboracoes" || tabAtiva === "cronicas" || tabAtiva === "resenhas") && obrasAtuais.length > 0 ? (
          <div className="estrada estrada-obra">
            {obrasAgrupadas.map((grupo, gIndex) => (
              <div key={grupo.decada}>
                <div 
                  id={`c-${grupo.decada}`} 
                  className="separador-genero" 
                  style={{ marginTop: gIndex === 0 ? '0' : '30px' }}
                >
                  {grupo.decada === 0 ? "Data não informada" : grupo.anoVisivel}
                </div>
                {grupo.livros.map((obra) => (
                  <div className="trecho" key={obra.titulo + obra.ano}>
                    <p>
                      <strong>{obra.titulo}</strong> 
                      <span style={{ display: "block", fontSize: "1rem", color: "#666", marginTop: "5px", fontFamily: "'Inter', sans-serif" }}>
                        {obra.descricao} <span className="tipo-publicacao">{obra.tipo}</span>
                      </span>
                    </p>
                    {tabAtiva === "obras" && (
                      <Link 
                        href={`/obra/${obra.titulo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\s–—()]+/g, '-')}`}
                        style={{ display: 'inline-block', marginTop: '10px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: '500', color: '#7a3b5a', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'all 0.3s ease', paddingBottom: '1px' }}
                        onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#7a3b5a'}
                        onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
                      >
                        Conheça a obra →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="estrada estrada-obra">
            <div className="trecho" style={{ marginTop: "60px", textAlign: "center" }}>
              <p style={{ fontStyle: 'italic', color: "#999", fontSize: "1.1rem" }}>📝 Conteúdo em processo de curadoria e atualização.</p>
              <p style={{ fontStyle: 'italic', color: "#bbb", fontSize: "0.95rem", marginTop: "10px" }}>
                {/* ✅ ALTERADO: Texto atualizado */}
                {tabAtiva === "cronicas" && "Veja todas as crônicas na listagem completa →"}
                {tabAtiva === "resenhas" && (subTabAtiva === "leituras" || subTabAtiva === "estudos") && "Em breve, leituras e estudos críticos sobre a obra da autora."}
              </p>
              
              {/* ✅ NOVO: Link para página de crônicas quando a tab está ativa */}
              {tabAtiva === "cronicas" && (
                <div style={{ marginTop: '30px' }}>
                  <Link 
                    href="/obra/cronica"
                    style={{ 
                      display: 'inline-block',
                      padding: '15px 30px',
                      backgroundColor: '#F7D179',
                      color: '#1a1a1a',
                      textDecoration: 'none',
                      borderRadius: '5px',
                      fontWeight: '500',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e6be68';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F7D179';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    📖 Ver todas as 9 crônicas →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
