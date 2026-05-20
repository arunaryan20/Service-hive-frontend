export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;

  status:
    | "New"
    | "Contacted"
    | "Qualified"
    | "Lost";

  source:
    | "Website"
    | "Instagram"
    | "Referral";

  isActive: boolean;

  createdAt: string;
}