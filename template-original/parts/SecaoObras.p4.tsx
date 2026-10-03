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
    else if (novaTab === "ensaios") setSubTabAtiva("ensaios");
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
  } else if (tabAtiva === "ensaios") {
    if (subTabAtiva === "ensaios") obrasAtuais = dadosEnsaios;
    else if (subTabAtiva === "cronicas") obrasAtuais = dadosCronicas;
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

        {(tabAtiva === "obras" || tabAtiva === "coletaneas" || tabAtiva === "colaboracoes" || tabAtiva === "ensaios" || tabAtiva === "resenhas") && obrasAtuais.length > 0 ? (
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
                {tabAtiva === "ensaios" && subTabAtiva !== "cronicas" && "Em breve, ensaios e crônicas em revistas e obras coletivas."}
                {tabAtiva === "resenhas" && (subTabAtiva === "leituras" || subTabAtiva === "estudos") && "Em breve, leituras e estudos críticos sobre a obra da autora."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
