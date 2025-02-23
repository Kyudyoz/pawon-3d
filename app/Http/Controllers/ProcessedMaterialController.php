<?php

namespace App\Http\Controllers;

use App\Models\ProcessedMaterial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProcessedMaterialController extends Controller
{
    public function index()
    {
        return Inertia::render('ProcessedMaterial/Index', [
            'processedMaterials' => ProcessedMaterial::with('processed_material_details.material')->get(),
            'materials' => \App\Models\Material::all(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'quantity' => 'required|integer',
            'processed_material_details' => 'required|array',
            'processed_material_details.*.material_id' => 'required|exists:materials,id',
            'processed_material_details.*.material_quantity' => 'required|integer',
            'processed_material_details.*.material_unit' => 'required|string',
        ]);

        $processedMaterial = ProcessedMaterial::create([
            'name' => $data['name'],
            'quantity' => $data['quantity'],
        ]);

        foreach ($data['processed_material_details'] as $detail) {
            $processedMaterial->processed_material_details()->create($detail);
        }

        return redirect()->route('processed-material.index')->with('success', 'Bahan baku olahan berhasil ditambahkan!');
    }

    public function update(Request $request, ProcessedMaterial $processedMaterial)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'quantity' => 'required|integer',
            'processed_material_details' => 'required|array',
            'processed_material_details.*.material_id' => 'required|exists:materials,id',
            'processed_material_details.*.material_quantity' => 'required|integer',
            'processed_material_details.*.material_unit' => 'required|string',
        ]);

        $processedMaterial->update([
            'name' => $data['name'],
            'quantity' => $data['quantity'],
        ]);

        $processedMaterial->processed_material_details()->delete();
        foreach ($data['processed_material_details'] as $detail) {
            $processedMaterial->processed_material_details()->create($detail);
        }

        return redirect()->route('processed-material.index')->with('success', 'Bahan baku olahan berhasil diperbarui!');
    }

    public function destroy(ProcessedMaterial $processedMaterial)
    {
        $processedMaterial->delete();

        return redirect()->route('processed-material.index')->with('success', 'Bahan baku olahan berhasil dihapus!');
    }
}
