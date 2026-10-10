"use client";
import { useState } from "react";
import Link from "next/link";
import CabecalhoObra from './CabecalhoObra';
import { extrairAnoBase, calcularDecadas } from "../lib/tempo";

type TabObra = "obras" | "coletaneas" | "colaboracoes" | "escritos" | "resenhas";
interface Livro { ano: number | string; titulo: string; descricao: string; tipo: string; slug?: string; }

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

const dadosProsa: Livro[] = [
  { titulo: "Diuturnos", ano: 2012, descricao: "Diário. SP: Alpharrabio", tipo: "Livro" },
  { titulo: "Seduzir para a Poesia", ano: 2008, descricao: "Trajetória Grupo Livrespaço", tipo: "Livro" },
  { titulo: "Anotações de Leituras", ano: 2006, descricao: "Comemorativa 14º aniversário", tipo: "Plaquete" },
  { titulo: "Alpharrabio 12 anos", ano: 2004, descricao: "Em coautoria com Luzia Maninha", tipo: "Livro" },
  { titulo: "Minudências", ano: 2000, descricao: "Diário. SP: Alpharrabio", tipo: "Livro" },
  { titulo: "As Artes do Ofício", ano: 2000, descricao: "Crônicas. SP: Alpharrabio", tipo: "Livro" },
  { titulo: "A Vida Crônica", ano: 1999, descricao: "Crônicas. SP: Alpharrabio", tipo: "Livro" }
];

