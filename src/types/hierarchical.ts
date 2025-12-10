export interface ApontamentoHierarchical {
  id: string;
  descricao: string;
  prazo: string;
  status: 'Pendente' | 'Em andamento' | 'Concluído';
  responsaveis: string;
  solucao: string;
}

export interface PautaHierarchical {
  id: string;
  descricao: string;
  apontamentos: ApontamentoHierarchical[];
}

export interface ReuniaoHierarchical {
  id: string;
  territorio: string;
  data: string;
  hora: string;
  facilitador: string;
  pautas: PautaHierarchical[];
}

export interface HierarchicalFilters {
  territorio?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  search?: string;
}
