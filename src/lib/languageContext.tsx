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
    'home.transformFeedback': 'Transform Customer Feedback into Growth',
    'home.elevateReputation': 'Elevate Your Restaurant\'s Reputation with Ease',
    'home.feedbackDesc': 'Turn customer feedback into glowing reviews. Collect insights, improve service, and boost your online presence with our intuitive reputation management platform.',
    'home.getStartedToday': 'Get started today',
    'home.viewDemo': 'View demo',
    'home.fromRestaurants': 'from over 100 restaurants',
    'home.readyTransform': 'Ready to transform your restaurant\'s reputation?',
    'home.joinHundreds': 'Join hundreds of successful restaurants already using our platform to collect feedback and improve their online presence.',
    'home.getStartedFree': 'Get started for free',
    'home.dashboardOverview': 'Dashboard Overview',
    'home.last30days': 'Last 30 days',
    'home.totalReviews': 'Total Reviews',
    'home.avgRating': 'Avg. Rating',
    'home.conversionRate': 'Conversion Rate',
    'home.ratingBreakdown': 'Rating Breakdown',
    'home.recentFeedback': 'Recent Feedback',
    'home.startedSuccess': 'Getting started!',
    'home.redirectingToSignup': 'Redirecting you to our signup page...',
    'home.demoTitle': 'Product Demo',
    'home.demoDescription': 'Experience how our platform helps you collect and manage customer feedback',
    'home.interactiveDemoTitle': 'Interactive Demo',
    'home.interactiveDemoText': 'This is where the demo content would be displayed',

    // Features section
    'features.title': 'Features',
    'features.heading': 'Everything You Need to Manage Your Reputation',
    'features.description': 'Our comprehensive solution provides all the tools necessary to collect, analyze, and leverage customer feedback to improve your business.',
    'features.qrCodes.title': 'Custom QR Codes',
    'features.qrCodes.description': 'Generate unique QR codes that customers can scan to leave feedback about your business.',
    'features.analytics.title': 'Comprehensive Analytics',
    'features.analytics.description': 'Access detailed reports and insights on customer feedback to identify trends and areas for improvement.',
    'features.redirection.title': 'Review Redirection',
    'features.redirection.description': 'Automatically redirect satisfied customers to leave reviews on Google Maps to boost your online presence.',
    'features.feedback.title': 'Instant Feedback',
    'features.feedback.description': 'Collect and organize customer feedback in real-time to quickly address concerns and improve service.',
    'features.benchmarking.title': 'Competitive Benchmarking',
    'features.benchmarking.description': 'Compare your performance against industry standards and competitors in your area.',
    'features.surveys.title': 'Customizable Surveys',
    'features.surveys.description': 'Create tailored surveys with multiple question types to gather specific feedback from your customers.',
    'features.reviewRouting.title': 'Intelligent Review Routing',
    'features.reviewRouting.description': 'Our smart system automatically directs satisfied customers to leave reviews on Google Maps while privately collecting constructive feedback from less satisfied customers.',
    'features.customThresholds': 'Set custom rating thresholds',
    'features.maximizeReviews': 'Maximize positive online reviews',
    'features.addressConcerns': 'Address concerns before they go public',
    'features.improveEfficiency': 'Improve reputation management efficiency',
    'features.experience': 'How was your experience?',
    'features.additionalComments': 'Any additional comments?',
    'features.submitFeedback': 'Submit Feedback',
    'features.redirectExplanation': '5-star feedback will be redirected to Google Maps for a public review.',

    // Footer
    'footer.subscribeNewsletter': 'Subscribe to our newsletter',
    'footer.enterEmail': 'Enter your email',
    'footer.subscribe': 'Subscribe',
    'footer.helpingRestaurants': 'Helping restaurants and cafés transform customer feedback into growth and improved online reputation.',
    'footer.product': 'Product',
    'footer.features': 'Features',
    'footer.pricing': 'Pricing',
    'footer.testimonials': 'Testimonials',
    'footer.caseStudies': 'Case Studies',
    'footer.api': 'API',
    'footer.company': 'Company',
    'footer.about': 'About',
    'footer.blog': 'Blog',
    'footer.careers': 'Careers',
    'footer.press': 'Press',
    'footer.partners': 'Partners',
    'footer.support': 'Support',
    'footer.helpCenter': 'Help Center',
    'footer.contactUs': 'Contact Us',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',
    'footer.status': 'Status',
    'footer.allRightsReserved': '© 2023 Repute. All rights reserved.',

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

    // Pricing section
    'pricing.title': 'Pricing',
    'pricing.heading': 'Simple, Transparent Pricing',
    'pricing.description': 'Choose the plan that best fits your business needs. No hidden fees or complicated pricing structures.',
    'pricing.monthly': 'Monthly',
    'pricing.annual': 'Annual',
    'pricing.save': 'Save 15%',
    'pricing.mostPopular': 'Most Popular',
    'pricing.getStarted': 'Get started',
    'pricing.mo': 'mo',
    'pricing.saveYear': 'Save $${amount}/year',
    'pricing.free.title': 'Free',
    'pricing.freeDesc': 'Basic tools for small businesses just getting started.',
    'pricing.pro.title': 'Pro',
    'pricing.proDesc': 'Advanced tools for growing businesses.',
    'pricing.premium.title': 'Premium',
    'pricing.premiumDesc': 'Complete solution for established businesses.',
    'pricing.basicSurvey': 'Basic survey creation',
    'pricing.responses100': 'Up to 100 responses per month',
    'pricing.basicAnalytics': 'Basic analytics dashboard',
    'pricing.emailSupport': 'Email support',
    'pricing.unlimitedSurveys': 'Unlimited survey creation',
    'pricing.responses1000': 'Up to 1,000 responses per month',
    'pricing.googleMapsRedirect': 'Google Maps review redirection',
    'pricing.advancedAnalytics': 'Advanced analytics dashboard',
    'pricing.customQR': 'Custom QR codes and short links',
    'pricing.priorityEmail': 'Priority email support',
    'pricing.everythingPro': 'Everything in Pro',
    'pricing.unlimitedResponses': 'Unlimited responses',
    'pricing.benchmarking': 'Competitive benchmarking',
    'pricing.industryAverages': 'Industry and city averages',
    'pricing.customBranding': 'Custom branding',
    'pricing.apiAccess': 'API access',
    'pricing.dedicatedManager': 'Dedicated account manager',
    'pricing.allPlans': 'All plans include access to our customer support team, regular product updates, and our knowledge base. Need a custom solution?',
    'pricing.contactSales': 'Contact our sales team',
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
    'home.transformFeedback': 'Μετατρέψτε τα Σχόλια Πελατών σε Ανάπτυξη',
    'home.elevateReputation': 'Αναβαθμίστε τη Φήμη του Εστιατορίου σας με Ευκολία',
    'home.feedbackDesc': 'Μετατρέψτε τα σχόλια των πελατών σας σε λαμπερές κριτικές. Συλλέξτε πληροφορίες, βελτιώστε την εξυπηρέτηση και ενισχύστε την διαδικτυακή σας παρουσία με την διαισθητική πλατφόρμα διαχείρισης φήμης.',
    'home.getStartedToday': 'Ξεκινήστε σήμερα',
    'home.viewDemo': 'Προβολή επίδειξης',
    'home.fromRestaurants': 'από πάνω από 100 εστιατόρια',
    'home.readyTransform': 'Έτοιμοι να μεταμορφώσετε τη φήμη του εστιατορίου σας;',
    'home.joinHundreds': 'Συνδεθείτε με εκατοντάδες επιτυχημένα εστιατόρια που χρησιμοποιούν ήδη την πλατφόρμα μας για να συλλέγουν σχόλια και να βελτιώνουν την διαδικτυακή τους παρουσία.',
    'home.getStartedFree': 'Ξεκινήστε δωρεάν',
    'home.dashboardOverview': 'Επισκόπηση Πίνακα Ελέγχου',
    'home.last30days': 'Τελευταίες 30 ημέρες',
    'home.totalReviews': 'Συνολικές Κριτικές',
    'home.avgRating': 'Μέση Βαθμολογία',
    'home.conversionRate': 'Ποσοστό Μετατροπής',
    'home.ratingBreakdown': 'Ανάλυση Βαθμολογίας',
    'home.recentFeedback': 'Πρόσφατα Σχόλια',
    'home.startedSuccess': 'Ξεκινάμε!',
    'home.redirectingToSignup': 'Ανακατεύθυνση στη σελίδα εγγρ��φής...',
    'home.demoTitle': 'Επίδειξη Προϊόντος',
    'home.demoDescription': 'Δείτε πώς η πλατφόρμα μας σας βοηθά να συλλέγετε και να διαχειρίζεστε τα σχόλια των πελατών',
    'home.interactiveDemoTitle': 'Διαδραστική Επίδειξη',
    'home.interactiveDemoText': 'Εδώ θα εμφανιζόταν το περιεχόμενο της επίδειξης',

    // Features section
    'features.title': 'Χαρακτηριστικά',
    'features.heading': 'Όλα Όσα Χρειάζεστε για να Διαχειριστείτε τη Φήμη σας',
    'features.description': 'Η ολοκληρωμένη λύση μας παρέχει όλα τα απαραίτητα εργαλεία για τη συλλογή, ανάλυση και αξιοποίηση των σχολίων των πελατών για τη βελτίωση της επιχείρησής σας.',
    'features.qrCodes.title': 'Προσαρμοσμένοι Κωδικοί QR',
    'features.qrCodes.description': 'Δημιουργήστε μοναδικούς κωδικούς QR που μπορούν να σαρώσουν οι πελάτες για να αφήσουν σχόλια σχετικά με την επιχείρησή σας.',
    'features.analytics.title': 'Ολοκληρωμένη Ανάλυση',
    'features.analytics.description': 'Αποκτήστε πρόσβαση σε λεπτομερείς αναφορές και πληροφορίες σχετικά με τα σχόλια των πελατών για να εντοπίσετε τάσεις και τομείς βελτίωσης.',
    'features.redirection.title': 'Ανακατεύθυνση Κριτικών',
    'features.redirection.description': 'Ανακατευθύνετε αυτόματα τους ικανοποιημένους πελάτες να αφήσουν κριτικές στο Google Maps για να ενισχύσετε την online παρουσία σας.',
    'features.feedback.title': 'Άμεση Ανατροφοδότηση',
    'features.feedback.description': 'Συλλέξτε και οργανώστε τα σχόλια των πελατών σε πραγματικό χρόνο για να αντιμετωπίσετε γρήγορα τις ανησυχίες και να βελτιώσετε την εξυπηρέτηση.',
    'features.benchmarking.title': 'Συγκριτική Αξιολόγηση',
    'features.benchmarking.description': 'Συγκρίνετε την απόδοσή σας με τα βιομηχανικά πρότυπα και τους ανταγωνιστές στην περιοχή σας.',
    'features.surveys.title': 'Προσαρμόσιμες Έρευνες',
    'features.surveys.description': 'Δημιουργήστε προσαρμοσμένες έρευνες με πολλαπλούς τύπους ερωτήσεων για να συλλέξετε συγκεκριμένα σχόλια από τους πελάτες σας.',
    'features.reviewRouting.title': 'Έξυπνη Δρομολόγηση Κριτικών',
    'features.reviewRouting.description': 'Το έξυπνο σύστημά μας κατευθύνει αυτόματα τους ικανοποιημένους πελάτες να αφήσουν κριτικές στο Google Maps, ενώ συλλέγει ιδιωτικά εποικοδομητικά σχόλια από λιγότερο ικανοποιημένους πελάτες.',
    'features.customThresholds': 'Ορίστε προσαρμοσμένα όρια βαθμολογίας',
    'features.maximizeReviews': 'Μεγιστοποιήστε τις θετικές online κριτικές',
    'features.addressConcerns': 'Αντιμετωπίστε ανησυχίες προτού γίνουν δημόσιες',
    'features.improveEfficiency': 'Βελτιώστε την αποτελεσματικότητα διαχείρισης φήμης',
    'features.experience': 'Πώς ήταν η εμπειρία σας;',
    'features.additionalComments': 'Έχετε επιπλέον σχόλια;',
    'features.submitFeedback': 'Υποβολή Σχολίων',
    'features.redirectExplanation': 'Τα σχόλια με 5 αστέρια θα ανακατευθυνθούν στο Google Maps για δημόσια κριτική.',

    // Footer
    'footer.subscribeNewsletter': 'Εγγραφείτε στο ενημερωτικό μας δελτίο',
    'footer.enterEmail': 'Εισάγετε το email σας',
    'footer.subscribe': 'Εγγραφή',
    'footer.helpingRestaurants': 'Βοηθάμε εστιατόρια και καφέ να μετατρέψουν τα σχόλια των πελατών σε ανάπτυξη και βελτιωμένη διαδικτυακή φήμη.',
    'footer.product': 'Προϊόν',
    'footer.features': 'Χαρακτηριστικά',
    'footer.pricing': 'Τιμές',
    'footer.testimonials': 'Μαρτυρίες',
    'footer.caseStudies': 'Μελέτες Περιπτώσεων',
    'footer.api': 'API',
    'footer.company': 'Εταιρεία',
    'footer.about': 'Σχετικά',
    'footer.blog': 'Ιστολόγιο',
    'footer.careers': 'Καριέρα',
    'footer.press': 'Τύπος',
    'footer.partners': 'Συνεργάτες',
    'footer.support': 'Υποστήριξη',
    'footer.helpCenter': 'Κέντρο Βοήθειας',
    'footer.contactUs': 'Επικοινωνήστε μαζί μας',
    'footer.privacyPolicy': 'Πολιτική Απορρήτου',
    'footer.termsOfService': 'Όροι Χρήσης',
    'footer.status': 'Κατάσταση',
    'footer.allRightsReserved': '© 2023 Repute. Με επιφύλαξη παντός δικαιώματος.',

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
    'survey.multipleChoice': 'Πολλαπλούς Επιλογής',
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

    // Pricing section
    'pricing.title': 'Τιμές',
    'pricing.heading': 'Απλές, Διαφανείς Τιμές',
    'pricing.description': 'Επιλέξτε το πακέτο που ταιριάζει καλύτερα στις ανάγκες της επιχείρησής σας. Χωρίς κρυφές χρεώσεις ή περίπλοκες δομές τιμολόγησης.',
    'pricing.monthly': 'Μηνιαία',
    'pricing.annual': 'Ετήσια',
    'pricing.save': 'Κερδίστε 15%',
    'pricing.mostPopular': 'Πιο Δημοφιλές',
    'pricing.getStarted': 'Ξεκινήστε',
    'pricing.mo': 'μήνα',
    'pricing.saveYear': 'Εξοικονομήστε ${amount}€/έτος',
    'pricing.free.title': 'Δωρεάν',
    'pricing.freeDesc': 'Βασικά εργαλεία για μικρές επιχειρήσεις που μόλις ξεκινούν.',
    'pricing.pro.title': 'Pro',
    'pricing.proDesc': 'Προηγμένα εργαλεία για αναπτυσσόμενες επιχειρήσεις.',
    'pricing.premium.title': 'Premium',
    'pricing.premiumDesc': 'Ολοκληρωμένη λύση για εδραιωμένες επιχειρήσεις.',
    'pricing.basicSurvey': 'Βασική δημιουργία ερευνών',
    'pricing.responses100': 'Έως 100 απαντήσεις ανά μήνα',
    'pricing.basicAnalytics': 'Βασικός πίνακας αναλύσεων',
    'pricing.emailSupport': 'Υποστήριξη μέσω email',
    'pricing.unlimitedSurveys': 'Απεριόριστη δημιουργία ερευνών',
    'pricing.responses1000': 'Έως 1.000 απαντήσεις ανά μήνα',
    'pricing.googleMapsRedirect': 'Ανακατεύθυνση κριτικών Google Maps',
    'pricing.advancedAnalytics': 'Προηγμένος πίνακας αναλύσεων',
    'pricing.customQR': 'Προσαρμοσμένοι κωδικοί QR και σύντομοι σύνδεσμοι',
    'pricing.priorityEmail': 'Προτεραιότητα στην υποστήριξη μέσω email',
    'pricing.everythingPro': 'Όλα όσα περιλαμβάνει το Pro',
    'pricing.unlimitedResponses': 'Απεριόριστες απαντήσεις',
    'pricing.benchmarking': 'Συγκριτική αξιολόγηση ανταγωνισμού',
    'pricing.industryAverages': 'Μέσοι όροι ανά κλάδο και πόλη',
    'pricing.customBranding': 'Προσαρμοσμένο branding',
    'pricing.apiAccess': 'Πρόσβαση σε API',
    'pricing.dedicatedManager': 'Αφοσιωμένος διαχειριστής λογαριασμού',
    'pricing.allPlans': 'Όλα τα πακέτα περιλαμβάνουν πρόσβαση στην ομάδα υποστήριξης πελατών, τακτικές ενημερώσεις προϊόντων και τη βάση γνώσεών μας. Χρειάζεστε μια προσαρμοσμένη λύση;',
    'pricing.contactSales': 'Επικοινωνήστε με την ομάδα πωλήσεων',
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
