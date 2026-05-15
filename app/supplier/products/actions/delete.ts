'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteProduct(productId: string, imageUrl: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // 1. Verify product ownership before deletion (Database RLS would also handle this, but explicit check is safer)
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('creator_id')
    .eq('id', productId)
    .single();

  if (fetchError || !product || product.creator_id !== user.id) {
    throw new Error('Forbidden: You do not own this product');
  }

  // 2. Delete image from storage if it exists
  if (imageUrl) {
    try {
      // Supabase public URLs are like: .../storage/v1/object/public/product-images/USER_ID/filename.jpg
      const url = new URL(imageUrl);
      const searchString = '/product-images/';
      const index = url.pathname.indexOf(searchString);

      if (index !== -1) {
        const filePath = decodeURIComponent(url.pathname.substring(index + searchString.length));

        // RED-TEAM FIX: Verify path starts with user ID
        if (filePath.startsWith(`${user.id}/`)) {
          const { error: storageError } = await supabase.storage
            .from('product-images')
            .remove([filePath]);

          if (storageError) {
            console.error('Error removing image:', storageError);
          }
        } else {
          console.warn('Security warning: Attempted to delete file outside of user directory');
        }
      }
    } catch (e) {
      console.error('Error parsing image URL for deletion:', e);
    }
  }

  // 3. Delete from database
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (deleteError) {
    throw deleteError;
  }

  revalidatePath('/supplier/dashboard');
  revalidatePath('/products');
}
