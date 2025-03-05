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
    'common.preview': 'Preview',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.share': 'Share',
    'common.created': 'Created on',
    'common.responses': 'Responses',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.analytics': 'Analytics',
    'nav.createSurvey': 'Create Survey',
    'nav.account': 'Account',
    'nav.templates': 'Templates',
    'nav.settings': 'Settings',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    
    // Homepage
    'home.welcome': 'Welcome',
    'home.welcomeBack': 'Welcome back',
    'home.hero.title': 'Get valuable feedback from your customers',
    'home.hero.subtitle': 'Create surveys, collect responses, and improve your business',
    'home.getStarted': 'Get Started',
    'home.seePricing': 'See Pricing',

    // Auth
    'auth.welcome': 'Welcome to Repute',
    'auth.loginTitle': 'Login to your account',
    'auth.signupTitle': 'Create your account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.loggedOut': 'Logged out',
    'auth.loggedOutDesc': 'You have been successfully logged out',
    'auth.errorLoggingOut': 'Error logging out',
    'auth.logIn': 'Log in',
    'auth.signUp': 'Sign up',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.recentSurveys': 'Recent Surveys',
    'dashboard.noSurveys': 'You don\'t have any surveys yet',
    'dashboard.createFirst': 'Create your first survey',
    'dashboard.monitor': 'Monitor your feedback and analytics',
    'dashboard.overview': 'Overview',
    'dashboard.surveys': 'Surveys',
    'dashboard.analytics': 'Analytics',
    'dashboard.totalSurveys': 'Total Surveys',
    'dashboard.surveysCreated': 'Surveys created to date',
    'dashboard.totalResponses': 'Total Responses',
    'dashboard.responsesCollected': 'Responses collected to date',
    'dashboard.averageRating': 'Average Rating',
    'dashboard.avgRatingAcross': 'Average rating across all surveys',
    'dashboard.recentFeedback': 'Recent Feedback',
    'dashboard.latestFeedback': 'The latest feedback from your customers',
    'dashboard.viewDetails': 'View details',
    'dashboard.submitted': 'Submitted',
    'dashboard.neutral': 'Neutral',
    'dashboard.positive': 'Positive',
    'dashboard.negative': 'Negative',
    'dashboard.ratingDistribution': 'Rating Distribution',
    'dashboard.howCustomersRating': 'How customers are rating your business',
    'dashboard.surveyPerformance': 'Survey Performance',
    'dashboard.comparisonSurveys': 'Comparison of your surveys',
    'dashboard.stars': 'Stars',
    'dashboard.star': 'Star',
    'dashboard.submissions': 'Submissions',
    'dashboard.avgRating': 'Avg. Rating',
    'dashboard.clickAnalytics': 'Click on "Analytics" button on any survey card to see detailed survey analytics',
    'dashboard.googleMapsUrl': 'Google Maps URL',
    'dashboard.viewLink': 'View link',
    'dashboard.viewForm': 'View Form',
    
    // Survey Creator
    'survey.create': 'Create Survey',
    'survey.edit': 'Edit Survey',
    'survey.design': 'Design',
    'survey.settings': 'Settings',
    'survey.preview': 'Preview',
    'survey.saving': 'Saving...',
    'survey.saveSurvey': 'Save Survey',
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
    'survey.createSurvey': 'Create Survey',
    'survey.createCustomSurvey': 'Create Custom Survey',
    'survey.shareSurvey': 'Share Survey',
    'survey.customerSatisfaction': 'Customer Satisfaction Survey',
    'survey.designCustomize': 'Design and customize your feedback survey',
    'survey.addQuestion': 'Add question',

    // Template Page
    'template.title': 'Survey Templates',
    'template.description': 'Choose from pre-built templates to get started quickly',
    'template.coffeeShop': 'Coffee Shop Experience',
    'template.coffeeDesc': 'A quick survey to gather feedback about your visit',
    'template.coffeeLong': 'A pre-configured template with questions focused on coffee feedback.',
    'template.haircutSatisfaction': 'Haircut Satisfaction Survey',
    'template.haircutDesc': 'A quick survey to gather feedback about haircut and service',
    'template.haircutLong': 'A pre-configured template with questions focused on barbershop feedback.',
    'template.hotelStay': 'Hotel Stay Experience',
    'template.hotelDesc': 'A brief survey to gather feedback about guest experience',
    'template.hotelLong': 'A pre-configured template with questions focused on hotel feedback.',
    'template.restaurant': 'Restaurant Customer Satisfaction',
    'template.restaurantDesc': 'A short survey to gather feedback about dining experience',
    'template.restaurantLong': 'A pre-configured template with questions focused on restaurant feedback.',
    'template.useTemplate': 'Use Template',
    'template.createFromTemplate': 'Create Survey from Template',
    'template.enterBusinessDetails': 'Enter your {type} details to create a survey using the {name} template.',
    'template.businessName': '{type} Name',
    'template.enterBusinessName': 'Enter your {type} name',
    'template.urlRedirectExplain': 'This URL will be used to redirect customers when they give a high rating.',
    'template.creating': 'Creating...',
    'template.surveyCreated': 'Survey created',
    'template.surveyCreatedDesc': 'Successfully created survey from the "{name}" template',
    'template.errorCreating': 'Error creating survey',
    'template.errorCreatingDesc': 'Could not create survey from template',

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
    'surveyView.rateExperience': 'How would you rate your overall experience?',
    'surveyView.enjoyMost': 'What did you enjoy most about your visit?',
    'surveyView.foodQuality': 'Food quality',
    'surveyView.service': 'Service',
    'surveyView.ambiance': 'Ambiance',
    'surveyView.valueForMoney': 'Value for money',
    'surveyView.other': 'Other',
    'surveyView.additionalComments': 'Do you have any additional comments or suggestions?',

    // Survey Results
    'surveyResults.title': 'Survey Results',
    'surveyResults.overview': 'Overview',
    'surveyResults.responses': 'Responses',
    'surveyResults.noResponses': 'No responses yet',
    'surveyResults.waitingForResponses': 'Waiting for your first response',
    'surveyResults.shareToGetResponses': 'Share your survey to start collecting responses',
    'surveyResults.individualResponses': 'Individual Responses',
    'surveyResults.viewAllResponses': 'View all responses',

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
    'account.businessProfile': 'Business Profile',
    'account.updateBusinessInfo': 'Update your business information',

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
    'common.preview': 'Προεπισκόπηση',
    'common.delete': 'Διαγραφή',
    'common.view': 'Προβολή',
    'common.share': 'Κοινοποίηση',
    'common.created': 'Δημιουργήθηκε στις',
    'common.responses': 'Απαντήσεις',

    // Navigation
    'nav.dashboard': 'Πίνακας Ελέγχου',
    'nav.analytics': 'Αναλύσεις',
    'nav.createSurvey': 'Δημιουργία Έρευνας',
    'nav.account': 'Λογαριασμός',
    'nav.templates': 'Πρότυπα',
    'nav.settings': 'Ρυθμίσεις',
    'nav.features': 'Χαρακτηριστικά',
    'nav.pricing': 'Τιμές',
    'nav.about': 'Σχετικά',
    
    // Homepage
    'home.welcome': 'Καλώς ήρθατε',
    'home.welcomeBack': 'Καλώς ήρθατε ξανά',
    'home.hero.title': 'Λάβετε πολύτιμα σχόλια από τους πελάτες σας',
    'home.hero.subtitle': 'Δημιουργήστε έρευνες, συλλέξτε απαντήσεις και βελτιώστε την επιχείρησή σας',
    'home.getStarted': 'Ξεκινήστε',
    'home.seePricing': 'Δείτε τις Τιμές',

    // Auth
    'auth.welcome': 'Καλώς ήρθατε στο Repute',
    'auth.loginTitle': 'Σύνδεση στο λογαριασμό σας',
    'auth.signupTitle': 'Δημιουργία λογαριασμού',
    'auth.email': 'Email',
    'auth.password': 'Κωδικός',
    'auth.forgotPassword': 'Ξεχάσατε τον κωδικό;',
    'auth.noAccount': 'Δεν έχετε λογαριασμό;',
    'auth.hasAccount': 'Έχετε ήδη λογαριασμό;',
    'auth.loggedOut': 'Αποσυνδεθήκατε',
    'auth.loggedOutDesc': 'Έχετε αποσυνδεθεί επιτυχώς',
    'auth.errorLoggingOut': 'Σφάλμα αποσύνδεσης',
    'auth.logIn': 'Σύνδεση',
    'auth.signUp': 'Εγγραφή',
    
    // Dashboard
    'dashboard.title': 'Πίνακας Ελέγχου',
    'dashboard.welcome': 'Καλώς ήρθατε ξανά',
    'dashboard.recentSurveys': 'Πρόσφατες Έρευνες',
    'dashboard.noSurveys': 'Δεν έχετε καμία έρευνα ακόμα',
    'dashboard.createFirst': 'Δημιουργήστε την πρώτη σας έρευνα',
    'dashboard.monitor': 'Παρακολουθήστε τα σχόλια και τις αναλύσεις σας',
    'dashboard.overview': 'Επισκόπηση',
    'dashboard.surveys': 'Έρευνες',
    'dashboard.analytics': 'Αναλύσεις',
    'dashboard.totalSurveys': 'Συνολικές Έρευνες',
    'dashboard.surveysCreated': 'Έρευνες που δημιουργήθηκαν μέχρι σήμερα',
    'dashboard.totalResponses': 'Συνολικές Απαντήσεις',
    'dashboard.responsesCollected': 'Απαντήσεις που συλλέχθηκαν μέχρι σήμερα',
    'dashboard.averageRating': 'Μέση Βαθμολογία',
    'dashboard.avgRatingAcross': 'Μέση βαθμολογία σε όλες τις έρευνες',
    'dashboard.recentFeedback': 'Πρόσφατα Σχόλια',
    'dashboard.latestFeedback': 'Τα τελευταία σχόλια από τους πελάτες σας',
    'dashboard.viewDetails': 'Προβολή λεπτομερειών',
    'dashboard.submitted': 'Υποβλήθηκε',
    'dashboard.neutral': 'Ουδέτερο',
    'dashboard.positive': 'Θετικό',
    'dashboard.negative': 'Αρνητικό',
    'dashboard.ratingDistribution': 'Κατανομή Βαθμολογίας',
    'dashboard.howCustomersRating': 'Πώς οι πελάτες βαθμολογούν την επιχείρησή σας',
    'dashboard.surveyPerformance': 'Απόδοση Ερευνών',
    'dashboard.comparisonSurveys': 'Σύγκριση των ερευνών σας',
    'dashboard.stars': 'Αστέρια',
    'dashboard.star': 'Αστέρι',
    'dashboard.submissions': 'Υποβολές',
    'dashboard.avgRating': 'Μέση Βαθμ.',
    'dashboard.clickAnalytics': 'Κάντε κλικ στο κουμπί "Αναλύσεις" σε οποιαδήποτε κάρτα έρευνας για να δείτε αναλυτικά στοιχεία έρευνας',
    'dashboard.googleMapsUrl': 'URL Google Maps',
    'dashboard.viewLink': 'Προβολή συνδέσμου',
    'dashboard.viewForm': 'Προβολή Φόρμας',
    
    // Survey Creator
    'survey.create': 'Δημιουργία Έρευνας',
    'survey.edit': 'Επεξεργασία Έρευνας',
    'survey.design': 'Σχεδιασμός',
    'survey.settings': 'Ρυθμίσεις',
    'survey.preview': 'Προεπισκόπηση',
    'survey.saving': 'Αποθήκευση...',
    'survey.saveSurvey': 'Αποθήκευση Έρευνας',
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
    'survey.createSurvey': 'Δημιουργία Έρευνας',
    'survey.createCustomSurvey': 'Δημιουργία Προσαρμοσμένης Έρευνας',
    'survey.shareSurvey': 'Κοινοποίηση Έρευνας',
    'survey.customerSatisfaction': 'Έρευνα Ικανοποίησης Πελατών',
    'survey.designCustomize': 'Σχεδιάστε και προσαρμόστε την έρευνα σχολίων σας',
    'survey.addQuestion': 'Προσθήκη ερώτησης',

    // Template Page
    'template.title': 'Πρότυπα Ερευνών',
    'template.description': 'Επιλέξτε από προκατασκευασμένα πρότυπα για να ξεκινήσετε γρήγορα',
    'template.coffeeShop': 'Εμπειρία Καφέ',
    'template.coffeeDesc': 'Μια γρήγορη έρευνα για τη συλλογή σχολίων σχετικά με την επίσκεψή σας',
    'template.coffeeLong': 'Ένα προδιαμορφωμένο πρότυπο με ερωτήσεις εστιασμένες στα σχόλια για τον καφέ.',
    'template.haircutSatisfaction': 'Έρευνα Ικανοποίησης Κουρέματος',
    'template.haircutDesc': 'Μια γρήγορη έρευνα για τη συλλογή σχολίων σχετικά με το κούρεμα και την εξυπηρέτηση',
    'template.haircutLong': 'Ένα προδιαμορφωμένο πρότυπο με ερωτήσεις εστιασμένες στα σχόλια για το κουρείο.',
    'template.hotelStay': 'Εμπειρία Διαμονής σε Ξενοδοχείο',
    'template.hotelDesc': 'Μια σύντομη έρευνα για τη συλλογή σχολίων σχετικά με την εμπειρία των επισκεπτών',
    'template.hotelLong': 'Ένα προδιαμορφωμένο πρότυπο με ερωτήσεις εστιασμένες στα σχόλια για το ξενοδοχείο.',
    'template.restaurant': 'Ικανοποίηση Πελατών Εστιατορίου',
    'template.restaurantDesc': 'Μια σύντομη έρευνα για τη συλλογή σχολίων σχετικά με την εμπειρία δείπνου',
    'template.restaurantLong': 'Ένα προδιαμορφωμένο πρότυπο με ερωτήσεις εστιασμένες στα σχόλια για το εστιατόριο.',
    'template.useTemplate': 'Χρήση Προτύπου',
    'template.createFromTemplate': 'Δημιουργία Έρευνας από Πρότυπο',
    'template.enterBusinessDetails': 'Εισάγετε τα στοιχεία του {type} σας για να δημιουργήσετε μια έρευνα χρησιμοποιώντας το πρότυπο {name}.',
    'template.businessName': 'Όνομα {type}',
    'template.enterBusinessName': 'Εισάγετε το όνομα του {type} σας',
    'template.urlRedirectExplain': 'Αυτό το URL θα χρησιμοποιηθεί για την ανακατεύθυνση των πελατών όταν δίνουν υψηλή βαθμολογία.',
    'template.creating': 'Δημιουργία...',
    'template.surveyCreated': 'Η έρευνα δημιουργήθηκε',
    'template.surveyCreatedDesc': 'Επιτυχής δημιουργία έρευνας από το πρότυπο "{name}"',
    'template.errorCreating': 'Σφάλμα δημιουργίας έρευνας',
    'template.errorCreatingDesc': 'Δεν ήταν δυνατή η δημιουργία έρευνας από το πρότυπο',

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
    'surveyView.thankYouDesc': 'Τα σχόλια σας υποβλήθηκαν με επιτυχία.',
    'surveyView.redirectingToGoogle': 'Θα ανακατευθυνθείτε στο Google Maps για να αφήσετε μια κριτική σε λίγο...',
    'surveyView.errorSubmitting': 'Σφάλμα υποβολής έρευνας',
    'surveyView.answerAtLeastOne': 'Παρακαλούμε απαντήστε τουλάχιστον σε μία ερώτηση',
    'surveyView.rateExperience': 'Πώς θα βαθμολογούσατε τη συνολική σας εμπειρία;',
    'surveyView.enjoyMost': 'Τι σας άρεσε περισσότερο από την επίσκεψή σας;',
    'surveyView.foodQuality': 'Ποιότητα φαγητού',
    'surveyView.service': 'Εξυπηρέτηση',
    'surveyView.ambiance': 'Ατμόσφαιρα',
    'surveyView.valueForMoney': 'Αξία για τα χρήματα',
    'surveyView.other': 'Άλλο',
    'surveyView.additionalComments': 'Έχετε πρόσθετα σχόλια ή προτάσεις;',

    // Survey Results
    'surveyResults.title': 'Αποτελέσματα Έρευνας',
    'surveyResults.overview': 'Επισκόπηση',
    'surveyResults.responses': 'Απαντήσεις',
    'surveyResults.noResponses': 'Δεν υπάρχουν απαντήσεις ακόμα',
    'surveyResults.waitingForResponses': 'Αναμονή για την πρώτη σας απάντηση',
    'surveyResults.shareToGetResponses': 'Κοινοποίηστε την έρευνά σας για να αρχίσετε να συλλέγετε απαντήσεις',
    'surveyResults.individualResponses': 'Μεμονωμένες Απαντήσεις',
    'surveyResults.viewAllResponses': 'Προβολή όλων των απαντήσεων',

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
    'account.businessProfile': 'Προφίλ Επιχείρησης',
    'account.updateBusinessInfo': 'Ενημερώστε τις πληροφορίες της επιχείρησής σας',

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
