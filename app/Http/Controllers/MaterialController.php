<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function index()
    {
        return Inertia::render('Material/Index', [
            'materials' => Material::orderBy('name', 'asc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'quantity' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
        ]);

        Material::create($validatedData);
        return redirect()->route('material.index')->with('success', 'Bahan baku berhasil ditambahkan!');
    }

    public function update(Request $request, Material $material)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'quantity' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
        ]);

        $material->update($validatedData);
        return redirect()->route('material.index')->with('success', 'Bahan baku berhasil diperbarui!');
    }

    public function destroy(Material $material)
    {
        $material->delete();
        return redirect()->route('material.index')->with('success', 'Bahan baku berhasil dihapus!');
    }
}
