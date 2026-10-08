TASK 82 — ENTREVISTAS: selo dtv carimbado na página de leitura
===============================================================

CONTEXTO: o zip que você procurava não existia mais — a conversa da
época foi interrompida antes do pacote, e a renovação do ambiente
esvaziou a pasta de downloads. Este aqui é o conserto refeito.

O QUE ESTE PACOTE FAZ:
1. SELO DTV (sua solicitação): o carimbo redondo "dtv — poeta, cronista,
   memorialista / Alpharrabio editora" aparece na abertura do corpo de
   cada entrevista, alinhado à DIREITA, fundido com o papel (efeito
   multiply) e levemente girado, como um carimbo real na primeira página.
   Tamanho: 92px. Imagem incluída no pacote (public/imagens/entrevistas/).
2. ALINHAMENTO À DIREITA das perguntas: já existia no seu arquivo; neste
   pacote o seletor foi reforçado (.corpo-texto.corpo-entrevistas
   p.ent-pergunta) para vencer com folga qualquer justificação do CSS
   base — agora garante o direita em todas as páginas.

ARQUIVOS:
- src/app/texto/[id]/ConteudoEntrevista.tsx  (substitui o seu por inteiro)
- public/imagens/entrevistas/dtv-selo.jpg    (novo — a imagem do carimbo)

IMPORTANTE:
- NÃO substitua seu css-corpo.ts (não vem no pacote; o seu permanece).
- NÃO mexa no page.tsx (a rota de entrevistas já existe no seu clone).
- Se um dia quiser o selo à esquerda: no arquivo ConteudoEntrevista.tsx,
  procure "justifyContent: \"flex-end\"" e troque por "flex-start".

COMO APLICAR:
1. Arraste os dois arquivos para os mesmos caminhos no seu clone.
2. VS Code: Commit & Sync.
3. Aguarde o deploy na Vercel (~2 min) e abra uma entrevista.

VERIFICADO ANTES DE ENVIAR:
- TypeScript sem erros; página testada no navegador (desktop e celular):
  selo visível à direita, perguntas azuis à direita, sem rolagem lateral.
