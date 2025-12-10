import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Territorio } from "@/types/dashboard";

interface TerritoryFilterProps {
  territorios: Territorio[];
  selectedTerritorios: string[];
  onTerritoriosChange: (territorios: string[]) => void;
}

export const TerritoryFilter = ({
  territorios,
  selectedTerritorios,
  onTerritoriosChange,
}: TerritoryFilterProps) => {
  const toggleTerritorio = (territorioNome: string) => {
    if (selectedTerritorios.includes(territorioNome)) {
      onTerritoriosChange(selectedTerritorios.filter((t) => t !== territorioNome));
    } else {
      onTerritoriosChange([...selectedTerritorios, territorioNome]);
    }
  };

  const clearAll = () => {
    onTerritoriosChange([]);
  };

  const selectAll = () => {
    onTerritoriosChange(territorios.map((t) => t.nome));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Territórios</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              {selectedTerritorios.length > 0
                ? `${selectedTerritorios.length} selecionado(s)`
                : "Selecionar"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="end">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAll}
                  className="h-7 text-xs"
                >
                  Selecionar todos
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-7 text-xs"
                  disabled={selectedTerritorios.length === 0}
                >
                  Limpar
                </Button>
              </div>
            </div>
            <ScrollArea className="h-64">
              <div className="p-3 space-y-2">
                {territorios.map((territorio) => (
                  <div
                    key={territorio.id}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-smooth cursor-pointer"
                    onClick={() => toggleTerritorio(territorio.nome)}
                  >
                    <Checkbox
                      checked={selectedTerritorios.includes(territorio.nome)}
                      onCheckedChange={() => toggleTerritorio(territorio.nome)}
                    />
                    <label className="flex-1 text-sm cursor-pointer">
                      {territorio.nome}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {selectedTerritorios.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-2">
            {selectedTerritorios.map((territorio) => (
              <Badge
                key={territorio}
                variant="secondary"
                className="pl-2 pr-1 py-1 gap-1 transition-smooth hover:bg-secondary/80"
              >
                <span className="text-xs">{territorio}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => toggleTerritorio(territorio)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
