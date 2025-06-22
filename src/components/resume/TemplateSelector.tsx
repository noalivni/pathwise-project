
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { templates } from "@/utils/resumeTemplateStyles";
import { toast } from "@/hooks/use-toast";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

const TemplateSelector = ({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) => {
  const handleTemplateChange = (templateId: string) => {
    onTemplateChange(templateId);
    toast({
      title: "Template Updated",
      description: `Switched to ${templates.find(t => t.id === templateId)?.name} template`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-main">
          <FileText className="mr-2 h-5 w-5 text-teal-600" />
          Resume Templates
        </CardTitle>
        <CardDescription className="text-sub">Choose your resume design</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedTemplate === template.id 
                  ? 'border-teal-500 shadow-md bg-[#5C469C]' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm hover:bg-[#5C469C]'
              }`}
              onClick={() => handleTemplateChange(template.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-main">{template.name}</h3>
                  <p className="text-sm text-sub">{template.description}</p>
                </div>
                {selectedTemplate === template.id && (
                  <Badge className="bg-teal-500">Active</Badge>
                )}
              </div>
              <p className="text-xs text-sub mt-2 italic">{template.preview}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
