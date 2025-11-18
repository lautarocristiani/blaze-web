import * as z from "zod";

export const SignupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]{3,15}$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const MAX_FILE_SIZE_MB = 4;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const ProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().gt(0, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required")
    .refine(
      (file) => file.size < MAX_FILE_SIZE_MB * 1024 * 1024,
      `Image must be ${MAX_FILE_SIZE_MB}MB or less`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png, and .webp formats are allowed"
    ),
});

export const UpdateProductSchema = ProductSchema.extend({
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size < MAX_FILE_SIZE_MB * 1024 * 1024,
      `Image must be ${MAX_FILE_SIZE_MB}MB or less`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png, and .webp formats are allowed"
    )
    .optional()
    .refine(
      (file) => !file || file.size > 0,
      "A new image file cannot be empty"
    ),
});