const coletaneasBrasil: Livro[] = [
  { ano: 2023, titulo: "Sarau Gente de Palavra", descricao: "Antologia com poemas dos homenageados no Sarau Paulista. Patuá, SP.", tipo: "Coletânea" },
  { ano: 2023, titulo: "Tempo de Voar", descricao: "Antologia de poesias, contos e crônicas. Scortecci Ed. SP.", tipo: "Coletânea" },
  { ano: 2022, titulo: "Feminino Infinito", descricao: "120 Poetas, Escritoras & Artistas Brasileiras. Ed. Feminino Infinito.", tipo: "Coletânea" },
  { ano: 2022, titulo: "ABCDelas", descricao: "Poemas. Organização Carmem Sanches et al. Editora Clóe, Diadema.", tipo: "Coletânea" },
  { ano: 2022, titulo: "Foice na carne", descricao: "7 poemas de cada um dos 13 poetas ligados ao Sarau das Ideias.", tipo: "Coletânea" },
  { ano: 2021, titulo: "Dias Distantes", descricao: "Coletânea (poesia, conto, artes visuais). 23 autores do ABC. Org. dtv.", tipo: "Coletânea" },
  { ano: 2020, titulo: "uma pausa na luta", descricao: "70 poemas. Org. Manuel Ricardo de Lima. Mórula Editorial, RJ.", tipo: "Coletânea" },
  { ano: 2020, titulo: "Clausura – A peste pela poesia", descricao: "Org. Rosana Piccolo. Editora Lobo Azul, Curitiba.", tipo: "Coletânea" },
  { ano: 2019, titulo: "Mediocridade", descricao: "Antologia poética. Org. Rosana Piccolo e Rubens Jardim.", tipo: "Coletânea" },
  { ano: 2019, titulo: "Revista Cult - Antologia Poética", descricao: "Número 2. Ed. Bregantini, SP. Org. Tarso de Melo.", tipo: "Revista" },
  { ano: 2018, titulo: "Crocevia di versi / Encruzilhada de Versos", descricao: "Antologia poética transoceânica. Avant Garde Edições, PI.", tipo: "Coletânea" },
  { ano: 2018, titulo: "A Mulher na Literatura Latino-Americana", descricao: "Org. Algemira Macêdo Mendes e Marleide Lins de Albuquerque.", tipo: "Coletânea" },
  { ano: 2018, titulo: "Um Girassol nos teus cabelos", descricao: "Poemas para Marielle Franco. Quintal edições e Mulherio das Letras.", tipo: "Coletânea" },
  { ano: 2015, titulo: "o amor não tem importância", descricao: "Antologia amor, Sábados PerVersos. Alpharrabio Edições.", tipo: "Coletânea" },
  { ano: 2015, titulo: "Antologia UBE", descricao: "União Brasileira de Escritores. Global Editora, SP.", tipo: "Coletânea" },
  { ano: 2014, titulo: "É que os Hussardos Chegam Hoje", descricao: "Editora Patuá / Hussardos Livreiros, SP.", tipo: "Coletânea" },
  { ano: 2013, titulo: "Outras Ruminações", descricao: "75 poetas e a poesia de Donizete Galvão. Dobra Literatura, SP.", tipo: "Coletânea" },
  { ano: 2013, titulo: "Celuzlose", descricao: "Revista Literária, no. 3. Dobra Literatura e Ed. Patuá, SP.", tipo: "Revista" },
  { ano: 2010, titulo: "Cidades Impossíveis", descricao: "Org. Eduardo C.B. Bittar e Tarso de Melo. Portal Literatura, SP.", tipo: "Coletânea" },
  { ano: 2008, titulo: "Encontro – Revista da Lusofonia e Cultura", descricao: "Gabinete Português de Leitura de Pernambuco, nº 20.", tipo: "Revista" },
  { ano: 2007, titulo: "João Suzuki – Travessia do Sonho", descricao: "José Armando Pereira da Silva. Alpharrabio Edições.", tipo: "Coletânea" },
  { ano: 2004, titulo: "Paixão Por São Paulo", descricao: "Antologia poética paulistana. Editora Terceiro Nome, SP.", tipo: "Coletânea" },
  { ano: 2004, titulo: "Relicário", descricao: "Produção poética feminina de 5 países. FUNALFA, Juiz de Fora.", tipo: "Coletânea" },
  { ano: 2003, titulo: "As Cidades Cantam o Tamanduateí que Passa", descricao: "Poetas das cidades do ABC. Prefeitura Municipal de Mauá.", tipo: "Coletânea" },
  { ano: 2003, titulo: "Poetas Revisitam Pessoa", descricao: "Org. João Alves das Neves. Centro de Estudos Fernando Pessoa.", tipo: "Coletânea" },
  { ano: 2000, titulo: "Brasil 2000", descricao: "Antologia de poesia contemporânea brasileira. Ed. Alma Azul.", tipo: "Coletânea" },
  { ano: 2000, titulo: "Uilcon Pereira: no coração", descricao: "Aricy Curvello (org.). Giordano Editora / Editora AGE.", tipo: "Coletânea" },
  { ano: 1998, titulo: "Subvertida Palavra", descricao: "Coletânea Livrespaço IV. SP: Ed. Livrespaço.", tipo: "Coletânea" },
  { ano: 1998, titulo: "À Margem", descricao: "Org. Luzia Teles Veras. SP: Alpharrabio Edições.", tipo: "Coletânea" },
  { ano: 1992, titulo: "Antologia da Nova Poesia Brasileira", descricao: "Org. Olga Savary. RJ: Editora Hipocampo.", tipo: "Coletânea" },
  { ano: 1990, titulo: "Sete Versus Sete", descricao: "(E se resolvermos falar de amor...) - Coletânea Livrespaço V.", tipo: "Coletânea" },
  { ano: 1990, titulo: "Benditos Alternativos e Independentes", descricao: "Benditos Nativos Pendentes. Org. Urhacy Faustino. Edicon.", tipo: "Coletânea" },
  { ano: 1985, titulo: "Poetas Contemporâneos Brasileiros", descricao: "v. III, Coleção Prata Nova. RS: Suplemento Literário Garatuja.", tipo: "Coletânea" },
  { ano: 1985, titulo: "Literatuando", descricao: "Coletânea Livrespaço III. SP: Ed. Livrespaço.", tipo: "Coletânea" },
  { ano: 1984, titulo: "Coletânea Livrespaço II", descricao: "SP: Ed. Livrespaço.", tipo: "Coletânea" }
];

const coletaneasPortugal: Livro[] = [
  { ano: 2022, titulo: "Este imenso mar", descricao: "Antologia de autores contemporâneos de língua portuguesa. Lisboa.", tipo: "Coletânea" },
  { ano: 2021, titulo: "À Janela do Tempo", descricao: "Cadernos de Santiago II. Univ. da Madeira. Lisboa.", tipo: "Coletânea" },
  { ano: 2017, titulo: "Levadas da Madeira: Uma antologia literária", descricao: "Org. Thierry Proença dos Santos. Imprensa Acadêmica.", tipo: "Coletânea" },
  { ano: 2017, titulo: "Lapinha de Poesia", descricao: "Antologia de poetas madeirenses. Org. Nelson Veríssimo.", tipo: "Coletânea" },
  { ano: 2004, titulo: "A Jeito de homenagem a Eugénio de Andrade", descricao: "Fólio Edições (Jornal O primeiro de Janeiro), Porto.", tipo: "Coletânea" },
  { ano: 2000, titulo: "Brasil 2000", descricao: "Antologia de poesia contemporânea brasileira. Ed. Alma Azul.", tipo: "Coletânea" },
  { ano: 1990, titulo: "Poet´Art 90", descricao: "Antologia de Poetas Madeirenses. Associação de Escritores da Madeira.", tipo: "Coletânea" },
  { ano: 1989, titulo: "O Natal na Voz dos Poetas Madeirenses", descricao: "Associação de Escritores da Madeira e Sec. Regional do Turismo.", tipo: "Coletânea" }
];

