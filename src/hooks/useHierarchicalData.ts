import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ReuniaoHierarchical, PautaHierarchical, ApontamentoHierarchical } from '@/types/hierarchical';

const normalizeStatus = (status: string): 'Pendente' | 'Em andamento' | 'Concluído' => {
  const normalized = status?.toLowerCase() || '';
  if (normalized.includes('conclu')) return 'Concluído';
  if (normalized.includes('andamento')) return 'Em andamento';
  return 'Pendente';
};

export const useHierarchicalData = () => {
  const [reunioes, setReunioes] = useState<ReuniaoHierarchical[]>([]);
  const [territorios, setTerritorios] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHierarchicalData();
  }, []);

  const fetchHierarchicalData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data with relationships
      const { data: reunioesData, error: reunioesError } = await supabase
        .from('reunioes')
        .select(`
          id_reuniao,
          data,
          hora,
          secretario_nome,
          territorios!inner(nome),
          pautas(
            id_pauta,
            descricao,
            acoes(
              id_acao,
              problema,
              descricao,
              prazo,
              status,
              solucao,
              responsaveis
            )
          )
        `)
        .order('data', { ascending: false });

      if (reunioesError) throw reunioesError;

      // Transform data into hierarchical structure
      const reunioesFormatted: ReuniaoHierarchical[] = (reunioesData || []).map((r: any) => {
        const pautas: PautaHierarchical[] = (r.pautas || []).map((p: any) => {
          const apontamentos: ApontamentoHierarchical[] = (p.acoes || []).map((a: any) => ({
            id: a.id_acao.toString(),
            descricao: a.problema || a.descricao || 'Sem descrição',
            prazo: a.prazo || '',
            status: normalizeStatus(a.status),
            responsaveis: a.responsaveis || 'Não atribuído',
            solucao: a.solucao || '',
          }));

          return {
            id: p.id_pauta.toString(),
            descricao: p.descricao || 'Sem descrição',
            apontamentos,
          };
        });

        return {
          id: r.id_reuniao.toString(),
          territorio: r.territorios?.nome || 'Sem território',
          data: r.data,
          hora: r.hora || '',
          facilitador: r.secretario_nome || 'Não informado',
          pautas,
        };
      });

      setReunioes(reunioesFormatted);

      // Extract unique territories
      const uniqueTerritorios = [...new Set(reunioesFormatted.map(r => r.territorio))];
      setTerritorios(uniqueTerritorios.sort());

    } catch (err) {
      console.error('Error fetching hierarchical data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  return {
    reunioes,
    territorios,
    loading,
    error,
    refetch: fetchHierarchicalData,
  };
};
