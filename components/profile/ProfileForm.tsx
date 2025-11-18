"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

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

  const username = profile?.username || "User";
  const initials = username.slice(0, 2).toUpperCase();

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

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state?.success) {
      const form = formRef.current;
      if (form) {
        const input = form.querySelector('input[name="deleteAvatar"]') as HTMLInputElement | null;
        if (input) input.value = "";
      }
      setDirty(false);
      setDeleteRequested(false);
      try {
        router.refresh();
      } catch (e) { }
    }
  }, [state?.success]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">Your Profile</h2>
      <form ref={formRef} action={action} className="space-y-8 max-w-xl mx-auto">
        <input type="hidden" name="deleteAvatar" value={deleteRequested ? "true" : ""} />
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="flex-shrink-0 flex flex-col items-center">
            <label className="cursor-pointer group relative">
              <Avatar className="h-32 w-32 border transition-opacity group-hover:opacity-80">
                <AvatarImage src={preview ?? ""} className="object-cover" />
                <AvatarFallback className="text-4xl bg-muted">{initials}</AvatarFallback>
              </Avatar>
              
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
              <Button
                type="button"
                variant="link"
                className="mt-2 text-destructive"
                onClick={() => {
                  if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
                  setPreview(null);
                  setDeleteRequested(true);
                  setDirty(true);
                  const el = fileRef.current;
                  if (el) el.value = "";
                }}
              >
                Remove photo
              </Button>
            )}
            {!preview && (
               <Button
               type="button"
               variant="link"
               className="mt-2"
               onClick={() => fileRef.current?.click()}
             >
               Upload photo
             </Button>
            )}
          </div>
          
          <div className="flex-1 w-full space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" defaultValue={profile?.username ?? ""} onChange={() => setDirty(true)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" name="firstName" defaultValue={profile?.first_name ?? ""} onChange={() => setDirty(true)} />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" name="lastName" defaultValue={profile?.last_name ?? ""} onChange={() => setDirty(true)} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" defaultValue={profile?.bio ?? ""} onChange={() => setDirty(true)} rows={4} className="min-h-[100px]" />
        </div>

        {state.message && <p className="text-sm text-muted-foreground">{state.message}</p>}

        <div className="text-center">
          <Button type="submit" size="lg" disabled={submitting || !dirty}>
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {submitting ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}