const coletaneasOutros: Livro[] = [
  { ano: 1998, titulo: "Contemporary Brazilian Literature", descricao: "EUA - Coletânea de textos da Universidade do Colorado.", tipo: "Coletânea" },
  { ano: 1998, titulo: "Selected Writings Magazine", descricao: "EUA - Dept. of Spanish and Portuguese, Universidade do Colorado.", tipo: "Revista" },
  { ano: 1993, titulo: "Verso L´Universo: Geometria Della Donna", descricao: "Itália - Perugia. (Org. Vera Lucia de Oliveira).", tipo: "Coletânea" },
  { ano: 1990, titulo: "Diez Poetas Brasileños", descricao: "Cuba - Revista Bohemia, Havana. (Trad. Felix Contreras).", tipo: "Revista" },
  { ano: 1987, titulo: "15 Poetas Brasileños Contemporaneos", descricao: "Espanha - Edición Grupo Literário Guadiana. Ciudad Real.", tipo: "Revista" },
  { ano: 1986, titulo: "Lectures Bresiliennes", descricao: "França - Revista Jalons, n. 26 e 28. (Trad. J. P. Mestas).", tipo: "Revista" },
  { ano: 1984, titulo: "Nuevos Folios", descricao: "Espanha - Revista literária. Asturias. (Trad. Margarita Anechina).", tipo: "Revista" }
];

