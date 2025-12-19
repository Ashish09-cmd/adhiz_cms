"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import { Button } from "../../../../components/ui/Button";
import { useRouter } from "next/navigation";

/* ================= COMPONENT ================= */
const AddTagPage: React.FC = () => {
  const router = useRouter();
  const [tagName, setTagName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= AUTO SLUG ================= */
  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagName(value);
    setSlug(generateSlug(value));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tagName.trim()) {
      setError("Tag name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.post("/tags", {
        tag_name: tagName,
        slug: slug,
      });

      // Redirect after success
      router.push("/dashboard/tags");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create tag"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          <Icon icon="heroicons:arrow-left-20-solid" className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          Add Tag
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-6 space-y-5"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* Tag Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tag Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={tagName}
            onChange={handleTagNameChange}
            placeholder="e.g. Communication Skills"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="communication-skills"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Slug must be unique and URL friendly
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-green-600 text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Tag"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTagPage;
