import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function NewProductPage() {
  async function createProduct(formData: FormData) {
    'use server';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const nameEn = formData.get('name_en') as string;
    const nameCn = formData.get('name_cn') as string;
    const descriptionEn = formData.get('description_en') as string;
    const descriptionCn = formData.get('description_cn') as string;
    const priceUsd = parseFloat(formData.get('price_usd') as string);
    const imageFile = formData.get('image') as File;

    let imageUrl = '';

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    const { error: insertError } = await supabase
      .from('products')
      .insert({
        creator_id: user.id,
        name_en: nameEn,
        name_cn: nameCn,
        description_en: descriptionEn,
        description_cn: descriptionCn,
        price_usd: priceUsd,
        image_url: imageUrl,
        name: nameEn, // Backwards compatibility if needed
        price: priceUsd, // Backwards compatibility
      });

    if (insertError) {
      throw insertError;
    }

    revalidatePath('/supplier/dashboard');
    revalidatePath('/products');
    redirect('/supplier/dashboard');
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-8">Add New Product / 添加新产品</h1>

      <form action={createProduct} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name (EN) / 产品名称 (英)</label>
            <input
              name="name_en"
              type="text"
              required
              placeholder="e.g. Silk Scarf"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name (CN) / 产品名称 (中)</label>
            <input
              name="name_cn"
              type="text"
              required
              placeholder="例如：丝绸围巾"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN) / 产品描述 (英)</label>
          <textarea
            name="description_en"
            rows={3}
            placeholder="Detailed description of the product in English..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (CN) / 产品描述 (中)</label>
          <textarea
            name="description_cn"
            rows={3}
            placeholder="产品的详细中文描述..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD) / 价格 (美元)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                name="price_usd"
                type="number"
                step="0.01"
                required
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image / 产品图片</label>
            <input
              name="image"
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Create Product / 创建产品
          </button>
        </div>
      </form>
    </div>
  );
}
