import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Rating } from "@/components/ui/rating";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { saveFeedbackItem } from "@/lib/feedback";
import { CheckCircle2 } from "lucide-react";

const feedbackFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  category: z.string().min(1, { message: "Please select a category" }),
  rating: z.number().min(1, { message: "Please provide a rating" }).max(5),
  comments: z.string().min(5, { message: "Comments must be at least 5 characters" }),
  recommend: z.string().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export default function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      rating: 0,
      comments: "",
      recommend: "",
    },
  });
  
  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      saveFeedbackItem(data);
      setSubmitted(true);
      form.reset();
      
      toast({
        title: "Success!",
        description: "Your feedback has been submitted.",
        variant: "default",
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your feedback.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-neutral-dark">Share Your Feedback</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Category Selection */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback Category *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="service">Customer Service</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating *</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Rating
                      value={field.value}
                      onChange={field.onChange}
                      className="text-2xl"
                    />
                  </FormControl>
                  <span className="ml-3 text-sm text-neutral-dark">
                    {field.value > 0 
                      ? `${field.value} Star${field.value !== 1 ? 's' : ''}` 
                      : 'No rating selected'}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Comments */}
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comments *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please share your thoughts..." 
                    rows={4} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Would Recommend */}
          <FormField
            control={form.control}
            name="recommend"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Would you recommend us to others?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="recommend-yes" />
                      <label htmlFor="recommend-yes" className="text-sm font-medium">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="recommend-no" />
                      <label htmlFor="recommend-no" className="text-sm font-medium">
                        No
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maybe" id="recommend-maybe" />
                      <label htmlFor="recommend-maybe" className="text-sm font-medium">
                        Maybe
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Submit Button */}
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Submit Feedback
          </Button>
          
          {/* Success Message */}
          {submitted && (
            <Alert className="bg-green-100 text-status-success border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Thank you for your feedback! Your submission has been saved.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </Form>
    </div>
  );
}
