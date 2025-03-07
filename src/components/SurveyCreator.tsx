import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Move, Laptop, Smartphone, AlignLeft, CheckSquare, Circle, ListOrdered, Edit2, Save, ArrowLeft } from "lucide-react";
import { supabase, QUESTION_TYPES, FRONTEND_TO_DB_TYPE, DB_TO_FRONTEND_TYPE } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@/lib/auth";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useLanguage } from "@/lib/languageContext";

const QUESTION_TYPE_UI = [{
  id: "rating",
  label: "Rating",
  icon: <ListOrdered className="h-4 w-4" />
}, {
  id: "multiplechoice",
  label: "Multiple Choice",
  icon: <CheckSquare className="h-4 w-4" />
}, {
  id: "text",
  label: "Text Response",
  icon: <AlignLeft className="h-4 w-4" />
}];

interface Question {
  id: string;
  type: string;
  title: string;
  required: boolean;
  options?: string[];
  maxRating?: number;
}

const SurveyCreator = () => {
  const {
    t
  } = useLanguage();
  const [surveyTitle, setSurveyTitle] = useState("Customer Satisfaction Survey");
  const [surveyDescription, setSurveyDescription] = useState("Please share your feedback about your recent experience at our restaurant.");
  const [questions, setQuestions] = useState<Question[]>([{
    id: "q1",
    type: "rating",
    title: "How would you rate your overall experience?",
    required: true,
    maxRating: 5
  }, {
    id: "q2",
    type: "multiplechoice",
    title: "What did you enjoy most about your visit?",
    required: false,
    options: ["Food quality", "Service", "Ambiance", "Value for money", "Other"]
  }, {
    id: "q3",
    type: "text",
    title: "Do you have any additional comments or suggestions?",
    required: false
  }]);
  const [activeTab, setActiveTab] = useState("design");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [redirectThreshold, setRedirectThreshold] = useState(4);
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showGoogleMapsError, setShowGoogleMapsError] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    user
  } = useSession();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    if (id) {
      setFormId(id);
      setIsEditing(true);
      fetchSurveyData(id);
    }
  }, [location]);

  const fetchSurveyData = async (id: string) => {
    if (!user) return;
    try {
      const {
        data: formData,
        error: formError
      } = await supabase.from('forms').select('*').eq('id', id).eq('user_id', user.id).single();
      if (formError) throw formError;
      setSurveyTitle(formData.restaurant_name);
      setGoogleMapsUrl(formData.google_maps_url);
      setRedirectThreshold(formData.minimum_positive_rating);
      const {
        data: questionsData,
        error: questionsError
      } = await supabase.from('questions').select('*').eq('form_id', id).order('order', {
        ascending: true
      });
      if (questionsError) throw questionsError;
      if (questionsData) {
        const transformedQuestions: Question[] = questionsData.map(q => {
          const frontendType = DB_TO_FRONTEND_TYPE[q.type] || q.type;
          return {
            id: q.id,
            type: frontendType,
            title: q.text,
            required: false,
            options: q.type === QUESTION_TYPES.MULTIPLE_CHOICE ? q.options : undefined,
            maxRating: q.type === QUESTION_TYPES.RATING ? 5 : undefined
          };
        });
        setQuestions(transformedQuestions);
      }
    } catch (error: any) {
      console.error("Error fetching survey data:", error);
      toast({
        title: "Error loading survey",
        description: error.message || "Could not load the survey data",
        variant: "destructive"
      });
    }
  };

  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      type,
      title: type === "rating" ? "How would you rate..." : type === "multiplechoice" ? "Select all that apply..." : "Any additional comments?",
      required: false
    };
    if (type === "rating") {
      newQuestion.maxRating = 5;
    }
    if (type === "multiplechoice") {
      newQuestion.options = ["Option 1", "Option 2", "Option 3"];
    }
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? {
      ...q,
      ...updates
    } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const reorderedQuestions = reorderQuestions(questions, result.source.index, result.destination.index);
    setQuestions(reorderedQuestions);
  };

  const reorderQuestions = (list: Question[], startIndex: number, endIndex: number): Question[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const saveSurvey = async () => {
    if (!user) {
      toast({
        title: t('common.error'),
        description: "Please sign in to save your survey",
        variant: "destructive"
      });
      return;
    }
    if (!surveyTitle.trim()) {
      toast({
        title: t('common.error'),
        description: t('survey.surveyTitle') + " " + t('common.required'),
        variant: "destructive"
      });
      return;
    }
    if (!googleMapsUrl.trim()) {
      setShowGoogleMapsError(true);
      toast({
        title: t('survey.googleUrlRequired'),
        description: t('survey.googleUrlRequired'),
        variant: "destructive"
      });
      setActiveTab("settings");
      return;
    }
    setIsSaving(true);
    try {
      let formData: any;
      if (isEditing && formId) {
        const {
          data,
          error: formError
        } = await supabase.from('forms').update({
          restaurant_name: surveyTitle,
          google_maps_url: googleMapsUrl,
          minimum_positive_rating: redirectThreshold
        }).eq('id', formId).select().single();
        if (formError) throw formError;
        formData = data;
        const {
          error: deleteError
        } = await supabase.from('questions').delete().eq('form_id', formId);
        if (deleteError) throw deleteError;
      } else {
        const {
          data,
          error: formError
        } = await supabase.from('forms').insert({
          restaurant_name: surveyTitle,
          google_maps_url: googleMapsUrl,
          minimum_positive_rating: redirectThreshold,
          user_id: user.id
        }).select().single();
        if (formError) throw formError;
        formData = data;
        setFormId(data.id);
      }
      const questionsToInsert = questions.map((question, index) => {
        const dbType = FRONTEND_TO_DB_TYPE[question.type] || question.type;
        return {
          form_id: formData.id,
          text: question.title,
          type: dbType,
          options: question.type === 'multiplechoice' ? question.options : null,
          order: index
        };
      });
      console.log('Questions to insert:', questionsToInsert);
      const {
        data: insertedQuestions,
        error: questionsError
      } = await supabase.from('questions').insert(questionsToInsert).select();
      if (questionsError) {
        console.error("Error inserting questions:", questionsError);
        throw questionsError;
      }
      console.log('Inserted questions response:', insertedQuestions);
      toast({
        title: isEditing ? "Survey updated" : "Survey saved",
        description: isEditing ? "Your survey has been updated successfully" : "Your survey has been saved successfully"
      });
      navigate(`/survey/${formData.id}/share`);
    } catch (error: any) {
      console.error("Error saving survey:", error);
      toast({
        title: "Error saving survey",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return <div className="container mx-auto px-6 py-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex flex-col gap-1 mb-1">
              <h2 className="text-2xl font-bold">{isEditing ? t('survey.edit') : t('survey.create')}</h2>
              <p className="text-foreground/70">
                Design and customize your feedback survey
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <TabsList>
              <TabsTrigger value="design" className="flex items-center gap-1">
                <Edit2 className="h-4 w-4" />
                <span>{t('survey.design')}</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Move className="h-4 w-4" />
                <span>{t('survey.settings')}</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Laptop className="h-4 w-4" />
                <span>{t('survey.preview')}</span>
              </TabsTrigger>
            </TabsList>
            <Button onClick={saveSurvey} disabled={isSaving} className="flex items-center gap-1" variant="success">
              {isSaving ? <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>{t('survey.saving')}</span>
                </> : <>
                  <Save className="h-4 w-4" />
                  <span>{t('survey.saveSurvey')}</span>
                </>}
            </Button>
          </div>
        </div>

        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Survey Information</CardTitle>
              <CardDescription>Set the title and description for your survey.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Survey Title</Label>
                <Input id="title" value={surveyTitle} onChange={e => setSurveyTitle(e.target.value)} className="max-w-lg" placeholder="Enter your restaurant name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Survey Description</Label>
                <Textarea id="description" value={surveyDescription} onChange={e => setSurveyDescription(e.target.value)} className="max-w-lg" rows={3} placeholder="Tell customers what this survey is about" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Add and customize your survey questions.</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Select onValueChange={value => addQuestion(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Add question" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPE_UI.map(type => <SelectItem key={type.id} value={type.id} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {type.icon}
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {questions.length === 0 ? <div className="text-center py-12 border-2 border-dashed rounded-lg text-foreground/60">
                  <p className="mb-2">No questions added yet</p>
                  <Button variant="outline" onClick={() => addQuestion("rating")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first question
                  </Button>
                </div> : <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="questions">
                    {provided => <div className="space-y-4" ref={provided.innerRef} {...provided.droppableProps}>
                        {questions.map((question, index) => <Draggable key={question.id} draggableId={question.id} index={index}>
                            {(provided, snapshot) => <div ref={provided.innerRef} {...provided.draggableProps} className={`border rounded-lg p-4 hover:shadow-sm transition-shadow ${snapshot.isDragging ? "shadow-lg border-primary/30 bg-primary/5" : ""}`}>
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div {...provided.dragHandleProps} className="cursor-move hover:text-primary transition-colors">
                                      <GripVertical className="h-5 w-5 text-foreground/50" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        {question.type === "rating" && <ListOrdered className="h-4 w-4 text-primary" />}
                                        {question.type === "multiplechoice" && <CheckSquare className="h-4 w-4 text-primary" />}
                                        {question.type === "text" && <AlignLeft className="h-4 w-4 text-primary" />}
                                        <span className="text-xs text-foreground/60">
                                          {question.type === "rating" ? "Rating" : question.type === "multiplechoice" ? "Multiple Choice" : "Text Response"}
                                        </span>
                                      </div>
                                      <Input value={question.title} onChange={e => updateQuestion(question.id, {
                              title: e.target.value
                            })} className="font-medium" />
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => updateQuestion(question.id, {
                            required: !question.required
                          })}>
                                      {question.required ? "Required" : "Optional"}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)}>
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>

                                {question.type === "multiplechoice" && <div className="pl-8 space-y-2">
                                    {question.options?.map((option, optIndex) => <div key={optIndex} className="flex items-center gap-2">
                                        <Circle className="h-4 w-4 text-foreground/30" />
                                        <Input value={option} onChange={e => {
                            const newOptions = [...(question.options || [])];
                            newOptions[optIndex] = e.target.value;
                            updateQuestion(question.id, {
                              options: newOptions
                            });
                          }} className="max-w-md" />
                                        <Button variant="ghost" size="sm" onClick={() => {
                            const newOptions = question.options?.filter((_, i) => i !== optIndex);
                            updateQuestion(question.id, {
                              options: newOptions
                            });
                          }}>
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>)}
                                    <Button variant="ghost" size="sm" className="ml-6" onClick={() => {
                          const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
                          updateQuestion(question.id, {
                            options: newOptions
                          });
                        }}>
                                      <Plus className="h-3 w-3 mr-1" /> Add option
                                    </Button>
                                  </div>}

                                {question.type === "rating" && <div className="pl-8 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm">Max rating:</span>
                                      <Select defaultValue={question.maxRating?.toString() || "5"} onValueChange={value => updateQuestion(question.id, {
                            maxRating: parseInt(value)
                          })}>
                                        <SelectTrigger className="w-20">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="3">3</SelectItem>
                                          <SelectItem value="5">5</SelectItem>
                                          <SelectItem value="10">10</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {Array.from({
                            length: question.maxRating || 5
                          }).map((_, i) => <div key={i} className="w-8 h-8 rounded-full border bg-muted flex items-center justify-center text-sm">
                                          {i + 1}
                                        </div>)}
                                    </div>
                                  </div>}

                                {question.type === "text" && <div className="pl-8">
                                    <div className="border border-dashed rounded p-3 bg-muted/50 max-w-md">
                                      <div className="text-xs text-foreground/60 italic">Text input field will appear here</div>
                                    </div>
                                  </div>}
                              </div>}
                          </Draggable>)}
                        {provided.placeholder}
                      </div>}
                  </Droppable>
                </DragDropContext>}
            </CardContent>
            <CardFooter className="flex justify-center border-t bg-muted/30 p-4">
              <Button variant="outline" onClick={() => addQuestion("rating")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Survey Settings</CardTitle>
              <CardDescription>Configure how your survey behaves and processes feedback.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="max-w-md">
                <h3 className="text-lg font-medium mb-4">Review Redirection</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="threshold" className="block mb-2">
                      Redirect customers to Google Maps when average rating is at least:
                    </Label>
                    <div className="flex items-center gap-3">
                      <Select value={redirectThreshold.toString()} onValueChange={value => setRedirectThreshold(parseInt(value))}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                      <span>stars (out of 5)</span>
                    </div>
                    <p className="text-sm text-foreground/60 mt-2">
                      Customers who give you a rating of {redirectThreshold} or higher will be invited to leave a Google review.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="google-url" className="block mb-2">
                      Google Maps URL
                      {showGoogleMapsError && <span className="ml-2 text-sm text-destructive">*Required</span>}
                    </Label>
                    <Input id="google-url" placeholder="https://g.page/your-restaurant/review" className={`w-full ${showGoogleMapsError ? "border-destructive focus-visible:ring-destructive" : ""}`} value={googleMapsUrl} onChange={e => {
                    setGoogleMapsUrl(e.target.value);
                    if (e.target.value.trim()) {
                      setShowGoogleMapsError(false);
                    }
                  }} />
                    <p className="text-sm text-foreground/60 mt-2">
                      Enter your Google Maps review URL. This is where customers will be redirected.
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-md">
                <h3 className="text-lg font-medium mb-4">Response Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="block">Anonymous Responses</Label>
                      <p className="text-sm text-foreground/60">
                        Collect feedback without identifying information
                      </p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                      <span className="absolute h-4 w-4 rounded-full bg-white translate-x-6 transition"></span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <div className="flex justify-end mb-4">
            <div className="bg-white border rounded-full p-1 flex items-center space-x-1">
              <Button variant={previewDevice === "desktop" ? "secondary" : "ghost"} size="sm" className="rounded-full" onClick={() => setPreviewDevice("desktop")}>
                <Laptop className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button variant={previewDevice === "mobile" ? "secondary" : "ghost"} size="sm" className="rounded-full" onClick={() => setPreviewDevice("mobile")}>
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className={`
              glass-panel rounded-xl overflow-hidden transition-all duration-300
              ${previewDevice === "desktop" ? "w-[800px]" : "w-[375px]"}
            `}>
              <div className="p-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{surveyTitle}</h3>
                  <p className="text-foreground/70">{surveyDescription}</p>
                </div>

                <div className="space-y-8">
                  {questions.map((question, index) => <div key={question.id} className="space-y-3">
                      <h4 className="font-medium">
                        {question.title}
                        {question.required && <span className="text-red-500">*</span>}
                      </h4>

                      {question.type === "rating" && <div className="flex flex-wrap gap-2">
                          {Array.from({
                      length: question.maxRating || 5
                    }).map((_, i) => <div key={i} className="w-12 h-12 rounded-full border hover:bg-primary hover:text-white transition-colors cursor-pointer flex items-center justify-center font-medium">
                              {i + 1}
                            </div>)}
                        </div>}

                      {question.type === "multiplechoice" && <div className="space-y-2">
                          {question.options?.map((option, optIndex) => <div key={optIndex} className="flex items-center space-x-2">
                              <div className="h-5 w-5 rounded border flex-shrink-0" />
                              <span>{option}</span>
                            </div>)}
                        </div>}

                      {question.type === "text" && <Textarea className="resize-none" rows={4} placeholder="Enter your response here..." />}
                    </div>)}
                </div>

                <div className="mt-8 pt-4 border-t">
                  <Button className="w-full sm:w-auto">Submit Feedback</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};

export default SurveyCreator;
