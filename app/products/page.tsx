import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto p-6 text-gray-900">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Products / 我们的产品</h1>
        <p className="text-xl text-gray-600">Discover premium goods from top Chinese suppliers. / 发现来自中国顶尖供应商的优质商品。</p>
      </header>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-gray-50">
                {product.image_url ? (
                  <Image
                    src={`${product.image_url}?width=600&quality=75`}
                    alt={product.name_en || product.name || ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                    {product.name_en || product.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">{product.name_cn}</p>
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
                  {product.description_en || product.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    ${(product.price_usd || product.price || 0).toFixed(2)}
                  </span>
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                    View Details / 查看详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-xl text-gray-500">No products available at the moment. Please check back later. / 目前没有可用产品。请稍后再试。</p>
        </div>
      )}
    </div>
  );
}
