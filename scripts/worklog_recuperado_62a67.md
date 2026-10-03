---
Task ID: 62
Agent: main
Task: Regeneração pós-queda de energia (reconstruir Tasks 60/61) + Task 62: restaurar conteúdo legado da aba Resenhas | Leituras Críticas (e Estudos Críticos)

Work Log:
- Queda de energia da usuária → rollback do filesystem para o checkpoint de 25 Sep (worklog em 20-b, dados.json dos 3 livros em versão antiga 439-485B, capa passageira placeholder 29KB, sem bloco subtítulo no ConteudoObra). Ambiente re-verificado item a item (arquivos surgiram com atraso na sync pós-boot; estado final = pré-Task 60)
- Site conceito re-localizado por força bruta de URLs: https://dalila-teles-veras.vercel.app (buildId 2bdy5z6zr5em0 intacto) — chunk de dados re-baixado (20.805B, idêntico) + capa real passageira.png (453.618B, idêntico)
- scripts/extract_conceito_3livros.mjs recriado: extração string-aware do objeto d={...} (marcadores "opcoes-para-morrer-no-espaco":{ / "passageira-antologia-pessoal-1982-2024":{ / insulas:{ ) + new Function → scripts/conceito_dados/*.json; batimento 100% com a Task 61 (Passageira sobre 1033c/orelha 558c Lilian Sais/11 cartões; Opções sobre 512c/orelha 416c Amanda Vital; Ínsulas sobre 1740c/6 cartões Fósforo)
- scripts/merge_conceito_3livros.mjs recriado (mesmas decisões): Passageira ano 2026 + verbatim + capa real em public/; Opções título minúsculo + cartão Prêmio Oceanos 1º + cartões do site (placeholder "Formato" do conceito fora); Ínsulas subtítulo "Dalila Teles Veras" + cartões Fósforo; limpeza dos subtítulos residuais diuturnos/soliloquios/vestigios
- ConteudoObra.tsx: bloco subtítulo sob o h1 re-adicionado ({livro.subtitulo && ...}) — 930 linhas
- TASK 62 (Leituras Críticas): legado baixado de http://www.dalila.telesveras.nom.br/leiturascr%C3%ADticas.htm + 6 páginas de livros + EstudosCriticos1.htm (ISO-8859-1→UTF-8). Estrutura: menu por livro → leituras completas em rows de tabela
- Inventário: 34 leituras críticas (Estranhas 1, Retratos 2, Janela 13, Vestígios 12, Artes 3 — incluindo "Lentes Atentas"/Fabiano Calixto não listada no menu, A Vida Crônica 3) + 1 estudo crítico (Clara Moura Lourenço, Univ. Coimbra, com BIBLIOGRAFIA/notas + poema "10 de junho" da página)
- scripts/gerar_leituras_criticas.py: parser limpar_fragmento (herdado de gerar_textos_legado.py) + curadoria bloco a bloco (scripts/lc_raw/, blocos_indice.txt) → 35 fichas /texto/[slug]/dados.json (tipo leitura-critica/estudo-critico, subtitulo "Por...", contexto evento "Sobre <livro>"/local-fonte, fonte_original com URL legado; nota (*) da Irene em fonte_original.nota; split "Poesia na Janela – ..."; cartas sem título usam frase de abertura como título)
- SecaoObras.tsx: arrays dadosLeiturasCriticas (34) + dadosEstudosCriticos (1) gerados; wiring leituras/estudos; "Leia o texto →" estendido p/ resenhas leituras+estudos
- ConteudoTexto.tsx: tipoRotulo/tipoFaixa com "Leitura Crítica"/"Estudo Crítico" (faixa "Resenhas") + union do tipo
- BUG de pipeline herdado corrigido (129 casos): espaço comido antes de tags inline ("Do latim<i>fatum</i>") — limpar_fragmento não colapsa mais whitespace antes de tags; corrige_espacos_tags.py cirúrgico em todos os dados.json; auditoria vs RAWs (audita_espacos_tags.py) reverteu itálico parcial intencional "e<i>stranhas"; corrige_fecha_tag.py (27 casos fecha+letra) com correção de posicionamento (26 casos exatos aplicados + saramago "Alegri</i>a)")
- Validação: tsc 0 erros; playwright verifica_task62.py 40/40 OK (3 fichas completas, lista de leituras, página de leitura, estudo+poema, regressão escritos/fortuna/verbetes, subtítulos residuais); HTTP 73/73 rotas /texto 200 + obras + home; screenshots shot62-*.png

Stage Summary:
- Trabalho das Tasks 60/61 restaurado por completo (3 fichas verbatim do conceito + capa real + subtítulos)
- Leituras Críticas: 34 textos completos do site legado com layout idêntico aos ensaios/crônicas/traduções (lista por ano + "Leia o texto →" + página de leitura padrão); Estudos Críticos: 1 estudo acadêmico
- Bug de espaços comidos por tags inline corrigido em TODO o acervo de textos (155 correções validadas contra os RAWs)
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 63
Agent: main
Task: Leituras Críticas agrupadas por livro (pedido da usuária após ver a lista por ano)

Work Log:
- Pedido da usuária: a lista por ano da leitura ficou ruim; volta ao agrupamento por livro (como no menu do site legado), no formato "[ano do livro] - [Nome do Livro]" → "-[por Autor n] - [link]Leia"
- Mapeamento livro→leituras a partir do campo "sobre <livro>" das 34 fichas + anos dos livros do catálogo da aba Obras Publicadas (Estranhas Formas de Vida 2013, Retratos Falhados 2008, Vestígios 2003, À Janela dos dias 2002, As Artes do Ofício 2000, A Vida Crônica 1999)
- SecaoObras.tsx: novo array estático leiturasAgrupadasPorLivro (6 grupos: 1+2+12+13+3+3 = 34 leituras); autores verbatim das fichas "Por ..." (única exceção: um-belo-livro... sem autor pessoal → atribuição verbatim do legado "Jornal O Capital, julho 2002, Aracaju, Sergipe", confirmada em scripts/lc_raw/jane_11.txt); grupos ordenados por ano do livro decrescente; dentro do grupo, ordem do legado preservada
- Render: branch própria para a aba leituras (separador-genero com "{ano} - {nome}", âncora c-{década} só no 1º livro da década; linha "- por {autor} - " + Link "Leia" → /texto/[slug] no estilo #7a3b5a); régua de décadas agora alimenta-se dos anos dos LIVROS (não das leituras); demais subtabs (fortuna/verbetes/estudos) inalteradas
- Validação: tsc 0 erros; scripts/verifica_leituras_por_livro.py 24/24 no browser (6 cabeçalhos em ordem, 34 linhas, contagens por grupo 1/2/12/13/3/3, 34 links Leia com hrefs corretos, sem "Data não informada", Estudos/Fortuna/Verbetes regressão OK) + 34/34 rotas /texto HTTP 200; screenshot scripts/shot-leituras-por-livro.png
- Nota técnica: SecaoObras só renderiza no eixo "obra" (page.tsx gating por estado/URL ?eixo=obra) — teste browser precisa de /?eixo=obra

Stage Summary:
- Leituras Críticas agrupadas pelos 6 livros comentados, no formato exato pedido pela usuária; 34 leituras intactas com links para as páginas de leitura
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 64
Agent: main
Task: Restaurar a subtab Entrevistas em Escritos & Leituras (conteúdo legado entrevistasdalilatelesveras.htm)

Work Log:
- Usuária reportou sumiço da subtab "Entrevistas"; verificado que ela não existe em nenhum commit git (provável perda no rollback da 1ª queda de energia — checkpoint 25 Sep era anterior) — reconstruída do zero a partir do legado
- Legado baixado: menu entrevistasdalilatelesveras.htm + Entrevistadalilatelesveras01..07.htm (ISO-8859-1→UTF-8); mesmo template das leituras críticas (conteúdo = TR3 da tabela)
- Curadoria bloco a bloco (scripts/ent_raw/ent_*.txt): TODOS os blocos são conteúdo em todas as 7 páginas (intros, bios, Q&A, poemas da pág. 06, poema Gastão Cruz na pág. 07; pergunta 5 da pág. 07 termina "Por q" truncada NO PRÓPRIO legado — verificado no HTML bruto, mantida verbatim)
- scripts/gerar_entrevistas.py: 7 fichas /texto/[slug]/dados.json (tipo "entrevista"), texto = html_limpo por bloco (preserva <i> das perguntas, dropcap "b<b>ecos</b>", negritos); fonte_original com URL legado; tags balanceadas OK
- Fichas: IMES-NOTÍCIAS 2004 (sem subtitulo, veículo), PD Literatura 2002 (Rodrigo de Souza Leão), Floriano Martins 2008 (prefácio de Retratos Falhados), Álvaro Alves de Faria 2009 (Pastores de Virgílio), Sérgio Simka 2012 (Portal Mauá e Região), Selmo Vasconcellos s.d. (ano 0 → "Data não informada", com 3 poemas), Tarso de Melo 2015 ("Sobre poesia, ainda", enquete)
- Wiring: CabecalhoObra (subtab Entrevistas entre Crônicas e Traduções + subtítulo "Ensaios, crônicas, entrevistas e traduções..."); SecaoObras (dadosEntrevistas + case "entrevistas"; link "Leia o texto" já coberto pela condição escritos); ConteudoTexto (tipo "entrevista" na union, rotulo "Entrevista", faixa "Entrevistas")
- INCIDENTE: import de gerar_leituras_criticas.py re-executou a geração da Task 62 e revertou correções manuais em 3 fichas (a-estranheza "vida <b>", para-quem-perdeu, resistencia) — restauradas do HEAD via git checkout; dump_entrevistas.py corrigido para função limpar_fragmento local (nunca importar o gerador)
- Validação: tsc 0 erros; scripts/verifica_entrevistas.py 22/22 (subtab visível, subtítulo, 7 itens na lista, Data não informada, 7 links, ficha completa com faixa/rótulo/subtitulo/Q&A verbatim, Selmo com poemas, regressão leituras-por-livro + rotas 8/8 HTTP 200); screenshots shot-entrevistas-lista.png / shot-entrevistas-ficha.png

Stage Summary:
- Subtab Entrevistas restaurada em Escritos & Leituras com as 7 entrevistas completas do legado, layout idêntico a ensaios/crônicas/traduções
- Fichas da Task 62 reintegradas ao estado corrigido (incidente do import neutralizado)
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar
