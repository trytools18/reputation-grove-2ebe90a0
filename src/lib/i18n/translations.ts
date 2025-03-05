
export type TranslationKeys = {
  [key: string]: string;
};

export const translations: Record<string, TranslationKeys> = {
  en: {
    // Common
    "back": "Back",
    "submit": "Submit",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "loading": "Loading...",
    "saving": "Saving...",
    "language": "Language",
    "english": "English",
    "greek": "Greek",
    "error": "Error",
    "success": "Success",
    "yes": "Yes",
    "no": "No",
    
    // Auth
    "login": "Log in",
    "signup": "Sign up",
    "logout": "Logout",
    "email": "Email",
    "password": "Password",
    "business_name": "Business Name",
    "login_title": "Log in to your account",
    "signup_title": "Create a new account",
    "login_subtitle": "Enter your credentials to access your account",
    "signup_subtitle": "Sign up to start creating feedback surveys",
    "logging_in": "Logging in...",
    "creating_account": "Creating account...",
    
    // Dashboard
    "welcome": "Welcome",
    "dashboard": "Dashboard",
    "overview": "Overview",
    "surveys": "Surveys",
    "analytics": "Analytics",
    "account_settings": "Account Settings",
    "create_survey": "Create Survey",
    "use_template": "Use Template",
    "templates": "Templates",
    "total_surveys": "Total Surveys",
    "total_responses": "Total Responses",
    "average_rating": "Average Rating",
    "recent_feedback": "Recent Feedback",
    "view_details": "View details",
    "view_all_analytics": "View All Analytics",
    "no_surveys_created": "No surveys created yet",
    "no_surveys_created_description": "Create your first survey or use a template to get started",
    "no_responses_received": "No responses received yet",
    "responses_collected": "Responses collected to date",
    "no_ratings_received": "No ratings received yet",
    "average_rating_surveys": "Average rating across all surveys",
    "no_feedback_received": "No feedback received yet",
    "submitted": "Submitted",
    "positive": "Positive",
    "neutral": "Neutral",
    "view_form": "View Form",
    "share_survey": "Share Survey",
    "rating_distribution": "Rating Distribution",
    "survey_performance": "Survey Performance",
    "submissions": "Submissions",
    "no_analytics_available": "No Analytics Available",
    "no_analytics_description": "Analytics will appear here after you receive feedback",
    "share_survey_description": "Share your survey with customers to start collecting feedback",
    
    // Account Settings
    "account_settings_title": "Account Settings",
    "business_profile": "Business Profile",
    "update_business_info": "Update your business information",
    "business_name_label": "Business Name",
    "business_category": "Business Category",
    "select_business_category": "Select business category",
    "city": "City",
    "select_city": "Select your city",
    "settings_updated": "Settings updated",
    "settings_updated_success": "Your account settings have been updated successfully.",
    "error_updating_settings": "Error updating settings",
    "save_changes": "Save Changes",
    
    // Onboarding
    "welcome_onboarding": "Welcome to Your Feedback Journey",
    "onboarding_description": "Tell us a bit about your business to get started",
    "complete_setup": "Complete Setup",
    
    // Survey Creation
    "survey_title": "Survey Title",
    "survey_description": "Survey Description",
    "add_question": "Add Question",
    "question_text": "Question Text",
    "question_type": "Question Type",
    "options": "Options",
    "add_option": "Add Option",
    "remove_option": "Remove",
    "rating_question": "Rating Question",
    "multiple_choice": "Multiple Choice",
    "text_question": "Text Question",
    "preview": "Preview",
    "save_survey": "Save Survey",
    "google_maps_url": "Google Maps URL",
    "google_maps_description": "Enter the URL to your Google Maps listing",
    "redirect_settings": "Redirect Settings",
    "minimum_rating": "Minimum Rating for Redirect",
    
    // Survey View
    "please_share_feedback": "Please share your feedback with us",
    "enter_response": "Enter your response here...",
    "submit_feedback": "Submit Feedback",
    "submitting": "Submitting...",
    "thank_you": "Thank You!",
    "feedback_submitted": "Your feedback has been submitted successfully.",
    "redirecting_maps": "You will be redirected to Google Maps to leave a review momentarily...",
    "survey_not_found": "Survey Not Found",
    "survey_not_found_description": "The survey you're looking for does not exist or may have been deleted.",
    "go_back": "Go Back",
    "answer_question": "Please answer at least one question",
    
    // Survey Results
    "survey_results": "Survey Results",
    "responses": "Responses",
    "individual_responses": "Individual Responses",
    "summary": "Summary",
    "no_responses": "No Responses Yet",
    "no_responses_description": "This survey hasn't received any responses yet. Share your survey to collect feedback.",
    
    // Survey Share
    "share_your_survey": "Share Your Survey",
    "survey_link": "Survey Link",
    "copy_link": "Copy Link",
    "copied": "Copied!",
    "qr_code": "QR Code",
    "download_qr": "Download QR Code",
    "embed_code": "Embed Code",
    "embed_description": "Copy this code to embed the survey on your website",
    
    // Templates
    "survey_templates": "Survey Templates",
    "templates_description": "Choose a template to quickly create surveys",
    "use_this_template": "Use this Template",
    "preview_template": "Preview Template",
    "customer_satisfaction": "Customer Satisfaction",
    "dining_experience": "Dining Experience",
    "hotel_stay": "Hotel Stay",
    "service_quality": "Service Quality",
    
    // Notifications
    "survey_created": "Survey created successfully",
    "survey_updated": "Survey updated successfully",
    "question_added": "Question added successfully",
    "changes_saved": "Changes saved successfully",
    "link_copied": "Link copied to clipboard",
    "qr_downloaded": "QR code downloaded",
    "logged_in": "Logged in successfully",
    "account_created": "Account created! Please check your email to confirm your registration.",
    "onboarding_completed": "Onboarding completed!",
    "survey_deleted": "Survey and all related data have been deleted successfully",
    "thank_you_feedback": "Thank you for your feedback!",
    "redirecting_google_maps": "You'll be redirected to Google Maps to leave a review in a moment!",
  },
  
  el: {
    // Common
    "back": "Πίσω",
    "submit": "Υποβολή",
    "save": "Αποθήκευση",
    "cancel": "Ακύρωση",
    "delete": "Διαγραφή",
    "loading": "Φόρτωση...",
    "saving": "Αποθήκευση...",
    "language": "Γλώσσα",
    "english": "Αγγλικά",
    "greek": "Ελληνικά",
    "error": "Σφάλμα",
    "success": "Επιτυχία",
    "yes": "Ναι",
    "no": "Όχι",
    
    // Auth
    "login": "Σύνδεση",
    "signup": "Εγγραφή",
    "logout": "Αποσύνδεση",
    "email": "Email",
    "password": "Κωδικός",
    "business_name": "Όνομα Επιχείρησης",
    "login_title": "Συνδεθείτε στον λογαριασμό σας",
    "signup_title": "Δημιουργήστε νέο λογαριασμό",
    "login_subtitle": "Εισάγετε τα στοιχεία σας για να αποκτήσετε πρόσβαση",
    "signup_subtitle": "Εγγραφείτε για να ξεκινήσετε τη δημιουργία ερευνών",
    "logging_in": "Σύνδεση...",
    "creating_account": "Δημιουργία λογαριασμού...",
    
    // Dashboard
    "welcome": "Καλωσήρθατε",
    "dashboard": "Πίνακας Ελέγχου",
    "overview": "Επισκόπηση",
    "surveys": "Έρευνες",
    "analytics": "Αναλύσεις",
    "account_settings": "Ρυθμίσεις Λογαριασμού",
    "create_survey": "Δημιουργία Έρευνας",
    "use_template": "Χρήση Προτύπου",
    "templates": "Πρότυπα",
    "total_surveys": "Συνολικές Έρευνες",
    "total_responses": "Συνολικές Απαντήσεις",
    "average_rating": "Μέση Βαθμολογία",
    "recent_feedback": "Πρόσφατα Σχόλια",
    "view_details": "Προβολή λεπτομερειών",
    "view_all_analytics": "Προβολή Όλων των Αναλύσεων",
    "no_surveys_created": "Δεν έχουν δημιουργηθεί έρευνες ακόμα",
    "no_surveys_created_description": "Δημιουργήστε την πρώτη σας έρευνα ή χρησιμοποιήστε ένα πρότυπο",
    "no_responses_received": "Δεν έχουν ληφθεί απαντήσεις ακόμα",
    "responses_collected": "Απαντήσεις που συλλέχθηκαν μέχρι σήμερα",
    "no_ratings_received": "Δεν έχουν ληφθεί βαθμολογίες ακόμα",
    "average_rating_surveys": "Μέση βαθμολογία σε όλες τις έρευνες",
    "no_feedback_received": "Δεν έχουν ληφθεί σχόλια ακόμα",
    "submitted": "Υποβλήθηκε",
    "positive": "Θετικό",
    "neutral": "Ουδέτερο",
    "view_form": "Προβολή Φόρμας",
    "share_survey": "Κοινοποίηση Έρευνας",
    "rating_distribution": "Κατανομή Βαθμολογίας",
    "survey_performance": "Απόδοση Έρευνας",
    "submissions": "Υποβολές",
    "no_analytics_available": "Δεν υπάρχουν διαθέσιμες αναλύσεις",
    "no_analytics_description": "Οι αναλύσεις θα εμφανιστούν εδώ μετά τη λήψη σχολίων",
    "share_survey_description": "Κοινοποιήστε την έρευνά σας στους πελάτες για να ξεκινήσετε τη συλλογή σχολίων",
    
    // Account Settings
    "account_settings_title": "Ρυθμίσεις Λογαριασμού",
    "business_profile": "Προφίλ Επιχείρησης",
    "update_business_info": "Ενημερώστε τις πληροφορίες της επιχείρησής σας",
    "business_name_label": "Όνομα Επιχείρησης",
    "business_category": "Κατηγορία Επιχείρησης",
    "select_business_category": "Επιλέξτε κατηγορία επιχείρησης",
    "city": "Πόλη",
    "select_city": "Επιλέξτε την πόλη σας",
    "settings_updated": "Οι ρυθμίσεις ενημερώθηκαν",
    "settings_updated_success": "Οι ρυθμίσεις του λογαριασμού σας ενημερώθηκαν με επιτυχία.",
    "error_updating_settings": "Σφάλμα ενημέρωσης ρυθμίσεων",
    "save_changes": "Αποθήκευση Αλλαγών",
    
    // Onboarding
    "welcome_onboarding": "Καλώς ήρθατε στο Ταξίδι Ανατροφοδότησης",
    "onboarding_description": "Πείτε μας λίγα πράγματα για την επιχείρησή σας για να ξεκινήσετε",
    "complete_setup": "Ολοκλήρωση Ρύθμισης",
    
    // Survey Creation
    "survey_title": "Τίτλος Έρευνας",
    "survey_description": "Περιγραφή Έρευνας",
    "add_question": "Προσθήκη Ερώτησης",
    "question_text": "Κείμενο Ερώτησης",
    "question_type": "Τύπος Ερώτησης",
    "options": "Επιλογές",
    "add_option": "Προσθήκη Επιλογής",
    "remove_option": "Αφαίρεση",
    "rating_question": "Ερώτηση Βαθμολογίας",
    "multiple_choice": "Πολλαπλής Επιλογής",
    "text_question": "Ερώτηση Κειμένου",
    "preview": "Προεπισκόπηση",
    "save_survey": "Αποθήκευση Έρευνας",
    "google_maps_url": "URL Google Maps",
    "google_maps_description": "Εισάγετε το URL της καταχώρισής σας στο Google Maps",
    "redirect_settings": "Ρυθμίσεις Ανακατεύθυνσης",
    "minimum_rating": "Ελάχιστη Βαθμολογία για Ανακατεύθυνση",
    
    // Survey View
    "please_share_feedback": "Παρακαλούμε μοιραστείτε τα σχόλιά σας μαζί μας",
    "enter_response": "Εισάγετε την απάντησή σας εδώ...",
    "submit_feedback": "Υποβολή Σχολίων",
    "submitting": "Υποβολή...",
    "thank_you": "Ευχαριστούμε!",
    "feedback_submitted": "Τα σχόλιά σας υποβλήθηκαν με επιτυχία.",
    "redirecting_maps": "Θα ανακατευθυνθείτε στο Google Maps για να αφήσετε μια κριτική σε λίγο...",
    "survey_not_found": "Η Έρευνα δεν Βρέθηκε",
    "survey_not_found_description": "Η έρευνα που αναζητάτε δεν υπάρχει ή ενδέχεται να έχει διαγραφεί.",
    "go_back": "Επιστροφή",
    "answer_question": "Παρακαλώ απαντήστε τουλάχιστον σε μία ερώτηση",
    
    // Survey Results
    "survey_results": "Αποτελέσματα Έρευνας",
    "responses": "Απαντήσεις",
    "individual_responses": "Μεμονωμένες Απαντήσεις",
    "summary": "Περίληψη",
    "no_responses": "Δεν Υπάρχουν Απαντήσεις Ακόμα",
    "no_responses_description": "Αυτή η έρευνα δεν έχει λάβει απαντήσεις ακόμα. Κοινοποιήστε την έρευνά σας για να συλλέξετε σχόλια.",
    
    // Survey Share
    "share_your_survey": "Κοινοποιήστε την Έρευνά σας",
    "survey_link": "Σύνδεσμος Έρευνας",
    "copy_link": "Αντιγραφή Συνδέσμου",
    "copied": "Αντιγράφηκε!",
    "qr_code": "Κωδικός QR",
    "download_qr": "Λήψη Κωδικού QR",
    "embed_code": "Κώδικας Ενσωμάτωσης",
    "embed_description": "Αντιγράψτε αυτόν τον κώδικα για να ενσωματώσετε την έρευνα στον ιστότοπό σας",
    
    // Templates
    "survey_templates": "Πρότυπα Έρευνας",
    "templates_description": "Επιλέξτε ένα πρότυπο για να δημιουργήσετε γρήγορα έρευνες",
    "use_this_template": "Χρήση αυτού του Προτύπου",
    "preview_template": "Προεπισκόπηση Προτύπου",
    "customer_satisfaction": "Ικανοποίηση Πελατών",
    "dining_experience": "Εμπειρία Εστίασης",
    "hotel_stay": "Διαμονή σε Ξενοδοχείο",
    "service_quality": "Ποιότητα Υπηρεσιών",
    
    // Notifications
    "survey_created": "Η έρευνα δημιουργήθηκε με επιτυχία",
    "survey_updated": "Η έρευνα ενημερώθηκε με επιτυχία",
    "question_added": "Η ερώτηση προστέθηκε με επιτυχία",
    "changes_saved": "Οι αλλαγές αποθηκεύτηκαν με επιτυχία",
    "link_copied": "Ο σύνδεσμος αντιγράφηκε στο πρόχειρο",
    "qr_downloaded": "Ο κωδικός QR κατέβηκε",
    "logged_in": "Συνδεθήκατε με επιτυχία",
    "account_created": "Ο λογαριασμός δημιουργήθηκε! Παρακαλώ ελέγξτε το email σας για να επιβεβαιώσετε την εγγραφή σας.",
    "onboarding_completed": "Η ρύθμιση ολοκληρώθηκε!",
    "survey_deleted": "Η έρευνα και όλα τα σχετικά δεδομένα έχουν διαγραφεί με επιτυχία",
    "thank_you_feedback": "Ευχαριστούμε για τα σχόλιά σας!",
    "redirecting_google_maps": "Θα ανακατευθυνθείτε στο Google Maps για να αφήσετε μια κριτική σε λίγο!",
  }
};
