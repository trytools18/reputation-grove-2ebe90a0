
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Chip } from "./ui/chip"
import { ArrowRight, Star } from "lucide-react"
import { useLanguage } from '@/lib/languageContext'

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative pt-28 pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-[20%] -left-[5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Chip 
            variant="outline" 
            className={`mb-6 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
          >
            {t('home.transformFeedback')}
          </Chip>

          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-6'}`}
          >
            {t('home.elevateReputation')}
          </h1>

          <p 
            className={`text-lg text-foreground/80 mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
          >
            {t('home.feedbackDesc')}
          </p>

          <div className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <Button size="lg" className="rounded-full px-6 group">
              {t('home.getStartedToday')}
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-6">
              {t('home.viewDemo')}
            </Button>
          </div>

          <div className={`flex items-center space-x-4 mb-16 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-12'}`}>
            <div className="flex -space-x-2">
              {/* Happy people avatars */}
              <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c21pbGluZyUyMGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=100&q=60" 
                  alt="Happy customer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c21pbGluZyUyMGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=100&q=60" 
                  alt="Happy customer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c21pbGluZyUyMGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=100&q=60" 
                  alt="Happy customer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8c21pbGluZyUyMGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=100&q=60" 
                  alt="Happy customer" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-sm text-foreground/80">
              <span className="font-medium">4.9/5</span> {t('home.fromRestaurants')}
            </p>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className={`relative max-w-4xl mx-auto transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200/50">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />
            <div className="aspect-[16/9] bg-gray-50 flex items-center justify-center">
              <div className="w-full h-full bg-gray-100 p-4">
                <div className="bg-white h-full rounded-lg shadow-sm p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold">{t('home.dashboardOverview')}</h3>
                      <p className="text-sm text-foreground/70">{t('home.last30days')}</p>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-gray-300" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-gray-300" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: t('home.totalReviews'), value: "427" },
                      { label: t('home.avgRating'), value: "4.8" },
                      { label: t('home.conversionRate'), value: "68%" }
                    ].map((stat, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-foreground/70 mb-1">{stat.label}</p>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-3">{t('home.ratingBreakdown')}</h4>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <span className="text-xs w-3">{rating}</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  rating > 3 ? 'bg-green-500' : rating > 1 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%` }}
                              />
                            </div>
                            <span className="text-xs w-8">
                              {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '7%' : rating === 2 ? '2%' : '1%'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-3">{t('home.recentFeedback')}</h4>
                      <div className="space-y-3">
                        {[
                          { rating: 5, text: "Great service and amazing food!" },
                          { rating: 5, text: "Staff was very attentive. Will return." },
                          { rating: 4, text: "Good experience overall. Loved the ambiance." }
                        ].map((feedback, i) => (
                          <div key={i} className="text-xs border-b border-gray-200 pb-2">
                            <div className="flex items-center space-x-1 mb-1">
                              {Array.from({ length: 5 }).map((_, starIndex) => (
                                <Star 
                                  key={starIndex} 
                                  className={`w-3 h-3 ${
                                    starIndex < feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <p className="line-clamp-1">{feedback.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none" />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-10 bg-black/20 blur-xl rounded-full z-[-1]" />
        </div>
      </div>
    </div>
  )
}

export default Hero
