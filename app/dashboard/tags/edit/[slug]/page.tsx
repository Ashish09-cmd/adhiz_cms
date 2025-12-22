"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import { Button } from "../../../../../components/ui/Button";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

/* ================= TYPES ================= */
interface Tag {
  id: string;
  tag_name: string;
  slug: string;
}

/* ================= COMPONENT ================= */
const EditTagPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slugParam = params?.slug as string;

  const [tag, setTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState("");
  const [slug, setSlug] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= AUTO SLUG ================= */
  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  /* ================= FETCH TAG ================= */
  const fetchTag = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/tags/slug/${slugParam}`);
      const data: Tag = res.data.data || res.data;

      setTag(data);
      setTagName(data.tag_name);
      setSlug(data.slug);
    } catch (err) {
      const error = err as AxiosError<{ message?: string; error?: string }>;
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load skill"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slugParam) fetchTag();
  }, [slugParam]);

  /* ================= HANDLERS ================= */
  const handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagName(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tag) return;

    if (!tagName.trim()) {
      setError("Tag name is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await api.put(`/tags/${tag.id}`, {
        tag_name: tagName,
        slug: slug,
      });

      router.push("/dashboard/tags");
    } catch (err) {
      const error = err as AxiosError<{ message?: string; error?: string }>;
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update skill"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        <Icon
          icon="heroicons:arrow-path-20-solid"
          className="w-5 h-5 animate-spin inline-block mr-2"
        />
        Loading tag...
      </div>
    );
  }

  if (error && !tag) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          <Icon icon="heroicons:arrow-left-20-solid" className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          Edit Tag
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Changing slug may affect URLs
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-blue-600 text-white"
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Tag"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditTagPage;
