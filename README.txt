ALPHARRABIO 12 ANOS — FICHA DA OBRA (Task 79, rev. 2)
======================================================

O QUE ESTE PACOTE FAZ
---------------------
Cria a página de detalhe do livro "Alpharrabio 12 anos: uma história em curso"
(Prosa, 2004), que até agora mostrava "Página em construção" ao clicar em
"Conheça a obra →" na sub-aba Prosa de OBRAS PUBLICADAS.

A partir do deploy, a página /obra/alpharrabio-12-anos terá:
- A capa (foto do livro que você enviou)
- A aba "Sobre" com o texto integral da apresentação
  (epígrafe de Guimarães Rosa + DOS MOTIVOS + DA AÇÃO + DO LIVRO +
   NEL MEZZO DEL CAMMIN + assinatura da autora)
- A aba "Dados da Edição" com 12 fichas (ISBN, organização, revisão, capa,
  orelhas com as obras de Amadasi e Brancatelli, vinheta de Guedo Gallett...)
- A aba "Adquira" com o botão "IR PARA A LOJA ALPHARRABIO"
  (status: disponível, como você confirmou — rev. 2)

ARQUIVOS (arraste por cima do seu clone local, mantendo as pastas)
------------------------------------------------------------------
src/app/obra/[id]/alpharrabio-12-anos/dados.json   (novo — a ficha)
src/app/obra/[id]/ConteudoObra.tsx                 (editado — registra a ficha)
public/imagens/obras-publicadas/prosa/2004-capa-alpharrabio12anos.jpg  (novo — capa)

DEPOIS DE ARRASTAR
------------------
1. VS Code → Commit & Sync (deploy automático Vercel, ~2 min)
2. Teste: OBRAS PUBLICADAS → Prosa → Alpharrabio 12 anos → "Conheça a obra →"

VALIDAÇÃO
---------
- npx tsc --noEmit: sem erros
- Texto preservado quase verbatim; veja LISTA-DE-AJUSTES.txt (Opção A)
