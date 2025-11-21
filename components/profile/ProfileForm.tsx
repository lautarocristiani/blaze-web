"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Save, 
  Loader2, 
  Camera, 
  Trash2, 
  User 
} from "lucide-react";

export default function ProfileForm({ profile }: { profile: any }) {
  const initialState = { success: false, message: "" };
  const [state, action] = useActionState(updateProfile, initialState);
  const [submitting, start] = useTransition();

  const initialPreview = profile?.avatar_url && profile.avatar_url.trim() !== "" 
    ? profile.avatar_url 
    : null;
    
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [dirty, setDirty] = useState(false);
  const router = useRouter();
  const [deleteRequested, setDeleteRequested] = useState(false);

  const username = (profile?.username && profile.username.trim() !== "") 
    ? profile.username 
    : "User";
    
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
      setDeleteRequested(false);
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
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information and public profile.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form ref={formRef} action={action} className="space-y-8">
            <input type="hidden" name="deleteAvatar" value={deleteRequested ? "true" : ""} />
            
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start p-6 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => fileRef.current?.click()}
                >
                  <Avatar 
                    key={preview || "fallback"} 
                    className="h-28 w-28 border-4 border-background shadow-sm transition-all group-hover:opacity-90"
                  >
                    {preview && (
                      <AvatarImage src={preview} className="object-cover" />
                    )}
                    <AvatarFallback className="text-3xl bg-muted font-bold text-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera className="h-8 w-8" />
                  </div>
                  
                  <input
                    ref={fileRef}
                    onChange={onFileChange}
                    accept="image/*"
                    type="file"
                    name="avatar"
                    className="hidden"
                  />
                </div>

                {preview && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 px-2"
                        onClick={() => {
                            if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
                            setPreview(null);
                            setDeleteRequested(true);
                            setDirty(true);
                            const el = fileRef.current;
                            if (el) el.value = "";
                        }}
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Remove photo
                    </Button>
                )}
              </div>

              <div className="flex-1 space-y-1 text-center sm:text-left pt-2">
                <h3 className="font-medium text-lg">{username}</h3>
                <p className="text-sm text-muted-foreground">
                  This will be displayed on your profile and product listings.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Username
                </Label>
                <Input 
                    id="username" 
                    name="username" 
                    defaultValue={profile?.username ?? ""} 
                    onChange={() => setDirty(true)} 
                    className="max-w-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    defaultValue={profile?.first_name ?? ""} 
                    onChange={() => setDirty(true)} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    defaultValue={profile?.last_name ?? ""} 
                    onChange={() => setDirty(true)} 
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                    id="bio" 
                    name="bio" 
                    defaultValue={profile?.bio ?? ""} 
                    onChange={() => setDirty(true)} 
                    rows={4} 
                    className="resize-none"
                    placeholder="Tell us a little bit about yourself..."
                />
                <p className="text-xs text-muted-foreground">
                    Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>
            </div>

            {state.message && (
                <div className={`text-sm p-3 rounded-md ${state.success ? "bg-green-50 text-green-600 dark:bg-green-950/30" : "bg-destructive/10 text-destructive"}`}>
                    {state.message}
                </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={submitting || !dirty} className="min-w-[120px]">
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}