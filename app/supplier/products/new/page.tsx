import ProductForm from './ProductForm';

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-8">Add New Product / 添加新产品</h1>
      <ProductForm />
    </div>
  );
}
