import type { Lead } from "../types/lead.types";

interface LeadCardProps {
  lead: Lead;

  handleEdit: (lead: Lead) => void;

  handleDelete: (id: string) => void;
}

const LeadCard = ({ lead, handleEdit, handleDelete }: LeadCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{lead.name}</h3>

        <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
          {lead.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-medium text-gray-700">Email:</span> {lead.email}
        </p>

        <p>
          <span className="font-medium text-gray-700">Source:</span>{" "}
          {lead.source}
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => handleEdit(lead)}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(lead._id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default LeadCard;
