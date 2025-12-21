"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";
import { AxiosError } from "axios";

interface SkillForm {
  id: string;
  title: string;
  slug: string;
  priority: number;
  description: string;
  status: "active" | "inactive";

  seo_title: string;
  seo_description: string;
  seo_keywords: string;
}

const EditSkillPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [form, setForm] = useState<SkillForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinerLoading, setSpinerLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  /* ----------------------------------------
   Fetch skill by slug
  ----------------------------------------- */
  const fetchSkill = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/skills/slug/${slug}`);
      const skill = res.data.data ?? res.data;

      setForm({
        id: skill.id,
        title: skill.title,
        slug: skill.slug,
        priority: Number(skill.priority) || 1,
        description: skill.description ?? "",
        status: skill.status === "inactive" ? "inactive" : "active",
        seo_title: skill.seo_title ?? "",
        seo_description: skill.seo_description ?? "",
        seo_keywords: skill.seo_keywords ?? "",
      });
    } catch (err) {
      const error = err as AxiosError<{ message?: string; error?: string }>;
      console.error(error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load skills"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkill();
  }, [slug]);

  /* -------------------------------
     Slug generator
  ------------------------------- */
  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  /* ----------------------------------------
   Handle input change
  ----------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!form) return;
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "priority" ? Number(value) : value,
    });
  };

  /* -------------------------------
     Handle title change → auto-update slug
  ------------------------------- */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!form) return;

    setForm({
      ...form,
      title: value,
      slug: slugTouched ? form.slug : generateSlug(value), // only update slug if not manually touched
    });
  };

  /* -------------------------------
     Handle manual slug change
  ------------------------------- */
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSlugTouched(true);
    if (!form) return;

    setForm({
      ...form,
      slug: value,
    });
  };
  /* ----------------------------------------
   Update skill
  ----------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    try {
      setSaving(true);

      await api.put(`/skills/${form.id}`, {
        title: form.title,
        slug: form.slug,
        priority: form.priority,
        description: form.description,
        status: form.status,
        seo_title: form.seo_title,
        seo_description: form.seo_description,
        seo_keywords: form.seo_keywords,
      });

      router.push("/dashboard/skills");
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

  /* ----------------------------------------
   UI states
  ----------------------------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center  h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700">
        {error || "Something went wrong"}
      </div>
    );
  }

  const handleAddSkill = () => {
    router.push("/dashboard/skills/add");
  };

  /* ----------------------------------------
   Form
  ----------------------------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex  items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-800 cursor-pointer hover:text-gray-900 p-2 hover:bg-gray-100"
          >
            <Icon icon="heroicons:arrow-left-20-solid" className="w-5 h-5" />
          </button>
          <h1 className="text-md font-bold text-gray-900 font-poppins">
            Edit Skill
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            className="flex items-center gap-1 text-xs bg-green-600 text-white cursor-pointer"
            onClick={handleAddSkill}
          >
            <Icon icon="akar-icons:edit" className="w-4 h-4" />
            Add Skill
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={loading}
            className="flex items-center gap-1 text-xs bg-blue-600 text-white cursor-pointer"
          >
            <Icon icon="ion:list-outline" className="w-4 h-4" />
            List
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={spinerLoading}
            className="flex items-center gap-1 text-xs bg-blue-600 text-white cursor-pointer"
          >
            <Icon icon="heroicons:eye-20-solid" className="w-4 h-4" />
            View
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Section */}
            <div className="flex flex-col gap-4 p-6 bg-white border border-gray-border-darker">
              {/* title */}
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
                  value={form.title}
                  onChange={handleTitleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
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
                  value={form.priority}
                  onChange={handleSlugChange}
                  min={1}
                  max={10}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
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
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
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
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
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
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Right Section: SEO */}
            <div className="flex flex-col gap-4 p-6 bg-white border border-gray-border-darker">
              <h6 className="text-gray-800 font-poppins font-bold text-sm pb-2 border-gray-border-darker border-b">
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
                  value={form.seo_title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
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
                  value={form.seo_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
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
                  value={form.seo_keywords}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
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
              onClick={() => router.back()}
              disabled={loading}
              className="bg-error text-white"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving && (
                <Icon
                  icon="heroicons:arrow-path-20-solid"
                  className="bg-blue-600 text-white"
                />
              )}
              {saving ? "Updating..." : "Update Skill"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSkillPage;
