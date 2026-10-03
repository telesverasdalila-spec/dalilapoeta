#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Task 62/63 reconstruídas — wiring do SecaoObras.tsx (arrays + case + branch leituras + régua)
from pathlib import Path

P = Path("/home/z/my-project/src/app/components/SecaoObras.tsx")
src = P.read_text(encoding="utf-8")

# 0. guardas de idempotência
assert "leiturasAgrupadasPorLivro" not in src, "já aplicado"

# 1. inserir arrays antes de coletaneasBrasil
arrays = Path("/home/z/my-project/scripts/lc_arrays.ts.txt").read_text(encoding="utf-8").rstrip() + "\n\n"
ancora = "const coletaneasBrasil: Livro[] = ["
assert ancora in src
src = src.replace(ancora, arrays + ancora, 1)

# 2. case resenhas + estudos
old_case = '''  } else if (tabAtiva === "resenhas") {
    if (subTabAtiva === "fortuna") obrasAtuais = dadosFortunaCritica;
    else if (subTabAtiva === "verbetes") obrasAtuais = dadosVerbetes;'''
new_case = '''  } else if (tabAtiva === "resenhas") {
    if (subTabAtiva === "fortuna") obrasAtuais = dadosFortunaCritica;
    else if (subTabAtiva === "verbetes") obrasAtuais = dadosVerbetes;
    else if (subTabAtiva === "estudos") obrasAtuais = dadosEstudosCriticos;'''
assert old_case in src
src = src.replace(old_case, new_case, 1)

# 3. régua de décadas: leituras alimentam-se dos anos dos LIVROS
old_regua = '  const decadasFixos = calcularDecadas(obrasAtuais.map(l => extrairAnoBase(l.ano)), "crescente");'
new_regua = '''  const decadasFixos = tabAtiva === "resenhas" && subTabAtiva === "leituras"
    ? calcularDecadas(anosLivrosLeituras, "crescente")
    : calcularDecadas(obrasAtuais.map(l => extrairAnoBase(l.ano)), "crescente");'''
assert old_regua in src
src = src.replace(old_regua, new_regua, 1)

# 4. branch própria para a subtab leituras (agrupamento por livro) + fluxo normal nos demais
old_render = '''        {(tabAtiva === "obras" || tabAtiva === "coletaneas" || tabAtiva === "colaboracoes" || tabAtiva === "escritos" || tabAtiva === "resenhas") && obrasAtuais.length > 0 ? ('''
new_render = '''        {tabAtiva === "resenhas" && subTabAtiva === "leituras" ? (
          <div className="estrada estrada-obra">
            {leiturasAgrupadasPorLivro.map((grupo, gIndex) => {
              const decadaJaMarcada = leiturasAgrupadasPorLivro.slice(0, gIndex).some(g2 => g2.decada === grupo.decada);
              return (
              <div key={grupo.livro}>
                <div
                  id={decadaJaMarcada ? undefined : `c-${grupo.decada}`}
                  className="separador-genero"
                  style={{ marginTop: gIndex === 0 ? "0" : "30px" }}
                >
                  {grupo.ano} - {grupo.livro}
                </div>
                {grupo.leituras.map((l) => (
                  <div className="trecho" key={l.slug}>
                    <p>
                      - por {l.autor} -{" "}
                      <Link
                        href={`/texto/${l.slug}`}
                        style={{ display: "inline-block", fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", fontWeight: "500", color: "#7a3b5a", textDecoration: "none", borderBottom: "1px solid transparent", transition: "all 0.3s ease", paddingBottom: "1px" }}
                        onMouseOver={(e) => e.currentTarget.style.borderBottomColor = "#7a3b5a"}
                        onMouseOut={(e) => e.currentTarget.style.borderBottomColor = "transparent"}
                      >
                        Leia
                      </Link>
                    </p>
                  </div>
                ))}
              </div>
              );
            })}
          </div>
        ) : (tabAtiva === "obras" || tabAtiva === "coletaneas" || tabAtiva === "colaboracoes" || tabAtiva === "escritos" || tabAtiva === "resenhas") && obrasAtuais.length > 0 ? ('''
assert old_render in src
src = src.replace(old_render, new_render, 1)

# 5. "Leia o texto →" estendido para estudos
old_link = '''                    {tabAtiva === "escritos" && obra.slug && ('''
new_link = '''                    {(tabAtiva === "escritos" || (tabAtiva === "resenhas" && subTabAtiva === "estudos")) && obra.slug && ('''
assert old_link in src
src = src.replace(old_link, new_link, 1)

P.write_text(src, encoding="utf-8")
print("SecaoObras.tsx atualizado:", len(src), "chars")
