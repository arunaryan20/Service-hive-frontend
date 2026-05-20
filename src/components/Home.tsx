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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Number of leads per page
  const [totalItems,setTotalItems]=useState(0);

  const fetchLeads = async () => {
    try {
      const response = await getLeads();
      setLeads(response.data.leads);
      setTotalItems(response.data.total);
      setCurrentPage(1); 
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

  // Apply filters and sorting on frontend
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

  // Pagination logic
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sourceFilter, sortBy]);

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
              
              {/* Items per page selector */}
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>
                
                {(search || statusFilter || sourceFilter) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("");
                      setSourceFilter("");
                      setSortBy("latest");
                      setCurrentPage(1);
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0 mb-3 px-1">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} leads
              </p>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pr-2">
              <LeadList
                leads={currentLeads}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>

            {/* Pagination Component */}
            {totalPages > 1 && (
              <div className="flex-shrink-0 mt-5 flex justify-center items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && paginate(page)}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : page === '...'
                          ? "bg-gray-100 text-gray-500 cursor-default"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;