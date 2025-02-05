export type InsuranceRecord = {
    id: string;
    applicantName: string;
    typeOfCustomer: "private" | "fleet";
    insuranceType: "Teilkasko" | "Vollkasko" | "Haftpflicht";
    requestedDate: string;
    status: "Pending" | "Approved" | "Declined" | "Further Review Required";
    amount: number; // Added amount field
  };
  
 
  