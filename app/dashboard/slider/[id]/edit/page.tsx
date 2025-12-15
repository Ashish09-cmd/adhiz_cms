'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/Button';

interface Skill {
  id: number;
  title: string;
  priority: number;
  description: string;
  slug: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  created_at: string;
  updated_at: string;
}

const EditSkillPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    title: '',
    priority: 1,
    description: '',
    slug: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: ''
  });

  const [originalData, setOriginalData] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await fetch(`/api/skills/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch skill');
        }
        const skill: Skill = await response.json();
        setOriginalData(skill);
        setFormData({
          title: skill.title,
          priority: skill.priority,
          description: skill.description,
          slug: skill.slug,
          seo_title: skill.seo_title || '',
          seo_description: skill.seo_description || '',
          seo_keywords: skill.seo_keywords || ''
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchSkill();
    }
  }, [id]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (formData.priority < 1 || formData.priority > 10) {
      errors.priority = 'Priority must be between 1 and 10';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value) || 1 : value
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update skill');
      }

      setSuccess(true);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        window.location.href = '/dashboard/skills';
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard/skills';
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return (
      formData.title !== originalData.title ||
      formData.priority !== originalData.priority ||
      formData.description !== originalData.description ||
      formData.slug !== originalData.slug ||
      formData.seo_title !== (originalData.seo_title || '') ||
      formData.seo_description !== (originalData.seo_description || '') ||
      formData.seo_keywords !== (originalData.seo_keywords || '')
    );
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !originalData) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="text-gray-800 cursor-pointer hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Back to Skills List"
          >
            <Icon icon="heroicons:arrow-left-20-solid" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-md font-bold text-gray-900 font-poppins">Edit Skill</h1>
            {/* {originalData && (
              <p className="text-sm text-gray-600 mt-1">Editing: {originalData.title}</p>
            )} */}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <Icon icon="heroicons:check-circle-20-solid" className="w-5 h-5" />
          Skill updated successfully! Redirecting...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <Icon icon="heroicons:exclamation-triangle-20-solid" className="w-5 h-5" />
          Error: {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className='flex flex-col gap-4'>
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2  transition-colors ${
                  formErrors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter skill title"
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  formErrors.priority ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.priority && (
                <p className="mt-1 text-sm text-red-600">{formErrors.priority}</p>
              )}
              <p className="mt-2 text-xs font-regular text-error italic">Priority level (1-10, higher numbers indicate higher priority)</p>
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2  transition-colors ${
                  formErrors.slug ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="javascript-fundamentals"
              />
              {formErrors.slug && (
                <p className="mt-1 text-sm text-red-600">{formErrors.slug}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">URL-friendly identifier (lowercase, numbers, hyphens only)</p>
            </div>
             
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2  transition-colors ${
                formErrors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter detailed skill description"
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>
          </div>

          <div>
          {/* SEO Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              {/* SEO Title */}
              <div>
                <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  id="seo_title"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2  transition-colors"
                  placeholder="Enter SEO title"
                />
                <p className="mt-1 text-xs text-gray-500">Title that appears in search engine results (leave empty to use main title)</p>
              </div>

              {/* SEO Description */}
              <div>
                <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  id="seo_description"
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2  transition-colors"
                  placeholder="Enter SEO description"
                />
                <p className="mt-1 text-xs text-gray-500">Description that appears in search engine results</p>
              </div>

              {/* SEO Keywords */}
              <div>
                <label htmlFor="seo_keywords" className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  id="seo_keywords"
                  name="seo_keywords"
                  value={formData.seo_keywords}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2  transition-colors"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="mt-1 text-xs text-gray-500">Comma-separated keywords for search optimization</p>
              </div>
            </div>
           </div>
          </div>
          </div>
          <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !hasChanges()}
            className="flex items-center gap-2"
            onClick={handleSubmit}
          >
            {loading && <Icon icon="heroicons:arrow-path-20-solid" className="w-4 h-4 animate-spin" />}
            {loading ? 'Updating...' : 'Update Skill'}
          </Button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default EditSkillPage;
