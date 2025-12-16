"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import { Button } from "../../../../components/ui/Button";

const EditSkillPage: React.FC = () => {
  const { slug } = useParams();
  const router = useRouter();

  const [skillId, setSkillId] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    priority: 1,
    description: "",
    slug: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch skill details
  useEffect(() => {
    if (!slug) return;

    const fetchSkill = async () => {
      try {
        setFetching(true);
        const res = await api.get(`/skills/${slug}`);
        const skill = res.data.data;

        setSkillId(skill.id);
        setFormData({
          title: skill.title,
          priority: skill.priority,
          description: skill.description,
          slug: skill.slug,
          seo_title: skill.seo_title || "",
          seo_description: skill.seo_description || "",
          seo_keywords: skill.seo_keywords || "",
          status: skill.status || "active",
        });
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load skill"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchSkill();
  }, [slug]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? Number(value) : value,
    }));
  };

  // 🔹 Update skill
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.put(`/skills/${skillId}`, formData);
      router.push("/dashboard/skills");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update skill"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/skills");
  };

  if (fetching) {
    return (
      <div className="p-6 text-center">
        <Icon icon="heroicons:arrow-path-20-solid" className="w-5 h-5 animate-spin inline-block mr-2" />
        Loading skill...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <Icon icon="heroicons:arrow-left-20-solid" className="w-5 h-5" />
        </button>
        <h1 className="text-md font-bold text-gray-900 font-poppins">
          Edit Skill
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="flex flex-col gap-4 p-6 border border-gray-border-darker">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  min={1}
                  max={10}
                  className="w-full px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Right SEO */}
            <div className="flex flex-col gap-4 p-6 border border-gray-border-darker">
              <h6 className="font-bold border-b pb-2">SEO Section</h6>

              <input
                name="seo_title"
                value={formData.seo_title}
                onChange={handleInputChange}
                placeholder="SEO Title"
                className="px-3 py-2 border"
              />

              <textarea
                name="seo_description"
                value={formData.seo_description}
                onChange={handleInputChange}
                rows={3}
                placeholder="SEO Description"
                className="px-3 py-2 border"
              />

              <input
                name="seo_keywords"
                value={formData.seo_keywords}
                onChange={handleInputChange}
                placeholder="SEO Keywords"
                className="px-3 py-2 border"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Skill"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSkillPage;
