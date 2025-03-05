
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'el';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const defaultLanguage: Language = 'en';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    // Common
    'app.name': 'Repute',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.continue': 'Continue',
    'common.logout': 'Logout',
    'common.login': 'Login',
    'common.signup': 'Sign Up',
    'common.required': 'Required',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.analytics': 'Analytics',
    'nav.createSurvey': 'Create Survey',
    'nav.account': 'Account',
    'nav.templates': 'Templates',
    'nav.settings': 'Settings',

    // Auth
    'auth.welcome': 'Welcome to Repute',
    'auth.loginTitle': 'Login to your account',
    'auth.signupTitle': 'Create your account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.recentSurveys': 'Recent Surveys',
    'dashboard.noSurveys': 'You don\'t have any surveys yet',
    'dashboard.createFirst': 'Create your first survey',
    
    // Survey Creator
    'survey.create': 'Create Survey',
    'survey.edit': 'Edit Survey',
    'survey.design': 'Design',
    'survey.settings': 'Settings',
    'survey.preview': 'Preview',
    'survey.saving': 'Saving...',
    'survey.saveSurvey': 'Save Survey',
    'survey.addQuestion': 'Add Question',
    'survey.noQuestions': 'No questions added yet',
    'survey.addFirst': 'Add your first question',
    'survey.surveyInfo': 'Survey Information',
    'survey.surveyTitle': 'Survey Title',
    'survey.surveyDescription': 'Survey Description',
    'survey.questions': 'Questions',
    'survey.required': 'Required',
    'survey.optional': 'Optional',
    'survey.rating': 'Rating',
    'survey.multipleChoice': 'Multiple Choice',
    'survey.textResponse': 'Text Response',
    'survey.maxRating': 'Max rating',
    'survey.googleMapsUrl': 'Google Maps URL',
    'survey.googleUrlRequired': 'Google Maps URL required',
    'survey.redirectThreshold': 'Redirect customers to Google Maps when average rating is at least',
    'survey.redirectExplain': 'Customers who give you a rating of {threshold} or higher will be invited to leave a Google review.',
    'survey.enterGoogleUrl': 'Enter your Google Maps review URL. This is where customers will be redirected.',

    // Survey View
    'surveyView.notFound': 'Survey Not Found',
    'surveyView.notFoundDesc': 'The survey you\'re looking for does not exist or may have been deleted.',
    'surveyView.goBack': 'Go Back',
    'surveyView.shareFeedback': 'Please share your feedback with us',
    'surveyView.noQuestions': 'This survey has no questions yet.',
    'surveyView.enterResponse': 'Enter your response here...',
    'surveyView.submitting': 'Submitting...',
    'surveyView.submitFeedback': 'Submit Feedback',
    'surveyView.thankYou': 'Thank You!',
    'surveyView.thankYouDesc': 'Your feedback has been submitted successfully.',
    'surveyView.redirectingToGoogle': 'You will be redirected to Google Maps to leave a review momentarily...',
    'surveyView.errorSubmitting': 'Error submitting survey',
    'surveyView.answerAtLeastOne': 'Please answer at least one question',

    // Account Settings
    'account.settings': 'Account Settings',
    'account.profile': 'Profile',
    'account.business': 'Business Information',
    'account.businessName': 'Business Name',
    'account.category': 'Business Category',
    'account.city': 'City',
    'account.theme': 'Theme',
    'account.language': 'Language',
    'account.saveChanges': 'Save Changes',
    'account.profileUpdated': 'Profile updated successfully',
    'account.errorUpdating': 'Error updating profile',

    // Language names (for dropdown)
    'language.en': 'English',
    'language.el': 'Greek',

    // Business Categories
    'category.restaurant': 'Restaurant',
    'category.cafe': 'Cafe',
    'category.retail': 'Retail Store',
    'category.hotel': 'Hotel',
    'category.barbershop': 'Barbershop',
    'category.beautySalon': 'Beauty Salon',
    'category.gym': 'Gym',
    'category.other': 'Other',

    // Cities
    'city.athens': 'Athens',
    'city.thessaloniki': 'Thessaloniki',
    'city.patra': 'Patra',
    'city.heraklion': 'Heraklion',
    'city.larissa': 'Larissa',
    'city.volos': 'Volos',
    'city.ioannina': 'Ioannina',
    'city.chania': 'Chania',
    'city.other': 'Other',
  },
  el: {
    // Common
    'app.name': 'Repute',
    'common.loading': 'Φόρτωση...',
    'common.error': 'Σφάλμα',
    'common.back': 'Πίσω',
    'common.save': 'Αποθήκευση',
    'common.cancel': 'Ακύρωση',
    'common.submit': 'Υποβολή',
    'common.continue': 'Συνέχεια',
    'common.logout': 'Αποσύνδεση',
    'common.login': 'Σύνδεση',
    'common.signup': 'Εγγραφή',
    'common.required': 'Απαιτείται',

    // Navigation
    'nav.dashboard': 'Πίνακας Ελέγχου',
    'nav.analytics': 'Αναλύσεις',
    'nav.createSurvey': 'Δημιουργία Έρευνας',
    'nav.account': 'Λογαριασμός',
    'nav.templates': 'Πρότυπα',
    'nav.settings': 'Ρυθμίσεις',

    // Auth
    'auth.welcome': 'Καλώς ήρθατε στο Repute',
    'auth.loginTitle': 'Σύνδεση στο λογαριασμό σας',
    'auth.signupTitle': 'Δημιουργία λογαριασμού',
    'auth.email': 'Email',
    'auth.password': 'Κωδικός',
    'auth.forgotPassword': 'Ξεχάσατε τον κωδικό;',
    'auth.noAccount': 'Δεν έχετε λογαριασμό;',
    'auth.hasAccount': 'Έχετε ήδη λογαριασμό;',
    
    // Dashboard
    'dashboard.title': 'Πίνακας Ελέγχου',
    'dashboard.welcome': 'Καλώς ήρθατε ξανά',
    'dashboard.recentSurveys': 'Πρόσφατες Έρευνες',
    'dashboard.noSurveys': 'Δεν έχετε καμία έρευνα ακόμα',
    'dashboard.createFirst': 'Δημιουργήστε την πρώτη σας έρευνα',
    
    // Survey Creator
    'survey.create': 'Δημιουργία Έρευνας',
    'survey.edit': 'Επεξεργασία Έρευνας',
    'survey.design': 'Σχεδιασμός',
    'survey.settings': 'Ρυθμίσεις',
    'survey.preview': 'Προεπισκόπηση',
    'survey.saving': 'Αποθήκευση...',
    'survey.saveSurvey': 'Αποθήκευση Έρευνας',
    'survey.addQuestion': 'Προσθήκη Ερώτησης',
    'survey.noQuestions': 'Δεν έχουν προστεθεί ερωτήσεις ακόμα',
    'survey.addFirst': 'Προσθέστε την πρώτη σας ερώτηση',
    'survey.surveyInfo': 'Πληροφορίες Έρευνας',
    'survey.surveyTitle': 'Τίτλος Έρευνας',
    'survey.surveyDescription': 'Περιγραφή Έρευνας',
    'survey.questions': 'Ερωτήσεις',
    'survey.required': 'Υποχρεωτικό',
    'survey.optional': 'Προαιρετικό',
    'survey.rating': 'Βαθμολογία',
    'survey.multipleChoice': 'Πολλαπλής Επιλογής',
    'survey.textResponse': 'Απάντηση Κειμένου',
    'survey.maxRating': 'Μέγιστη βαθμολογία',
    'survey.googleMapsUrl': 'URL Google Maps',
    'survey.googleUrlRequired': 'Απαιτείται URL Google Maps',
    'survey.redirectThreshold': 'Ανακατεύθυνση πελατών στο Google Maps όταν η μέση βαθμολογία είναι τουλάχιστον',
    'survey.redirectExplain': 'Οι πελάτες που σας δίνουν βαθμολογία {threshold} ή υψηλότερη θα προσκληθούν να αφήσουν μια κριτική στο Google.',
    'survey.enterGoogleUrl': 'Εισάγετε το URL κριτικής σας στο Google Maps. Εδώ θα ανακατευθύνονται οι πελάτες.',

    // Survey View
    'surveyView.notFound': 'Η Έρευνα Δεν Βρέθηκε',
    'surveyView.notFoundDesc': 'Η έρευνα που αναζητάτε δεν υπάρχει ή ενδέχεται να έχει διαγραφεί.',
    'surveyView.goBack': 'Επιστροφή',
    'surveyView.shareFeedback': 'Παρακαλούμε μοιραστείτε τα σχόλιά σας μαζί μας',
    'surveyView.noQuestions': 'Αυτή η έρευνα δεν έχει ερωτήσεις ακόμα.',
    'surveyView.enterResponse': 'Εισάγετε την απάντησή σας εδώ...',
    'surveyView.submitting': 'Υποβολή...',
    'surveyView.submitFeedback': 'Υποβολή Σχολίων',
    'surveyView.thankYou': 'Ευχαριστούμε!',
    'surveyView.thankYouDesc': 'Τα σχόλιά σας υποβλήθηκαν με επιτυχία.',
    'surveyView.redirectingToGoogle': 'Θα ανακατευθυνθείτε στο Google Maps για να αφήσετε μια κριτική σε λίγο...',
    'surveyView.errorSubmitting': 'Σφάλμα υποβολής έρευνας',
    'surveyView.answerAtLeastOne': 'Παρακαλούμε απαντήστε τουλάχιστον σε μία ερώτηση',

    // Account Settings
    'account.settings': 'Ρυθμίσεις Λογαριασμού',
    'account.profile': 'Προφίλ',
    'account.business': 'Πληροφορίες Επιχείρησης',
    'account.businessName': 'Όνομα Επιχείρησης',
    'account.category': 'Κατηγορία Επιχείρησης',
    'account.city': 'Πόλη',
    'account.theme': 'Θέμα',
    'account.language': 'Γλώσσα',
    'account.saveChanges': 'Αποθήκευση Αλλαγών',
    'account.profileUpdated': 'Το προφίλ ενημερώθηκε με επιτυχία',
    'account.errorUpdating': 'Σφάλμα ενημέρωσης προφίλ',

    // Language names (for dropdown)
    'language.en': 'Αγγλικά',
    'language.el': 'Ελληνικά',

    // Business Categories
    'category.restaurant': 'Εστιατόριο',
    'category.cafe': 'Καφετέρια',
    'category.retail': 'Κατάστημα Λιανικής',
    'category.hotel': 'Ξενοδοχείο',
    'category.barbershop': 'Κουρείο',
    'category.beautySalon': 'Κομμωτήριο',
    'category.gym': 'Γυμναστήριο',
    'category.other': 'Άλλο',

    // Cities
    'city.athens': 'Αθήνα',
    'city.thessaloniki': 'Θεσσαλονίκη',
    'city.patra': 'Πάτρα',
    'city.heraklion': 'Ηράκλειο',
    'city.larissa': 'Λάρισα',
    'city.volos': 'Βόλος',
    'city.ioannina': 'Ιωάννινα',
    'city.chania': 'Χανιά',
    'city.other': 'Άλλο',
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || defaultLanguage;
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
