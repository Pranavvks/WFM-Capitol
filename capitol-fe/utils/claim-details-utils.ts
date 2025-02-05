import axios from 'axios';
import { createClient } from './supabase/client';

export interface ClaimDetails {
  id: number;
  claimant_name: string;
  claim_type: string;
  insurance_type: string;
  insurance_id: number;
  insurance_end_date: string;
  accident_description: string;
  approval_status: string;
}

export const fetchClaimDetails = async (claimId: string): Promise<ClaimDetails> => {
  try {
    const { data } = await axios.get<ClaimDetails>(`http://localhost:5001/claims/${claimId}`);
    return data;
  } catch (error) {
    console.error('Error fetching claim details:', error);
    throw error;
  }
};

export const updateClaimStatus = async (claimId: string, approval_status: string): Promise<{ approval_status: string }> => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('claims')
      .update({ approval_status })
      .eq('id', claimId);
    console.log(approval_status)
    if (error) {
      console.error('Supabase error:', error.message);
      throw new Error(`Failed to update claim status: ${error.message}`);
    }

    return { approval_status };
  } catch (error) {
    console.error('Error updating claim status:', error);
    throw error;
  }
};