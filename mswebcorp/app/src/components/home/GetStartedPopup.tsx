import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { X, HelpCircle, Upload, Check, ChevronLeft, ChevronRight, Plus, Minus,  Instagram, Facebook, ArrowRight, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, addDays, isBefore, isAfter, startOfDay, addBusinessDays, endOfDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, isEqual } from 'date-fns'
import { cn } from "../../../lib/utils"
import { Slider } from "@/components/ui/slider"
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51Q9eId09lH5Cy2LMShB4mO9TsdE8aIm8DHHrkYUJl5bgccGi2ElBcDnmlEnYWXJW4hf5NV7CfUzAuXD5OI8XlPZH004DwPOshL')

const PaymentForm = ({ formData, totalMonthly, totalOneTime }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create a PaymentMethod
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      })

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Send the PaymentMethod ID and subscription details to your server
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          formData,
          totalMonthly,
          totalOneTime,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An error occurred while processing your payment.');
      }

      console.log('Subscription created:', result.subscription);
      // Handle successful subscription (e.g., show success message, redirect)

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card-element">Credit Card Information</Label>
        <div className="p-3 border rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={!stripe || processing} className="w-full">
        {processing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  )
}

export const GoogleLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
export function GetStartedPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    subscriptionModel: 'base',
    pageCount: '1',
    pageNames: [''],
    hasImages: false,
    socialMediaLinks: [],
    addons: {
      logoCreation: false,
      socialMarketing: false,
      socialMarketingBudget: 100, // Starting at $100
      seoService: false,
      seoBudget: 200, // Starting at $200
      aiChatbot: false
    },
    otherAddons: '',
    deliveryDate: new Date(),
    hasDomain: false,
    currentHost: '',
    currentDomain: ''
  })
  const [errors, setErrors] = useState({})
  const [expeditedFee, setExpeditedFee] = useState(0)
  const [totalMonthly, setTotalMonthly] = useState(0)
  const [totalOneTime, setTotalOneTime] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([])

  useEffect(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end }).filter(day => 
      isSameMonth(day, currentMonth)
    )
    setDaysInMonth(days)
  }, [currentMonth])

  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1))
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handlePageCountChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      pageCount: value,
      pageNames: Array(parseInt(value)).fill('')
    }))
  }

  const handlePageNameChange = (index: number, value: string) => {
    setFormData(prev => {
      const newPageNames = [...prev.pageNames]
      newPageNames[index] = value
      return { ...prev, pageNames: newPageNames }
    })
  }

  const handleAddonChange = (addon: keyof typeof formData.addons) => {
    setFormData(prev => ({
      ...prev,
      addons: { ...prev.addons, [addon]: !prev.addons[addon] }
    }))
  }

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.firstName) newErrors['firstName'] = 'First Name is required'
    if (!formData.lastName) newErrors['lastName'] = 'Last Name is required'
    if (!formData.email) {
      newErrors['email'] = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors['email'] = 'Invalid email address'
    }
    if (!formData.phone) newErrors['phone'] = 'Phone is required'
    if (!formData.companyName) newErrors['companyName'] = 'Company Name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    setStep(prev => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData)
    onClose()
  }

  const calculateTotalPrice = useCallback(() => {
    const basePrice = formData.subscriptionModel === 'base' ? 49.99 : 99.99
    const oneTimeFee = 700.00
    const logoCreationFee = 0 // Complimentary
    const socialMarketingFee = formData.addons.socialMarketing ? formData.addons.socialMarketingBudget : 0
    const seoServiceFee = formData.addons.seoService ? formData.addons.seoBudget : 0
  
    const monthly = basePrice + socialMarketingFee + seoServiceFee
    const oneTime = oneTimeFee + logoCreationFee + expeditedFee

    setTotalMonthly(monthly)
    setTotalOneTime(oneTime)
  }, [formData, expeditedFee])

  useEffect(() => {
    calculateTotalPrice()
  }, [calculateTotalPrice])

  const handleDateSelect = (day: Date) => {
    setFormData(prev => ({ ...prev, deliveryDate: day }))
    if (isTwoDayDelivery(day)) {
      setExpeditedFee(1000.00)  // Correct fee for 2-day delivery
    } else if (isExpeditedDelivery(day)) {
      setExpeditedFee(500.00)   // Correct fee for 2-week expedited delivery
    } else {
      setExpeditedFee(0)        // No fee for standard delivery
    }
  }
  const isDateDisabled = (date: Date) => {
    const twoDaysFromNow = endOfDay(addDays(startOfDay(new Date()), 1))
    return isBefore(date, twoDaysFromNow)
  }

  const isTwoDayDelivery = (date: Date) => {
    const today = startOfDay(new Date());
    const dayAfterTomorrow = addDays(today, 2);
    return isEqual(startOfDay(date), dayAfterTomorrow);
  };

  const isExpeditedDelivery = (date: Date) => {
    const threeDaysFromNow = addDays(new Date(), 2)
    const twoWeeksFromNow = addDays(new Date(), 14)
    return isAfter(date, threeDaysFromNow) && isBefore(date, twoWeeksFromNow)
  }

  const isStandardDelivery = (date: Date) => {
    const twoWeeksFromNow = addDays(new Date(), 14)
    return isAfter(date, twoWeeksFromNow)
  }
  const logoDescription = "Free unique logo for your website"
  const seoDescription = "Improve website visibility and ranking in search results"
  const socialAdsDescription = "Increase brand awareness and engagement through social media ads"
  const OrderSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Services</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{formData.subscriptionModel === 'base' ? 'Base' : 'Premium'} Subscription:</span>
              <span>${formData.subscriptionModel === 'base' ? '49.99' : '99.99'}/month</span>
            </div>
            <div className="flex justify-between">
              <span>One-time Setup Fee:</span>
              <span>$700.00</span>
            </div>
          </div>
        </div>
        {(formData.addons.logoCreation || formData.addons.socialMarketing || formData.addons.seoService || formData.addons.aiChatbot) && (
          <div>
            <h4 className="font-semibold mb-2">Add-ons</h4>
            <div className="space-y-2">
              {formData.addons.logoCreation && (
                <div className="flex justify-between">
                  <span>Logo Creation:</span>
                  <span>FREE</span>
                </div>
              )}
              {formData.addons.socialMarketing && (
                <div className="flex justify-between">
                  <span>Social Marketing:</span>
                  <span>${formData.addons.socialMarketingBudget.toFixed(2)}/month</span>
                </div>
              )}
              {formData.addons.seoService && (
                <div className="flex justify-between">
                  <span>SEO Service:</span>
                  <span>${formData.addons.seoBudget.toFixed(2)}/month</span>
                </div>
              )}
              {formData.addons.aiChatbot && (
                <div className="flex justify-between">
                  <span>AI Chatbot:</span>
                  <span>Call For Pricing</span>
                </div>
              )}
            </div>
          </div>
        )}

        {expeditedFee > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Expedited Delivery</h4>
            <div className="flex justify-between">
              <span>{expeditedFee === 1000 ? 'Two-Day Delivery Fee' : 'Expedited 2-Week Delivery Fee'}:</span>
              <span>${expeditedFee.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold">
            <span>Total Monthly:</span>
            <span>${totalMonthly.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total One-time:</span>
            <span>${totalOneTime.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="sm:w-md mx-auto space-y-6 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
                {errors['firstName'] && <p className="text-red-500 text-sm mt-1">{errors['firstName']}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
                {errors['lastName'] && <p className="text-red-500 text-sm mt-1">{errors['lastName']}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full"
              />
              {errors['email'] && <p className="text-red-500 text-sm mt-1">{errors['email']}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full"
              />
              {errors['phone'] && <p className="text-red-500 text-sm mt-1">{errors['phone']}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full"
              />
              {errors['companyName'] && <p className="text-red-500 text-sm mt-1">{errors['companyName']}</p>}
            </div>
          </div>
        )
    case 2:
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {['base', 'premium'].map((type) => (
            <Card 
              key={type}
              className={`cursor-pointer transition-all duration-300 ${
                formData.subscriptionModel === type 
                  ? 'ring-2 ring-primary bg-primary/10' 
                  : 'hover:bg-secondary/10'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, subscriptionModel: type }))}
            >
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {type === 'base' ? 'Base' : 'Premium'} Subscription
                </h3>
                <p className="text-sm mb-2">
                  ${type === 'base' ? '49.99' : '99.99'}/month + $700.00 one-time fee
                </p>
                <p className="text-sm mb-4 italic">
                  {type === 'base' 
                    ? 'Great for individuals, small projects, small businesses'
                    : 'Great for growing businesses with active social marketing and increasing visitors'}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-2" /> Custom web design
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-2" /> Web development
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-2" /> Free SSL
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-2" /> Ongoing maintenance
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-2" /> Basic modifications
                  </li>
                  <li className="flex items-center font-semibold">
                    <Check className="text-green-500 mr-2" /> 
                    Up to {type === 'base' ? '10,000' : '100,000'} monthly visitors
                  </li>
                  <li className="flex items-center font-semibold">
                    <Check className="text-green-500 mr-2" /> 
                    {type === 'base' ? '50GB' : 'Unlimited'} Storage space
                  </li>
                  <li className="flex items-center font-semibold">
                    <Check className="text-green-500 mr-2" /> 
                    {type === 'base' ? 'Standard' : 'Priority'} customer care
                  </li>
                  <li className="flex items-center font-semibold">
                    <Check className="text-green-500 mr-2" /> 
                    {type === 'base' ? 'Includes' : 'No'} WebStudioMS branding
                  </li>
                  {type === 'premium' && (
                    <li className="mt-4">
    <div className="flex items-start">
      <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" />
      <div>
        <span className="font-semibold">Includes social media marketing</span>
        <div className="flex space-x-2 mt-2 mb-2">
          <Instagram className="w-5 h-5 text-pink-500" />
          <Facebook className="w-5 h-5 text-blue-600" />
          <GoogleLogo className="w-5 h-5" />
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <ArrowRight className="w-4 h-4 mr-2 text-primary" />
            <span>Maintenance and optimization</span>
          </li>
          <li className="flex items-center">
            <ArrowRight className="w-4 h-4 mr-2 text-primary" />
            <span>Review comments & updates</span>
          </li>
          <li className="flex items-center">
            <ArrowRight className="w-4 h-4 mr-2 text-primary" />
            <span>Posts management</span>
          </li>
        </ul>
      </div>
    </div>
  </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pageCount">How many pages do you need?</Label>
                  <Select value={formData.pageCount} onValueChange={handlePageCountChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of pages" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.pageNames.map((name, index) => (
                  <div key={index}>
                    <Label htmlFor={`pageName${index}`}>Page {index + 1} Name</Label>
                    <Input
                      id={`pageName${index}`}
                      value={name}
                      onChange={(e) => handlePageNameChange(index, e.target.value)}
                    />
                  </div>
                ))}
                <div>
                  <Label>Do you have any images that you'd like to use on the site?</Label>
                  <RadioGroup value={formData.hasImages ? 'yes' : 'no'} onValueChange={(value) => setFormData(prev => ({ ...prev, hasImages: value === 'yes' }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="images-yes" />
                      <Label htmlFor="images-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="images-no" />
                      <Label htmlFor="images-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                {formData.hasImages && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Drag and drop or click to upload</p>
                    <input type="file" className="hidden" multiple />
                  </div>
                )}
                <div>
                  <Label>Do you want us to add your social media links to the site?</Label>
                  <RadioGroup 
                    value={formData.socialMediaLinks.length > 0 ? 'yes' : 'no'} 
                    onValueChange={(value) => {
                      if (value === 'yes') {
                        setFormData(prev => ({ ...prev, socialMediaLinks: [''] }))
                      } else {
                        setFormData(prev => ({ ...prev, socialMediaLinks: [] }))
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="social-yes" />
                      <Label htmlFor="social-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="social-no" />
                      <Label htmlFor="social-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                {formData.socialMediaLinks.length > 0 && (
                  <div className="space-y-4 mt-4">
                    {formData.socialMediaLinks.map((link, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder={`Social Media URL ${index + 1}`}
                          value={link}
                          onChange={(e) => {
                            const newLinks = [...formData.socialMediaLinks];
                            newLinks[index] = e.target.value;
                            setFormData(prev => ({ ...prev, socialMediaLinks: newLinks }));
                          }}
                        />
                        <div className="flex space-x-2">
                          {index > 0 && (
                            <Button 
                              type="button" 
                              size="icon"
                              variant="outline"
                              onClick={() => {
                                const newLinks = formData.socialMediaLinks.filter((_, i) => i !== index);
                                setFormData(prev => ({ ...prev, socialMediaLinks: newLinks }));
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                          {index === formData.socialMediaLinks.length - 1 && (
                            <Button 
                              type="button" 
                              size="icon"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  socialMediaLinks: [...prev.socialMediaLinks, '']
                                }));
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <Label>Do you currently own a domain for your website?</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 inline-block ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>A domain is the web address for your site (e.g., www.yourcompany.com)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <RadioGroup value={formData.hasDomain ? 'yes' : 'no'} onValueChange={(value) => setFormData(prev => ({ ...prev, hasDomain: value === 'yes' }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="domain-yes" />
                      <Label htmlFor="domain-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="domain-no" />
                      <Label htmlFor="domain-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                {formData.hasDomain && (
                  <div>
                    <Label htmlFor="currentHost">Current Host</Label>
                    <Input
                      id="currentHost"
                      name="currentHost"
                      value={formData.currentHost}
                      onChange={handleInputChange}
                      placeholder="e.g., GoDaddy"
                    />
                  </div>
                )}
                {formData.hasDomain && (
                  <div>
                    <Label htmlFor="currentDomain">Current Website Link</Label>
                    <Input
                      id="current website link "
                      name="currentDomain"
                      value={formData.currentDomain}
                      onChange={handleInputChange}
                      placeholder="e.g., www.yourcompany.com"
                    />
                  </div>
                )}
                <div>
                  <Label>Additional Add-ons</Label>
                  <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="logoCreation"
                          checked={formData.addons.logoCreation}
                          onCheckedChange={() => handleAddonChange('logoCreation')}
                        />
                        <Label htmlFor="logoCreation">Logo Creation (Complimentary)</Label>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">{logoDescription}</p>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="socialMarketing"
                          checked={formData.addons.socialMarketing}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              addons: {
                                ...prev.addons,
                                socialMarketing: checked as boolean
                              }
                            }))
                          }}
                        />
                        <Label htmlFor="socialMarketing" className="font-medium">Social Media Ads/Promotion</Label>
                        
                      </div>
                      {formData.addons.socialMarketing && (
                        <div className="pl-6 space-y-2">
                          <Slider
                            min={100}
                            max={1000}
                            step={50}
                            value={[formData.addons.socialMarketingBudget]}
                            onValueChange={(value) => {
                              setFormData(prev => ({
                                ...prev,
                                addons: {
                                  ...prev.addons,
                                  socialMarketingBudget: value[0]
                                }
                              }))
                            }}
                          />
                          <p className="text-sm text-muted-foreground">
                            Budget: ${formData.addons.socialMarketingBudget}/month
                          </p>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground pl-6">{socialAdsDescription}</p>

                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="seoService"
                          checked={formData.addons.seoService}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              addons: {
                                ...prev.addons,
                                seoService: checked as boolean
                              }
                            }))
                          }}
                        />
                        <Label htmlFor="seoService" className="font-medium">SEO Service</Label>
                      </div>
                      {formData.addons.seoService && (
                        <div className="pl-6 space-y-2">
                          <Slider
                            min={200}
                            max={2000}
                            step={100}
                            value={[formData.addons.seoBudget]}
                            onValueChange={(value) => {
                              setFormData(prev => ({
                                ...prev,
                                addons: {
                                  ...prev.addons,
                                  seoBudget: value[0]
                                }
                              }))
                            }}
                          />
                          <p className="text-sm text-muted-foreground">
                            Budget: ${formData.addons.seoBudget}/month
                          </p>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground pl-6">{seoDescription}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="aiChatbot"
                          checked={formData.addons.aiChatbot}
                          onCheckedChange={() => handleAddonChange('aiChatbot')}
                        />
                        <Label htmlFor="aiChatbot">AI Chatbot (Call For Pricing)</Label>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="otherAddons">Other Add-ons</Label>
                      <Input
                        id="otherAddons"
                        name="otherAddons"
                        value={formData.otherAddons}
                        onChange={handleInputChange}
                        placeholder="Enter any other add-ons you're interested in"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 lg:self-start">
              <div className="space-y-2">
                <Label className="block font-bold text-left text-md mb-1.5">
                  Delivery Date
                </Label>      
                <div className="flex justify-start">
                  <div className="inline-block"> 
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-3">
                        <button onClick={goToPreviousMonth} className="p-1.5">
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="text-sm font-medium">
                          {format(currentMonth, 'MMMM yyyy')}
                        </div>
                        <button onClick={goToNextMonth} className="p-1.5">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1.5">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                          <div key={day} className="h-7 w-11 flex items-center justify-center text-muted-foreground text-xs">
                            {day}
                          </div>
                        ))}
                        {daysInMonth.map(day => (
                          <button
                            key={day.toString()}
                            onClick={() => handleDateSelect(day)}
                            disabled={isDateDisabled(day)}
                            className={`
                              h-9 w-11 font-normal text-sm
                              flex items-center justify-center
                              ${isDateDisabled(day) ? 'text-muted-foreground opacity-50' : ''}
                              ${formData.deliveryDate && day.getTime() === formData.deliveryDate.getTime() 
                                ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground' 
                                : 'hover:bg-accent hover:text-accent-foreground'}
                              ${isTwoDayDelivery(day) ? 'border-2 border-red-400' : ''}
                              ${isExpeditedDelivery(day) ? 'border-2 border-yellow-400' : ''}
                              ${isStandardDelivery(day) ? 'border-2 border-green-400' : ''}
                            `}
                          >
                            {day.getDate()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center mb-2">
                  <span className="inline-block h-4 w-4 bg-red-400 rounded-full mr-2" />
                  <span className="text-sm text-red-600">Two-Day Delivery</span>
                </div>
                <p className="text-xs text-gray-500 ml-6">$1000.00 additional fee</p>
                
                
                <div className="flex items-center mb-2">
                  <span className="inline-block h-4 w-4 bg-yellow-400 rounded-full mr-2" />
                  <span className="text-sm text-yellow-600">Expedited 2-Week Delivery</span>
                </div>
                <p className="text-xs text-gray-500 ml-6">$500.00 additional fee</p>
                
                <div className="flex items-center mb-2">
                  <span className="inline-block h-4 w-4 bg-green-400 rounded-full mr-2" />
                  <span className="text-sm text-green-600">Standard Delivery</span>
                </div>
                <p className="text-xs text-gray-500 ml-6">No additional fee</p>
              </div>
               {/* Order Summary */}
            <OrderSummary />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise}>
                  <PaymentForm formData={formData} totalMonthly={totalMonthly} totalOneTime={totalOneTime} />
                </Elements>
              </CardContent>
            </Card>
            <OrderSummary />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-h-[90vh] flex flex-col p-6",
          {
            'sm:max-w-[95vw] md:max-w-[80vw] lg:max-w-[1000px]': step === 1,
            'sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[1200px] xl:max-w-[1400px]': step === 2,
            'sm:max-w-[95vw] md:max-w-[80vw] lg:max-w-[1000px]': step === 3
          }
        )}
      >
        <DialogHeader>
          <DialogTitle>Get Started with Your Website</DialogTitle>
          <DialogDescription>Step {step} of 3</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto py-4 custom-scrollbar">
          {renderStep()}
        </div>
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">Secure Payment</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}