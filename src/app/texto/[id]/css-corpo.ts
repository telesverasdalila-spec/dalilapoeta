// CSS compartilhado do corpo dos textos (Ensaios, Crônicas, Traduções).
// Refinamento (pedido da usuária): títulos internos em MAIÚSCULAS, peso
// fino e na cor dourada da paleta (#8b6914 — dourado de texto, com linha
// em #D4AF37), usando Cormorant Garamond (serifada fina do site).
// Escopado em .corpo-texto para não vazar para outras páginas.

export const cssCorpoTexto = `
  .corpo-texto { font-family: Georgia, 'Times New Roman', serif; font-size: 1.1rem; line-height: 1.9; color: #333; }
  .corpo-texto h2, .corpo-texto h3 {
    font-family: var(--font-cormorant), Georgia, 'Times New Roman', serif;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #8b6914;
    border-bottom: 1px solid #d4af37;
  }
  .corpo-texto h2 {
    font-size: 1.5rem;
    margin: 40px 0 15px 0;
    padding-bottom: 8px;
  }
  .corpo-texto h3 {
    font-size: 1.25rem;
    margin: 30px 0 10px 0;
    padding-bottom: 6px;
  }
  .corpo-texto p { margin-bottom: 20px; text-align: justify; }
  /* Entrevistas: perguntas em rosa-grená de contraste com as respostas
     (pedido da usuária), mantendo o corpo das respostas em #333 */
  .corpo-texto p.pergunta, .corpo-texto span.pergunta { color: #7a3b5a; }
  .corpo-texto blockquote {
    margin: 25px 0; padding: 20px 25px;
    background-color: #faf8f2;
    border-left: 1px solid #d4af37;
    font-style: italic;
    font-size: 1.05rem;
    color: #444;
  }
  .corpo-texto blockquote p { margin-bottom: 10px; }
  .corpo-texto em, .corpo-texto i { font-style: italic; }
  .corpo-texto a { color: #7a3b5a; text-decoration: none; }
  .corpo-texto ul, .corpo-texto ol { margin: 20px 0; padding-left: 30px; }
  .corpo-texto li { margin-bottom: 10px; }

  /* Título de entrada de diário (crônicas com tabs por data) */
  .corpo-texto p.titulo-entrada {
    font-family: var(--font-cormorant), Georgia, 'Times New Roman', serif;
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #8b6914;
    text-align: left;
    margin: 0 0 22px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #d4af37;
  }

  /* Traduções: títulos de poemas bilíngues — mesmo tratamento dourado
     fino dos títulos internos (pedido da usuária), mas centrado e sem
     linha, preservando a estética dos poemas */
  .corpo-texto p.titulo-poema {
    font-family: var(--font-cormorant), Georgia, 'Times New Roman', serif;
    font-weight: 500;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #8b6914;
    font-size: 1.35rem;
    line-height: 1.4;
    margin: 38px 0 8px 0;
    border-bottom: none;
    padding-bottom: 0;
  }
  .corpo-texto p.verso {
    text-align: center;
    margin-bottom: 2px;
    color: #333;
  }
  .corpo-texto p.dedicatoria {
    text-align: center;
    font-style: italic;
    margin-bottom: 26px;
  }

  /* Poemas em dourado SOMENTE nos ensaios (pedido da usuária): os versos
     de traduções e crônicas permanecem na cor padrão do corpo de texto */
  .corpo-texto.corpo-ensaios p.verso {
    color: #8b6914;
  }
  .corpo-texto.corpo-ensaios p.dedicatoria {
    color: #8b6914;
  }
  .corpo-texto p.nota-fonte {
    text-align: center;
    font-size: 0.85rem;
    color: #999;
    font-family: 'Inter', sans-serif;
    margin-top: 30px;
  }

  /* Bibliografia em subtab (ensaios): entradas alinhadas à esquerda,
     sem a justificação do corpo de prosa */
  .corpo-texto.corpo-bibliografia p {
    text-align: left;
  }
`;
