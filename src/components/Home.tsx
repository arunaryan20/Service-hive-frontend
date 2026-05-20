import { useEffect, useState } from "react";
import Toast from "../components/Toast";
import LeadForm from "../components/LeadForm";
import LeadList from "../components/LeadList";
import {
  createLead,
  deleteLead,
  getLeads,
  updateLead,
} from "../services/lead.service";
import type { Lead } from "../types/lead.types";

const Home = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });
  const [editingLeadId, setEditingLeadId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "New",
    source: "Website",
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const fetchLeads = async () => {
    try {
      const response = await getLeads();
      setLeads(response.data.leads);
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLeadId) {
        await updateLead(editingLeadId, formData);
        setToast({
          message: "Lead updated successfully",
          type: "success",
        });
      } else {
        await createLead(formData);
        setToast({
          message: "Lead created successfully",
          type: "success",
        });
      }
      setFormData({
        name: "",
        email: "",
        status: "New",
        source: "Website",
      });
      setEditingLeadId("");
      fetchLeads();
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message,
        type: "error",
      });
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLeadId(lead._id);
    setFormData({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      setToast({
        message: "Lead deleted successfully",
        type: "success",
      });
      fetchLeads();
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message,
        type: "error",
      });
    }
  };

  // Apply filters and sorting 
  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? lead.status === statusFilter : true;
      const matchesSource = sourceFilter ? lead.source === sourceFilter : true;
      return matchesSearch && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  return (
    <div className="h-screen bg-gray-100 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-800">Lead Management</h1>
          <p className="text-gray-500 mt-2">Manage your leads professionally</p>
        </div>

        <Toast
          message={toast.message}
          type={toast.type as "success" | "error"}
        //   onClose={() => setToast({ message: "", type: "success" })}
        />

        <div className="flex-1 min-h-0 flex gap-6">
          <div className="w-1/3 flex-shrink-0 overflow-y-auto">
            <div className="sticky top-0">
              <LeadForm
                formData={formData}
                editingLeadId={editingLeadId}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col min-h-0">
            <div className="flex-shrink-0 bg-white rounded-2xl shadow-lg p-5 mb-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search by Name or Email
                  </label>
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Status</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Source
                  </label>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Sources</option>
                    <option value="Website">Website</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
              {(search || statusFilter || sourceFilter) && (
                <div className="mt-4 text-right">
                  <button
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("");
                      setSourceFilter("");
                      setSortBy("latest");
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 mb-3 px-1">
              <p className="text-sm text-gray-600">
                Showing {filteredLeads.length} of {leads.length} leads
              </p>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pr-2">
              <LeadList
                leads={filteredLeads}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;