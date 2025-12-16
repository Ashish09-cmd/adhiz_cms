"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import { Button } from "../../../components/ui/Button";

interface Skill {
  id: string;
  title: string;
  slug: string;
  priority: number;
  description: string;
  seo_title: string;
  seo_description: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [sortBy, setSortBy] = useState<"title" | "priority" | "created_at">(
    "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [showFilterPopover, setShowFilterPopover] = useState(false);

  const [unsavedFilter, setUnsavedFilter] = useState(statusFilter);
  const itemsPerPage = 10;

  // Fetch skills
  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await api.get("/skills");
      const data: Skill[] = res.data.data || res.data;
      setSkills(data);
      setFilteredSkills(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load skills"
      );
    } finally {
      setLoading(false);
    }
  };

  // confirm delete api call

  const handleConfirmDelete = async () => {
    if (!selectedSkill) return;

    try {
      setDeleting(true);

      await api.delete(`/skills/${selectedSkill.id}`);

      // remove from UI instantly (optional but better UX)
      setSkills((prev) =>
        prev.filter((skill) => skill.id !== selectedSkill.id)
      );

      setFilteredSkills((prev) =>
        prev.filter((skill) => skill.id !== selectedSkill.id)
      );

      setShowDeleteModal(false);
      setSelectedSkill(null);
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete skill"
      );
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    let filtered = skills;

    if (statusFilter !== "all") {
      filtered = filtered.filter((skill) => skill.status === statusFilter);
    }

    if (search.trim() !== "") {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (skill) =>
          skill.title.toLowerCase().includes(term) ||
          skill.slug.toLowerCase().includes(term)
      );
    }

    setFilteredSkills(filtered);
  }, [search, statusFilter, skills]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSkills();
  };

  const handleAddSkill = () => {
    window.location.href = "/dashboard/skills/add";
  };

  //
  const handleEditSkill = () => {
    window.location.href = "";
  };

  const truncateDescription = (description: string, maxLength: number = 50) => {
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  const getSkillStatus = (skill: Skill) => {
    return skill.priority >= 5 ? "active" : "inactive";
  };

  const handleDeleteClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowDeleteModal(true);
  };

  const handleViewClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <h1 className="text-md font-bold text-gray-900 font-poppins">
          Skills
        </h1>

        <Button onClick={handleAddSkill} className="flex items-center gap-2">
          <Icon icon="heroicons:plus-20-solid" className="w-4 h-4" />
          Add Skill
        </Button>
      </div> */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          Skills List
        </h1>
        <Button
          variant="primary"
          size="md"
          className="flex items-center gap-2 bg-green-600 text-white cursor-pointer"
          onClick={handleAddSkill}
        >
          <Icon icon="heroicons:plus-20-solid" className="w-4 h-4" />
          Add Skill
        </Button>
      </div>

      <div className="bg-white p-4 border border-gray-200 rounded-lg flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                  // onClick={() => setUnsavedFilter("")}
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

      {/* Content */}
      <div className="bg-white border border-gray-border-darker">
        {loading && (
          <div className="p-6 text-center text-gray-600">
            <Icon
              icon="heroicons:arrow-path-20-solid"
              className="w-5 h-5 animate-spin inline-block mr-2"
            />
            Loading skills...
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && skills.length === 0 && (
          <div className="p-6 text-center text-gray-600">No skills found.</div>
        )}

        {!loading && !error && skills.length > 0 && (
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold text-primary-title  capatalize tracking-wider cursor-pointer"
                  // onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1">Title</div>
                </th>
                <th
                  className="px-6 border border-[#ddd] py-3 text-left text-xs font-bold text-primary-title  capatalize tracking-wider cursor-pointer"
                  // onClick={() => handleSort("priority")}
                >
                  <div className="flex items-center gap-1">
                    Priority
                    {sortBy === "priority" && (
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
                  Description
                </th>

                <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold text-primary-title  capatalize tracking-wider">
                  Updated At
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
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 border border-[#ddd] whitespace-nowrap text-sm font-medium text-gray-900">
                    {skill.title}
                  </td>

                  <td className="px-6 py-4 border border-[#ddd] whitespace-nowrap text-sm font-medium text-gray-700">
                    {skill.priority}
                  </td>

                  <td className="px-6 py-4 border border-[#ddd] whitespace-nowrap text-sm font-medium text-gray-700">
                    {truncateDescription(skill.description)}
                  </td>

                  <td className="px-6 py-4 border border-[#ddd] whitespace-nowrap text-sm font-medium text-gray-700">
                    {new Date(skill.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 border border-[#ddd]">
                    {" "}
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
                        onClick={() => handleViewClick(skill)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View"
                      >
                        <Icon
                          icon="heroicons:eye-20-solid"
                          className="w-4 h-4"
                        />
                      </button>
                      <button
                        onClick={() =>
                          (window.location.href = `/dashboard/skills/edit/${skill.slug}`)
                        }
                        className="text-green-600 cursor-pointer hover:text-green-900 p-1 rounded"
                        title="Edit"
                      >
                        <Icon
                          icon="heroicons:pencil-20-solid"
                          className="w-4 h-4"
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(skill)}
                        className="text-red-600 cursor-pointer hover:text-red-900 p-1 rounded"
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
        )}
      </div>
      {showDeleteModal && selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000040] bg-opacity-40">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">
                Delete Skill
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <Icon icon="heroicons:x-mark-20-solid" className="w-7 h-7" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedSkill.title}</span>? This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </Button>

              <Button
                // variant="danger"
                className="bg-red-600 text-white"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showViewModal && selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000040]">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                View Skill
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="heroicons:x-mark-20-solid" className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Title:</span>{" "}
                {selectedSkill.title}
              </div>

              <div>
                <span className="font-semibold">Slug:</span>{" "}
                {selectedSkill.slug}
              </div>

              <div>
                <span className="font-semibold">Priority:</span>{" "}
                {selectedSkill.priority}
              </div>

              <div>
                <span className="font-semibold">Description:</span>
                <p className="mt-1 text-gray-700">
                  {selectedSkill.description}
                </p>
              </div>

              <div>
                <span className="font-semibold">SEO Title:</span>{" "}
                {selectedSkill.seo_title}
              </div>

              <div>
                <span className="font-semibold">SEO Description:</span>
                <p className="mt-1 text-gray-700">
                  {selectedSkill.seo_description}
                </p>
              </div>

              <div>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(selectedSkill.created_at).toLocaleString()}
              </div>

              <div>
                <span className="font-semibold">Updated At:</span>{" "}
                {new Date(selectedSkill.updated_at).toLocaleString()}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPage;


