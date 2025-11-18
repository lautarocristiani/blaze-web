"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  LoginSchema,
  SignupSchema,
  ProductSchema,
  UpdateProductSchema,
} from "./validation";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type AuthResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

type ProductResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function signUpWithEmail(
  prevState: AuthResponse,
  formData: FormData
): Promise<AuthResponse> {
  const supabase = await createClient();
  const values = Object.fromEntries(formData.entries());

  const validatedFields = SignupSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields. Please check your data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, username, email, password } = validatedFields.data;

  const supabaseAdmin = createAdminClient();
  
  const { data: existingUser } = await supabaseAdmin
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (existingUser) {
    return {
      success: false,
      message: "Validation failed", 
      errors: {
        username: ["This username is already taken. Please choose another."],
      },
    };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        username: username,
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (authError) {
    if (authError.message.includes("User already registered") || authError.status === 422) {
      return {
        success: false,
        message: "Validation failed",
        errors: {
          email: ["A user with this email already exists."],
        }
      };
    }
    
    if (authError.message.includes("Database error")) {
       return {
        success: false,
        message: "This username might be taken or there was a system error. Please try again.",
      };
    }

    return { success: false, message: authError.message };
  }

  if (!authData.user) {
    return { success: false, message: "User registration failed." };
  }

  const avatarFile = formData.get("avatar");

  if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split(".").pop();
    const filePath = `avatars/${authData.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile as Blob, {
        cacheControl: "3600",
        upsert: false,
      });
      
    if (!uploadError) {
      const { data: urlData } = await supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      
      await supabase
        .from("profiles")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", authData.user.id);
    }
  }

  return redirect("/");
}

export async function loginWithEmail(
  prevState: AuthResponse,
  formData: FormData
): Promise<AuthResponse> {
  const supabase = await createClient();
  const values = Object.fromEntries(formData.entries());

  const loginInput = values.email as string;
  const password = values.password as string;

  if (!loginInput || !password) {
    return {
      success: false,
      message: "Please enter both email/username and password.",
    };
  }

  let emailToLogin = loginInput;

  if (!loginInput.includes("@")) {
    const supabaseAdmin = createAdminClient();
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("username", loginInput)
      .single();

    if (!profile || !profile.email) {
      return { success: false, message: "Invalid username or password." };
    }
    emailToLogin = profile.email;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: emailToLogin,
    password,
  });

  if (error) {
    return { success: false, message: "Invalid credentials." };
  }

  return redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
}

export async function updateProfile(
  prevState: AuthResponse,
  formData: FormData
): Promise<AuthResponse> {
  const supabase = await createClient();
  const values = Object.fromEntries(formData.entries()) as any;

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId) {
    return { success: false, message: "Not authenticated" };
  }

  const { username, firstName, lastName, bio } = values;

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", userId)
    .single();
  const existingAvatarUrl = existingProfile?.avatar_url ?? null;

  let finalAvatarUrl: string | null = existingAvatarUrl;
  const avatarFile = formData.get("avatar");
  const deleteAvatar =
    values.deleteAvatar === "true" || values.deleteAvatar === true;
    
  if (deleteAvatar) {
    finalAvatarUrl = null;
    if (existingAvatarUrl) {
      try {
        const marker = "/storage/v1/object/public/";
        const idx = existingAvatarUrl.indexOf(marker);
        if (idx !== -1) {
          const after = existingAvatarUrl.substring(idx + marker.length);
          const prefix = "avatars/";
          const path = after.startsWith(prefix)
            ? after.substring(prefix.length)
            : after;
          await supabase.storage.from("avatars").remove([path]);
        }
      } catch (e) {}
    }
  }
  
  if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split(".").pop();
    const filePath = `avatars/${userId}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile as Blob, {
        cacheControl: "3600",
        upsert: true,
      });
    if (!uploadError) {
      const { data: urlData } = await supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      finalAvatarUrl = urlData.publicUrl;
      if (existingAvatarUrl) {
        try {
          const marker = "/storage/v1/object/public/";
          const idx = existingAvatarUrl.indexOf(marker);
          if (idx !== -1) {
            const after = existingAvatarUrl.substring(idx + marker.length);
            const prefix = "avatars/";
            const path = after.startsWith(prefix)
              ? after.substring(prefix.length)
              : after;
            await supabase.storage.from("avatars").remove([path]);
          }
        } catch (e) {}
      }
    }
  }

  const payload: any = {
    id: userId,
    username: username || null,
    first_name: firstName || null,
    last_name: lastName || null,
    avatar_url: finalAvatarUrl ?? null,
    bio: bio || null,
    ...(values.theme ? { theme: values.theme } : {}),
  };

  const { error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    return {
      success: false,
      message: `Failed to update profile: ${error.message}`,
    };
  }

  if (values.theme) {
    try {
      await supabase.auth.updateUser({ data: { theme: values.theme } });
    } catch (e) {}
  }
  return { success: true, message: "Profile updated" };
}

