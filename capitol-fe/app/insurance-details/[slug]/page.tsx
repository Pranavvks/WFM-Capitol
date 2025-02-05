"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Check, Search, Car, Fuel,  Shield, Calendar, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/ui/navbar';
import { fetchApplicationDetails, InsuranceApplicationDetails, updateApplicationStatus } from '@/utils/insurance-details-utils';

export default function DocumentReview() {
  const params = useParams();
  const applicationId = params.slug as string;
  const queryClient = useQueryClient();

  const { data: applicationDetails, isLoading, error } = useQuery({
    queryKey: ['applicationDetails', applicationId],
    queryFn: () => fetchApplicationDetails(applicationId),
  });

  const [statusNotification, setStatusNotification] = React.useState<string | null>(null);

  const updateStatusMutation = useMutation<{ status: string }, Error, { status: string }>({    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    mutationFn: ({ status }: { status: string }) => updateApplicationStatus(applicationId, status),
    onSuccess: (data) => {
      // Update only the insuranceApplications list cache
      queryClient.invalidateQueries({ queryKey: ['insuranceApplications'] });
      // Update the application details cache without refetching
      queryClient.setQueryData(['applicationDetails', applicationId], (oldData: InsuranceApplicationDetails | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          status: data.status
        };
      });
    },
  });

  const handleStatusChange = (status: 'Approved' | 'Declined' | 'Further Review Required') => {
    updateStatusMutation.mutate({ status });
    setStatusNotification(status);
  };

  if (isLoading) return <div className="min-h-screen bg-[#0d0f11] text-gray-100 p-8">Loading...</div>;
  if (error) return <div className="min-h-screen bg-[#0d0f11] text-gray-100 p-8">Error loading application details</div>;
  if (!applicationDetails) return null;

  const { vehicle_risk_assessment, driver_risk_assessment } = applicationDetails;

  return (
    <div className="min-h-screen bg-[#0d0f11] text-gray-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Review documents</h1>
            <h2 className="text-lg text-gray-400">Insurance policy #{applicationId}</h2>
            {statusNotification && (
              <div className="mt-4 mb-6">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusNotification === 'Approved' ? 'bg-green-500/20 text-green-400' : statusNotification === 'Declined' ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'}`}>
                  {statusNotification}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4 border border-gray-700 bg-[#121518] text-white">
              <h3 className="text-lg font-semibold">Vehicle Risk Assessment</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <Car className="h-4 w-4 text-blue-400" />
                      Vehicle Details
                    </div>
                    <div className="text-sm text-gray-400">VIN: {vehicle_risk_assessment.vin}</div>
                    <div className="font-medium">{vehicle_risk_assessment.vehicle_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Vehicle Age</div>
                    <div className="font-medium">{vehicle_risk_assessment.construction_year_diff} years</div>
                  </div>
                </div>

                <Separator className="bg-gray-800 -mx-6" />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                      <Fuel className="h-4 w-4 text-green-400" />
                      CO2 Emissions
                    </div>
                    <div className="font-medium">{vehicle_risk_assessment.co2_emissions}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4 text-purple-400" />
                      Vehicle Risk Score
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${getRiskScoreColor(vehicle_risk_assessment.risk_score)}`}>
                      {vehicle_risk_assessment.risk_score ? vehicle_risk_assessment.risk_score.toFixed(2) : 'N/A'}/10
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-gray-700 bg-[#121518] text-white">
              <h3 className="text-lg font-semibold mb-4">Driver Risk Assessment</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-400" />
                      Driver Profile
                    </div>
                    <div className="font-medium">{driver_risk_assessment.name}</div>
                    <div className="text-sm text-gray-400">{driver_risk_assessment.license}</div>
                  </div>
                </div>

                <Separator className="bg-gray-800 -mx-6" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-green-400" />
                      Age
                    </div>
                    <div className="font-medium">{driver_risk_assessment.age} years</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      Past Claims
                    </div>
                    <div className="font-medium">{driver_risk_assessment.past_claims.incidents} incidents</div>
                    <div className="text-sm text-gray-400">{driver_risk_assessment.past_claims.period}</div>
                  </div>
                </div>

                <Separator className="bg-gray-800 -mx-6" />

                <div>
                  <div className="text-sm text-gray-400 flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-purple-400" />
                    Driver Risk Score
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${getRiskScoreColor(driver_risk_assessment.risk_score)}`}>
                      {driver_risk_assessment.risk_score ? driver_risk_assessment.risk_score.toFixed(2) : 'N/A'}/10
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 space-y-4 border border-gray-700 bg-[#121518]">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-white">Document Actions</h3>
                <p className="text-sm text-gray-400">Select an action for this insurance document</p>
              </div>
              
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  className="border-green-600 text-green-500 hover:bg-green-600 hover:text-white"
                  onClick={() => handleStatusChange('Approved')}
                  disabled={updateStatusMutation.isPending}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>

                <Button
                  variant="outline"
                  className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                  onClick={() => handleStatusChange('Declined')}
                  disabled={updateStatusMutation.isPending}
                >
                  <X className="mr-2 h-4 w-4" />
                  Decline
                </Button>

                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white"
                  onClick={() => handleStatusChange('Further Review Required')}
                  disabled={updateStatusMutation.isPending}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Request Review
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

const getRiskScoreColor = (score: number) => {
  if (score > 7) return 'bg-red-900/50 text-red-400';
  if (score > 4) return 'bg-yellow-900/50 text-yellow-400';
  return 'bg-green-900/50 text-green-400';
};

        