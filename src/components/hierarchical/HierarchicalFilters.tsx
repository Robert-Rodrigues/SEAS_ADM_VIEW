import { Filter, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HierarchicalFilters as FilterType } from "@/types/hierarchical";

interface HierarchicalFiltersProps {
  filters: FilterType;
  territorios: string[];
  onFiltersChange: (filters: FilterType) => void;
  onClearFilters: () => void;
}

export const HierarchicalFilters = ({
  filters,
  territorios,
  onFiltersChange,
  onClearFilters,
}: HierarchicalFiltersProps) => {
  const hasActiveFilters = 
    filters.territorio || 
    filters.status || 
    filters.dataInicio || 
    filters.dataFim || 
    filters.search;

  return (
    <Card className="p-5 shadow-md sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-7 text-xs gap-1"
          >
            <X className="w-3 h-3" />
            Limpar
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm">Buscar</Label>
          <Input
            id="search"
            type="text"
            placeholder="Pauta, apontamento..."
            value={filters.search || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="text-sm"
          />
        </div>

        {/* Territory */}
        <div className="space-y-2">
          <Label htmlFor="territorio" className="text-sm">Território</Label>
          <Select
            value={filters.territorio || "todos"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                territorio: value === "todos" ? undefined : value,
              })
            }
          >
            <SelectTrigger id="territorio" className="text-sm">
              <SelectValue placeholder="Todos os territórios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os territórios</SelectItem>
              {territorios.map((territorio) => (
                <SelectItem key={territorio} value={territorio}>
                  {territorio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm">Status</Label>
          <Select
            value={filters.status || "todos"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                status: value === "todos" ? undefined : value,
              })
            }
          >
            <SelectTrigger id="status" className="text-sm">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Em andamento">Em andamento</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date range */}
        <div className="space-y-2">
          <Label className="text-sm">Período</Label>
          <div className="space-y-2">
            <Input
              type="date"
              value={filters.dataInicio || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, dataInicio: e.target.value })
              }
              className="text-sm"
            />
            <Input
              type="date"
              value={filters.dataFim || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, dataFim: e.target.value })
              }
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
