"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';

import type { ClaimDetails } from '@/utils/claim-details-utils';
import { fetchClaimDetails, updateClaimStatus } from '@/utils/claim-details-utils';
import { Check, Search, X, User2, FileText, Calendar, Shield, FileCheck } from 'lucide-react';



export default function ClaimDetails() {
  const params = useParams();
  const claimId = params.slug as string;
  const queryClient = useQueryClient();
  const [statusNotification, setStatusNotification] = React.useState<string | null>(null);

  const { data: claimDetails, isLoading, error } = useQuery<ClaimDetails, Error>({
    queryKey: ['claimDetails', claimId],
    queryFn: () => fetchClaimDetails(claimId),
    staleTime: 60000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: (failureCount, error) => {
      if (error.message.includes('404')) return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const updateStatusMutation = useMutation<{ approval_status: string }, Error, { status: string }>({
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    mutationFn: ({ status }: { status: string }) => updateClaimStatus(claimId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.setQueryData(['claimDetails', claimId], (oldData: ClaimDetails | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          approval_status: data.approval_status
        };
      });
    },
  });

  const handleStatusChange = (status: 'Approved' | 'Rejected' | 'Review Required') => {
    updateStatusMutation.mutate({ status });
    setStatusNotification(status);
  };

  if (isLoading) return <div className="min-h-screen bg-[#0d0f11] text-gray-100 p-8">Loading...</div>;
  if (error) return <div className="min-h-screen bg-[#0d0f11] text-gray-100 p-8">Error loading claim details</div>;
  if (!claimDetails) return null;

  return (
    <div className="min-h-screen bg-[#0d0f11] text-gray-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Claim Details</h1>
            <h2 className="text-lg text-gray-400">Claim #{claimId}</h2>
            {statusNotification && (
              <div className="mt-4 mb-6">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusNotification === 'Approved' ? 'bg-green-500/20 text-green-400' : statusNotification === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'}`}>
                  {statusNotification}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6 space-y-4 border border-gray-700 bg-[#121518] text-white">
              <h3 className="text-lg font-semibold">Claim Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <User2 className="h-4 w-4 text-blue-400" />
                      Claimant Name
                    </div>
                    <div className="font-medium">{claimDetails.claimant_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-purple-400" />
                      Insurance ID
                    </div>
                    <div className="font-medium">#{claimDetails.insurance_id}</div>
                  </div>
                </div>

                <Separator className="bg-gray-800 -mx-6" />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-green-400" />
                      Claim Type
                    </div>
                    <div className="font-medium">{claimDetails.claim_type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4 text-yellow-400" />
                      Insurance Type
                    </div>
                    <div className="font-medium">{claimDetails.insurance_type}</div>
                  </div>
                </div>

                <Separator className="bg-gray-800 -mx-6" />

                <div>
                  <div className="text-sm text-gray-400 flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-red-400" />
                    Insurance End Date
                  </div>
                  <div className="font-medium">{new Date(claimDetails.insurance_end_date).toLocaleDateString()}</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border border-gray-700 bg-[#121518] text-white">
              <h3 className="text-lg font-semibold">Claim Summary</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Accident Description</div>
                <p className="text-gray-300">{claimDetails.accident_description}</p>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border border-gray-700 bg-[#121518]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-white">Document Actions</h3>
                  <p className="text-sm text-gray-400">Select an action for this claim</p>
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
                    onClick={() => handleStatusChange('Rejected')}
                    disabled={updateStatusMutation.isPending}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>

                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white"
                    onClick={() => handleStatusChange('Review Required')}
                    disabled={updateStatusMutation.isPending}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Request Review
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}