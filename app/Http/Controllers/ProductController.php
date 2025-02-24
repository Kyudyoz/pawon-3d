<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Product/Index', [
            'products' => Product::with(['category', 'product_compositions'])->get(),
            'categories' => \App\Models\Category::all(),
            'materials' => \App\Models\Material::all(),
            'processedMaterials' => \App\Models\ProcessedMaterial::all(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|integer',
            'stock' => 'required|integer',
            'product_image' => 'nullable',
            'is_ready' => 'boolean',
            'product_compositions' => 'array',
            'product_compositions.*.material_id' => 'nullable|exists:materials,id',
            'product_compositions.*.material_quantity' => 'integer',
            'product_compositions.*.processed_material_id' => 'nullable|exists:processed_materials,id',
            'product_compositions.*.processed_material_quantity' => 'integer',
            'product_compositions.*.material_unit' => 'nullable|string',
        ]);


        $product = Product::create([
            'name' => $data['name'],
            'category_id' => $data['category_id'],
            'price' => $data['price'],
            'stock' => $data['stock'],
            'is_ready' => $data['is_ready'],
        ]);

        if ($request->hasFile('product_image')) {
            $data['product_image'] = $request->file('product_image');
            $product->product_image = $data['product_image']->store('product_images', 'public');
            $product->save();
        }


        foreach ($data['product_compositions'] as $composition) {
            $product->product_compositions()->create($composition);
        }

        return redirect()->route('product.index')->with('success', 'Produk berhasil ditambahkan!');
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|integer',
            'stock' => 'required|integer',
            'product_image' => 'nullable|file|image',
            'is_ready' => 'boolean',
            'product_compositions' => 'array',
            'product_compositions.*.material_id' => 'nullable|exists:materials,id',
            'product_compositions.*.material_quantity' => 'nullable|integer',
            'product_compositions.*.processed_material_id' => 'nullable|exists:processed_materials,id',
            'product_compositions.*.processed_material_quantity' => 'nullable|integer',
            'product_compositions.*.material_unit' => 'nullable|string',
        ]);


        $product->update([
            'name' => $data['name'],
            'category_id' => $data['category_id'],
            'price' => $data['price'],
            'stock' => $data['stock'],
            'is_ready' => $data['is_ready'],
        ]);

        if ($request->hasFile('product_image')) {
            if ($product->product_image) {
                Storage::disk('public')->delete($product->product_image);
            }

            $product->product_image = $data['product_image']->store('product_images', 'public');
            $product->save();
        }


        $product->product_compositions()->delete();
        foreach ($data['product_compositions'] as $composition) {
            $product->product_compositions()->create($composition);
        }

        return redirect()->route('product.index')->with('success', 'Produk berhasil diperbarui!');
    }

    public function destroy(Product $product)
    {
        if ($product->product_image) {
            Storage::disk('public')->delete($product->product_image);
        }

        $product->delete();

        return redirect()->route('product.index')->with('success', 'Produk berhasil dihapus!');
    }
}