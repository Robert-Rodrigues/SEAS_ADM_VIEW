export interface Territorio {
  id: string;
  nome: string;
}

export interface Responsavel {
  id: string;
  nome: string;
}

export interface Apontamento {
  id: string;
  dataReuniao: string;
  pauta: string;
  problema: string;
  descricao: string;
  solucao: string;
  responsaveis: string;
  territorio: string;
  prazo: string;
  status: 'Pendente' | 'Em andamento' | 'Concluído';
}

export interface DashboardFilters {
  territorios: string[];
  dataInicio?: string;
  dataFim?: string;
  status: string[];
  responsavel?: string;
  pauta?: string;
}

export interface MetricasTerritoriais {
  territorio: string;
  total: number;
  pendentes: number;
  emAndamento: number;
  concluidos: number;
  percentualConclusao: number;
}
