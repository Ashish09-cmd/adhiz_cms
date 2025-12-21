"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";

const AddBannerPage: React.FC = () => {

  const [formData, setFormData] = useState({
    title: "",
    slug: "",          // added slug field
    image_url: "",
    start_at: "",
    end_at: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------- HELPERS ----------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "is_active"
          ? value === "true"
          : value,
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
    <div className="max-w-3xl space-y-6">
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
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-6 space-y-5"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Enter banner title"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="enter-slug-for-banner"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Image URL <span className="text-red-500">*</span>
          </label>
          <input
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="https://example.com/banner.jpg"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Publish Date
          </label>
          <input
            type="date"
            name="start_at"
            value={formData.start_at}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Expire Date
          </label>
          <input
            type="date"
            name="end_at"
            value={formData.end_at}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Status
          </label>
          <select
            name="is_active"
            value={String(formData.is_active)}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-600 text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Create Banner"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBannerPage;
