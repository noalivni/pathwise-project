
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FieldSelectorProps {
  selectedField: string;
  onFieldChange: (field: string) => void;
}

const fields = [
  { value: "UX/UI Design", label: "UX/UI Design" },
  { value: "Data Analytics", label: "Data Analytics" },
  { value: "Marketing", label: "Marketing" },
  { value: "Software Development", label: "Software Development" },
  { value: "Product Management", label: "Product Management" },
  { value: "Finance", label: "Finance" },
  { value: "General", label: "General" }
];

const FieldSelector = ({ selectedField, onFieldChange }: FieldSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="field-selector" className="text-sm font-medium text-foreground">
        Field of Interest
      </Label>
      <Select value={selectedField} onValueChange={onFieldChange}>
        <SelectTrigger id="field-selector" className="w-full bg-background border-border">
          <SelectValue placeholder="Select your field of interest" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border">
          {fields.map((field) => (
            <SelectItem key={field.value} value={field.value} className="text-foreground hover:bg-accent">
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FieldSelector;
