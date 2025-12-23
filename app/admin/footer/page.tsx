"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2, Edit2, X } from "lucide-react";
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

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

interface Profile {
  name: string;
  title: string;
}

export default function AdminFooterPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState({ platform: "", url: "", icon: "" });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [profileRes, linksRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/social-links"),
      ]);

      if (profileRes.ok) setProfile(await profileRes.json());
      if (linksRes.ok) setSocialLinks(await linksRes.json());
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
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
        body: JSON.stringify({ name: profile.name, title: profile.title }),
      });

      if (res.ok) {
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Berhasil disimpan!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Gagal menyimpan",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveLink(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingLink ? "PUT" : "POST";
      const url = editingLink 
        ? `/api/social-links/${editingLink.id}` 
        : "/api/social-links";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchData();
        setShowModal(false);
        setEditingLink(null);
        setFormData({ platform: "", url: "", icon: "" });
      }
    } catch (error) {
      console.error("Failed to save link:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteLink(id: number) {
    const result = await MySwal.fire({
      ...swalConfig,
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`/api/social-links/${id}`, { method: "DELETE" });
      setSocialLinks((links) => links.filter((l) => l.id !== id));
      MySwal.fire({
        ...swalConfig,
        icon: "success",
        title: "Link deleted",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Failed to delete",
      });
    }
  }

  function openEditModal(link: SocialLink) {
    setEditingLink(link);
    setFormData({ platform: link.platform, url: link.url, icon: link.icon });
    setShowModal(true);
  }

  if (loading) {
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
          Footer
        </h1>
        <p className="text-gray-500 dark:text-[#66768f]">
          Edit konten footer website
        </p>
      </div>

      {/* Brand Info */}
      <div className="bg-white dark:bg-[#131C31] rounded-xl p-6 border border-gray-200 dark:border-[#222F43]">
        <h2 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9] mb-4">
          Brand Info
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
                Tagline
              </label>
              <input
                type="text"
                value={profile?.title || ""}
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, title: e.target.value } : p))
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#ffe400] text-[#101010] rounded-lg font-semibold hover:bg-[#ffe400]/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan
          </button>
        </form>
      </div>

      {/* Social Links */}
      <div className="bg-white dark:bg-[#131C31] rounded-xl p-6 border border-gray-200 dark:border-[#222F43]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9]">
            Social Links
          </h2>
          <button
            onClick={() => {
              setEditingLink(null);
              setFormData({ platform: "", url: "", icon: "" });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#ffe400] text-[#101010] rounded-lg font-semibold hover:bg-[#ffe400]/90"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>

        <div className="space-y-3">
          {socialLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0F172A] rounded-lg"
            >
              <div>
                <p className="font-medium text-[#101010] dark:text-[#94A9C9]">
                  {link.platform}
                </p>
                <p className="text-sm text-gray-500 dark:text-[#66768f] truncate max-w-md">
                  {link.url}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(link)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-[#222F43] rounded-lg"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#131C31] rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9]">
                {editingLink ? "Edit" : "Tambah"} Social Link
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                  Platform
                </label>
                <input
                  type="text"
                  value={formData.platform}
                  onChange={(e) => setFormData((f) => ({ ...f, platform: e.target.value }))}
                  placeholder="GitHub, LinkedIn, Email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                  Icon (lucide-react)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="github, linkedin, mail"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-2 bg-[#ffe400] text-[#101010] rounded-lg font-semibold hover:bg-[#ffe400]/90 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
