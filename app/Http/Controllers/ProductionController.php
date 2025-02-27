<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Production;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductionController extends Controller
{
    public function index()
    {
        return Inertia::render('Production/Index', [
            'productions' => Production::with('product', 'product.product_compositions')->latest()->get(),
            'products' => Product::with('category', 'product_compositions')->get(),
            'transactions' => Transaction::where('type', 'pesanan')->with('details', 'details.product')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'nullable',
            'transaction_detail_id' => 'nullable',
            'product_id' => 'nullable',
            'count' => 'nullable|integer',
            'status' => 'nullable',
            'time' => 'nullable',
            'quantity' => 'nullable|integer',
            'material_quantity' => 'nullable|integer',
            'processed_material_quantity' => 'nullable|integer',
        ]);

        $validated['product_id'] = $request->transaction_detail_id ? Transaction::find($request->transaction_id)->details->find($request->transaction_detail_id)->product_id : $request->product_id;
        Production::create($validated);

        return redirect()->route('production.index')->with('success', 'Data produksi berhasil disimpan.');
    }

    public function destroy(Production $production)
    {
        $production->delete();

        return redirect()->route('production.index')->with('success', 'Data produksi berhasil dihapus.');
    }
}