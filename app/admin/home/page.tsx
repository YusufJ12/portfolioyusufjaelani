"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2, X } from "lucide-react";
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
  heroTagline: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  avatarUrl: string | null;
}

interface Skill {
  id: number;
  category: string;
  name: string;
  description: string;
  icon: string;
  technologies: string[];
  order: number;
}

export default function AdminHomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Skill Form State
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [skillFormData, setSkillFormData] = useState({
    category: "",
    name: "",
    description: "",
    icon: "",
    technologies: [] as string[],
    order: 0,
  });

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [profileRes, skillsRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/skills"),
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data);
      }

      if (skillsRes.ok) {
        const data = await skillsRes.json();
        setSkills(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  // --- Skill Actions ---
  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillFormData({
      category: skill.category,
      name: skill.name,
      description: skill.description || "",
      icon: skill.icon || "",
      technologies: skill.technologies || [],
      order: skill.order || 0,
    });
    setShowSkillForm(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingSkill ? `/api/skills/${editingSkill.id}` : "/api/skills";
      const method = editingSkill ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillFormData),
      });

      if (res.ok) {
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: editingSkill ? "Skill updated!" : "Skill added!",
          timer: 2000,
          showConfirmButton: false,
        });
        setShowSkillForm(false);
        setEditingSkill(null);
        setSkillFormData({
          category: "", name: "", description: "", icon: "", technologies: [], order: 0
        });
        fetchData();
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Failed to save skill",
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

  const handleDeleteSkill = async (id: number) => {
    const result = await MySwal.fire({
      ...swalConfig,
      title: "Yakin ingin menghapus skill ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (res.ok) {
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Skill deleted",
          timer: 1500,
          showConfirmButton: false,
        });
        setSkills(skills.filter(s => s.id !== id));
      }
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Failed to delete skill",
      });
    }
  };

  const addTech = () => {
    if (tagInput.trim() && !skillFormData.technologies.includes(tagInput.trim())) {
      setSkillFormData({
        ...skillFormData,
        technologies: [...skillFormData.technologies, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const removeTech = (tech: string) => {
    setSkillFormData({
      ...skillFormData,
      technologies: skillFormData.technologies.filter(t => t !== tech)
    });
  };

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
          title: "Berhasil disimpan!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Gagal menyimpan",
        });
      }
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Terjadi kesalahan",
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
          Home Page
        </h1>
        <p className="text-gray-500 dark:text-[#66768f]">
          Edit konten yang tampil di halaman home
        </p>
      </div>

      {/* Hero Section Editor */}
      <div className="bg-white dark:bg-[#131C31] rounded-xl p-6 border border-gray-200 dark:border-[#222F43]">
        <h2 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9] mb-4">
          Hero Section
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                Nama
              </label>
              <input
                type="text"
                value={profile?.name || ""}
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, name: e.target.value } : p))
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                Title (TypewriterText)
                <span className="text-xs text-gray-400 ml-2">
                  Pisahkan dengan koma untuk multiple phrases
                </span>
              </label>
              <input
                type="text"
                value={profile?.title || ""}
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, title: e.target.value } : p))
                }
                placeholder="Android Developer,Full Stack Web Developer"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
              Hero Tagline (Badge dengan dot kuning)
            </label>
            <input
              type="text"
              value={profile?.heroTagline || ""}
              onChange={(e) =>
                setProfile((p) =>
                  p ? { ...p, heroTagline: e.target.value } : p
                )
              }
              placeholder="Tersedia untuk pekerjaan lepas (freelance)"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
              Bio / Deskripsi
            </label>
            <textarea
              value={profile?.description || ""}
              onChange={(e) =>
                setProfile((p) =>
                  p ? { ...p, description: e.target.value } : p
                )
              }
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#ffe400] text-[#101010] rounded-lg font-semibold hover:bg-[#ffe400]/90 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan Hero
          </button>
        </form>
      </div>

      {/* Skills Section */}
      <div className="bg-white dark:bg-[#131C31] rounded-xl p-6 border border-gray-200 dark:border-[#222F43]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9]">
            Technical Expertise (Skills)
          </h2>
          <button
            onClick={() => {
              setEditingSkill(null);
              setSkillFormData({
                category: "", name: "", description: "", icon: "", technologies: [], order: 0
              });
              setShowSkillForm(true);
            }}
            className="p-2 bg-[#ffe400] text-[#101010] rounded-lg hover:bg-[#ffe400]/90"
          >
            <Plus size={20} />
          </button>
        </div>

        {showSkillForm && (
          <form onSubmit={handleSaveSkill} className="mb-8 p-4 border border-[#ffe400] rounded-lg space-y-4">
            <h3 className="font-semibold text-[#101010] dark:text-[#94A9C9]">
              {editingSkill ? "Edit Skill" : "Add New Skill Category"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Category (e.g., Web Development)"
                value={skillFormData.category}
                onChange={(e) => setSkillFormData({ ...skillFormData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                required
              />
              <input
                placeholder="Icon Name (Lucide icon name)"
                value={skillFormData.icon}
                onChange={(e) => setSkillFormData({ ...skillFormData, icon: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-[#94A9C9]">
                Technologies
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] outline-none"
                  placeholder="Type tech and press Enter"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="p-2 bg-[#ffe400] text-[#101010] rounded-lg"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {skillFormData.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-[#222F43] text-[#101010] dark:text-[#94A9C9] rounded-full text-xs"
                  >
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSkillForm(false)}
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
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0F172A] rounded-lg group"
            >
              <div>
                <p className="font-medium text-[#101010] dark:text-[#94A9C9]">
                  {skill.category}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skill.technologies.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-white dark:bg-[#131C31] border border-gray-200 dark:border-[#222F43] rounded dark:text-[#94A9C9]/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditSkill(skill)}
                  className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg text-yellow-600"
                >
                  <Plus className="w-4 h-4 rotate-45" />
                </button>
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {skills.length === 0 && !showSkillForm && (
            <p className="text-center text-gray-500 py-4">Belum ada skills</p>
          )}
        </div>
      </div>
    </div>
  );
}
