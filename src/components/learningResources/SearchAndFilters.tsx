
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  resourceTypes: string[];
}

const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  resourceTypes
}: SearchAndFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search resources, skills, or topics..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        {resourceTypes.map(type => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange(type)}
            className="capitalize"
          >
            {type}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilters;
