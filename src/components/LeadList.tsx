import type { Lead } from "../types/lead.types";

import LeadCard from "./LeadCard";

interface LeadListProps {
  leads: Lead[];

  handleEdit: (
    lead: Lead
  ) => void;

  handleDelete: (
    id: string
  ) => void;
}

const LeadList = ({
  leads,
  handleEdit,
  handleDelete,
}: LeadListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leads.map((lead) => (
        <LeadCard
          key={lead._id}
          lead={lead}
          handleEdit={
            handleEdit
          }
          handleDelete={
            handleDelete
          }
        />
      ))}
    </div>
  );
};

export default LeadList;