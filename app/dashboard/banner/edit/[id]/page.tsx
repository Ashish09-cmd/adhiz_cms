"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { useParams, useRouter } from "next/navigation";

interface Banner {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  start_at?: string;
  end_at?: string;
  is_active: boolean;
}

const UpdateBannerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [formData, setFormData] = useState<Banner>({
    id: "",
    title: "",
    slug: "",
    image_url: "",
    start_at: "",
    end_at: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------------- FETCH EXISTING BANNER ----------------
  const fetchBanner = async () => {
    try {
      setFetching(true);
      const res = await api.get(`/hero/banner/${id}`);
      const data: Banner = res.data.data || res.data;

      setFormData({
        id: data.id,
        title: data.title || "",
        slug: (data as any).slug || "",
        image_url: data.image_url || "",
        start_at: data.start_at ? data.start_at.split(" ")[0] : "",
        end_at: data.end_at ? data.end_at.split(" ")[0] : "",
        is_active: data.is_active,
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load banner"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) fetchBanner();
  }, [id]);

  // ---------------- HELPERS ----------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_active" ? value === "true" : value,
    }));
  };

  const cleanPayload = (data: any) => {
    const cleaned: any = {};
    Object.keys(data).forEach((key) => {
      cleaned[key] = data[key] === "" ? null : data[key];
    });
    return cleaned;
  };

  // ---------------- SUBMIT UPDATE ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = cleanPayload(formData);
      await api.put(`/hero/banner/${id}`, payload);

      router.push("/dashboard/banner");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update banner"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  if (fetching) {
    return (
      <div className="p-6 text-center text-gray-600">
        <Icon
          icon="heroicons:arrow-path-20-solid"
          className="w-5 h-5 animate-spin inline-block mr-2"
        />
        Loading banner...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-800 cursor-pointer hover:text-gray-900 p-2 hover:bg-gray-100">
          <Icon icon="heroicons:arrow-left-20-solid" className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          Edit Banner
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
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Banner"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBannerPage;
