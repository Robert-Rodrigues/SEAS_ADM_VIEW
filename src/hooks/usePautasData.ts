import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Pauta {
  id: string;
  descricao: string;
  territorio: string;
  dataReuniao: string;
  totalAcoes: number;
  acoesPendentes: number;
  acoesEmAndamento: number;
  acoesConcluidas: number;
}

export const usePautasData = () => {
  const [pautas, setPautas] = useState<Pauta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPautas();
  }, []);

  const fetchPautas = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: pautasData, error: pautasError } = await supabase
        .from('pautas')
        .select(`
          id_pauta,
          descricao,
          reunioes!inner(
            data,
            territorios!inner(nome)
          ),
          acoes(
            id_acao,
            status
          )
        `)
        .order('id_pauta', { ascending: false });

      if (pautasError) throw pautasError;

      const pautasFormatted: Pauta[] = (pautasData || []).map((p: any) => {
        const acoes = p.acoes || [];
        const acoesPendentes = acoes.filter((a: any) => 
          a.status?.toLowerCase().includes('pendente')
        ).length;
        const acoesEmAndamento = acoes.filter((a: any) => 
          a.status?.toLowerCase().includes('andamento')
        ).length;
        const acoesConcluidas = acoes.filter((a: any) => 
          a.status?.toLowerCase().includes('conclu')
        ).length;

        return {
          id: p.id_pauta.toString(),
          descricao: p.descricao || 'Sem descrição',
          territorio: p.reunioes?.territorios?.nome || 'Sem território',
          dataReuniao: p.reunioes?.data || '',
          totalAcoes: acoes.length,
          acoesPendentes,
          acoesEmAndamento,
          acoesConcluidas,
        };
      });

      setPautas(pautasFormatted);
    } catch (err) {
      console.error('Error fetching pautas:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar pautas');
    } finally {
      setLoading(false);
    }
  };

  return {
    pautas,
    loading,
    error,
    refetch: fetchPautas,
  };
};
