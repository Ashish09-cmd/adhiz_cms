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

const ViewSkillPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await fetch(`/api/skills/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch skill');
        }
        const skillData: Skill = await response.json();
        setSkill(skillData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSkill();
    }
  }, [id]);

  const handleBack = () => {
    window.location.href = '/dashboard/skills';
  };

  const handleEdit = () => {
    window.location.href = `/dashboard/skills/${id}/edit`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 text-red-800';
    if (priority >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A73E8]"></div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error || 'Skill not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
          >
            <Icon icon="heroicons:arrow-left-20-solid" className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-poppins">View Skill</h1>
        </div>
        <Button
          variant="primary"
          size="md"
          className="flex items-center gap-2 bg-[#1A73E8] hover:bg-blue-700"
          onClick={handleEdit}
        >
          <Icon icon="heroicons:pencil-20-solid" className="w-4 h-4" />
          Edit Skill
        </Button>
      </div>

      {/* Skill Details */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <p className="text-lg font-semibold text-gray-900 font-dmSans">{skill.title}</p>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(skill.priority)}`}>
              {skill.priority}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <p className="text-gray-700 font-dmSans whitespace-pre-wrap">{skill.description}</p>
        </div>

        {/* Slug */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug
          </label>
          <p className="text-gray-700 font-dmSans">{skill.slug}</p>
        </div>

        {/* SEO Title */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Title
          </label>
          <p className="text-gray-700 font-dmSans">{skill.seo_title || 'Not set'}</p>
        </div>

        {/* SEO Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Description
          </label>
          <p className="text-gray-700 font-dmSans whitespace-pre-wrap">{skill.seo_description || 'Not set'}</p>
        </div>

        {/* SEO Keywords */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Keywords
          </label>
          <p className="text-gray-700 font-dmSans">{skill.seo_keywords || 'Not set'}</p>
        </div>

        {/* Timestamps */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Created At
            </label>
            <p className="text-gray-700 font-dmSans">{formatDate(skill.created_at)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Updated At
            </label>
            <p className="text-gray-700 font-dmSans">{formatDate(skill.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSkillPage;
