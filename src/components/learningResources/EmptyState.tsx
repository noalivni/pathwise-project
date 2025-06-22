
import { BookOpen } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-sub mb-2">No resources found</h3>
      <p className="text-sub">Try adjusting your search terms or filters</p>
    </div>
  );
};

export default EmptyState;
