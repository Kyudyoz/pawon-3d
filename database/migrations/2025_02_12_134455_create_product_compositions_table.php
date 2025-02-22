<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_compositions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('product_id');
            $table->uuid('material_id');
            $table->uuid('processed_material_id');
            $table->decimal('material_quantity', 10, 0);
            $table->decimal('processed_material_quantity', 10, 0);
            $table->timestamps();

            $table->foreign('product_id')
                ->references('id')
                ->on('products')
                ->onDelete('cascade');

            $table->foreign('material_id')
                ->references('id')
                ->on('materials')
                ->onDelete('cascade');

            $table->foreign('processed_material_id')
                ->references('id')
                ->on('processed_materials')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_compositions');
    }
};
