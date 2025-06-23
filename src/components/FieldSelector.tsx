
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface FieldSelectorProps {
  selectedField: string;
  onFieldChange: (field: string) => void;
}

const CAREER_FIELDS = [
  "UX/UI Design",
  "Data Analytics", 
  "Marketing",
  "Software Development",
  "Product Management",
  "General"
];

const FieldSelector = ({ selectedField, onFieldChange }: FieldSelectorProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Target className="mr-2 h-5 w-5 text-primary" />
          Select Your Field of Interest
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Choose your career field to get personalized skills assessments
          </p>
          <Select value={selectedField} onValueChange={onFieldChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a field..." />
            </SelectTrigger>
            <SelectContent>
              {CAREER_FIELDS.map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldSelector;
