<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;

class TransactionController extends Controller
{
    public function pos()
    {
        $categories = Category::all();
        $products = Product::all();
        return Inertia::render('Transaction/Pos', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }

    public function index()
    {
        $transactions = Transaction::with(['user', 'details', 'details.product'])->get();

        return Inertia::render('Transaction/Index', [
            'transactions' => $transactions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|in:tunai,non tunai',
            'details' => 'required|array',
        ]);

        // Buat transaksi
        $transaction = Transaction::create([
            'user_id' => $request->user_id,
            'total_amount' => $request->total_amount,
            'payment_method' => $request->payment_method,
            'payment_status' => 'lunas',
            'status' => 'selesai',
            'type' => 'siap beli',
        ]);

        // Buat detail transaksi
        foreach ($request->details as $detail) {
            TransactionDetail::create([
                'transaction_id' => $transaction->id,
                'product_id' => $detail['product_id'],
                'quantity' => $detail['quantity'],
                'price' => $detail['price'],
                'unique_code' => uniqid('transaction-'),
            ]);
            Product::find($detail['product_id'])->decrement('stock', $detail['quantity']);
        }

        return redirect()->back()->with('success', 'Transaksi berhasil!');
    }
}
