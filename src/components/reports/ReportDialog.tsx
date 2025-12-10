import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FileText, Printer, Eye, X, Download, Zap, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReportDialogProps {
  type: "reunioes" | "pautas" | "apontamentos";
  data: any[];
  territorios?: string[];
}

export const ReportDialog = ({ type, data, territorios = [] }: ReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    territorio: "all",
    dataInicio: "",
    dataFim: "",
    status: "all",
    includeHeader: true,
    includeSummary: true,
    includeFooter: true,
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: type === "reunioes" ? "data" : type === "pautas" ? "dataReuniao" : "prazo",
    direction: "desc",
  });

  // Field selection for each report type
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    getDefaultFields(type)
  );

  // Get available fields based on report type
  function getDefaultFields(reportType: string): Record<string, boolean> {
    if (reportType === "reunioes") {
      return {
        data: true,
        hora: true,
        territorio: true,
        secretario: true,
        totalPautas: true,
        totalAcoes: true,
      };
    } else if (reportType === "pautas") {
      return {
        descricao: true,
        territorio: true,
        dataReuniao: true,
        totalAcoes: true,
        acoesPendentes: true,
        acoesEmAndamento: true,
        acoesConcluidas: true,
      };
    } else {
      return {
        pauta: true,
        problema: true,
        descricao: true,
        territorio: true,
        responsaveis: true,
        prazo: true,
        status: true,
        solucao: false,
      };
    }
  }

  const fieldLabels: Record<string, string> = {
    data: "Data",
    hora: "Hora",
    territorio: "Território",
    secretario: "Secretário",
    totalPautas: "Total de Pautas",
    totalAcoes: "Total de Apontamentos",
    descricao: "Descrição",
    dataReuniao: "Data da Reunião",
    acoesPendentes: "Pendentes",
    acoesEmAndamento: "Em Andamento",
    acoesConcluidas: "Concluídos",
    pauta: "Pauta",
    problema: "Problema",
    responsaveis: "Responsáveis",
    prazo: "Prazo",
    status: "Status",
    solucao: "Solução",
  };

  const toggleField = (field: string) => {
    setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Get sorting options based on type
  const getSortOptions = () => {
    if (type === "reunioes") {
      return [
        { value: "data", label: "Data" },
        { value: "territorio", label: "Território" },
        { value: "secretario", label: "Secretário" },
        { value: "totalPautas", label: "Total de Pautas" },
        { value: "totalAcoes", label: "Total de Apontamentos" },
      ];
    } else if (type === "pautas") {
      return [
        { value: "dataReuniao", label: "Data da Reunião" },
        { value: "descricao", label: "Descrição" },
        { value: "territorio", label: "Território" },
        { value: "totalAcoes", label: "Total de Apontamentos" },
        { value: "acoesPendentes", label: "Pendentes" },
      ];
    } else {
      return [
        { value: "prazo", label: "Prazo" },
        { value: "pauta", label: "Pauta" },
        { value: "territorio", label: "Território" },
        { value: "status", label: "Status" },
        { value: "responsaveis", label: "Responsáveis" },
      ];
    }
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    if (filters.territorio && filters.territorio !== "all") {
      result = result.filter((item) => item.territorio === filters.territorio);
    }

    if (filters.dataInicio) {
      result = result.filter((item) => {
        const itemDate = new Date(item.data || item.dataReuniao);
        return itemDate >= new Date(filters.dataInicio);
      });
    }

    if (filters.dataFim) {
      result = result.filter((item) => {
        const itemDate = new Date(item.data || item.dataReuniao);
        return itemDate <= new Date(filters.dataFim);
      });
    }

    if (filters.status && filters.status !== "all" && type === "apontamentos") {
      result = result.filter((item) => item.status === filters.status);
    }

    // Apply sorting
    result.sort((a, b) => {
      const field = sortConfig.field;
      let aVal = a[field];
      let bVal = b[field];

      // Handle date fields
      if (field === "data" || field === "dataReuniao" || field === "prazo") {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }

      // Handle numeric fields
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Handle string fields
      const aStr = String(aVal || "").toLowerCase();
      const bStr = String(bVal || "").toLowerCase();
      
      if (sortConfig.direction === "asc") {
        return aStr.localeCompare(bStr, "pt-BR");
      }
      return bStr.localeCompare(aStr, "pt-BR");
    });

    return result;
  }, [data, filters, type, sortConfig]);

  const handlePreview = () => {
    if (filteredData.length === 0) {
      toast({
        title: "Nenhum dado para exibir",
        description: "Ajuste os filtros para incluir dados no relatório.",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  const handlePrint = () => {
    if (filteredData.length === 0) {
      toast({
        title: "Nenhum dado para imprimir",
        description: "Ajuste os filtros para incluir dados no relatório.",
        variant: "destructive",
      });
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast({
        title: "Erro ao abrir janela de impressão",
        description: "Verifique se o bloqueador de pop-ups está desabilitado.",
        variant: "destructive",
      });
      return;
    }

    const htmlContent = generateHTMLReport(filteredData);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 250);

    toast({
      title: "Relatório gerado com sucesso",
      description: `${filteredData.length} registro(s) incluído(s) no relatório.`,
    });

    setOpen(false);
    setShowPreview(false);
  };

  const handleQuickPrint = () => {
    if (data.length === 0) {
      toast({
        title: "Nenhum dado disponível",
        description: "Não há dados para gerar o relatório.",
        variant: "destructive",
      });
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast({
        title: "Erro ao abrir janela de impressão",
        description: "Verifique se o bloqueador de pop-ups está desabilitado.",
        variant: "destructive",
      });
      return;
    }

    const htmlContent = generateHTMLReport(data);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 250);

    toast({
      title: "Relatório rápido gerado",
      description: `${data.length} registro(s) incluído(s) no relatório completo.`,
    });
  };

  const handleDownload = () => {
    if (filteredData.length === 0) {
      toast({
        title: "Nenhum dado para baixar",
        description: "Ajuste os filtros para incluir dados no relatório.",
        variant: "destructive",
      });
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast({
        title: "Erro ao abrir janela",
        description: "Verifique se o bloqueador de pop-ups está desabilitado.",
        variant: "destructive",
      });
      return;
    }

    const htmlContent = generateHTMLReport(filteredData);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    toast({
      title: "Pronto para salvar",
      description: "Use Ctrl+P ou Cmd+P e escolha 'Salvar como PDF'.",
    });

    setOpen(false);
    setShowPreview(false);
  };

  const generateHTMLReport = (reportData: any[]) => {
    const title =
      type === "reunioes"
        ? "Relatório de Reuniões"
        : type === "pautas"
        ? "Relatório de Pautas"
        : "Relatório de Apontamentos";

    const now = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

    // Generate table headers based on selected fields
    let tableHeaders = "<tr>";
    let tableRows = "";

    if (type === "reunioes") {
      tableHeaders += "<th>#</th>";
      if (selectedFields.data) tableHeaders += "<th>Data</th>";
      if (selectedFields.hora) tableHeaders += "<th>Hora</th>";
      if (selectedFields.territorio) tableHeaders += "<th>Território</th>";
      if (selectedFields.secretario) tableHeaders += "<th>Secretário</th>";
      if (selectedFields.totalPautas) tableHeaders += "<th style='text-align: center;'>Pautas</th>";
      if (selectedFields.totalAcoes) tableHeaders += "<th style='text-align: center;'>Apontamentos</th>";
      tableHeaders += "</tr>";

      tableRows = reportData
        .map((item, index) => {
          let row = `<tr><td class="row-number">#${index + 1}</td>`;
          if (selectedFields.data) row += `<td>${format(new Date(item.data), "dd/MM/yyyy", { locale: ptBR })}</td>`;
          if (selectedFields.hora) row += `<td>${item.hora || "Não informado"}</td>`;
          if (selectedFields.territorio) row += `<td>${item.territorio}</td>`;
          if (selectedFields.secretario) row += `<td>${item.secretario}</td>`;
          if (selectedFields.totalPautas) row += `<td style="text-align: center; font-weight: 600;">${item.totalPautas}</td>`;
          if (selectedFields.totalAcoes) row += `<td style="text-align: center; font-weight: 600;">${item.totalAcoes}</td>`;
          row += "</tr>";
          return row;
        })
        .join("");
    } else if (type === "pautas") {
      tableHeaders += "<th>#</th>";
      if (selectedFields.descricao) tableHeaders += "<th>Descrição da Pauta</th>";
      if (selectedFields.territorio) tableHeaders += "<th>Território</th>";
      if (selectedFields.dataReuniao) tableHeaders += "<th>Data Reunião</th>";
      if (selectedFields.totalAcoes) tableHeaders += "<th style='text-align: center;'>Total</th>";
      if (selectedFields.acoesPendentes) tableHeaders += "<th style='text-align: center;'>Pendentes</th>";
      if (selectedFields.acoesEmAndamento) tableHeaders += "<th style='text-align: center;'>Em Andamento</th>";
      if (selectedFields.acoesConcluidas) tableHeaders += "<th style='text-align: center;'>Concluídos</th>";
      tableHeaders += "</tr>";

      tableRows = reportData
        .map((item, index) => {
          let row = `<tr><td class="row-number">#${index + 1}</td>`;
          if (selectedFields.descricao) row += `<td style="font-weight: 500;">${item.descricao}</td>`;
          if (selectedFields.territorio) row += `<td>${item.territorio}</td>`;
          if (selectedFields.dataReuniao) row += `<td>${format(new Date(item.dataReuniao), "dd/MM/yyyy", { locale: ptBR })}</td>`;
          if (selectedFields.totalAcoes) row += `<td style="text-align: center; font-weight: 600;">${item.totalAcoes}</td>`;
          if (selectedFields.acoesPendentes) row += `<td style="text-align: center; color: #dc2626;">${item.acoesPendentes}</td>`;
          if (selectedFields.acoesEmAndamento) row += `<td style="text-align: center; color: #f59e0b;">${item.acoesEmAndamento}</td>`;
          if (selectedFields.acoesConcluidas) row += `<td style="text-align: center; color: #16a34a;">${item.acoesConcluidas}</td>`;
          row += "</tr>";
          return row;
        })
        .join("");
    } else {
      tableHeaders += "<th>#</th>";
      if (selectedFields.pauta) tableHeaders += "<th>Pauta</th>";
      if (selectedFields.problema) tableHeaders += "<th>Problema</th>";
      if (selectedFields.descricao) tableHeaders += "<th>Descrição</th>";
      if (selectedFields.territorio) tableHeaders += "<th>Território</th>";
      if (selectedFields.responsaveis) tableHeaders += "<th>Responsáveis</th>";
      if (selectedFields.prazo) tableHeaders += "<th>Prazo</th>";
      if (selectedFields.status) tableHeaders += "<th>Status</th>";
      if (selectedFields.solucao) tableHeaders += "<th>Solução</th>";
      tableHeaders += "</tr>";

      tableRows = reportData
        .map((item, index) => {
          let row = `<tr><td class="row-number">#${index + 1}</td>`;
          if (selectedFields.pauta) row += `<td style="font-weight: 500;">${item.pauta}</td>`;
          if (selectedFields.problema) row += `<td>${item.problema}</td>`;
          if (selectedFields.descricao) row += `<td style="max-width: 250px;">${item.descricao || "N/A"}</td>`;
          if (selectedFields.territorio) row += `<td>${item.territorio}</td>`;
          if (selectedFields.responsaveis) row += `<td>${item.responsaveis}</td>`;
          if (selectedFields.prazo) row += `<td style="white-space: nowrap;">${item.prazo ? format(new Date(item.prazo), "dd/MM/yyyy", { locale: ptBR }) : "Sem prazo"}</td>`;
          if (selectedFields.status) row += `<td><span class="status status-${item.status.toLowerCase().replace(" ", "-")}">${item.status}</span></td>`;
          if (selectedFields.solucao) row += `<td style="max-width: 250px;">${item.solucao || "Sem solução"}</td>`;
          row += "</tr>";
          return row;
        })
        .join("");
    }

    const summary =
      type === "reunioes"
        ? `
        <div class="summary">
          <h3>Resumo Executivo</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <strong>Total de Reuniões</strong>
              <span class="value">${reportData.length}</span>
            </div>
            <div class="summary-item">
              <strong>Total de Pautas</strong>
              <span class="value">${reportData.reduce((acc, r) => acc + r.totalPautas, 0)}</span>
            </div>
            <div class="summary-item">
              <strong>Total de Apontamentos</strong>
              <span class="value">${reportData.reduce((acc, r) => acc + r.totalAcoes, 0)}</span>
            </div>
            <div class="summary-item">
              <strong>Territórios Ativos</strong>
              <span class="value">${new Set(reportData.map(r => r.territorio)).size}</span>
            </div>
          </div>
        </div>
      `
        : type === "pautas"
        ? (() => {
            const totalApontamentos = reportData.reduce((acc, p) => acc + p.totalAcoes, 0);
            const totalPendentes = reportData.reduce((acc, p) => acc + p.acoesPendentes, 0);
            const totalEmAndamento = reportData.reduce((acc, p) => acc + p.acoesEmAndamento, 0);
            const totalConcluidos = reportData.reduce((acc, p) => acc + p.acoesConcluidas, 0);
            const taxaPendentes = totalApontamentos > 0 ? Math.round((totalPendentes / totalApontamentos) * 100) : 0;
            const taxaEmAndamento = totalApontamentos > 0 ? Math.round((totalEmAndamento / totalApontamentos) * 100) : 0;
            const taxaConcluidos = totalApontamentos > 0 ? Math.round((totalConcluidos / totalApontamentos) * 100) : 0;
            
            return `
        <div class="summary">
          <h3>Resumo Executivo</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <strong>Total de Pautas</strong>
              <span class="value">${reportData.length}</span>
            </div>
            <div class="summary-item">
              <strong>Total de Apontamentos</strong>
              <span class="value">${totalApontamentos}</span>
            </div>
            <div class="summary-item summary-item-status">
              <strong>Pendentes</strong>
              <span class="value" style="color: #dc2626;">${totalPendentes}</span>
              <span class="percentage" style="background: #fecaca; color: #7f1d1d;">${taxaPendentes}%</span>
            </div>
            <div class="summary-item summary-item-status">
              <strong>Em Andamento</strong>
              <span class="value" style="color: #d97706;">${totalEmAndamento}</span>
              <span class="percentage" style="background: #fde68a; color: #78350f;">${taxaEmAndamento}%</span>
            </div>
            <div class="summary-item summary-item-status">
              <strong>Concluídos</strong>
              <span class="value" style="color: #16a34a;">${totalConcluidos}</span>
              <span class="percentage" style="background: #bbf7d0; color: #14532d;">${taxaConcluidos}%</span>
            </div>
          </div>
        </div>
      `;
          })()
        : `
        <div class="summary">
          <h3>Resumo Executivo</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <strong>Total de Apontamentos</strong>
              <span class="value">${reportData.length}</span>
            </div>
            <div class="summary-item">
              <strong>Pendentes</strong>
              <span class="value" style="color: #dc2626;">${reportData.filter((a) => a.status === "Pendente").length}</span>
            </div>
            <div class="summary-item">
              <strong>Em Andamento</strong>
              <span class="value" style="color: #f59e0b;">${reportData.filter((a) => a.status === "Em andamento").length}</span>
            </div>
            <div class="summary-item">
              <strong>Concluídos</strong>
              <span class="value" style="color: #16a34a;">${reportData.filter((a) => a.status === "Concluído").length}</span>
            </div>
            <div class="summary-item">
              <strong>Taxa de Conclusão</strong>
              <span class="value" style="color: #16a34a;">${reportData.length > 0 ? Math.round((reportData.filter(a => a.status === "Concluído").length / reportData.length) * 100) : 0}%</span>
            </div>
          </div>
        </div>
      `;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page {
            margin: 2cm;
            size: A4;
            @bottom-right {
              content: "Página " counter(page) " de " counter(pages);
            }
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #0f172a;
            background: #ffffff;
            padding: 0;
            counter-reset: page;
          }
          
          .page-number {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 11px;
            color: #64748b;
            font-weight: 500;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 32px 24px;
            border-bottom: 4px solid #3b82f6;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 12px;
            page-break-after: avoid;
          }
          
          h1 {
            font-size: 32px;
            color: #1e293b;
            margin-bottom: 12px;
            font-weight: 800;
            letter-spacing: -0.8px;
          }
          
          .subtitle {
            font-size: 15px;
            color: #64748b;
            margin-top: 10px;
            font-weight: 500;
          }
          
          .filter-info {
            font-size: 13px;
            color: #475569;
            background: white;
            display: inline-block;
            padding: 8px 16px;
            border-radius: 8px;
            margin: 6px;
            border: 1px solid #e2e8f0;
          }
          
          .summary {
            margin-bottom: 40px;
            page-break-inside: avoid;
            page-break-after: avoid;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            padding: 24px;
            border-radius: 12px;
            border: 2px solid #e2e8f0;
          }
          
          .summary h3 {
            color: #1e40af;
            margin-bottom: 24px;
            font-size: 22px;
            font-weight: 700;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
          }
          
          .summary-item {
            background: white;
            padding: 24px;
            border-radius: 10px;
            text-align: center;
            border: 2px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          }
          
          .summary-item strong {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            display: block;
            margin-bottom: 12px;
            font-weight: 700;
          }
          
          .summary-item .value {
            font-size: 40px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -2px;
            display: block;
            line-height: 1;
          }
          
          .summary-item .percentage {
            display: inline-block;
            margin-top: 10px;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.3px;
          }
          
          .summary-item-status {
            position: relative;
          }
          
          .table-section {
            margin-bottom: 40px;
          }
          
          .table-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 16px;
            padding: 12px 16px;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border-left: 4px solid #3b82f6;
            border-radius: 6px;
          }
          
          .table-wrapper {
            overflow-x: auto;
            margin-bottom: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            page-break-inside: auto;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            font-size: 13px;
          }
          
          thead {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          }
          
          th {
            padding: 16px 14px;
            text-align: left;
            font-weight: 700;
            font-size: 11px;
            color: white;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: none;
            white-space: nowrap;
          }
          
          td {
            padding: 14px 14px;
            text-align: left;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
            vertical-align: top;
            word-wrap: break-word;
            max-width: 300px;
          }
          
          tbody tr {
            transition: background-color 0.2s;
            page-break-inside: avoid;
          }
          
          tbody tr:nth-child(odd) {
            background: #ffffff;
          }
          
          tbody tr:nth-child(even) {
            background: #f8fafc;
          }
          
          tbody tr:hover {
            background: #eff6ff;
          }
          
          tbody tr:last-child td {
            border-bottom: none;
          }
          
          .status {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 24px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            white-space: nowrap;
          }
          
          .status-pendente {
            background: #fecaca;
            color: #7f1d1d;
            border: 2px solid #f87171;
          }
          
          .status-em-andamento {
            background: #fde68a;
            color: #78350f;
            border: 2px solid #fbbf24;
          }
          
          .status-concluído {
            background: #bbf7d0;
            color: #14532d;
            border: 2px solid #4ade80;
          }
          
          .row-number {
            font-weight: 700;
            color: #3b82f6;
            font-size: 12px;
            min-width: 40px;
          }
          
          .footer {
            margin-top: 60px;
            padding-top: 24px;
            border-top: 3px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
            font-weight: 500;
            page-break-inside: avoid;
          }
          
          .footer strong {
            color: #1e40af;
            font-size: 16px;
            display: block;
            margin-bottom: 10px;
            font-weight: 700;
          }
          
          /* Melhorias específicas para impressão */
          @media print {
            @page {
              margin: 1.5cm;
            }
            
            body { 
              padding: 0;
              font-size: 11pt;
            }
            
            .header {
              background: #eff6ff !important;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              page-break-after: avoid;
              margin-bottom: 30px;
            }
            
            h1 {
              font-size: 28px;
            }
            
            .summary { 
              page-break-inside: avoid;
              page-break-after: avoid;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              background: #f8fafc !important;
              margin-bottom: 30px;
            }
            
            .summary-item {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              background: white !important;
              page-break-inside: avoid;
            }
            
            .summary-item .value {
              font-size: 32px;
            }
            
            .table-section {
              page-break-before: auto;
            }
            
            .table-title {
              page-break-after: avoid;
              background: #f8fafc !important;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            
            .table-wrapper {
              box-shadow: none;
              page-break-inside: auto;
            }
            
            table { 
              page-break-inside: auto;
              font-size: 10pt;
            }
            
            thead {
              display: table-header-group;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
            }
            
            th {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              background: none;
              padding: 12px 10px;
              font-size: 10px;
            }
            
            tbody tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            
            tbody tr:nth-child(even) {
              background: #f8fafc !important;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            
            tbody tr:hover {
              background-color: transparent;
            }
            
            td {
              padding: 10px 10px;
              font-size: 10pt;
            }
            
            .status {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              padding: 4px 10px;
              font-size: 9px;
            }
            
            .status-pendente {
              background: #fecaca !important;
              border-color: #f87171 !important;
            }
            
            .status-em-andamento {
              background: #fde68a !important;
              border-color: #fbbf24 !important;
            }
            
            .status-concluído {
              background: #bbf7d0 !important;
              border-color: #4ade80 !important;
            }
            
            .footer {
              page-break-inside: avoid;
              margin-top: 40px;
            }
            
            .page-number {
              display: block;
            }
          }
          
          @media screen {
            .page-number {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        ${filters.includeHeader ? `
        <div class="header">
          <h1>${title}</h1>
          <p class="subtitle">📊 Gerado em ${now}</p>
          ${filters.territorio && filters.territorio !== "all" ? `<p class="filter-info">📍 Território: <strong>${filters.territorio}</strong></p>` : ""}
          ${filters.dataInicio || filters.dataFim ? `<p class="filter-info">📅 Período: ${filters.dataInicio ? format(new Date(filters.dataInicio), "dd/MM/yyyy", { locale: ptBR }) : "Início"} até ${filters.dataFim ? format(new Date(filters.dataFim), "dd/MM/yyyy", { locale: ptBR }) : "Atual"}</p>` : ""}
        </div>
        ` : ""}
        
        ${filters.includeSummary ? summary : ""}
        
        <div class="table-section">
          <div class="table-title">
            📋 ${type === "reunioes" ? "Detalhamento das Reuniões" : type === "pautas" ? "Detalhamento das Pautas" : "Detalhamento dos Apontamentos"} (${reportData.length} registros)
          </div>
          <div class="table-wrapper">
            <table>
              <thead>
              ${tableHeaders}
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
            </table>
          </div>
        </div>
        
        ${filters.includeFooter ? `
        <div class="footer">
          <strong>Sistema de Gestão de Reuniões e Apontamentos</strong>
          <p>📄 Relatório gerado automaticamente em ${now}</p>
          <p style="margin-top: 8px; color: #94a3b8;">Total de ${reportData.length} registro(s) • Documento confidencial</p>
        </div>
        ` : ""}
        
        <div class="page-number">Página 1</div>
      </body>
      </html>
    `;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" />
            Relatório
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleQuickPrint}>
            <Zap className="w-4 h-4 mr-2" />
            Impressão Rápida
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Relatório Personalizado
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Configurar Relatório
          </DialogTitle>
          <DialogDescription className="text-sm">
            Escolha os dados que deseja incluir no relatório de{" "}
            {type === "reunioes" ? "reuniões" : type === "pautas" ? "pautas" : "apontamentos"}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-5 p-6">
          {/* Territory filter */}
          {territorios.length > 0 && (
            <div className="space-y-2">
              <Label>Território</Label>
              <Select value={filters.territorio} onValueChange={(value) => setFilters({ ...filters, territorio: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os territórios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os territórios</SelectItem>
                  {territorios.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input
                type="date"
                value={filters.dataInicio}
                onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={filters.dataFim}
                onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
              />
            </div>
          </div>

          {/* Status filter for apontamentos */}
          {type === "apontamentos" && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* Sorting Options */}
          <div className="space-y-3">
            <Label className="text-base flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Ordenação
            </Label>
            <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Ordenar por</Label>
                <Select 
                  value={sortConfig.field} 
                  onValueChange={(value) => setSortConfig(prev => ({ ...prev, field: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getSortOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={sortConfig.direction === "asc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortConfig(prev => ({ ...prev, direction: "asc" }))}
                  className="flex-1 gap-2"
                >
                  <ArrowUp className="w-4 h-4" />
                  Crescente
                </Button>
                <Button
                  type="button"
                  variant={sortConfig.direction === "desc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortConfig(prev => ({ ...prev, direction: "desc" }))}
                  className="flex-1 gap-2"
                >
                  <ArrowDown className="w-4 h-4" />
                  Decrescente
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Field Selection */}
          <div className="space-y-3">
            <Label className="text-base">Campos a incluir</Label>
            <div className="grid grid-cols-2 gap-3 p-3 border rounded-lg bg-muted/30">
              {Object.keys(selectedFields).map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={selectedFields[field]}
                    onCheckedChange={() => toggleField(field)}
                  />
                  <label htmlFor={field} className="text-sm leading-none cursor-pointer">
                    {fieldLabels[field]}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Layout Options */}
          <div className="space-y-3">
            <Label className="text-base">Opções de layout</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="header"
                  checked={filters.includeHeader}
                  onCheckedChange={(checked) => setFilters({ ...filters, includeHeader: checked as boolean })}
                />
                <label htmlFor="header" className="text-sm leading-none cursor-pointer">
                  Incluir cabeçalho com título e data
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="summary"
                  checked={filters.includeSummary}
                  onCheckedChange={(checked) => setFilters({ ...filters, includeSummary: checked as boolean })}
                />
                <label htmlFor="summary" className="text-sm leading-none cursor-pointer">
                  Incluir resumo executivo
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="footer"
                  checked={filters.includeFooter}
                  onCheckedChange={(checked) => setFilters({ ...filters, includeFooter: checked as boolean })}
                />
                <label htmlFor="footer" className="text-sm leading-none cursor-pointer">
                  Incluir rodapé
                </label>
              </div>
            </div>
          </div>

          {/* Data count */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Registros no relatório</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Após aplicar os filtros selecionados
                </p>
              </div>
              <Badge variant="default" className="text-lg px-3 py-1">
                {filteredData.length}
              </Badge>
            </div>
          </div>
        </div>
        </ScrollArea>

        {showPreview ? (
          <div className="space-y-6 p-6 border-t bg-muted/20">
            <div className="border rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 shadow-sm overflow-hidden">
              {/* Preview Header */}
              <div className="bg-primary/10 border-b border-primary/20 px-6 py-4">
                <h4 className="font-semibold text-lg flex items-center gap-2 text-primary">
                  <Eye className="w-5 h-5" />
                  Prévia do Relatório
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Confirme as configurações antes de imprimir
                </p>
              </div>
              
              {/* Preview Content */}
              <div className="p-6 space-y-4">
                {/* Type Badge */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">Tipo:</span>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {type === "reunioes" ? "Reuniões" : type === "pautas" ? "Pautas" : "Apontamentos"}
                  </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-background/80 rounded-lg p-4 border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Registros</p>
                    <p className="text-2xl font-bold text-primary mt-1">{filteredData.length}</p>
                  </div>
                  <div className="bg-background/80 rounded-lg p-4 border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Ordenação</p>
                    <p className="text-sm font-medium mt-1 flex items-center gap-1">
                      {getSortOptions().find(o => o.value === sortConfig.field)?.label}
                      {sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    </p>
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Campos selecionados</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(selectedFields)
                      .filter(([_, selected]) => selected)
                      .map(([field, _]) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {fieldLabels[field]}
                        </Badge>
                      ))}
                  </div>
                </div>

                {/* Filters Applied */}
                {(filters.territorio !== "all" || filters.dataInicio || filters.dataFim) && (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide pt-2">Filtros aplicados</p>
                    <div className="flex flex-wrap gap-2">
                      {filters.territorio && filters.territorio !== "all" && (
                        <Badge variant="secondary" className="text-xs">
                          📍 {filters.territorio}
                        </Badge>
                      )}
                      {(filters.dataInicio || filters.dataFim) && (
                        <Badge variant="secondary" className="text-xs">
                          📅 {filters.dataInicio ? format(new Date(filters.dataInicio), "dd/MM/yyyy", { locale: ptBR }) : "Início"}
                          {" → "}
                          {filters.dataFim ? format(new Date(filters.dataFim), "dd/MM/yyyy", { locale: ptBR }) : "Atual"}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowPreview(false)} className="gap-2">
                <X className="w-4 h-4" />
                Voltar
              </Button>
              <Button variant="secondary" onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Salvar PDF
              </Button>
              <Button onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" />
                Imprimir
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 justify-end px-6 pb-6 pt-4 border-t bg-muted/30">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="secondary" onClick={handlePreview} className="gap-2">
              <Eye className="w-4 h-4" />
              Visualizar
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};
