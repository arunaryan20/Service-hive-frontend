import { useEffect, useState } from "react";

import {
  createLead,
  deleteLead,
  getLeads,
  updateLead,
} from "../services/lead.service";

import type { Lead } from "../types/lead.types";

import Toast from "../components/Toast";

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

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingLeadId) {
        const response = await updateLead(editingLeadId, formData);

        setToast({
          message: response.message,
          type: "success",
        });
      } else {
        const response = await createLead(formData);

        setToast({
          message: response.message,
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?",
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteLead(id);

      setToast({
        message: response.message,
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
          // onClose={() => setToast({ message: "", type: "success" })}
        />

        <div className="flex-1 min-h-0 flex gap-6">
          <div className="w-1/3 flex-shrink-0 overflow-y-auto">
            <div className="sticky top-0">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-5">
                  {editingLeadId ? "Update Lead" : "Create Lead"}
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 gap-5"
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
                    <option value="New">New</option>

                    <option value="Contacted">Contacted</option>

                    <option value="Qualified">Qualified</option>

                    <option value="Lost">Lost</option>
                  </select>

                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Website">Website</option>

                    <option value="Instagram">Instagram</option>

                    <option value="Referral">Referral</option>
                  </select>

                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 font-semibold transition"
                  >
                    {editingLeadId ? "Update Lead" : "Add Lead"}
                  </button>
                </form>
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {lead.name}
                      </h3>

                      <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                        {lead.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium text-gray-700">Email:</span>{" "}
                        {lead.email}
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
