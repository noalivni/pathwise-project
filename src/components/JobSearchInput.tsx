
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface JobSearchInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const JobSearchInput = ({ searchTerm, onSearchChange }: JobSearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search career roles, categories, or skills..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default JobSearchInput;
