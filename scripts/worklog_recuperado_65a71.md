
---
Task ID: 65
Agent: main
Task: Cor de contraste para as PERGUNTAS das entrevistas (pedido da usuária: "as perguntas tinham uma cor de contraste com as respostas na versão anterior")

Work Log:
- Investigação da "versão anterior": legado (perguntas pretas, só <b>/<i> — sem cor), site conceito vercel.app (chunks JS baixados — sem Q&A de entrevistas, só eventos do movimento), git (fichas das entrevistas têm UM único commit, o da Task 64 — o estilo antigo perdeu-se no rollback da queda de energia e é irrecuperável) e template-original (nada) → recriado o contraste com o accent do site #7a3b5a (rosa-grená dos links/"Leia o texto")
- Levantamento bloco a bloco dos formatos de pergunta nas 7 fichas: IMES <b>IN</b>: (7, parágrafo-gigante com <br>, respostas <b>Dalila</b>:), Álvaro <p>AAF/AFF - (12, sendo 1 parágrafo MISTO pergunta+DTV no mesmo <p>), Floriano <p>FM (9), PD <b>/<strong>PD - (10), Selmo <b>SELMO VASCONCELLOS</b> (6, com variação de espaço antes de </b>; versos do poema "como salvar..." NÃO são perguntas), Sérgio Simka <p><i>...</i></p> integral (10 prompts), Tarso enquete <p>N. (5; a 4 abre com aspa CP1252 \x93 legada, verbatim)
- scripts/marcar_perguntas_entrevistas.py: adiciona class="pergunta" aos <p> de pergunta (51) e envolve trechos em span.pergunta (8: 7 do IMES + 1 do parágrafo misto do Álvaro — nesse o <p> fica SEM classe para não colorir a resposta); guardas: contagens exatas por ficha (aborta se divergir), verbatim strip-tags antes/depois idêntico, tags balanceadas, idempotente (nunca importar geradores — lição da Task 64)
- css-corpo.ts: .corpo-texto p.pergunta, .corpo-texto span.pergunta { color: #7a3b5a } — respostas permanecem #333
- Validação: tsc 0 erros; scripts/verifica_perguntas_entrevistas.py 7/7 (contagens p/span exatas, cor computada rgb(122,59,90) nas perguntas, respostas rgb(51,51,51), versos do poema do Selmo intactos, resposta do parágrafo misto do Álvaro intacta, respostas "Dalila:" do IMES intactas); HTTP 200 7/7 entrevistas + regressão ensaio/leitura; screenshots shot65-pd-qa.png, shot65-imes-qa.png, shot65-sergio-perguntas.png (contraste visual confirmado)

Stage Summary:
- As 59 perguntas das 7 entrevistas agora aparecem em rosa-grená #7a3b5a (contraste com as respostas #333), com o texto 100% verbatim (apenas atributo class adicionado)
- Parágrafos mistos e o gigante do IMES: cor aplicada só ao trecho da pergunta (span), resposta permanece escura
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 66
Agent: main
Task: Correções de transcrição na Entrevista a Álvaro Alves de Faria (reportadas pela usuária): travessão virado "quadradinho" + 1ª pergunta sem a cor das perguntas

Work Log:
- Diagnóstico do "quadradinho": os .htm do legado são ISO-8859-1 declarado com bytes CP1252 do Word (0x93 " / 0x94 " / 0x96 – / 0x97 —); navegadores exibem ISO-8859-1 como windows-1252, então o legado MOSTRAVA os travessões certos — a conversão ISO-8859-1→UTF-8 da Task 64 preservou os controles C1 (U+0093/U+0094/U+0096/U+0097), que browsers atuais desenham como tofu. Confirmado byte a byte no legado bruto (legado_entrevista_04.htm: 5× 0x96, exatamente os 5 da ficha)
- Auditoria do acervo inteiro (82 fichas /texto + 3 /obra + data/*.json): 41 C1 em 6 entrevistas (alvaro 5×0x96, floriano 2×0x96, imes 9×0x93+9×0x94, pd 3×0x96+2×0x97, selmo 1×0x96+2×0x93+1×0x94, tarso 4×0x93+3×0x94); ensaios/crônicas/traduções/leituras limpos
- scripts/corrige_c1_cp1252.py: substituição 1:1 provada posição a posição (só C1, mapa CP1252 completo); verificação cruzada por ficha vs legado bruto (contagem de cada byte no .htm original == contagem corrigida: 5/5, 2/2, 9/9, 9/9, 3/3, 2/2, 2/2, 1/1, 4/4, 3/3); pós-check: nenhum C1 restante; correção de bug no próprio script (zip desalinhado pela marcação que muda tamanho — comparação isolada antes da marcação)
- 2º ponto: 1ª pergunta do Álvaro abre com "- <b>Álvaro Alves de Faria</b> – Dalila, ..." (nome completo; as demais usam AAF/AFF — por isso escapou da Task 65) → class="pergunta" adicionada; Álvaro agora com 12 p.pergunta + 1 span
- Validação: tsc 0 erros; verifica_perguntas_entrevistas.py 7/7 (regressão Task 65 com alvaro p=12); checks Task 66 no browser: "Álvaro Alves de Faria – Dalila" com en dash correto, 1ª pergunta rgb(122,59,90), IMES com aspas “disseminação” corretas, PD com em dash "gestões — ... —", Tarso pergunta 4 "4. “Tenho que dar...", zero tofu nas 4 páginas; HTTP 200 7/7; screenshots shot66-alvaro-1a-pergunta.png, shot66-imes-aspas.png

Stage Summary:
- Os 41 "quadradinhos" das entrevistas corrigidos para os caracteres reais do legado (aspas “ ” e travessões – —), com contagem byte a byte batendo com o site original
- 1ª pergunta do Álvaro (nome completo) agora colorida como as demais; texto 100% verbatim
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 67
Agent: main
Task: Separar perguntas e respostas em parágrafos próprios ("respiro") — pedido da usuária: "pergunta e resposta tudo na mesma linha" (exemplo: /texto/entrevista-alvaro-alves-de-faria)

Work Log:
- Diagnóstico: o parser da Task 64 converteu separadores de bloco do legado em espaços. Casos: (1) Álvaro p7 — legado tinha <br><br> entre a pergunta AFF e a resposta DTV dentro de 1 <p>; hoje estavam colados na mesma linha (2) IMES — TODA a entrevista (7 Q + 7 A) num único <p> gigante de 21 <br>, sem margem de parágrafo (3) bônus encontrado no scan: Sérgio Simka pergunta 6 "Q<i>uais são as maiores dificuldades..." tinha o Q FORA do <i> no legado → escapou do padrão <p><i> da Task 65 e não estava colorida
- Scans automáticos (scripts/scan_qa_colados.py, scan_perguntas_sem_classe.py): confirmaram que só essas 3 fichas tinham o problema; Floriano/PD/Selmo/Tarso já corretas
- scripts/corrige_qa_paragrafos.py: Álvaro misto → <p class="pergunta"> + <p> DTV; IMES gigante → 7 <p class="pergunta"> + 7 <p> de resposta (<p><br><span> eliminado, <br><br> virou fronteira de parágrafo, <br> final removido); Sérgio Q6 ganhou class="pergunta". Espaços preservados ENTRE </p> e <p> (posição invisível) para o guard verbatim passar; guardas: strip-tags + whitespace normalizado idêntico, tags balanceadas, contagens exatas (1/7/6/1), zero C1
- Contagens finais: Álvaro 32 p (13 pergunta), IMES 15 p (7+7), Sérgio 23 p (11 pergunta); total de perguntas coloridas 61
- Verificação: tsc 0 erros; verifica_perguntas_entrevistas.py 7/7 (contagens, cor rgb(122,59,90) nas perguntas, respostas rgb(51,51,51), Álvaro: resposta DTV em <p> separado com margin-bottom 20px e sem colagem; IMES: nenhum <p> com IN:+Dalila:, 7 Q + 7 A, respiro 20px; Selmo: versos do poema intactos); HTTP 200 7/7; screenshots shot67-alvaro-separacao.png, shot67-imes-separacao.png, shot67-imes-final.png, shot67-sergio-pergunta6.png

Stage Summary:
- Perguntas e respostas agora em parágrafos próprios com o respiro de 20px nas 3 fichas afetadas (Álvaro, IMES, Sérgio Simka); texto 100% verbatim (só estrutura HTML)
- Bônus: 6ª pergunta do Sérgio Simka (dropcap Q fora do <i> no legado) agora colorida como as demais
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 68
Agent: main
Task: Restaurar os dados do Eixo Movimento perdidos no vai-e-volta de energia — distribuição nas subtabs da tab Ativismo Cultural (usuária forneceu pasta do Drive 1Q0ZVOF3TDMitMbTHeq60vsVU7-_yVSG7)

Work Log:
- Estado encontrado: 9 JSONs de movimento como stubs vazios de 25/09 (rollback da 1ª queda); Institucionais.json (8) e ativismo.json (263) sobreviveram; distribuição anterior nunca commitada e worklog das tasks perdidas sumiu no rollback
- Download do Drive (gdown no venv): 9 JSONs curados da usuária (38 registros, schema próprio: id/titulo/tipo/modalidade/ano/dataCompleta/local/cidade/estado/descricao) + AtivismoCultural.txt (106KB)
- AtivismoCultural.txt = array TS `dadosPalestrasOficinas` com 263 registros — COMPARADO byte a byte com src/app/data/movimento/ativismo.json: IDÊNTICOS (era só backup; parse TS->JSON em scripts/parse_ao_drive.js com balancemaneto ciente de strings/URLs http://)
- Mapeamento adotado (scripts/gerar_dados_movimento.py): palestras-conferencias(5)→Palestras; oficina-workshops(4)→OficinasWorkshops; saraus-recitais(5)→SarausRecitais; congressos-seminarios(4)→CongressosSeminariosSimposios; mesas-debate-rodas-conversa(4)→ConferenciasMesas; encontros-leituras SPLIT por tipo: 3 Leitura Pública→LeiturasPoeticas + 1 Encontro→EncontrosAtividadesCulturais; entrevistas-programas(4)+lives-podcasts(4)→ProgramasEntrevistas; curadoria-consultoria(4)→CuradoriaConsultoria
- Conversão de schema para a moldura ArquivoCategoria idêntica ao Institucionais sobrevivente: id "<prefixo>-NNN" + numero_ordem, dataCompleta→data ISO "AAAA-MM-00" (parser 4 padrões, 38 formatos) + data_fim para faixas ("22 de novembro a 12 de dezembro de 1990"→1990-11-22 a 1990-12-12), estado "Internacional"→pais "Portugal" (Funchal), tags do vocabulário do lib/tags.ts (subcategoria azul + virtual vermelho), descricao→texto_original; ordenação cronológica; sem slug_texto (rota /palestras não existe — evita link morto)
- Stubs antigos salvos em scripts/backup_movimento_stubs/; Institucionais e ativismo intocados; SecaoMovimento.tsx conferido vs template-original: fiel (só diferenças defensivas ?./?? de sessões anteriores); dadosAtivismos importado e não renderizado é design do template dela
- Validação: tsc 0 erros; scripts/verifica_movimento.py 9/9 subtabs (contagens 9/5/4/4/8/1/8/4/3, zero "Nenhum registro", décadas renderizadas, Funchal mostra Portugal, pill #virtual presente); rotas 200 (home 3 eixos + /texto); screenshots shot68-palestras.png, shot68-leituras.png

Stage Summary:
- As 9 subtabs do Ativismo Cultural repovoadas com os 38 registros curados da usuária (total 46 com os 8 Institucionais sobreviventes), no schema normalizado do site e texto verbatim dela
- ativismo.json (263) confirmado intacto; ativo como backup do Drive da usuária
- Decisões de mapeamento comunicadas à usuária (split encontros/leituras, lives/podcasts em Programas & Entrevistas) — reversível se ela preferir outra distribuição
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 69
Agent: main
Task: Verificar e restaurar o livro "Alpharrabio 12 anos" em Obras Publicadas (usuária perguntou se o texto e a imagem se perderam)

Work Log:
- Diagnóstico: o REGISTRO no catálogo (dadosProsa: "Alpharrabio 12 anos", 2004, "Em coautoria com Luzia Maninha") sobreviveu — idêntico em template-original, conceito_chunks e drive-obra-full; a CAPA também sobreviveu em disco (public/imagens/obras-publicadas/poesia/2004-capa-Alpharrabio12anos.jpg, foto do livro "uma história em curso") — porém a FICHA /obra/alpharrabio-12-anos nunca foi commitada (git log --all vazio) e a página caía em "Página em construção" (o texto sim se perdeu no rollback das quedas de energia)
- Ficha recriada em src/app/obra/[id]/alpharrabio-12-anos/dados.json com dados 100% verbatim: titulo, subtitulo "uma história em curso" (da capa + bibliografia do estudo legado), genero Prosa, ano 2004, capa (arquivo original), status_catalogo esgotado, sobre = definição da autora verbatim do estudo crítico legado ("o registro, de um ciclo cumprido, o registro de uma casa de livros, notas sobre uma casa de palavras, anotações sobre uma casa de artes, memórias de uma casa de cultura, notícias de uma micro usina de ideias e projetos") + atribuição, dados da edição (Ano/Tipo/Editora "Alpharrabio Edições, Santo André/SP"/Coautoria "Luzia Maninha Teles Veras")
- ConteudoObra.tsx: ficha registrada no import + mapa livros["alpharrabio-12-anos"] (imports estáticos — sem isso o cliente não enxerga a ficha nova)
- BÔNUS — varredura das subtabs Poesia/Prosa comparando slug gerado pela listagem (titulo → slugify) vs pastas de fichas: 6 links "Conheça a obra" MORTOS apesar de fichas existentes (A Palavraparte, Poética das Circunstâncias, Forasteiros, Elemento em Fúria, Madeira, As Artes do Ofício — pastas com "---" ou nomes divergentes; bug herdado também da SecaoObras_CORRIGIDO da usuária). Corrigido com slug explícito nas 6 entradas + href preferindo obra.slug com fallback ao slug gerado
- Pendências reportadas à usuária (fichas realmente inexistentes → "Página em construção", estado suportado pelo template): ponto(s), Seduzir para a Poesia, Minudências (esta tem capa em disco: 2000-capa-minudencias.jpg)
- Validação: tsc 0 erros; scripts/verifica_alpharrabio12.py 29/29 (ficha completa: capa decodificada naturalWidth=400, título/subtítulo/PROSA, Sobre com citação, Dados da Edição com 5 cards incluindo EDIÇÃO Esgotada auto; listagem Prosa intacta; regressão a-vida-cronica; 6 links consertados abrindo ficha); screenshots shot69-alpharrabio-ficha.png, shot69-alpharrabio-dados.png, shot69-lista-prosa.png

Stage Summary:
- Alpharrabio 12 anos: ficha restaurada com capa + citação da autora + dados de edição; página saiu do "Página em construção"
- 6 links mortos da listagem (Poesia/Prosa) agora abrem suas fichas existentes
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 70
Agent: main
Task: Ficha Minudências a partir do legado (pedido da usuária: usar o conteúdo de http://www.dalila.telesveras.nom.br/Minudencias.htm na ficha minudencias)

Work Log:
- Contexto: pendência herdada da Task 69 (Minudências constava como "Página em construção"; capa 2000-capa-minudencias.jpg já existia em disco)
- Legado baixado (scripts/legado_minudencias/Minudencias.htm, ISO-8859-1/CP1252, 3.2KB): página do livro com título, link Alpharrabio Edições, formato "(16 x 23 cm, 136 pp.)" e descrição em 2 parágrafos (projeto de diarização de 1999 / origem na empreitada de Antonio Possidonio Sampaio, 1992, ABC Cotidiano - Cotidiário)
- scripts/gerar_ficha_minudencias.py: extração verbatim dos 2 <p ALIGN="right"> do legado (drop de tags, unescape, soft wraps -> espaço único, \n\n entre parágrafos); guardas de prefixos/âncoras/finais, zero C1, zero resto de tag; aspas de abertura do P1 (sem fecho NO PRÓPRIO legado) e "idéia" pré-acordo preservados
- src/app/obra/[id]/minudencias/dados.json: titulo Minudências, genero Prosa, ano 2000, capa original, status esgotado, sobre = 2 parágrafos verbatim, dados: Ano 2000 / Tipo Diário (catalogo "Diário. SP: Alpharrabio") / Editora Alpharrabio Edições, SP / Formato 16 x 23 cm / Páginas 136 pp. (padrão das fichas irmãs a-vida-cronica/a-janela-dos-dias)
- ConteudoObra.tsx: import + livros["minudencias"] (imports estáticos — mesmo wiring da Task 69)
- Slug: listagem Prosa gera "minudencias" automaticamente de "Minudências" (NFD) — casa com a pasta; nenhuma edição no SecaoObras necessária
- Validação: tsc 0 erros; scripts/verifica_minudencias.py 27/27 (HTTP 200, sem "Página em construção", capa naturalWidth=1890, Sobre verbatim P1/P2 com âncoras, 5 cards + EDIÇÃO Esgotada auto, link Conheça a obra → /obra/minudencias, regressão a-vida-cronica/alpharrabio-12-anos/diuturnos); screenshots shot70-minudencias-ficha.png, shot70-minudencias-dados.png, shot70-lista-prosa.png

Stage Summary:
- Ficha /obra/minudencias saiu do "Página em construção": capa original + texto verbatim do legado (2 parágrafos) + Dados da Edição completos
- Fichas de obras ainda sem fonte (seguem "Página em construção", conforme levantamento da Task 69): Seduzir para a Poesia (pasta inexistente) e demais sem legado identificado
- Pacote permanece v14; aguardando "terminou" da usuária para reempacotar

---
Task ID: 70-b (fechamento)
Agent: main
Task: Encerramento da fase — reempacotamento v15 para GitHub (usuária disse "terminou tudo por agora")

Work Log:
- QA final antes do pacote: scripts/varredura_final_fechamento.py — 120 rotas varridas (home 3 eixos + 37 fichas /obra + 80 páginas /texto): TODAS HTTP 200 e nenhuma ficha com conteúdo caiu em "Página em construção"; único alerta era falso positivo (curl sem JS não vê rótulo do eixo obra) — confirmado no browser com scripts/confirma_eixos_browser.py 4/4 (OBRAS PUBLICADAS renderiza em maiúsculas via CSS)
- /api/baixar-pacote NÃO existe mais no código (só resta o route.ts "Hello world" — mecanismo da v14 perdido nos rollbacks das quedas de energia); pacote v15 gerado direto do git: `git archive --format=zip --prefix=dalila-teles-veras/ -o download/dalila-teles-veras-site-v15-final.zip HEAD`
- Verificação do pacote: zip íntegro (unzip -t), 1410 entradas = 1072 arquivos + 338 diretórios, batendo 1:1 com `git ls-files` (1072=1072; 6 "diferenças" são apenas nomes UTF-8 — git exibe escapado, zip traz "liçõesdetempo/inventário.jpg" reais); diff byte a byte OK (minudencias/dados.json, ConteudoObra.tsx, worklog, package.json); maior arquivo 7MB (folga do limite de 100MB do GitHub)
- Estado do git: working tree limpo, último commit inclui a Task 70 completa (ficha minudencias + wiring + scripts + screenshots)
- Pacote: download/dalila-teles-veras-site-v15-final.zip (303MB, pasta raiz dalila-teles-veras/ ao descompactar, SEM .git — repo limpo para git init + push)

Stage Summary:
- Fase encerrada a pedido da usuária ("terminou tudo por agora"); site 100% validado (tsc 0 erros, 120 rotas 200, eixos OK no browser)
- Pacote v15 completo (snapshot exato do HEAD, incluindo src/, public/, scripts/, upload/, drive-obra-full/, template-original/, worklog) disponível em download/ para o GitHub
- Usuária voltará depois "com os apontamentos da cliente amiga" — sessão futura de revisões

---
Task ID: 71
Agent: main
Task: RECONSTRUÇÃO TOTAL pós-2ª queda de energia — rollback para o checkpoint de 25 Sep perdeu as Tasks 60-70 (git também revertido; commit 44969bc da Task 70 inexistente como objeto); pedido da usuária: recriar o download v15

Work Log:
- Diagnóstico: .git com 38 commits todos de 25 Sep (último feb3348 21:46); reflog sem rastro dos commits de 01 Oct; zip v15 de download/ sumiu; worklog.md regrediu a 20-b; 3 fichas conceito em versão antiga (403-485B); 9 subtabs de movimento como stubs ~150B; sem leituras críticas/entrevistas/alpharrabio/minudencias
- SOBREVIVEU (Tasks 1-59): 38 fichas /texto, 35 fichas /obra, ativismo.json (263), Institucionais.json (8), scripts/legado/ + gerar_textos_legado.py
- Documentação recuperada: entradas 62-70-b re-anexadas ao worklog a partir do contexto da sessão (scripts/worklog_recuperado_62a67.md)
- Reconstrução em andamento conforme as receitas das tasks originais (todas documentadas acima)
