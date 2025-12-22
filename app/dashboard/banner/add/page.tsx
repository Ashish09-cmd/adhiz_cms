"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";

const AddBannerPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "", // added slug field
    image_url: "",
    start_at: "",
    end_at: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    og_image_url: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------- HELPERS ----------------
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_active" ? value === "true" : value,
    }));
  };

  // convert empty string -> null
  const cleanPayload = (data: any) => {
    const cleaned: any = {};
    Object.keys(data).forEach((key) => {
      cleaned[key] = data[key] === "" ? null : data[key];
    });
    return cleaned;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = cleanPayload(formData);

      await api.post("/hero/banner", payload);

      window.location.href = "/dashboard/banner";
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create banner"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className=" space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="text-gray-800 cursor-pointer hover:text-gray-900 p-2 hover:bg-gray-100"
        >
          <Icon icon="heroicons:arrow-left-20-solid" className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          Add Banner
        </h1>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white p-8">
        <form onSubmit={handleSubmit} className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left section */}
            <div className="flex flex-col gap-8 p-6 bg-white border border-gray-border-darker">
              <div className="flex items-center gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-0"
                    placeholder="Enter banner title"
                  />
                </div>
              </div>

              {/* Slug */}
              <div className="flex items-centerg gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                </div>
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full flex-1 border-gray-300 focus:outline-0 border rounded px-3 py-2 text-sm"
                  placeholder="enter-slug-for-banner"
                />
              </div>

              {/* Image URL */}
              <div className="flex items-center gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 focus:outline-0 rounded px-3 py-2 text-sm"
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div className="flex items-center gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    type="date"
                    name="start_at"
                    value={formData.start_at}
                    onChange={handleChange}
                    className="w-full border border-gray-300 focus:outline-0 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="flex items-center gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expire Date
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    type="date"
                    name="end_at"
                    value={formData.end_at}
                    onChange={handleChange}
                    className="w-full border-gray-300 focus:outline-0 border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex gap-2 ">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                </div>
                <div className="flex-1">
                  <select
                    name="is_active"
                    value={String(formData.is_active)}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Right section */}
            <div className="flex flex-col gap-8 p-6 bg-white border border-gray-border-darker">
              <h6 className="text-gray-800 font-poppins font-bold text-sm pb-2 border-gray-border-darker border-b">
                SEO Section
              </h6>
              <div className="flex items-center gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    name="seo_title"
                    value={formData.seo_title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-0"
                    placeholder="Enter seo title"
                  />
                </div>
              </div>

              <div className="flex items-centerg gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Descriptio
                  </label>
                </div>
                <textarea
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleChange}
                  className="w-full flex-1 border-gray-300 focus:outline-0 border rounded px-3 py-2 text-sm"
                  placeholder="Enter seo description"
                />
              </div>
              <div className="flex items-center gap-2">
                <div>
                <label
                  htmlFor="seo_keywords"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  SEO Keywords
                </label>
                </div>
                <div className="flex-1">
                <input
                  type="text"
                  name="seo_keywords"
                  value={formData.seo_keywords}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                  placeholder="Enter SEO keywords (comma separated)"
                />
                </div>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => window.history.back()}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 text-white cursor-pointer"
              disabled={loading}
            >
              {loading ? "Saving..." : "Create Banner"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBannerPage;
