"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct, updateProduct } from "@/lib/actions";
import Image from "next/image";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

function SubmitButton({ isUpdating }: { isUpdating: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending
        ? isUpdating
          ? "Saving Changes..."
          : "Publishing..."
        : isUpdating
        ? "Save Changes"
        : "Publish Product"}
    </Button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return <p className="mt-1 text-xs text-red-500">{errors[0]}</p>;
}

export function ProductForm({ product }: { product?: any }) {
  const isUpdating = !!product;

  const actionToCall = isUpdating
    ? updateProduct.bind(null, product.id)
    : createProduct;
    
  const [state, action] = useActionState(actionToCall, initialState);

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Gaming Mouse"
          defaultValue={product?.name ?? ""}
        />
        <FieldError errors={state.errors?.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your product..."
          defaultValue={product?.description ?? ""}
        />
        <FieldError errors={state.errors?.description} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            defaultValue={product?.price ?? ""}
          />
          <FieldError errors={state.errors?.price} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={product?.category ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Home & Garden">Home & Garden</SelectItem>
              <SelectItem value="Books">Books</SelectItem>
            </SelectContent>
          </Select>
          <FieldError errors={state.errors?.category} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Product Image</Label>
        {isUpdating && product.image_url && (
          <div className="my-4">
            <p className="text-sm text-muted-foreground">Current image:</p>
            <Image
              src={product.image_url}
              alt={product.name}
              width={100}
              height={100}
              className="mt-2 rounded-md object-cover"
              loading="eager"
              
            />
          </div>
        )}
        <Input id="image" name="image" type="file" accept="image/*" />
        {isUpdating && (
          <p className="text-xs text-muted-foreground">
            Leave blank to keep the current image.
          </p>
        )}
        <FieldError errors={state.errors?.image} />
      </div>

      {!state.success && state.message && !state.errors && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}

      <SubmitButton isUpdating={isUpdating} />
    </form>
  );
}