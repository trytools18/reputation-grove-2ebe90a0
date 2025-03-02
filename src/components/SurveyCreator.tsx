
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, GripVertical, Move, Laptop, Smartphone, AlignLeft, CheckSquare, Circle, ListOrdered, Edit2 } from "lucide-react"

// Question types
const QUESTION_TYPES = [
  { id: "multiplechoice", label: "Multiple Choice", icon: <CheckSquare className="h-4 w-4" /> },
  { id: "rating", label: "Rating", icon: <ListOrdered className="h-4 w-4" /> },
  { id: "text", label: "Text Response", icon: <AlignLeft className="h-4 w-4" /> }
]

interface Question {
  id: string
  type: string
  title: string
  required: boolean
  options?: string[]
  maxRating?: number
}

const SurveyCreator = () => {
  const [surveyTitle, setSurveyTitle] = useState("Customer Satisfaction Survey")
  const [surveyDescription, setSurveyDescription] = useState("Please share your feedback about your recent experience at our restaurant.")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      type: "rating",
      title: "How would you rate your overall experience?",
      required: true,
      maxRating: 5
    },
    {
      id: "q2",
      type: "multiplechoice",
      title: "What did you enjoy most about your visit?",
      required: false,
      options: ["Food quality", "Service", "Ambiance", "Value for money", "Other"]
    },
    {
      id: "q3",
      type: "text",
      title: "Do you have any additional comments or suggestions?",
      required: false
    }
  ])
  const [activeTab, setActiveTab] = useState("design")
  const [previewDevice, setPreviewDevice] = useState("desktop")
  const [redirectThreshold, setRedirectThreshold] = useState(4)

  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      type,
      title: type === "rating" 
        ? "How would you rate..." 
        : type === "multiplechoice" 
          ? "Select all that apply..." 
          : "Any additional comments?",
      required: false
    }
    
    if (type === "rating") {
      newQuestion.maxRating = 5
    }
    
    if (type === "multiplechoice") {
      newQuestion.options = ["Option 1", "Option 2", "Option 3"]
    }
    
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Create Survey</h2>
            <p className="text-foreground/70">
              Design and customize your feedback survey
            </p>
          </div>
          <div className="flex space-x-4">
            <TabsList>
              <TabsTrigger value="design" className="flex items-center gap-1">
                <Edit2 className="h-4 w-4" />
                <span>Design</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Move className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Laptop className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>
            <Button>Save Survey</Button>
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
                <Input 
                  id="title" 
                  value={surveyTitle} 
                  onChange={(e) => setSurveyTitle(e.target.value)} 
                  className="max-w-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Survey Description</Label>
                <Textarea 
                  id="description" 
                  value={surveyDescription} 
                  onChange={(e) => setSurveyDescription(e.target.value)}
                  className="max-w-lg"
                  rows={3}
                />
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
                <Select onValueChange={(value) => addQuestion(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Add question" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {type.icon}
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {questions.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg text-foreground/60">
                  <p className="mb-2">No questions added yet</p>
                  <Button variant="outline" onClick={() => addQuestion("rating")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first question
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-5 w-5 text-foreground/30 cursor-move" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {question.type === "rating" && <ListOrdered className="h-4 w-4 text-primary" />}
                              {question.type === "multiplechoice" && <CheckSquare className="h-4 w-4 text-primary" />}
                              {question.type === "text" && <AlignLeft className="h-4 w-4 text-primary" />}
                              <span className="text-xs text-foreground/60">
                                {question.type === "rating" ? "Rating" : 
                                 question.type === "multiplechoice" ? "Multiple Choice" : "Text Response"}
                              </span>
                            </div>
                            <Input 
                              value={question.title} 
                              onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                              className="font-medium"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuestion(question.id, { required: !question.required })}
                          >
                            {question.required ? "Required" : "Optional"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      {question.type === "multiplechoice" && (
                        <div className="pl-8 space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <Circle className="h-4 w-4 text-foreground/30" />
                              <Input 
                                value={option} 
                                onChange={(e) => {
                                  const newOptions = [...(question.options || [])]
                                  newOptions[optIndex] = e.target.value
                                  updateQuestion(question.id, { options: newOptions })
                                }}
                                className="max-w-md"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newOptions = question.options?.filter((_, i) => i !== optIndex)
                                  updateQuestion(question.id, { options: newOptions })
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-6"
                            onClick={() => {
                              const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`]
                              updateQuestion(question.id, { options: newOptions })
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add option
                          </Button>
                        </div>
                      )}

                      {question.type === "rating" && (
                        <div className="pl-8 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Max rating:</span>
                            <Select 
                              defaultValue={question.maxRating?.toString() || "5"}
                              onValueChange={(value) => updateQuestion(question.id, { maxRating: parseInt(value) })}
                            >
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
                            {Array.from({ length: question.maxRating || 5 }).map((_, i) => (
                              <div 
                                key={i} 
                                className="w-8 h-8 rounded-full border bg-muted flex items-center justify-center text-sm"
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {question.type === "text" && (
                        <div className="pl-8">
                          <div className="border border-dashed rounded p-3 bg-muted/50 max-w-md">
                            <div className="text-xs text-foreground/60 italic">Text input field will appear here</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                      <Select 
                        value={redirectThreshold.toString()} 
                        onValueChange={(value) => setRedirectThreshold(parseInt(value))}
                      >
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
                    <Label htmlFor="google-url" className="block mb-2">Google Maps URL</Label>
                    <Input 
                      id="google-url" 
                      placeholder="https://g.page/your-restaurant/review" 
                      className="w-full"
                    />
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
              <Button 
                variant={previewDevice === "desktop" ? "secondary" : "ghost"} 
                size="sm" 
                className="rounded-full"
                onClick={() => setPreviewDevice("desktop")}
              >
                <Laptop className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button 
                variant={previewDevice === "mobile" ? "secondary" : "ghost"} 
                size="sm" 
                className="rounded-full"
                onClick={() => setPreviewDevice("mobile")}
              >
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
                  {questions.map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <h4 className="font-medium">
                        {question.title}
                        {question.required && <span className="text-red-500">*</span>}
                      </h4>

                      {question.type === "rating" && (
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: question.maxRating || 5 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-12 h-12 rounded-full border hover:bg-primary hover:text-white transition-colors cursor-pointer flex items-center justify-center font-medium"
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === "multiplechoice" && (
                        <div className="space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <div className="h-5 w-5 rounded border flex-shrink-0" />
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === "text" && (
                        <Textarea className="resize-none" rows={4} placeholder="Enter your response here..." />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-4 border-t">
                  <Button className="w-full sm:w-auto">Submit Feedback</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SurveyCreator
