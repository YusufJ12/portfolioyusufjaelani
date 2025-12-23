"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Loader2, Plus, X, Upload, Image as ImageIcon } from "lucide-react";
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

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "Web",
    tags: [] as string[],
    liveUrl: "",
    githubUrl: "",
    featured: false,
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Project created successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/admin/projects");
        router.refresh();
      } else {
        const error = await res.json();
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Creation failed",
          text: error.error || "Failed to create project",
        });
      }
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, imageUrl: data.url });
        MySwal.fire({
          ...swalConfig,
          icon: "success",
          title: "Image uploaded successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        MySwal.fire({
          ...swalConfig,
          icon: "error",
          title: "Upload failed",
        });
      }
    } catch {
      MySwal.fire({
        ...swalConfig,
        icon: "error",
        title: "An error occurred during upload",
      });
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tagToRemove),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#131C31] text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#101010] dark:text-[#94A9C9]">
            Add New Project
          </h1>
          <p className="text-gray-500 dark:text-[#66768f]">
            Create a new project for your portfolio
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-[#131C31] rounded-xl p-6 border border-gray-200 dark:border-[#222F43] shadow-sm space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-[#94A9C9]">
                Title
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
                placeholder="Project Title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-[#94A9C9]">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
              >
                <option value="Web">Web</option>
                <option value="Mobile">Mobile</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-[#94A9C9]">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
              placeholder="Project description..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700 dark:text-[#94A9C9]">
              Project Image
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
                    placeholder="/projects/filename.jpg"
                  />
                </div>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <div className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-200 dark:border-[#222F43] rounded-xl hover:border-[#ffe400] dark:hover:border-[#ffe400] transition-colors">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-[#ffe400]" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-500">Click to upload image</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative aspect-video bg-gray-100 dark:bg-[#0F172A] rounded-xl overflow-hidden border border-gray-200 dark:border-[#222F43]">
                {formData.imageUrl ? (
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span className="text-sm">No image selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-[#94A9C9]">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
                placeholder="Press Enter to add tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="p-2 bg-[#ffe400] text-[#101010] rounded-lg hover:bg-[#e6cd00]"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-[#222F43] text-[#101010] dark:text-[#94A9C9] rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-[#94A9C9]">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-[#94A9C9]">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-[#ffe400] focus:ring-[#ffe400] accent-[#ffe400]"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-[#94A9C9]">
                Featured Project
              </span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-[#94A9C9]">
                Sort Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-20 px-4 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] bg-white dark:bg-[#0F172A] text-[#101010] dark:text-[#94A9C9] focus:ring-2 focus:ring-[#ffe400] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/projects"
            className="px-6 py-2 rounded-lg border border-gray-200 dark:border-[#222F43] text-gray-600 dark:text-[#94A9C9] hover:bg-gray-100 dark:hover:bg-[#131C31] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2 bg-[#ffe400] text-[#101010] rounded-lg font-bold hover:bg-[#e6cd00] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
}
