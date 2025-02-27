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
            'productions' => Production::with('product', 'product.product_compositions')->get(),
            'products' => Product::with('category', 'product_compositions')->get(),
            'transactions' => Transaction::where('type', 'pesanan')->with('details', 'details.product')->get(),
        ]);
    }
}