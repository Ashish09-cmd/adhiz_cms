"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "../../../components/ui/Button";

interface Skill {
  id: number;
  title: string;
  priority: number;
  description: string;
  slug: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  created_at: string;
  updated_at: string;
  status: "active" | "inactive";
}

interface ApiResponse {
  data: Skill[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "priority" | "created_at">(
    "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">(
    ""
  );
  const [unsavedFilter, setUnsavedFilter] = useState(statusFilter);

  const itemsPerPage = 10;

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/skills?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }

      const data: ApiResponse = await response.json();
      setSkills(data.data);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const handleSort = (column: "title" | "priority" | "created_at") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSkills();
  };

  const getSkillStatus = (skill: Skill) => {
    return skill.priority >= 5 ? "active" : "inactive";
  };

  const handleView = (skill: Skill) => {
    window.location.href = `/dashboard/skills/${skill.id}`;
  };

  const handleEdit = (skill: Skill) => {
    window.location.href = `/dashboard/skills/${skill.id}/edit`;
  };

  const handleDelete = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowDeleteModal(true);
  };

  // Filter function
  const applyFilters = () => {
    setStatusFilter(unsavedFilter);
    setShowFilterPopover(false);
    setCurrentPage(1);
    fetchSkills();
  };

  const resetFilters = () => {
    setUnsavedFilter("");
  };

  const confirmDelete = async () => {
    if (!selectedSkill) return;

    try {
      const response = await fetch(`/api/skills/${selectedSkill.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete skill");
      }

      setShowDeleteModal(false);
      setSelectedSkill(null);
      fetchSkills(); // Refresh the list
    } catch (err) {
      console.error("Error deleting skill:", err);
      // You might want to show an error message to the user here
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const truncateDescription = (description: string, maxLength: number = 50) => {
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return "bg-red-100 text-red-800";
    if (priority >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  if (loading && skills.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          Slider List
        </h1>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            className="flex items-center gap-2 bg-green-600 text-xs  text-white cursor-pointer"
            onClick={() => (window.location.href = "/dashboard/skills/add")}
          >
            <Icon icon="akar-icons:edit" className="w-4 h-4" />
            Add
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex items-center gap-2 bg-blue-600 text-white text-xs cursor-pointer"
            onClick={() => (window.location.href = "/dashboard/skills/add")}
          >
            <Icon icon="ion:list-outline" className="w-4 h-4" />
             List
          </Button>
            <Button
            variant="primary"
            size="md"
            className="flex items-center gap-2 bg-white text-primary-text-body border-gray-border-darker text-xs cursor-pointer"
            onClick={() => (window.location.href = "/dashboard/skills/add")}
          >
            <Icon icon="nrk:list" className="w-4 h-4" />
            Re Order
          </Button>
        </div>
      </div>
      <div className="bg-white p-4 border border-gray-200 rounded-lg flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button
            type="submit"
            variant="secondary"
            size="md"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Icon
              icon="heroicons:magnifying-glass-20-solid"
              className="w-4 h-4"
            />
            Search
          </Button>
        </form>

        {/* Filter Button */}
        <div className="relative">
          <Button
            variant={statusFilter ? "primary" : "secondary"}
            size="md"
            onClick={() => setShowFilterPopover((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Icon icon="mdi:filter-outline" className="w-4 h-4" />
            Filter
            {statusFilter && (
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </Button>
          {showFilterPopover && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <h4 className="text-gray-800 font-semibold mb-2">Filters</h4>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={unsavedFilter}
                  onChange={(e) => setUnsavedFilter(e.target.value as any)}
                  className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                  onClick={() => setUnsavedFilter("")}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => {
                    setStatusFilter(unsavedFilter);
                    setShowFilterPopover(false);
                    setCurrentPage(1);
                    fetchSkills();
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold text-primary-title  capatalize tracking-wider cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1">
                    Title
                    {sortBy === "title" && (
                      <Icon
                        icon={
                          sortOrder === "asc"
                            ? "heroicons:chevron-up-20-solid"
                            : "heroicons:chevron-down-20-solid"
                        }
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                </th>
                <th className="px-6 border border-[#ddd] py-3 text-left text-xs font-bold text-primary-title  capatalize tracking-wider">
                  Image  
                </th>
                <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold text-primary-title  capatalize tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left border border-[#ddd] text-xs font-bold text-primary-title  capatalize tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {skills.map((skill) => (
                <tr
                  key={skill.id}
                  className={skill.priority >= 8 ? "bg-yellow-50" : ""}
                >
                  <td className="px-6 py-4 border border-[#ddd] whitespace-nowrap text-sm font-medium text-gray-900">
                    {skill.title}
                  </td>
                  <td className="px-6 py-4 border border-[#ddd] whitespace-nowrap text-sm font-dmSans text-gray-text-body ">
                    {formatDate(skill.updated_at)}
                  </td>
                  <td className="px-6 py-4 border border-[#ddd]">
                    <div className="relative group inline-block">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold  cursor-default ${
                          getSkillStatus(skill) === "active"
                            ? " text-green-800"
                            : " text-gray-800"
                        }`}
                      >
                        {getSkillStatus(skill) === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                      <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {getSkillStatus(skill)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 border border-[#ddd] whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(skill)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View"
                      >
                        <Icon
                          icon="heroicons:eye-20-solid"
                          className="w-4 h-4"
                        />
                      </button>
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-green-800 hover:text-green-900 p-1 rounded"
                        title="Edit"
                      >
                        <Icon
                          icon="akar-icons:edit"
                          className="w-4 h-4"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(skill)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete"
                      >
                        <Icon
                          icon="heroicons:trash-20-solid"
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-[#2F2F9E] text-white"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="text-white bg-green-700  "
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedSkill && (
        <div className="fixed inset-0 bg-[#00000040]  flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">View Skill</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="heroicons:x-mark-20-solid" className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedSkill.title}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedSkill.priority}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedSkill.description}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedSkill.slug}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SEO Title
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedSkill.seo_title}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SEO Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedSkill.seo_description}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SEO Keywords
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedSkill.seo_keywords}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(selectedSkill.created_at)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(selectedSkill.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Placeholder */}
      {showEditModal && selectedSkill && (
        <div className="fixed inset-0 bg-[#00000040] flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Skill</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="heroicons:x-mark-20-solid" className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600">
              Edit functionality would be implemented here with a form.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setShowEditModal(false)}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSkill && (
        <div className="fixed inset-0 bg-[#00000040] flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">
                Delete Skill
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="heroicons:x-mark-20-solid" className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete "{selectedSkill.title}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={confirmDelete}
                className="bg-[#1A73E8] text-white hover:bg-blue-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
