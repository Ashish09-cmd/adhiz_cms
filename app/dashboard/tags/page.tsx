"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import { Button } from "../../../components/ui/Button";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
interface Tag {
  id: string;
  tag_name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

/* ================= COMPONENT ================= */
const TagsPage: React.FC = () => {
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ================= FETCH TAGS ================= */
  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await api.get("/tags");
      const data: Tag[] = res.data.data || res.data;

      setTags(data);
      setFilteredTags(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load tags"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH FILTER ================= */
  useEffect(() => {
    if (!search.trim()) {
      setFilteredTags(tags);
      return;
    }

    const term = search.toLowerCase();
    setFilteredTags(
      tags.filter(
        (tag) =>
          tag.tag_name.toLowerCase().includes(term) ||
          tag.slug.toLowerCase().includes(term)
      )
    );
  }, [search, tags]);

  useEffect(() => {
    fetchTags();
  }, []);

  /* ================= DELETE TAG ================= */
  const handleConfirmDelete = async () => {
    if (!selectedTag) return;

    try {
      setDeleting(true);

      await api.delete(`/tags/${selectedTag.id}`);

      setTags((prev) => prev.filter((t) => t.id !== selectedTag.id));
      setFilteredTags((prev) => prev.filter((t) => t.id !== selectedTag.id));

      setShowDeleteModal(false);
      setSelectedTag(null);
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete tag"
      );
    } finally {
      setDeleting(false);
    }
  };

  /* ================= HANDLERS ================= */
  const handleAddTag = () => {
    router.push("/dashboard/tags/add");
  };

  const handleViewClick = (tag: Tag) => {
    setSelectedTag(tag);
    setShowViewModal(true);
  };

  const handleDeleteClick = (tag: Tag) => {
    setSelectedTag(tag);
    setShowDeleteModal(true);
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          Tags List
        </h1>

        <Button
          variant="primary"
          size="md"
          className="flex items-center gap-2 bg-green-600 text-white"
          onClick={handleAddTag}
        >
          <Icon icon="heroicons:plus-20-solid" className="w-4 h-4" />
          Add Tag
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg">
        <input
          type="text"
          placeholder="Search by tag name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-border-darker">
        {loading && (
          <div className="p-6 text-center text-gray-600">
            <Icon
              icon="heroicons:arrow-path-20-solid"
              className="w-5 h-5 animate-spin inline-block mr-2"
            />
            Loading tags...
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && filteredTags.length === 0 && (
          <div className="p-6 text-center text-gray-600">No tags found.</div>
        )}

        {!loading && !error && filteredTags.length > 0 && (
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold">
                  Tag Name
                </th>
                <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold">
                  Slug
                </th>
                <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border border-[#ddd]">
                    {tag.tag_name}
                  </td>
                  <td className="px-6 py-4 border border-[#ddd]">{tag.slug}</td>
                  <td className="px-6 py-4 border border-[#ddd]">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewClick(tag)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Icon icon="heroicons:eye-20-solid" />
                      </button>

                      <button
                        onClick={() =>
                          (window.location.href = `/dashboard/tags/edit/${tag.slug}`)
                        }
                        className="text-green-600 hover:text-green-900"
                      >
                        <Icon icon="heroicons:pencil-20-solid" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(tag)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Icon icon="heroicons:trash-20-solid" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && selectedTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000040]">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              Delete Tag
            </h3>

            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedTag.tag_name}</span>?
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

      {/* ================= VIEW MODAL ================= */}
      {showViewModal && selectedTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000040]">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">View Tag</h3>
              <button onClick={() => setShowViewModal(false)}>
                <Icon icon="heroicons:x-mark-20-solid" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Tag Name:</span>{" "}
                {selectedTag.tag_name}
              </div>
              <div>
                <span className="font-semibold">Slug:</span> {selectedTag.slug}
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

export default TagsPage;
