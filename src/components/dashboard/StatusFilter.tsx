import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface StatusFilterProps {
  selectedStatus: string[];
  onStatusChange: (status: string[]) => void;
}

const statusOptions = [
  { value: "Pendente", label: "Pendente", icon: Circle, color: "text-danger" },
  { value: "Em andamento", label: "Em andamento", icon: Clock, color: "text-warning" },
  { value: "Concluído", label: "Concluído", icon: CheckCircle2, color: "text-success" },
];

export const StatusFilter = ({ selectedStatus, onStatusChange }: StatusFilterProps) => {
  const toggleStatus = (status: string) => {
    if (selectedStatus.includes(status)) {
      onStatusChange(selectedStatus.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatus, status]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Status</label>
      <div className="space-y-2">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.value}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-smooth cursor-pointer"
              onClick={() => toggleStatus(option.value)}
            >
              <Checkbox
                id={option.value}
                checked={selectedStatus.includes(option.value)}
                onCheckedChange={() => toggleStatus(option.value)}
              />
              <Label
                htmlFor={option.value}
                className="flex items-center gap-2 cursor-pointer flex-1 text-sm"
              >
                <Icon className={`w-4 h-4 ${option.color}`} />
                {option.label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
