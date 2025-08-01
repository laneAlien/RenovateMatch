import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertContractorProfileSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Star } from "lucide-react";

const specialtyOptions = [
  "Kitchen Remodel",
  "Bathroom",
  "Flooring",
  "Roofing",
  "Electrical",
  "Plumbing",
  "Painting",
  "General"
];

export default function ContractorProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: existingProfile, isLoading } = useQuery({
    queryKey: ['/api/contractor-profiles/user', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/contractor-profiles/user/${user?.id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch contractor profile');
      }
      return response.json();
    },
    enabled: !!user?.id,
  });

  const form = useForm({
    resolver: zodResolver(insertContractorProfileSchema),
    defaultValues: {
      businessName: "",
      description: "",
      specialties: [],
      yearsExperience: "",
      serviceRadius: "",
      profileImage: "",
      portfolioImages: [],
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/contractor-profiles", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contractor-profiles'] });
      toast({
        title: "Success",
        description: "Profile created successfully!",
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!existingProfile || !existingProfile.id) throw new Error('No profile to update');
      const response = await apiRequest("PUT", `/api/contractor-profiles/${existingProfile.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contractor-profiles'] });
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a profile",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (existingProfile) {
      updateProfileMutation.mutate(data);
    } else {
      createProfileMutation.mutate(data);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to create a contractor profile.</p>
            <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-blue-700">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.userType !== 'contractor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contractor Access Only</h2>
            <p className="text-gray-600 mb-6">Only contractor accounts can create contractor profiles.</p>
            <Button onClick={() => navigate("/")} className="bg-primary hover:bg-blue-700">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            {existingProfile ? "Update Your" : "Create Your"} Contractor Profile
          </h2>
          <p className="mt-4 text-lg text-gray-600">Showcase your expertise and attract quality projects</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-xl p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="ABC Construction" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="specialties"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialties</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {specialtyOptions.map((specialty: string) => (
                            <div key={specialty} className="flex items-center space-x-2">
                              <Checkbox
                                id={specialty}
                                checked={Array.isArray(field.value) && field.value.includes(specialty)}
                                onCheckedChange={(checked) => {
                                  const currentSpecialties = Array.isArray(field.value) ? field.value : [];
                                  if (checked) {
                                    field.onChange([...currentSpecialties, specialty]);
                                  } else {
                                    field.onChange(currentSpecialties.filter((s: string) => s !== specialty));
                                  }
                                }}
                              />
                              <label htmlFor={specialty} className="text-sm">
                                {specialty}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={4} 
                            placeholder="Tell homeowners about your experience and approach..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="yearsExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-2 years">1-2 years</SelectItem>
                              <SelectItem value="3-5 years">3-5 years</SelectItem>
                              <SelectItem value="6-10 years">6-10 years</SelectItem>
                              <SelectItem value="11-15 years">11-15 years</SelectItem>
                              <SelectItem value="15+ years">15+ years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serviceRadius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Area (Miles)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service area" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Within 10 miles">Within 10 miles</SelectItem>
                              <SelectItem value="Within 25 miles">Within 25 miles</SelectItem>
                              <SelectItem value="Within 50 miles">Within 50 miles</SelectItem>
                              <SelectItem value="Within 100 miles">Within 100 miles</SelectItem>
                              <SelectItem value="Statewide">Statewide</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline">
                      Save Draft
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-blue-700"
                      disabled={createProfileMutation.isPending || updateProfileMutation.isPending}
                    >
                      {(createProfileMutation.isPending || updateProfileMutation.isPending) 
                        ? "Saving..." 
                        : existingProfile ? "Update Profile" : "Create Profile"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
          
          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Preview</h3>
              <div className="text-center mb-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">Photo</span>
                </div>
                <h4 className="mt-2 font-semibold text-gray-900">
                  {form.watch('businessName') || 'Your Business Name'}
                </h4>
                <p className="text-sm text-gray-600">{user.firstName} {user.lastName}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 text-yellow-400 mr-2 fill-current" />
                  <span className="font-medium">New</span>
                  <span className="text-gray-600 ml-1">(No reviews yet)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  <span>{form.watch('serviceRadius') || 'Service area not set'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-calendar mr-2"></i>
                  <span>{form.watch('yearsExperience') || 'Experience not set'}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Specialties</h5>
                <div className="flex flex-wrap gap-2">
                  {form.watch('specialties')?.length > 0 ? form.watch('specialties')?.map((specialty: string) => (
                    <span key={specialty} className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                      {specialty}
                    </span>
                  )) : <span className="text-gray-500 text-xs">No specialties selected</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
