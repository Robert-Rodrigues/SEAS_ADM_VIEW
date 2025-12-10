import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://plkzhswqvzldcjhneizu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsa3poc3dxdnpsZGNqaG5laXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzY0MjMsImV4cCI6MjA2Njk1MjQyM30.Scd1TKN7kCAEq5kpRMQ5a1AmAvU9ERsaKY1pBUU24js';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbTerritorio {
  id_territorio: number;
  nome: string;
}

export interface DbReuniao {
  id_reuniao: number;
  id_territorio: number;
  data: string;
  hora: string;
  secretario_nome: string;
}

export interface DbPauta {
  id_pauta: number;
  id_reuniao: number;
  descricao: string;
}

export interface DbAcao {
  id_acao: number;
  id_pauta: number;
  problema: string;
  descricao_acao: string;
  prazo: string;
  status: string;
}

export interface DbResponsavel {
  id_responsavel: number;
  nome: string;
}