const dadosColaboracoes: Livro[] = [
  { ano: 2024, titulo: "Manto da Transição", descricao: "De Adélia Nicolete. Alpharrabio Edições.", tipo: "Prefácio" },
  { ano: 2023, titulo: "Curtidiano", descricao: "De Zhô Bertolini. Alpharrabio Edições.", tipo: "Apresentação" },
  { ano: 2023, titulo: "Cidade Cativa", descricao: "De Deise Assumpção. Alpharrabio Edições.", tipo: "Resenha" },
  { ano: 2022, titulo: "Justa Causa", descricao: "De Giovana Damaceno. Editora Penalux.", tipo: "Orelha" },
  { ano: 2022, titulo: "O Sino Mágico", descricao: "De Renata Moré (memória da Cia. Do Nó). Alpharrabio Edições.", tipo: "Prefácio" },
  { ano: 2022, titulo: "Ensaio na Translocal", descricao: "Conferência na abertura do Curso de Doutorado, Univ. da Madeira.", tipo: "Ensaio" },
  { ano: 2021, titulo: "Xilogravura de Pássaros", descricao: "De Carvalho Junior. Editora Penalux (publicado postumamente).", tipo: "Orelha" },
  { ano: 2019, titulo: "Rastros", descricao: "De Tarso de Melo. Martelo Casa Editorial.", tipo: "Orelha" },
  { ano: 2018, titulo: "A mulher de Ló", descricao: "De Carlos Machado. Coleção Donizete Galvão, Ed. Patuá.", tipo: "Posfácio" },
  { ano: 2017, titulo: "o avesso da lâmpada", descricao: "De Demetrios Galvão. Editora Moinhos, MG.", tipo: "Orelha" },
  { ano: 2017, titulo: "Caderno de Intermitências", descricao: "De Rosana Chrispim. Editora Patuá.", tipo: "Prefácio" },
  { ano: 2014, titulo: "Poesia use várias vezes ao dia", descricao: "De Constança Lucas. Editora Patuá.", tipo: "Prefácio" },
  { ano: 2012, titulo: "Hugo Eduardo Vespúcio", descricao: "Texto transformado em plaquete por Luzia Maninha, ofertada a Hugo Eduardo nos seus 60 anos.", tipo: "Apresentação" },
  { ano: 2012, titulo: "Memórias sentimentais de um silva no rio de suas manhãs", descricao: "Sobre o livro o rio de minhas manhãs, de Joaquim Celso Freire.", tipo: "Resenha" },
  { ano: 2012, titulo: "Mariano do Amaral", descricao: "Exposição uma certa livraria, no Espaço Cultural Gambalaia, Santo André.", tipo: "Apresentação" },
  { ano: 2011, titulo: "Políticas de Governança", descricao: "De Luiz Roberto Alves. ABCDMaior Editora.", tipo: "Prefácio" },
  { ano: 2011, titulo: "Os Livros", descricao: "Exposição de arte-postal, organização de Constança Lucas. Galeria Gravura Brasileira.", tipo: "Apresentação" },
  { ano: 2010, titulo: "Bem mais Perto", descricao: "Exposição de Sueli Moraes. Casa do Olhar, Santo André.", tipo: "Apresentação" },
  { ano: 2010, titulo: "Monocromia", descricao: "De Jurema Barreto de Souza. Ed. A Cigarra.", tipo: "Apresentação" },
  { ano: 2009, titulo: "Livro fotografias", descricao: "De José de Souza Martins. Ed. USP. Leitura na livraria Alpharrabio.", tipo: "Apresentação" },
  { ano: 2009, titulo: "Tramas de Formas", descricao: "Exposição de Cristina Suzuki. Alpharrabio, Santo André.", tipo: "Apresentação" },
  { ano: 2009, titulo: "Grande ABC: culturas que excedem o lugar culturalizado", descricao: "De Luiz Roberto Alves. Alpharrabio Edições.", tipo: "Prefácio" },
  { ano: 2008, titulo: "Espólio de Rubervam", descricao: "Ed. Scortecci.", tipo: "Orelha" },
  { ano: 2008, titulo: "O livro de Sophia", descricao: "De Álvaro Alves de Faria. Leitura crítica em carta ao autor.", tipo: "Resenha" },
  { ano: 2007, titulo: "Um Silva de A a Z", descricao: "De Joaquim Celso Freire. Alpharrabio Edições.", tipo: "Prefácio" },
  { ano: 2007, titulo: "Revista literária A Cigarra", descricao: "Artigo/apresentação para número especial (25 anos).", tipo: "Apresentação" },
  { ano: 2003, titulo: "Entretempo", descricao: "De Rosana Chrispim.", tipo: "Orelha" },
  { ano: 2003, titulo: "Vitrines da cidade", descricao: "De Silvia Passarelli. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2002, titulo: "Poéticas sociais", descricao: "Catálogo de exposição (Amadasi, Suzuki, Massenzi, Giarfi). Diadema.", tipo: "Apresentação" },
  { ano: 2001, titulo: "Inventor de Paisagens", descricao: "De Milton Andrade. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 2001, titulo: "Paisagens do Olhar", descricao: "De Paulo Franco. Ed. Alpharrabio.", tipo: "Orelha" },
  { ano: 2000, titulo: "Brazilírica Pereira: A Traição das Metáforas", descricao: "De Arthur Gomes. Alpharrabio Edições.", tipo: "Prefácio" },
  { ano: 1999, titulo: "A História de Augusto Matraga", descricao: "Peça teatral. Direção Silene Pignagrandi.", tipo: "Adaptação" },
  { ano: 1998, titulo: "Não Há Neblina na Colina", descricao: "De Fábio Souza, Roseli Aguiar e Ivone Mariano. Edição dos autores.", tipo: "Apresentação" },
  { ano: 1998, titulo: "À margem", descricao: "Coletânea. Alpharrabio Edições. Org. Luzia Teles Veras.", tipo: "Apresentação" },
  { ano: 1996, titulo: "A ARTE DE LEILA E AS FORÇAS INCOMPATÍVEIS DO UNIVERSO", descricao: "Catálogo de exposição de Leila Luli. Cine Teatro Carlos Gomes.", tipo: "Apresentação" },
  { ano: 1996, titulo: "Moacyr", descricao: "Dentro do projeto Talentos Emergentes. Livraria Alpharrabio.", tipo: "Orelha" },
  { ano: 1996, titulo: "Talentos Emergentes", descricao: "Coletânea de novos escritores. Alpharrabio Edições.", tipo: "Prefácio" },
  { ano: 1996, titulo: "Coleção Prosas", descricao: "6 volumes em caixa (Valdecirio T. Veras, A. P. Sampaio, etc). Alpharrabio Edições.", tipo: "Apresentação" },
  { ano: 1996, titulo: "Coleção Poéticas", descricao: "5 volumes em caixa manual. Alpharrabio Edições.", tipo: "Apresentação" },
  { ano: 1996, titulo: "Recado", descricao: "Monólogo com poemas de A Palavraparte. Ator Marcos Lemes, dir. Paulo Henrique Sarro. (Biblioteca Mário de Andrade, Alpharrabio, Teatro Municipal de Santo André, etc).", tipo: "Adaptação" },
  { ano: 1996, titulo: "A Palavraparte", descricao: "Monólogo com Artur Gomes. Direção de Hamir Haddad. Alpharrabio.", tipo: "Adaptação" },
  { ano: 1995, titulo: "Pessoa", descricao: "Espetáculo teatral de Silvio Vieira com ator Marcos Lemes.", tipo: "Apresentação" },
  { ano: 1995, titulo: "Trovas Madeirenses", descricao: "De Maria Lourdes Agrela. Alpharrabio Edições (1ª e 2ª edições).", tipo: "Prefácio" },
  { ano: 1994, titulo: "Sem Ensaio", descricao: "De Zhô Bertholini. Edição do autor.", tipo: "Prefácio" },
  { ano: 1991, titulo: "Cores de vidro", descricao: "De Corinne Marian. Edições Livrespaço.", tipo: "Prefácio" },
  { ano: 1990, titulo: "Leila Luli", descricao: "Catálogo de exposição. Cine Teatro Carlos Gomes, Santo André.", tipo: "Apresentação" },
  { ano: 1983, titulo: "Concurso Magister de Poesias", descricao: "Coletânea do Colégio Magister, São Caetano do Sul.", tipo: "Prefácio" },
  { ano: 0, titulo: "DA viagem à LILA", descricao: "Colagem com poemas, crônicas e diários. Grupo Ponto de Fiandeiras. (Museu de Santo André, Alpharrabio, UFABC).", tipo: "Adaptação" },
  { ano: 0, titulo: "Coedição Alpharrabio / Prefeitura de Diadema", descricao: "Coletânea de novos escritores.", tipo: "Prefácio" },
  { ano: 0, titulo: "Roupa nova", descricao: "De Gilberto Tadeu de Lima. Alpharrabio Edições.", tipo: "Orelha" },
  { ano: 0, titulo: "Rosana Chrispim", descricao: "Vol. Coleção micro Alpharrabio, nos 40 anos da poeta.", tipo: "Apresentação" },
  { ano: 0, titulo: "Margarita Lo Russo", descricao: "Coleção micro Alpharrabio.", tipo: "Prefácio" },
  { ano: 0, titulo: "A profissão dos peixes", descricao: "De Rubervam du Nascimento. 2ª edição.", tipo: "Apresentação" },
  { ano: 0, titulo: "Juca Arteiro", descricao: "De Daniel Henrique Esteves Grando.", tipo: "Prefácio" },
  { ano: 0, titulo: "Thiago Sandes Pereira", descricao: "Livro de menino autista.", tipo: "Apresentação" }
];

const dadosEnsaios: Livro[] = [
  { ano: 2016, titulo: "Emigração, memória e as tarefas da poesia", descricao: "Comunicação apresentada no Funchal, Madeira (Portugal), em 10.11.2016.", tipo: "Palestra", slug: "emigracao-memoria-e-as-tarefas-da-poesia" },
  { ano: 2015, titulo: "Os Congressos de História do Grande ABC e as tarefas da poesia", descricao: "Palestra proferida na abertura do XIII Congresso de História do Grande ABC, 2015.", tipo: "Palestra", slug: "os-congressos-de-historia-do-grande-abc-e-as-tarefas-da-poesia" },
  { ano: 2011, titulo: "A AMÁLIA E O FADO - Estranhas formas de vida", descricao: "Ensaio publicado na revista nanico 22, maio de 2011.", tipo: "Ensaio", slug: "a-amalia-e-o-fado-estranhas-formas-de-vida" },
  { ano: 2010, titulo: "Saramago e a poética do humano", descricao: "Ensaio sobre a trajetória de José Saramago.", tipo: "Ensaio", slug: "saramago-e-a-poetica-do-humano" },
  { ano: 2010, titulo: "Pessoa e Saramago - A palavra (re)veladora", descricao: "Palestra no evento Saramago & Pessoa, SESCSP, 17.09.2010.", tipo: "Palestra", slug: "pessoa-e-saramago-a-palavra-re-veladora" },
  { ano: 2008, titulo: "A vez da utopia na agenda cultural", descricao: "Ensaio publicado na obra coletiva Nosso Século XXI, Vol. 2 (2008).", tipo: "Ensaio", slug: "a-vez-da-utopia-na-agenda-cultural" },
  { ano: 2008, titulo: "Joaquim de Montezuma de Carvalho: Embaixador Cultural", descricao: "Comunicação no Colóquio 400 Anos de Padre António Vieira, 24.04.2008.", tipo: "Comunicação", slug: "joaquim-de-montezuma-de-carvalho-embaixador-cultural" },
  { ano: 2007, titulo: "Café, verso e história", descricao: "Roteiro de palestra no SESC São Caetano (Projeto Estação Café).", tipo: "Palestra", slug: "cafe-verso-e-historia" },
  { ano: 2004, titulo: "Cidadã Andreense", descricao: "Discurso na Câmara Municipal de Santo André, 17.03.2004.", tipo: "Discurso", slug: "cidada-andreense" },
  { ano: 2003, titulo: "João Ramalho: um luso na história e na literatura do Brasil", descricao: "Ensaio sobre a polêmica figura do fundador de Santo André (1553).", tipo: "Ensaio", slug: "joao-ramalho-um-luso-na-historia-e-na-literatura-do-brasil" },
  { ano: 2002, titulo: "Ser Editor e Poeta no Grande ABC", descricao: "Palestra na I Semana do Editor (FAENAC, 2002).", tipo: "Palestra", slug: "ser-editor-e-poeta-no-grande-abc" },
  { ano: 2001, titulo: "As palavras aí estão, uma por uma...", descricao: "Depoimento na Casa da Palavra, 07.11.2001.", tipo: "Depoimento", slug: "as-palavras-ai-estao-uma-por-uma" },
  { ano: 2001, titulo: "A Cultura na Pauta da Agenda Regional", descricao: "Ensaio na coletânea Nosso Século XXI (2001).", tipo: "Ensaio", slug: "a-cultura-na-pauta-da-agenda-regional" },
  { ano: 2000, titulo: "Pessoa Entranhado", descricao: "Depoimento no encontro dos 60 anos da morte de Pessoa, 25.11.2000.", tipo: "Depoimento", slug: "pessoa-entranhado" },
  { ano: 2000, titulo: "Eu nunca estive em Macau", descricao: "Comunicação no Colóquio de Macau, 18.08.2000.", tipo: "Comunicação", slug: "eu-nunca-estive-em-macau" },
  { ano: 2000, titulo: "Poesia Madeirense", descricao: "Comunicação no III Encontro Luso-Afro-Brasileiro (2000).", tipo: "Comunicação", slug: "poesia-madeirense" },
  { ano: 2000, titulo: "Seduzir para a poesia: a experiência do grupo Livrespaço", descricao: "Texto no Encontro de Escritores em Fortaleza, 02.06.2000.", tipo: "Comunicação", slug: "seduzir-para-a-poesia-a-experiencia-do-grupo-livrespaco-1983-1993" },
  { ano: 1999, titulo: "A Criação literária como matéria de memória e esquecimento", descricao: "Texto-roteiro no Seminário Literatura & Memória, out/1999.", tipo: "Palestra", slug: "a-criacao-literaria-como-materia-de-memoria-e-esquecimento" },
  { ano: 1998, titulo: "Revistas Literárias", descricao: "Ensaio na revista A Cigarra no. 33 (1998).", tipo: "Ensaio", slug: "revistas-literarias" },
  { ano: 1998, titulo: "Os impróprios nomes próprios como matéria para poesia", descricao: "Ensaio na RL – Revista Literatura, no. 11, 1998.", tipo: "Ensaio", slug: "os-improprios-nomes-proprios-como-materia-para-poesia" },
  { ano: 1997, titulo: "Beats e Marginais - as últimas escolas", descricao: "Ensaio na revista A Cigarra, no. 30, 1997.", tipo: "Ensaio", slug: "beats-e-marginais-as-ultimas-escolas" },
  { ano: 1997, titulo: "Poesia feita por mulheres", descricao: "Palestra proferida na RECAP (Refinaria Capuava), Santo André, 5.04.1997.", tipo: "Palestra", slug: "poesia-feita-por-mulheres" },
  { ano: 1996, titulo: "Para além do Bojador", descricao: "Comunicação no II Encontro de Artistas Portugueses no Brasil, 1996.", tipo: "Comunicação", slug: "para-alem-do-bojador" },
  { ano: 1995, titulo: "A evocação de Oswald", descricao: "Texto no Evento Retalhos Imortais do SerAfim, out/1995.", tipo: "Palestra", slug: "a-evocacao-de-oswald" },
  { ano: 1991, titulo: "A imprensa alternativa no Brasil como resistência cultural", descricao: "Texto no Colóquio na UNESCO, Paris, jun/1991.", tipo: "Comunicação", slug: "a-imprensa-alternativa-no-brasil-como-resistencia-cultural" },
  { ano: 1991, titulo: "A Literatura no ABC (Da contemplação à resistência)", descricao: "Artigo na Revista Raízes no. 4, jan/1991.", tipo: "Artigo", slug: "a-literatura-no-abc-da-contemplacao-a-resistencia" },
  { ano: 1990, titulo: "O escritor luso-brasileiro: entre duas pátrias", descricao: "Comunicação no I Encontro de Intelectuais Portugueses no Brasil, mai/1990.", tipo: "Comunicação" },
  { ano: 0, titulo: "Sentir-se Português na Diáspora", descricao: "Ensaio sobre a diáspora portuguesa e a identidade luso-brasileira.", tipo: "Ensaio", slug: "sentir-se-portugues-na-diaspora" },
  { ano: 0, titulo: "O Poeta e a Cidade", descricao: "Anotações para uma conversa sobre a relação entre o poeta e a cidade.", tipo: "Palestra", slug: "o-poeta-e-a-cidade" }
];

const dadosCronicas: Livro[] = [
  { ano: "1999-2004", titulo: "A Língua, a pátria possível", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica", slug: "a-lingua-a-patria-possivel" },
  { ano: "1999-2004", titulo: "Anotações de Leituras IV", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica", slug: "anotacoes-de-leituras-iv" },
  { ano: "1999-2004", titulo: "Anotações de Leituras III", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica", slug: "anotacoes-de-leituras-iii" },
  { ano: "1999-2004", titulo: "Anotações de Leituras II", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica", slug: "anotacoes-de-leituras-ii" },
  { ano: "1999-2004", titulo: "Anotações de Leituras I", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica", slug: "anotacoes-de-leituras-i" },
  { ano: "1999-2004", titulo: "Biblocasa", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica", slug: "bibliocasa" },
  { ano: "1999-2004", titulo: "O Direito ao Silêncio", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica", slug: "o-direito-ao-silencio" },
  { ano: "1999-2004", titulo: "Crônica de Outono", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica", slug: "cronica-de-outono" },
  { ano: "1999-2004", titulo: "A Cidade do Meu Desejo", descricao: "Crônicas escritas para coluna Viaverbo, entre 1999-2004.", tipo: "Crônica", slug: "a-cidade-do-meu-desejo" }
];

const dadosEntrevistas: Livro[] = [
  { ano: 2015, titulo: "Tarso de Melo", descricao: "Enquete “Sobre poesia, ainda”, realizada com poetas brasileiros da atualidade. Blog Contra Tanto Silêncio, abril de 2015.", tipo: "Entrevista", slug: "entrevista-tarso-de-melo" },
  { ano: 2012, titulo: "Sérgio Simka", descricao: "Entrevista concedida ao prof. Sérgio Simka, publicada no Portal Mauá e Região, setembro de 2012.", tipo: "Entrevista", slug: "entrevista-sergio-simka" },
  { ano: 2009, titulo: "Álvaro Alves de Faria", descricao: "Entrevista por e-mails a Álvaro Alves de Faria, inserida no livro Pastores de Virgílio (Ed. Escrituras, 2009).", tipo: "Entrevista", slug: "entrevista-alvaro-alves-de-faria" },
  { ano: 2008, titulo: "Floriano Martins", descricao: "Entrevista concedida a Floriano Martins, incluída à guisa de prefácio no livro Retratos Falhados (Ed. Escrituras, 2008).", tipo: "Entrevista", slug: "entrevista-floriano-martins" },
  { ano: 2004, titulo: "IMES-Notícias", descricao: "Entrevista ao IMES-Notícias, Ano XIV, nº 93, novembro de 2004.", tipo: "Entrevista", slug: "entrevista-noticias-imes" },
  { ano: "", titulo: "Selmo Vasconcellos", descricao: "Entrevista nº 584, coluna de entrevistas do portal Selmo Vasconcellos.", tipo: "Entrevista", slug: "entrevista-selmo-vasconcellos" },
  { ano: "", titulo: "Revista Virtual PD Literatura", descricao: "Entrevista à Revista Virtual PD Literatura, sobre À Janela dos Dias – poesia quase toda.", tipo: "Entrevista", slug: "entrevista-pd-literatura" }
];

const dadosTraducoes: Livro[] = [
  { ano: 2000, titulo: "Traduções", descricao: "Antonio Machado e Mario Benedetti em versões bilíngues, publicadas na revista A Cigarra (nº 31, ago/1997; nº 35, jun/2000).", tipo: "Tradução", slug: "traducoes" }
];

const dadosVerbetes: Livro[] = [
  { ano: 2021, titulo: "As Mulheres Poetas na Literatura Brasileira", descricao: "Rubens Jardim (org.). Arribaçã, Cajazeiras, PB.", tipo: "Verbete" },
  { ano: 2010, titulo: "Gente do ABCD – 100 crônicas do jornal ABCD Maior", descricao: "Sobre lideranças populares na região. Verbete por Daniel Brazil. ABCDMaior.", tipo: "Verbete" },
  { ano: 2008, titulo: "Imprensa Alternativa no ABC – A história contada pelos independentes", descricao: "Olga Defavari. Prefeitura de Santo André, SP.", tipo: "Verbete" },
  { ano: 2003, titulo: "O Vinho da Madeira na voz dos apreciadores e literatos", descricao: "In A Vinha e o Vinho na História da Madeira, Séculos XV a XX. Alberto Vieira. Centro de Estudos de História do Atlântico, Funchal, Portugal.", tipo: "Verbete" },
  { ano: 2002, titulo: "Dicionário Crítico de Escritoras Brasileiras", descricao: "Nelly Novaes Coelho. Escrituras, SP (verbete crítico pgs. 148 e 149).", tipo: "Verbete" },
  { ano: 2001, titulo: "Enciclopédia de Literatura Brasileira", descricao: "Vols. I e II. Afrânio Coutinho e J. Galante de Souza. Global/Ministério da Cultura, Academia Brasileira de Letras.", tipo: "Verbete" },
  { ano: 2000, titulo: "História da Literatura em Santo André – um ensaio através do tempo", descricao: "Tarso de Melo. Prefeitura Municipal de Santo André.", tipo: "Verbete" },
  { ano: 1999, titulo: "Dicionário de Mulheres", descricao: "Hilda Agnes Hübner Flores. RS: Ed. Nova Dimensão, 1ª ed. (verbete pg. 763). 2ª ed. revista e ampliada, Editora Mulheres, Florianópolis, 2011.", tipo: "Verbete" },
  { ano: 1994, titulo: "Anuário da Poesia Brasileira, 1994", descricao: "CODPOE – Cooperativa de Poetas e Escritores, Rio de Janeiro.", tipo: "Verbete" },
  { ano: 1993, titulo: "Ensaístas Brasileiras - Mulheres que escreveram sobre literatura e artes de 1860 a 1991", descricao: "Heloísa Buarque de Holanda e Lúcia Nascimento Araújo (org.). RJ: Ed. Rocco.", tipo: "Verbete" },
  { ano: 1992, titulo: "Antologia da Nova Poesia Brasileira", descricao: "Organização, seleção, notas e apresentação de Olga Savary, com 334 poetas de todas as regiões do Brasil. Fundação Rio/RioArte, Editora Hipocampo.", tipo: "Verbete" },
  { ano: 1988, titulo: "Dicionário de Poetas Contemporâneos", descricao: "Francisco Igreja (org.). RJ: Oficina Letras & Artes (2ª ed., RJ: Oficina Cadernos de Poesia, 1991).", tipo: "Verbete" }
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

  const handleMudarTab = (novaTab: string) => {
    setTabAtiva(novaTab as TabObra);
    if (novaTab === "obras") setSubTabAtiva("poesia");
    else if (novaTab === "coletaneas") setSubTabAtiva("brasil");
    else if (novaTab === "colaboracoes") setSubTabAtiva("apresentacoes");
    else if (novaTab === "escritos") setSubTabAtiva("ensaios");
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
  } else if (tabAtiva === "escritos") {
    if (subTabAtiva === "ensaios") obrasAtuais = dadosEnsaios;
    else if (subTabAtiva === "cronicas") obrasAtuais = dadosCronicas;
    else if (subTabAtiva === "entrevistas") obrasAtuais = dadosEntrevistas;
    else if (subTabAtiva === "traducoes") obrasAtuais = dadosTraducoes;
  } else if (tabAtiva === "resenhas") {
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

        {(tabAtiva === "obras" || tabAtiva === "coletaneas" || tabAtiva === "colaboracoes" || tabAtiva === "escritos" || tabAtiva === "resenhas") && obrasAtuais.length > 0 ? (
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
                    {tabAtiva === "escritos" && obra.slug && (
                      <Link 
                        href={`/texto/${obra.slug}`}
                        style={{ display: 'inline-block', marginTop: '10px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: '500', color: '#7a3b5a', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'all 0.3s ease', paddingBottom: '1px' }}
                        onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#7a3b5a'}
                        onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
                      >
                        Leia o texto →
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
                {tabAtiva === "escritos" && subTabAtiva !== "cronicas" && "Em breve, mais ensaios e traduções em texto integral."}
                {tabAtiva === "resenhas" && (subTabAtiva === "leituras" || subTabAtiva === "estudos") && "Em breve, leituras e estudos críticos sobre a obra da autora."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}