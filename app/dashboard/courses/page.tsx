"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import { Button } from "../../../components/ui/Button";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  course_name: string;
  title: string;
  duration: number | null;
  status: string | null;
  type: string | null;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  created_at: string;
  updated_at: string;
}

const CoursesPage: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await api.get("/courses");
      const data: Course[] = res.data.data || res.data;

      setCourses(data);
      setFilteredCourses(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH FILTER =================
  useEffect(() => {
    if (!search.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const term = search.toLowerCase();
    const filtered = courses.filter(
      (course) =>
        course.course_name.toLowerCase().includes(term) ||
        course.title.toLowerCase().includes(term)
    );

    setFilteredCourses(filtered);
  }, [search, courses]);

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= DELETE COURSE =================
  const handleConfirmDelete = async () => {
    if (!selectedCourse) return;

    try {
      setDeleting(true);

      // ✅ FIXED ENDPOINT
      await api.delete(`/courses/${selectedCourse.id}`);

      setCourses((prev) =>
        prev.filter((course) => course.id !== selectedCourse.id)
      );

      setFilteredCourses((prev) =>
        prev.filter((course) => course.id !== selectedCourse.id)
      );

      setShowDeleteModal(false);
      setSelectedCourse(null);
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete course"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleAddCourse = () => {
    router.push("/dashboard/courses/add");
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleViewClick = (course: Course) => {
    setSelectedCourse(course);
    setShowViewModal(true);
  };

  // ================= UI =================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          Courses List
        </h1>
        <Button
          variant="primary"
          size="md"
          className="flex items-center gap-2 bg-green-600 text-white"
          onClick={handleAddCourse}
        >
          <Icon icon="heroicons:plus-20-solid" className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg">
        <input
          type="text"
          placeholder="Search by course name or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-border-darker">
        {loading && (
          <div className="p-6 text-center text-gray-600">
            <Icon
              icon="heroicons:arrow-path-20-solid"
              className="w-5 h-5 animate-spin inline-block mr-2"
            />
            Loading courses...
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && filteredCourses.length === 0 && (
          <div className="p-6 text-center text-gray-600">No courses found.</div>
        )}

        {!loading && !error && filteredCourses.length > 0 && (
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold">
                  Course Name
                </th>
                <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold">
                  Title
                </th>
                <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold">
                  Duration
                </th>
                <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold">
                  Type
                </th>
                <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold">
                  Status
                </th>
                <th className="px-6 py-3 border border-[#ddd] text-left text-xs font-bold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border border-[#ddd]">
                    {course.course_name}
                  </td>
                  <td className="px-6 py-4 border border-[#ddd]">
                    {course.title}
                  </td>
                  <td className="px-6 py-4 border border-[#ddd]">
                    {course.duration ? `${course.duration} hrs` : "-"}
                  </td>
                  <td className="px-6 py-4 border border-[#ddd]">
                    {course.type || "-"}
                  </td>
                  <td className="px-6 py-4 border border-[#ddd]">
                    <span
                      className={`text-xs font-semibold ${
                        course.status === "active"
                          ? "text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      {course.status || "inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 border border-[#ddd]">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewClick(course)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View"
                      >
                        <Icon
                          icon="heroicons:eye-20-solid"
                          className="w-4 h-4"
                        />
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/dashboard/courses/edit/${course.slug}`)
                        }
                        className="text-green-600 hover:text-green-900"
                      >
                        <Icon icon="heroicons:pencil-20-solid" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(course)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Icon icon="heroicons:trash-20-solid" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000040]">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              Delete Course
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedCourse.course_name}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showViewModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000040]">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                View Course
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="heroicons:x-mark-20-solid" className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Title:</span>{" "}
                {selectedCourse.title}
              </div>

              <div>
                <span className="font-semibold">Slug:</span>{" "}
                {selectedCourse.slug}
              </div>

              <div>
                <span className="font-semibold">Course Name:</span>{" "}
                {selectedCourse.course_name}
              </div>

              <div>
                <span className="font-semibold">Type:</span>
                {selectedCourse.type}
              </div>

              <div>
                <span className="font-semibold">Status:</span>{" "}
                {selectedCourse.status}
              </div>

              <div>
                <span className="font-semibold">Duration:</span>
                {selectedCourse.duration}
              </div>
              <div>
                <span className="font-semibold">Meta Title:</span>
                <p className="mt-1 text-gray-700">
                  {selectedCourse.meta_title}
                </p>
              </div>
              <div>
                <span className="font-semibold">Meta Description:</span>
                <p className="mt-1 text-gray-700">
                  {selectedCourse.meta_description}
                </p>
              </div>
              <div>
                <span className="font-semibold">Meta Keyboard:</span>{" "}
                <p className="mt-1 text-gray-700">
                  {selectedCourse.meta_keywords}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
