import axios from 'axios'
import { InsuranceRecord } from '@/mock-data/Insurancemock'

export type APIInsuranceRecord = {
  id: number
  category: string
  insurance_type: string
  name: string
  status: string
  amount?: number
}

export const generateRandomDate = (): string => {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 30)
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return randomDate.toISOString().split('T')[0]
}

// Cache for storing status values based on application ID
const statusCache = new Map<string, string>();

export const transformApiData = (apiData: APIInsuranceRecord[]): InsuranceRecord[] => {
  return apiData.map((item) => {
    const id = String(item.id);
    const requestedDate = generateRandomDate();
    const daysSinceRequest = Math.floor((new Date().getTime() - new Date(requestedDate).getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate base amount between 200 and 1500 based on days
    const baseAmount = 200 + Math.floor((daysSinceRequest / 30) * 100);
    const finalAmount = Math.min(1500, Math.max(200, baseAmount));

    // Use cached status if available, otherwise store the new status
    let status = statusCache.get(id);
    if (!status) {
      status = item.status as "Pending" | "Approved" | "Declined" | "Further Review Required";
      statusCache.set(id, status);
    }

    return {
      id,
      applicantName: item.name,
      typeOfCustomer: item.category.toLowerCase() === 'fleet' ? 'fleet' : 'private',
      insuranceType: item.insurance_type as "Teilkasko" | "Vollkasko" | "Haftpflicht",
      status: status as "Pending" | "Approved" | "Declined" | "Further Review Required",
      requestedDate,
      amount: item.amount ?? finalAmount
    }
  })
}

export const fetchInsuranceApplications = async (): Promise<APIInsuranceRecord[]> => {
  try {
    const { data } = await axios.get<APIInsuranceRecord[]>('http://localhost:5001/applications')
    return data
  } catch (error) {
    console.error('Error fetching insurance applications:', error)
    throw error 
  }
}