
import { useLanguage } from "./LanguageContext";

export const useBusinessCategories = () => {
  const { language } = useLanguage();
  
  const categoriesData = {
    en: [
      { value: "restaurant", label: "Restaurant" },
      { value: "barbershop", label: "Barbershop" },
      { value: "hotel", label: "Hotel" },
      { value: "coffee", label: "Coffee Shop" },
    ],
    el: [
      { value: "restaurant", label: "Εστιατόριο" },
      { value: "barbershop", label: "Κουρείο" },
      { value: "hotel", label: "Ξενοδοχείο" },
      { value: "coffee", label: "Καφετέρια" },
    ]
  };
  
  return categoriesData[language as "en" | "el"] || categoriesData.en;
};

export const useGreekCities = () => {
  const { language } = useLanguage();
  
  const citiesData = {
    en: [
      { value: "athens", label: "Athens" },
      { value: "thessaloniki", label: "Thessaloniki" },
      { value: "patras", label: "Patras" },
      { value: "heraklion", label: "Heraklion" },
      { value: "larissa", label: "Larissa" },
    ],
    el: [
      { value: "athens", label: "Αθήνα" },
      { value: "thessaloniki", label: "Θεσσαλονίκη" },
      { value: "patras", label: "Πάτρα" },
      { value: "heraklion", label: "Ηράκλειο" },
      { value: "larissa", label: "Λάρισα" },
    ]
  };
  
  return citiesData[language as "en" | "el"] || citiesData.en;
};
