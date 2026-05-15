import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default async function SupplierDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto p-6 text-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Supplier Dashboard / 供应商控制面板</h1>
        <Link
          href="/supplier/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Product / 添加产品
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold">Your Inventory / 您的库存</h2>
        </div>

        {products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Product / 产品</th>
                  <th className="px-6 py-4 font-medium">Description (CN) / 描述 (中)</th>
                  <th className="px-6 py-4 font-medium">Price (USD) / 价格 (美元)</th>
                  <th className="px-6 py-4 font-medium">Status / 状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name_en || product.name || ''}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{product.name_en || product.name}</p>
                          <p className="text-sm text-gray-500">{product.name_cn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-1">{product.description_cn}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${(product.price_usd || product.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">No products found. Start by adding your first product!</p>
          </div>
        )}
      </div>
    </div>
  );
}
