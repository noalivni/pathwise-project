
import { LearningResource } from "@/types/learningResources";
import SearchAndFilters from "@/components/learningResources/SearchAndFilters";
import ResourceCard from "@/components/learningResources/ResourceCard";
import EmptyState from "@/components/learningResources/EmptyState";

interface CuratedResourcesSectionProps {
  filteredResources: LearningResource[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  resourceTypes: string[];
  onResourceClick: (resource: LearningResource) => void;
}

const CuratedResourcesSection = ({
  filteredResources,
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  resourceTypes,
  onResourceClick
}: CuratedResourcesSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-pathwise-text">Curated Learning Resources</h2>
      
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedType={selectedType}
        onTypeChange={onTypeChange}
        resourceTypes={resourceTypes}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onResourceClick={onResourceClick}
          />
        ))}
      </div>

      {filteredResources.length === 0 && <EmptyState />}
    </div>
  );
};

export default CuratedResourcesSection;
