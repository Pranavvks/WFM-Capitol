import axios from 'axios';
import { createClient } from './supabase/client';

export type VehicleRiskAssessment = {
  co2_emissions: string;
  construction_year_diff: number;
  risk_score: number;
  vin: string;
  vehicle_name: string;
};

export type DriverRiskAssessment = {
  age: number;
  license: string;
  name: string;
  past_claims: {
    incidents: number;
    period: string;
  };
  risk_score: number;
};

export type InsuranceApplicationDetails = {
  id: number;
  status: string;
  vehicle_risk_assessment: VehicleRiskAssessment;
  driver_risk_assessment: DriverRiskAssessment;
};

export const fetchApplicationDetails = async (applicationId: string): Promise<InsuranceApplicationDetails> => {
  try {
    const { data } = await axios.get<InsuranceApplicationDetails>(`http://localhost:5001/applications/${applicationId}`);
    return data;
  } catch (error) {
    console.error('Error fetching application details:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId: string, status: string): Promise<{ status: string }> => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('application_id', applicationId);

    if (error) {
      console.error('Supabase error:', error.message);
      throw new Error(`Failed to update application status: ${error.message}`);
    }

    return { status };
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};