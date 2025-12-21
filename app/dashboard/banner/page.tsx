"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { useParams } from "next/navigation";

interface Banner {
  id: string;
  title: string;
  image_url: string;
  start_at?: string;
  end_at?: string;
  status?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

const BannersPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">("");
  const [unsavedFilter, setUnsavedFilter] = useState(statusFilter);
  const [searchTerm, setSearchTerm] = useState("");


  const { id } = useParams<{ id: string }>();
  // ---------------- FETCH ----------------
  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/hero/banner", {
        params: {
          search: searchTerm || undefined,
          status: statusFilter || undefined,
          page: currentPage,
        },
      });
      
      const data: Banner[] = res.data.data || res.data;
      setBanners(data);

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load banners"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [searchTerm, statusFilter , currentPage]);

  // ---------------- HELPERS ----------------
  const formatDate = (date?: string) => {
    if (!date) return "-";
    const iso = date.replace(" ", "T");
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "-" : d.toISOString().split("T")[0];
  };

  const getStatusLabel = (banner: Banner) =>
    banner.is_active ? "Active" : "Inactive";

  // ---------------- ACTIONS ----------------
  const handleDeleteClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setShowDeleteModal(true);
  };

  const handleViewClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setShowViewModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBanner) return;

    try {
      setDeleting(true);
      await api.delete(`/hero/banner/${selectedBanner.id}`);

      setBanners((prev) => prev.filter((b) => b.id !== selectedBanner.id));

      setShowDeleteModal(false);
      setSelectedBanner(null);
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete banner"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleAddBanner = () => {
    window.location.href = "/dashboard/banner/add";
  };

  // ---------------- SEARCH & FILTER ----------------
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBanners();
  };

  const applyFilters = () => {
    setStatusFilter(unsavedFilter);
    setShowFilterPopover(false);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setUnsavedFilter("");
  };

  // ---------------- UI ----------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          Banners
        </h1>
        <Button
          className="flex items-center gap-2 bg-green-600 text-white"
          onClick={handleAddBanner}
        >
          <Icon icon="heroicons:plus-20-solid" className="w-4 h-4" />
          Add Banner
        </Button>
      </div>

      {/* Search and Filter */}
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
            className="flex items-center gap-2"
          >
            <Icon
              icon="heroicons:magnifying-glass-20-solid"
              className="w-4 h-4"
            />{" "}
            Search
          </Button>
        </form>

        {/* Filter */}
        <div className="relative">
          <Button
            variant={statusFilter ? "primary" : "secondary"}
            size="md"
            onClick={() => setShowFilterPopover((prev) => !prev)}
            className="flex items-center gap-2"
          >
            <Icon icon="mdi:filter-outline" className="w-4 h-4" /> Filter
            {statusFilter && (
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </Button>

          {showFilterPopover && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4"
              onClick={(e) => e.stopPropagation()}
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
                  onClick={resetFilters}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={applyFilters}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {loading && (
          <div className="p-6 text-center text-gray-600">
            <Icon
              icon="heroicons:arrow-path-20-solid"
              className="w-5 h-5 animate-spin inline-block mr-2"
            />
            Loading banners...
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && banners.length === 0 && (
          <div className="p-6 text-center text-gray-600">No banners found.</div>
        )}

        {!loading && !error && banners.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold text-primary-title  capatalize w-50  cursor-pointer">
                      Title
                    </th>
                    <th className="px-6 border border-[#ddd] py-3 text-left text-xs font-bold text-primary-title  capatalize tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold text-primary-title  capatalize tracking-wider cursor-pointer">
                      Start At
                    </th>
                    <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold text-primary-title  capatalize tracking-wider cursor-pointer">
                      End At
                    </th>
                    <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold text-primary-title  capatalize tracking-wider cursor-pointer">
                      Status
                    </th>
                    <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold text-primary-title  capatalize tracking-wider cursor-pointer">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {banners.map((banner) => (
                    <tr key={banner.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 border border-[#ddd] text-sm font-medium text-gray-900 w-108">
                        {banner.title}
                      </td>

                      <td className="px-6 py-4 border border-[#ddd] whitespace-nowrap text-sm font-dmSans text-gray-text-body ">
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="h-20 rounded border"
                        />
                      </td>

                      <td className="px-6 py-4 border border-[#ddd]">
                        {formatDate(banner.start_at)}
                      </td>

                      <td className="px-6 py-4 text-sm border border-[#ddd]">
                        {formatDate(banner.end_at)}
                      </td>

                      <td className="px-6 py-4 text-sm border border-[#ddd]">
                        <span
                          className={`font-semibold ${
                            banner.is_active
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {getStatusLabel(banner)}
                        </span>
                      </td>

                      <td className="px-6 py-4 border border-[#ddd]">
                        <div className="flex gap-3 flex-wrap">
                          <button
                            onClick={() => handleViewClick(banner)}
                            className="text-blue-50 h-8 w-8 flex items-center cursor-pointer justify-center bg-blue-600 rounded-sm"
                          >
                            <Icon
                              icon="heroicons:eye-20-solid"
                              className="text-sm"
                            />
                          </button>
                          <button
                            onClick={() =>
                              (window.location.href = `/dashboard/banner/edit/${banner.id}`)
                            }
                            className="text-blue-50 h-8 w-8 flex items-center cursor-pointer justify-center bg-blue-600 rounded-sm"
                          >
                            <Icon
                              icon="akar-icons:edit"
                              className="text-sm"
                            />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(banner)}
                            className="text-blue-50 h-8 w-8 flex items-center cursor-pointer justify-center bg-error rounded-sm"
                          >
                            <Icon icon="heroicons:trash-20-solid" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && selectedBanner && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-red-600 mb-3">
              Delete Banner
            </h3>
            <p className="text-sm mb-6">
              Are you sure you want to delete{" "}
              <strong>{selectedBanner.title}</strong>?
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

      {/* VIEW MODAL */}
      {showViewModal && selectedBanner && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">View Banner</h3>
              <button onClick={() => setShowViewModal(false)}>
                <Icon icon="heroicons:x-mark-20-solid" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p>
                <strong>Title:</strong> {selectedBanner.title}
              </p>
              <p>
                <strong>Status:</strong> {getStatusLabel(selectedBanner)}
              </p>
              <p>
                <strong>Start At:</strong> {formatDate(selectedBanner.start_at)}
              </p>
              <p>
                <strong>End At:</strong> {formatDate(selectedBanner.end_at)}
              
              </p>
              <div className="flex items-center  h-50 mt-5">
                <img
                src={selectedBanner.image_url}
                alt="Banner"
                className="rounded border mt-2 h-full w-auto"
                 />
              </div>
            </div>

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

export default BannersPage;
