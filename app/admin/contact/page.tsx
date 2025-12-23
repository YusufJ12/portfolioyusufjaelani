"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Mail, Trash2, Eye, EyeOff } from "lucide-react";
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
  email: string;
  phone: string | null;
  location: string | null;
}

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminContactPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [profileRes, messagesRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/contact"),
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data);
      }

      if (messagesRes.ok) {
        const data = await messagesRes.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
        }),
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

  async function handleDeleteMessage(id: number) {
    const result = await MySwal.fire({
      ...swalConfig,
      title: "Yakin ingin menghapus pesan ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((msgs) => msgs.filter((m) => m.id !== id));
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Pesan dihapus",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "Failed to delete message",
      });
    }
  }

  async function handleToggleRead(id: number, currentRead: boolean) {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });

      if (res.ok) {
        setMessages((msgs) =>
          msgs.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
        );
      }
    } catch (error) {
      console.error("Failed to update message:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffe400]" />
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
          Contact Page
        </h1>
        <p className="text-gray-500 dark:text-[#66768f]">
          Edit info kontak dan kelola pesan masuk
        </p>
      </div>

      {/* Contact Info */}
      <div className="bg-white dark:bg-[#131C31] rounded-xl p-6 border border-gray-200 dark:border-[#222F43]">
        <h2 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9] mb-4">
          Contact Info
        </h2>

        <form onSubmit={handleSaveContact} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, email: e.target.value } : p))
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                Phone
              </label>
              <input
                type="text"
                value={profile?.phone || ""}
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, phone: e.target.value } : p))
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A9C9] mb-1">
                Location
              </label>
              <input
                type="text"
                value={profile?.location || ""}
                onChange={(e) =>
                  setProfile((p) =>
                    p ? { ...p, location: e.target.value } : p
                  )
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
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan
          </button>
        </form>
      </div>

      {/* Messages Inbox */}
      <div className="bg-white dark:bg-[#131C31] rounded-xl p-6 border border-gray-200 dark:border-[#222F43]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#101010] dark:text-[#94A9C9]">
            Pesan Masuk
          </h2>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm">
              {unreadCount} belum dibaca
            </span>
          )}
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-[#66768f]">
            <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Belum ada pesan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-lg border ${
                  msg.read
                    ? "bg-gray-50 dark:bg-[#0F172A] border-gray-200 dark:border-[#222F43]"
                    : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-[#101010] dark:text-[#94A9C9]">
                        {msg.name}
                      </p>
                      <span className="text-sm text-gray-500 dark:text-[#66768f]">
                        ({msg.email})
                      </span>
                    </div>
                    <p className="font-semibold text-[#101010] dark:text-[#94A9C9] mb-1">
                      {msg.subject}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[#66768f] line-clamp-2">
                      {msg.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(msg.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleRead(msg.id, msg.read)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-[#222F43] rounded-lg transition-colors"
                      title={msg.read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                    >
                      {msg.read ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-[#ffe400]" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
