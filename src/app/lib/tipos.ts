export interface EventoNovo {
  id: string;
  titulo_evento: string;
  data: string;
  data_fim?: string;
  local: string;
  cidade: string | null;
  estado: string | null;
  pais: string;
  categoria_principal: string;
  tags: string[];
  participantes?: string[];
  texto_original: string;
}


// Molde do arquivo JSON inteiro
export interface ArquivoCategoria {
  categoria: string;
  total_registros: number;
  descricao: string;
  tags_comuns: string[];
  registros: EventoNovo[];
}