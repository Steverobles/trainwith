"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadAvatar, removeAvatar } from "@/lib/profiles";

export default function AvatarUpload({
  profileId,
  currentUrl,
  initials,
  onChange,
}: {
  profileId: string;
  currentUrl: string | null;
  initials: string;
  onChange: (url: string | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadAvatar(file);
      onChange(url);
    } catch {
      setError("Couldn't upload that photo. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function onRemove() {
    setUploading(true);
    setError(null);
    try {
      await removeAvatar(profileId);
      onChange(null);
    } catch {
      setError("Couldn't remove that photo. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Profile photo</label>
      <div className="mt-2 flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-blue-100">
          {currentUrl ? (
            <Image src={currentUrl} alt="" fill sizes="64px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-blue-700">
              {initials}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {uploading ? "Uploading…" : currentUrl ? "Replace" : "Upload photo"}
          </button>
          {currentUrl && (
            <button
              type="button"
              onClick={onRemove}
              disabled={uploading}
              className="rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Remove
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
      </div>
      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
