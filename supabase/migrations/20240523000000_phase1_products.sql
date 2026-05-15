-- Phase 1: Product Listing Implementation

-- Update products table for multi-language support
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS name_cn TEXT,
ADD COLUMN IF NOT EXISTS desc_en TEXT,
ADD COLUMN IF NOT EXISTS desc_cn TEXT,
ADD COLUMN IF NOT EXISTS price_usd DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Migration of existing data (if any) could go here
-- UPDATE public.products SET name_en = name, desc_en = description, price_usd = price;

-- Create product-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for product-images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.uid() = owner
);

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.uid() = owner
);
