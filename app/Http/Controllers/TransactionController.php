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
        $products = Product::orderBy('stock', 'desc')->get();
        return Inertia::render('Transaction/Pos', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }

    public function index()
    {
        $transactions = Transaction::with(['user', 'details', 'details.product'])->latest()->get();

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
            'total_amount' => ($request->total_amount),
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
                'quantity' => ($detail['quantity']),
                'price' => ($detail['price']),
                'unique_code' => uniqid('transaction-'),
            ]);
            Product::find($detail['product_id'])->decrement('stock', ($detail['quantity']));
        }

        return redirect()->back()->with('success', 'Transaksi berhasil!');
    }

    public function edit(Transaction $transaction)
    {
        $transaction = Transaction::with('details', 'details.product')->findOrFail($transaction->id);
        foreach ($transaction->details as $detail) {
            $detail->product->stock = $detail->product->stock + $detail->quantity;
            $detail->product->save();
        }
        $categories = Category::all();
        $products = Product::orderBy('stock', 'desc')->get();
        return Inertia::render('Transaction/Edit', [
            'transaction' => $transaction,
            'categories' => $categories,
            'products' => $products,
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|in:tunai,non tunai',
            'details' => 'required|array',
        ]);

        $transaction->update([
            'user_id' => $request->user_id,
            'total_amount' => ($request->total_amount),
            'payment_method' => $request->payment_method,
            'payment_status' => 'lunas',
            'status' => 'selesai',
            'type' => 'siap beli',
        ]);

        $transaction->details()->delete();

        foreach ($request->details as $detail) {
            TransactionDetail::create([
                'transaction_id' => $transaction->id,
                'product_id' => $detail['product_id'],
                'quantity' => ($detail['quantity']),
                'price' => ($detail['price']),
                'unique_code' => uniqid('transaction-'),
            ]);
        }

        $product = Product::where('id', $detail['product_id'])->first();
        $product->stock = $product->stock - $detail['quantity'];
        $product->save();
        return redirect()->route('transaction.index')->with('success', 'Transaksi berhasil diperbarui!');
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return redirect()->route('transaction.index')->with('success', 'Transaksi berhasil dihapus!');
    }
}
