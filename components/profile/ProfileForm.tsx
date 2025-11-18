"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export default function ProfileForm({ profile }: { profile: any }) {
  const initialState = { success: false, message: "" };
  const [state, action] = useActionState(updateProfile, initialState);
  const [submitting, start] = useTransition();

  const initialPreview = profile?.avatar_url ? profile.avatar_url : null;
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [dirty, setDirty] = useState(false);
  const router = useRouter();
  const [deleteRequested, setDeleteRequested] = useState(false);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview((prev) => {
        if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
        return url;
      });
      setDirty(true);
    }
  }

  // Clear object URL on unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const formRef = useRef<HTMLFormElement | null>(null);

  // when action finishes successfully, refresh server components (Header) and clear delete flag
  useEffect(() => {
    if (state?.success) {
      // reset deleteAvatar hidden field
      const form = formRef.current;
      if (form) {
        const input = form.querySelector('input[name="deleteAvatar"]') as HTMLInputElement | null;
        if (input) input.value = "";
      }
      setDirty(false);
      setDeleteRequested(false);
      // refresh server components so Header/UserMenu re-fetch profile
      try {
        router.refresh();
      } catch (e) { }
    }
  }, [state?.success]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Your profile</h2>
      <form ref={formRef} action={action} className="space-y-6 max-w-xl mx-auto">
        <input type="hidden" name="deleteAvatar" value={deleteRequested ? "true" : ""} />
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <label className="cursor-pointer">
              {preview ? (
                <img src={preview} alt="avatar" className="h-32 w-32 rounded-full object-cover border" decoding="async" />
              ) : (
                <User className="h-32 w-32 text-muted-foreground border rounded-full p-8" />
              )}
              <input
                ref={fileRef}
                onChange={onFileChange}
                onClick={(e) => ((e.currentTarget as HTMLInputElement).value = "")}
                accept="image/*"
                type="file"
                name="avatar"
                className="hidden"
              />
            </label>
            {preview && (
              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    // Mark for deletion and clear preview locally. Actual delete will occur on Save.
                    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
                    setPreview(null);
                    setDeleteRequested(true);
                    setDirty(true);
                    const el = fileRef.current;
                    if (el) el.value = "";
                  }}
                  className="text-sm text-destructive hover:underline"
                >
                  Remove avatar
                </button>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div>
              <Label className="mb-2">Username</Label>
              <Input name="username" defaultValue={profile?.username ?? ""} onChange={() => setDirty(true)} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="mb-2">First name</Label>
                <Input name="firstName" defaultValue={profile?.first_name ?? ""} onChange={() => setDirty(true)} />
              </div>
              <div>
                <Label className="mb-2">Last name</Label>
                <Input name="lastName" defaultValue={profile?.last_name ?? ""} onChange={() => setDirty(true)} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-2">Bio</Label>
          <textarea name="bio" defaultValue={profile?.bio ?? ""} onChange={() => setDirty(true)} className="w-full rounded-md border px-3 py-2" />
        </div>

        {state.message && <p className="text-sm text-muted-foreground">{state.message}</p>}

        <div className="text-center">
          <Button type="submit" disabled={submitting || !dirty}>{submitting ? "Saving..." : "Save profile"}</Button>
        </div>
      </form>
    </div>
  );
}
