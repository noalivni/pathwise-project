
export interface TemplateStyles {
  container: string;
  header: string;
  section: string;
  title: string;
  text: string;
}

export const getTemplateStyles = (selectedTemplate: string): TemplateStyles => {
  switch (selectedTemplate) {
    case "classic":
      return {
        container: "bg-white border-2 border-gray-400 font-serif shadow-md",
        header: "text-center border-b-2 border-gray-400 pb-6 mb-6 text-black",
        section: "mb-6 border-b border-gray-300 pb-4",
        title: "text-xl font-bold text-gray-900 mb-2 uppercase tracking-widest",
        text: "text-gray-800 leading-relaxed text-sm"
      };
    case "creative":
      return {
        container: "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-l-8 border-purple-600 shadow-2xl rounded-r-lg",
        header: "bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-tr-lg mb-6 relative overflow-hidden",
        section: "mb-6 bg-white/70 p-5 rounded-xl backdrop-blur-sm border border-white/50 shadow-sm",
        title: "text-xl font-bold text-purple-700 mb-3 flex items-center border-b-2 border-purple-200 pb-2",
        text: "text-gray-700 leading-relaxed"
      };
    case "minimal":
      return {
        container: "bg-white border border-gray-100 shadow-sm",
        header: "mb-10 pb-4 border-b border-gray-100 text-black",
        section: "mb-10",
        title: "text-lg font-light text-gray-500 mb-4 uppercase tracking-widest text-sm",
        text: "text-gray-900 leading-loose font-light"
      };
    default: // modern
      return {
        container: "bg-white border-l-4 border-teal-500 shadow-xl",
        header: "bg-gradient-to-r from-teal-600 to-blue-600 text-white p-8 mb-6 relative",
        section: "mb-6 px-6",
        title: "text-lg font-semibold text-teal-700 mb-3 border-b-2 border-teal-200 pb-2 uppercase tracking-wide",
        text: "text-gray-700 leading-relaxed"
      };
  }
};

export const templates = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean design with color accents",
    preview: "Professional layout with modern typography and teal accents"
  },
  {
    id: "classic",
    name: "Traditional Corporate",
    description: "Conservative business format",
    preview: "Traditional serif format with formal styling and clear sections"
  },
  {
    id: "creative",
    name: "Creative Design",
    description: "Bold layout with visual elements",
    preview: "Dynamic layout with gradients, visual sections, and creative styling"
  },
  {
    id: "minimal",
    name: "Clean Minimal",
    description: "Simple, content-focused design",
    preview: "Minimalist approach with ample white space and light typography"
  }
];
