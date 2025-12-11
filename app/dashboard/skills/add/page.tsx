"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "../../../../components/ui/Button";
import RichTextEditor from "@/components/ui/Editor";

const AddSkillPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    priority:"",
    description: "",
    slug: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

      if (!token) {
        // Not authenticated
        alert("You must be logged in to create a skill. Redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const payload = {
        ...formData,
      };

      const res = await fetch(`${apiBase}/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // try extract message from response
        const msg = data?.message || data?.error || "Failed to create skill";
        throw new Error(msg);
      }

      // Success → redirect to skills list
      window.location.href = "/dashboard/skills";
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = "/dashboard/skills";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="text-gray-800 cursor-pointer hover:text-gray-900 p-2  hover:bg-gray-100"
        >
          <Icon icon="heroicons:arrow-left-20-solid" className="w-5 h-5" />
        </button>
        <h1 className="text-md font-bold text-gray-900 font-poppins">
          Add New Skill
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white  p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* title */}
            <div className="flex flex-col gap-4 p-6 bg-white border border-gray-border-darker">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300  focus:outline-none "
                  placeholder="Enter skill title"
                />
              </div>
              {/* priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Priority
                </label>
                <input
                  type="number"
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none "
                />
              </div>
              {/* description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none "
                  placeholder="Enter skill description"
                />
              </div>
              {/* slug */}
              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none "
                  placeholder="Enter URL slug (e.g., javascript-fundamentals)"
                />
              </div>
              {/* status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none "
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div
              className="flex flex-col gap-4 p-6 bg-white border border-gray-border-darker"
            >
              <h6 className="text-gray-800 font-poppins font-bold text-sm pb-2 border-gray-border-darker  border-b">
                SEO Section
              </h6>
              <div>
                <label
                  htmlFor="seo_title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  SEO Title
                </label>
                <input
                  type="text"
                  id="seo_title"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300  focus:outline-none "
                  placeholder="Enter SEO title"
                />
              </div>

              <div>
                <label
                  htmlFor="seo_description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  SEO Description
                </label>
                <textarea
                  id="seo_description"
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300  focus:outline-none "
                  placeholder="Enter SEO description"
                />
              </div>

              <div>
                <label
                  htmlFor="seo_keywords"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  SEO Keywords
                </label>
                <input
                  type="text"
                  id="seo_keywords"
                  name="seo_keywords"
                  value={formData.seo_keywords}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300  focus:outline-none "
                  placeholder="Enter SEO keywords (comma separated)"
                />
              </div>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
              Error: {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
              className="bg-error text-white "
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading && (
                <Icon
                  icon="heroicons:arrow-path-20-solid"
                  className="w-4 h-4 animate-spin"
                />
              )}
              {loading ? "Creating..." : "Create Skill"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillPage;
