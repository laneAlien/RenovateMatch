import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertProjectSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function PostProject() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const form = useForm({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      projectType: "",
      budgetRange: "",
      timeline: "",
      propertyType: "",
      location: "",
      images: [],
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Success",
        description: "Project posted successfully!",
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post project",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post a project",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    createProjectMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to post a project.</p>
            <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-blue-700">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Post Your Renovation Project</h2>
          <p className="mt-4 text-lg text-gray-600">Tell contractors about your project to receive competitive bids</p>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Kitchen Renovation" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kitchen-remodel">Kitchen Remodel</SelectItem>
                          <SelectItem value="bathroom-renovation">Bathroom Renovation</SelectItem>
                          <SelectItem value="basement-finishing">Basement Finishing</SelectItem>
                          <SelectItem value="exterior-roofing">Exterior/Roofing</SelectItem>
                          <SelectItem value="flooring">Flooring</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4} 
                        placeholder="Describe your project in detail..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="budgetRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="$5,000 - $15,000">$5,000 - $15,000</SelectItem>
                          <SelectItem value="$15,000 - $30,000">$15,000 - $30,000</SelectItem>
                          <SelectItem value="$30,000 - $50,000">$30,000 - $50,000</SelectItem>
                          <SelectItem value="$50,000+">$50,000+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeline</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ASAP">ASAP</SelectItem>
                          <SelectItem value="Within 1 month">Within 1 month</SelectItem>
                          <SelectItem value="Within 3 months">Within 3 months</SelectItem>
                          <SelectItem value="Within 6 months">Within 6 months</SelectItem>
                          <SelectItem value="Flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Single Family Home">Single Family Home</SelectItem>
                          <SelectItem value="Condo/Townhome">Condo/Townhome</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="City, State or ZIP code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-blue-700"
                  disabled={createProjectMutation.isPending}
                >
                  {createProjectMutation.isPending ? "Posting..." : "Post Project"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
