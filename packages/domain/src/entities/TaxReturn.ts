export interface TaxReturn {
  id: string;
  assessmentYear: string;
  taxpayerId: string;
  createdAt: Date;
  updatedAt: Date;
  status: "Draft" | "Validated" | "Filed";
}