export async function setTheme(formData: FormData) {
  const supabase = await createClient();
  const values = Object.fromEntries(formData.entries()) as any;
  const theme = values.theme;
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) {
    return;
  }
  await supabase.from("profiles").update({ theme }).eq("id", userId);
  try {
    await supabase.auth.updateUser({ data: { theme } });
  } catch {}
}

export async function createProduct(
  prevState: ProductResponse,
  formData: FormData
): Promise<ProductResponse> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return {
      success: false,
      message: "Not authenticated. Please log in.",
    };
  }

  const values = Object.fromEntries(formData.entries());
  const validatedFields = ProductSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields. Please check your data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, price, category, image } = validatedFields.data;

  const fileExt = image.name.split(".").pop();
  const filePath = `products/${
    userData.user.id
  }/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error: storageError } = await supabase.storage
    .from("products")
    .upload(filePath, image);

  if (storageError) {
    return { success: false, message: `Storage Error: ${storageError.message}` };
  }

  const { data: urlData } = supabase.storage
    .from("products")
    .getPublicUrl(filePath);

  const publicImageUrl = urlData.publicUrl;

  const { data: productData, error: insertError } = await supabase
    .from("products")
    .insert({
      name,
      description,
      price,
      category,
      image_url: publicImageUrl,
      seller_id: userData.user.id,
    })
    .select("id")
    .single();

  if (insertError) {
    return { success: false, message: `Database Error: ${insertError.message}` };
  }

  revalidatePath("/");
  redirect(`/products/${productData.id}`);
}

export async function updateProduct(
  productId: string,
  prevState: ProductResponse,
  formData: FormData
): Promise<ProductResponse> {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return {
      success: false,
      message: "Not authenticated. Please log in.",
    };
  }

  const { data: existingProduct, error: fetchError } = await supabase
    .from("products")
    .select("seller_id, image_url")
    .eq("id", productId)
    .single();

  if (fetchError || !existingProduct) {
    return { success: false, message: "Product not found." };
  }

  if (existingProduct.seller_id !== userData.user.id) {
    return {
      success: false,
      message: "You are not authorized to edit this product.",
    };
  }

  const values = Object.fromEntries(formData.entries());
  const image = values.image as File;

  let validatedFields;
  let newImage: File | undefined = undefined;

  if (image && image.size > 0) {
    validatedFields = UpdateProductSchema.safeParse(values);
    if (validatedFields.success) {
      newImage = validatedFields.data.image;
    }
  } else {
    const { image: _, ...rest } = values;
    validatedFields = UpdateProductSchema.omit({ image: true }).safeParse(rest);
  }

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields. Please check your data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, price, category } = validatedFields.data;
  let publicImageUrl = existingProduct.image_url;

  if (newImage) {
    const fileExt = newImage.name.split(".").pop();
    const filePath = `products/${
      userData.user.id
    }/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: storageError } = await supabase.storage
      .from("products")
      .upload(filePath, newImage);

    if (storageError) {
      return {
        success: false,
        message: `Storage Error: ${storageError.message}`,
      };
    }

    publicImageUrl = supabase.storage
      .from("products")
      .getPublicUrl(filePath).data.publicUrl;
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      category,
      image_url: publicImageUrl,
    })
    .eq("id", productId);

  if (updateError) {
    return { success: false, message: `Database Error: ${updateError.message}` };
  }

  revalidatePath("/");
  revalidatePath(`/products/${productId}`);
  redirect(`/products/${productId}`);
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("Not authenticated");
  }

  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("seller_id, image_url")
    .eq("id", productId)
    .single();

  if (fetchError || !product) {
    throw new Error("Product not found");
  }

  if (product.seller_id !== userData.user.id) {
    throw new Error("You are not authorized to delete this product.");
  }

  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  revalidatePath("/");
  redirect("/");
}