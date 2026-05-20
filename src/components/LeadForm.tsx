import type { Lead } from "../types/lead.types";

interface LeadFormProps {
  formData: any;

  editingLeadId: string;

  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;

  handleSubmit: (
    e: React.FormEvent
  ) => void;
}

const LeadForm = ({
  formData,
  editingLeadId,
  handleChange,
  handleSubmit,
}: LeadFormProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        {editingLeadId
          ? "Update Lead"
          : "Create Lead"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="New">
            New
          </option>

          <option value="Contacted">
            Contacted
          </option>

          <option value="Qualified">
            Qualified
          </option>

          <option value="Lost">
            Lost
          </option>
        </select>

        <select
          name="source"
          value={formData.source}
          onChange={handleChange}
          className="px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Website">
            Website
          </option>

          <option value="Instagram">
            Instagram
          </option>

          <option value="Referral">
            Referral
          </option>
        </select>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 font-semibold transition"
        >
          {editingLeadId
            ? "Update Lead"
            : "Add Lead"}
        </button>
      </form>
    </div>
  );
};

export default LeadForm;