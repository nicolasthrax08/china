'use client';

import { useActionState } from 'react';
import { createProduct, ActionState } from '../actions/create';

const initialState: ActionState = {};

export default function ProductForm() {
  const [state, formAction, isPending] = useActionState(createProduct, initialState);

  return (
    <form action={formAction} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      {state.error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {state.error}
        </div>
      )}

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
          required
          placeholder="Detailed description of the product in English..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (CN) / 产品描述 (中)</label>
        <textarea
          name="description_cn"
          rows={3}
          required
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
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Creating... / 创建中...' : 'Create Product / 创建产品'}
        </button>
      </div>
    </form>
  );
}
