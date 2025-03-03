
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter } from "lucide-react";

interface TemplateFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  children: React.ReactNode;
  getCategoryIcon: (category: string) => JSX.Element;
  formatCategoryName: (category: string) => string;
}

const TemplateFilter = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  children,
  getCategoryIcon,
  formatCategoryName
}: TemplateFilterProps) => {
  return (
    <Tabs defaultValue={selectedCategory || categories[0] || 'all'}>
      <TabsList className="mb-6">
        <TabsTrigger value="all" onClick={() => onSelectCategory(null)}>
          <ListFilter className="h-4 w-4 mr-1" />
          All Templates
        </TabsTrigger>
        {categories.map(category => (
          <TabsTrigger 
            key={category} 
            value={category}
            onClick={() => onSelectCategory(category)}
            className="flex items-center gap-1"
          >
            {getCategoryIcon(category)}
            {formatCategoryName(category)}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="all">
        {children}
      </TabsContent>
      
      {categories.map(category => (
        <TabsContent key={category} value={category}>
          {children}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TemplateFilter;
