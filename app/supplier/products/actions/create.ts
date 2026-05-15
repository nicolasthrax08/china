'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const productSchema = z.object({
  name_en: z.string().min(2, 'English name is required / 英文名称是必填的'),
  name_cn: z.string().min(1, 'Chinese name is required / 中文名称是必填的'),
  description_en: z.string().min(5, 'English description is required / 英文描述是必填的'),
  description_cn: z.string().min(2, 'Chinese description is required / 中文描述是必填的'),
  price_usd: z.coerce.number().positive('Price must be positive / 价格必须为正数'),
});

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function createProduct(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated / 用户未通过身份验证' };
  }

  const rawFormData = {
    name_en: formData.get('name_en'),
    name_cn: formData.get('name_cn'),
    description_en: formData.get('description_en'),
    description_cn: formData.get('description_cn'),
    price_usd: formData.get('price_usd'),
  };

  const validatedFields = productSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = Object.values(errors).flat().join('. ');
    return { error: errorMessage };
  }

  const { name_en, name_cn, description_en, description_cn, price_usd } = validatedFields.data;
  const imageFile = formData.get('image') as File;

  let imageUrl = '';
  let uploadedFilePath = '';

  try {
    // 2. Upload image if present
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      uploadedFilePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(uploadedFilePath, imageFile);

      if (uploadError) {
        return { error: `Image upload failed: ${uploadError.message}` };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(uploadedFilePath);

      imageUrl = publicUrl;
    }

    // 3. Insert into database
    const { error: insertError } = await supabase
      .from('products')
      .insert({
        creator_id: user.id,
        name_en,
        name_cn,
        description_en,
        description_cn,
        price_usd,
        image_url: imageUrl,
        name: name_en, // Backwards compatibility
        price: price_usd, // Backwards compatibility
      });

    if (insertError) {
      // Cleanup uploaded image if database insert fails
      if (uploadedFilePath) {
        await supabase.storage.from('product-images').remove([uploadedFilePath]);
      }
      return { error: `Database error: ${insertError.message}` };
    }
  } catch (err: any) {
    // General error handling
    if (uploadedFilePath) {
      await supabase.storage.from('product-images').remove([uploadedFilePath]);
    }
    return { error: err.message || 'An unexpected error occurred' };
  }

  revalidatePath('/supplier/dashboard');
  revalidatePath('/products');
  redirect('/supplier/dashboard');
}
