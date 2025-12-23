"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Common configuration for SweetAlert2
const swalConfig = {
  confirmButtonColor: "#ffe400",
  cancelButtonColor: "#d33",
  customClass: {
    confirmButton: "text-[#101010] font-bold",
  },
};

interface Profile {
  id: number;
  name: string;
  title: string;
  description: string;
  email: string;
  phone: string | null;
  location: string | null;
  resumeUrl: string | null;
  avatarUrl: string | null;
  availableForFreelance: boolean;
  heroTagline: string | null;
}

interface Experience {
  id: number;
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string | null;
  achievements: string;
  websiteLinks: string;
}

interface Education {
  id: number;
  type: string;
  title: string;
  institution: string;
  year: string;
  certificateUrl: string | null;
}

export default function AdminAboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("profile");
  const [mounted, setMounted] = useState(false);

  // Experience Form State
  const [showExpForm, setShowExpForm] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expFormData, setExpFormData] = useState({
    title: "",
    company: "",
    description: "",
    startDate: "",
    endDate: "",
    achievements: [] as string[],
    websiteLinks: [] as string[],
    order: 0,
  });

  // Education Form State
  const [showEduForm, setShowEduForm] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [eduFormData, setEduFormData] = useState({
    type: "Education",
    title: "",
    institution: "",
    year: "",
    certificateUrl: "",
    order: 0,
  });

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [profileRes, expRes, eduRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/experiences"),
        fetch("/api/education"),
      ]);

      if (profileRes.ok) setProfile(await profileRes.json());
      if (expRes.ok) setExperiences(await expRes.json());
      if (eduRes.ok) setEducation(await eduRes.json());
    } catch (error) {
      console.error("Failed to fetch:", error);
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Oops...",
        text: "Failed to load data",
      });
    } finally {
      setLoading(false);
    }
  }

  // --- Experience Actions ---
  const handleEditExperience = (exp: Experience) => {
    setEditingExp(exp);
    setExpFormData({
      title: exp.title,
      company: exp.company,
      description: exp.description,
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
      websiteLinks: Array.isArray(exp.websiteLinks) ? exp.websiteLinks : [],
      order: (exp as any).order || 0,
    });
    setShowExpForm(true);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingExp ? `/api/experiences/${editingExp.id}` : "/api/experiences";
      const method = editingExp ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expFormData),
      });

      if (res.ok) {
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: editingExp ? "Experience updated!" : "Experience added!",
          timer: 2000,
          showConfirmButton: false,
        });
        setShowExpForm(false);
        setEditingExp(null);
        setExpFormData({
          title: "", company: "", description: "", startDate: "", endDate: "",
          achievements: [], websiteLinks: [], order: 0
        });
        fetchData();
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Failed to save",
        });
      }
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "An error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  async function handleDeleteExperience(id: number) {
    const result = await MySwal.fire({
      ...swalConfig,
      title: "Yakin ingin menghapus experience ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      setExperiences((exp) => exp.filter((e) => e.id !== id));
      MySwal.fire({
        ...swalConfig,
        icon: "success",
        title: "Experience deleted",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Failed to delete",
      });
    }
  }

  // --- Education Actions ---
  const handleEditEducation = (edu: Education) => {
    setEditingEdu(edu);
    setEduFormData({
      type: edu.type,
      title: edu.title,
      institution: edu.institution,
      year: edu.year,
      certificateUrl: edu.certificateUrl || "",
      order: (edu as any).order || 0,
    });
    setShowEduForm(true);
  };

  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingEdu ? `/api/education/${editingEdu.id}` : "/api/education";
      const method = editingEdu ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eduFormData),
      });

      if (res.ok) {
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: editingEdu ? "Education updated!" : "Education added!",
          timer: 2000,
          showConfirmButton: false,
        });
        setShowEduForm(false);
        setEditingEdu(null);
        setEduFormData({
          type: "Education", title: "", institution: "", year: "", certificateUrl: "", order: 0
        });
        fetchData();
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Failed to save education",
        });
      }
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "An error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  async function handleDeleteEducation(id: number) {
    const result = await MySwal.fire({
      ...swalConfig,
      title: "Yakin ingin menghapus data ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`/api/education/${id}`, { method: "DELETE" });
      setEducation((edu) => edu.filter((e) => e.id !== id));
      MySwal.fire({
        ...swalConfig,
        icon: "success",
        title: "Education deleted",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Failed to delete",
      });
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Profile updated!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Failed to update profile",
        });
      }
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "An error occurred",
      });
    } finally {
      setSaving(false);
    }
  }

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffe400]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
          About Page
        </h1>
        <p className="text-gray-500 dark:text-[#66768f]">
          Edit konten halaman about
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-[#131C31] rounded-xl border border-gray-200 dark:border-[#222F43]">
        <button
          onClick={() => setExpandedSection(expandedSection === "profile" ? null : "profile")}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <h2 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9]">
            Profile Info
          </h2>
          {expandedSection === "profile" ? <ChevronUp /> : <ChevronDown />}
        </button>

        {expandedSection === "profile" && profile && (
          <form onSubmit={handleSaveProfile} className="p-6 pt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                  Resume URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={profile.resumeUrl || ""}
                    onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                    placeholder="/resume.pdf"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        if (file.type !== "application/pdf") {
                          MySwal.fire({
                            ...swalConfig,
                            icon: "error",
                            title: "Only PDF files allowed",
                          });
                          return;
                        }

                        const formData = new FormData();
                        formData.append("file", file);

                        MySwal.fire({
                          title: "Uploading resume...",
                          allowOutsideClick: false,
                          didOpen: () => {
                            Swal.showLoading();
                          },
                        });

                        try {
                          const res = await fetch("/api/upload/resume", {
                            method: "POST",
                            body: formData,
                          });

                          if (res.ok) {
                            const data = await res.json();
                            setProfile({ ...profile, resumeUrl: data.url });
                            MySwal.fire({
                              ...swalConfig,
                              icon: "success",
                              title: "Resume uploaded!",
                              text: "Pelase save profile to persist changes.",
                              timer: 2000,
                            });
                          } else {
                            MySwal.fire({
                              ...swalConfig,
                              icon: "error",
                              title: "Upload failed",
                            });
                          }
                        } catch (err) {
                          MySwal.fire({
                            ...swalConfig,
                            icon: "error",
                            title: "Error uploading file",
                          });
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      className="h-full px-4 py-2 bg-gray-100 dark:bg-[#0F172A] border border-gray-200 dark:border-[#222F43] rounded-lg text-[#101010] dark:text-[#94A9C9] hover:bg-gray-200 dark:hover:bg-[#1E293B]"
                    >
                      Upload PDF
                    </button>
                  </div>
                </div>
                {profile.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs text-blue-500 hover:underline"
                  >
                    View Current Resume
                  </a>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                Bio / Description
              </label>
              <textarea
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-[#ffe400] text-[#101010] rounded-lg font-semibold hover:bg-[#ffe400]/90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Profile
            </button>
          </form>
        )}
      </div>

      {/* Experience Section */}
      <div className="bg-white dark:bg-[#131C31] rounded-xl border border-gray-200 dark:border-[#222F43]">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setExpandedSection(expandedSection === "experience" ? null : "experience")}
            className="flex-1 flex items-center justify-between text-left"
          >
            <h2 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9]">
              Experience ({experiences.length})
            </h2>
            {expandedSection === "experience" ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedSection === "experience" && (
            <button
              onClick={() => {
                setEditingExp(null);
                setExpFormData({
                  title: "", company: "", description: "", startDate: "", endDate: "",
                  achievements: [], websiteLinks: [], order: 0
                });
                setShowExpForm(true);
              }}
              className="ml-4 p-2 bg-[#ffe400] text-[#101010] rounded-lg hover:bg-[#ffe400]/90"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {expandedSection === "experience" && (
          <div className="p-6 pt-0 space-y-6">
            {showExpForm && (
              <form onSubmit={handleSaveExperience} className="p-4 border border-[#ffe400] rounded-lg space-y-4">
                <h3 className="font-semibold text-[#101010] dark:text-[#94A9C9]">
                  {editingExp ? "Edit Experience" : "Add New Experience"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    placeholder="Job Title"
                    value={expFormData.title}
                    onChange={(e) => setExpFormData({ ...expFormData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                    required
                  />
                  <input
                    placeholder="Company"
                    value={expFormData.company}
                    onChange={(e) => setExpFormData({ ...expFormData, company: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                    required
                  />
                  <input
                    placeholder="Start Date (e.g., Oct 2021)"
                    value={expFormData.startDate}
                    onChange={(e) => setExpFormData({ ...expFormData, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                    required
                  />
                  <input
                    placeholder="End Date (e.g., Present)"
                    value={expFormData.endDate}
                    onChange={(e) => setExpFormData({ ...expFormData, endDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={expFormData.description}
                  onChange={(e) => setExpFormData({ ...expFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowExpForm(false)}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-[#ffe400] text-[#101010] rounded-lg font-semibold disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-start justify-between p-4 bg-gray-50 dark:bg-[#0F172A] rounded-lg group"
                >
                  <div className="flex-1">
                    <p className="font-medium text-[#101010] dark:text-[#94A9C9]">
                      {exp.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-[#66768f]">
                      {exp.company} • {exp.startDate} - {exp.endDate || "Sekarang"}
                    </p>
                    <p className="text-sm mt-2 text-gray-600 dark:text-[#94A9C9]/70 line-clamp-2">
                      {exp.description}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditExperience(exp)}
                      className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg text-yellow-600"
                    >
                      <Plus className="w-4 h-4 rotate-45" /> {/* Use Plus as edit for now or import Edit */}
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {experiences.length === 0 && !showExpForm && (
                <p className="text-center text-gray-500 py-4">Belum ada experience</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-white dark:bg-[#131C31] rounded-xl border border-gray-200 dark:border-[#222F43]">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setExpandedSection(expandedSection === "education" ? null : "education")}
            className="flex-1 flex items-center justify-between text-left"
          >
            <h2 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9]">
              Education & Certifications ({education.length})
            </h2>
            {expandedSection === "education" ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedSection === "education" && (
            <button
              onClick={() => {
                setEditingEdu(null);
                setEduFormData({
                  type: "Education", title: "", institution: "", year: "", certificateUrl: "", order: 0
                });
                setShowEduForm(true);
              }}
              className="ml-4 p-2 bg-[#ffe400] text-[#101010] rounded-lg hover:bg-[#ffe400]/90"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {expandedSection === "education" && (
          <div className="p-6 pt-0 space-y-6">
            {showEduForm && (
              <form onSubmit={handleSaveEducation} className="p-4 border border-[#ffe400] rounded-lg space-y-4">
                <h3 className="font-semibold text-[#101010] dark:text-[#94A9C9]">
                  {editingEdu ? "Edit Education/Cert" : "Add New Education/Cert"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={eduFormData.type}
                    onChange={(e) => setEduFormData({ ...eduFormData, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                  >
                    <option value="Education">Education</option>
                    <option value="Certification">Certification</option>
                  </select>
                  <input
                    placeholder="Title (Indonesian or English)"
                    value={eduFormData.title}
                    onChange={(e) => setEduFormData({ ...eduFormData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                    required
                  />
                  <input
                    placeholder="Institution"
                    value={eduFormData.institution}
                    onChange={(e) => setEduFormData({ ...eduFormData, institution: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                    required
                  />
                  <input
                    placeholder="Year (e.g., 2018 - 2022)"
                    value={eduFormData.year}
                    onChange={(e) => setEduFormData({ ...eduFormData, year: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEduForm(false)}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-[#ffe400] text-[#101010] rounded-lg font-semibold disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="flex items-start justify-between p-4 bg-gray-50 dark:bg-[#0F172A] rounded-lg group"
                >
                  <div>
                    <p className="font-medium text-[#101010] dark:text-[#94A9C9]">
                      {edu.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-[#66768f]">
                      {edu.institution} • {edu.year}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded">
                      {edu.type}
                    </span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditEducation(edu)}
                      className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg text-yellow-600"
                    >
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {education.length === 0 && !showEduForm && (
                <p className="text-center text-gray-500 py-4">Belum ada education</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
