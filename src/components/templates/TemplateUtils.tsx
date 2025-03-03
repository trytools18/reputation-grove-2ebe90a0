
import React from "react";
import { Coffee, Hotel, ListFilter, Scissors, Utensils } from "lucide-react";

export const getCategoryIcon = (category: string): JSX.Element => {
  switch (category) {
    case 'restaurant':
      return <Utensils className="h-4 w-4" />;
    case 'barbershop':
      return <Scissors className="h-4 w-4" />;
    case 'hotel':
      return <Hotel className="h-4 w-4" />;
    case 'coffee':
      return <Coffee className="h-4 w-4" />;
    default:
      return <ListFilter className="h-4 w-4" />;
  }
};

export const formatCategoryName = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};
