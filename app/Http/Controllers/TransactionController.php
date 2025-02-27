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
        $transactions = Transaction::with(['user', 'details', 'details.product', 'details.product.productions'])->latest()->get();

        $transactions->map(function ($transaction) {
            $transaction->schedule = \Carbon\Carbon::parse($transaction->schedule)->format('d-M-Y');
        });

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

        $schedule = \Carbon\Carbon::parse($request->schedule)->format('Y-m-d');

        $status = 'selesai';

        if ($request->type == 'siap beli') {
            $status = 'selesai';
        } elseif ($request->type == 'pesanan') {
            $status = 'pending';
        }

        // Buat transaksi
        $transaction = Transaction::create([
            'user_id' => $request->user_id,
            'total_amount' => ($request->total_amount),
            'payment_method' => $request->payment_method,
            'schedule' => $schedule,
            'payment_status' => $request->payment_status,
            'dp' => $request->dp,
            'status' => $status,
            'type' => $request->type,
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

            if ($request->type == 'siap beli') {
                Product::find($detail['product_id'])->decrement('stock', ($detail['quantity']));
            }
        }

        return redirect()->back()->with('success', 'Transaksi berhasil!');
    }

    public function edit(Transaction $transaction)
    {
        $transaction = Transaction::with('details', 'details.product')->findOrFail($transaction->id);
        if ($transaction->type == 'siap beli') {
            foreach ($transaction->details as $detail) {
                $detail->product->stock = $detail->product->stock + $detail->quantity;
                $detail->product->save();
            }
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
        $schedule = \Carbon\Carbon::parse($request->schedule)->format('Y-m-d');

        $status = 'selesai';

        if ($request->type == 'siap beli') {
            $status = 'selesai';
        } elseif ($request->type == 'pesanan') {
            $status = 'pending';
        }

        $transaction->update([
            'user_id' => $request->user_id,
            'total_amount' => ($request->total_amount),
            'payment_method' => $request->payment_method,
            'payment_status' => $request->payment_status,
            'dp' => $request->dp,
            'status' => $status,
            'type' => $request->type,
            'schedule' => $schedule,
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
        if ($request->type == 'siap beli') {
            foreach ($transaction->details as $detail) {
                $product = Product::where('id', $detail['product_id'])->first();
                $product->stock = $product->stock - $detail['quantity'];
                $product->save();
            }
        }
        return redirect()->route('transaction.index')->with('success', 'Transaksi berhasil diperbarui!');
    }

    public function updatePaymentStatus(Request $request, Transaction $transaction)
    {
        $request->validate([
            'payment_status' => 'required|in:lunas,belum lunas',
        ]);

        $transaction->update([
            'payment_status' => $request->payment_status,
        ]);

        return redirect()->route('transaction.index')->with('success', 'Status pembayaran berhasil diperbarui!');
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return redirect()->route('transaction.index')->with('success', 'Transaksi berhasil dihapus!');
    }
}