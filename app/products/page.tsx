import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';

export default async function BuyerGallery() {
  const supabase = await createClient();

  // Fetch only the requested fields: name, price, and image_url
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Buyer Gallery</h1>

      {!products || products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="relative h-64 w-full bg-gray-100">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name || 'Product image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 truncate">{product.name}</h2>
                <p className="text-lg font-bold text-blue-600">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
