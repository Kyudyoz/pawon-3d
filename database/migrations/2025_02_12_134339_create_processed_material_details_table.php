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
        Schema::create('processed_material_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('processed_material_id');
            $table->uuid('material_id');
            $table->decimal('material_quantity', 10, 0);
            $table->string('material_unit', 50);
            $table->timestamps();

            $table->foreign('processed_material_id')
                ->references('id')
                ->on('processed_materials')
                ->onDelete('cascade');

            $table->foreign('material_id')
                ->references('id')
                ->on('materials')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('processed_material_details');
    }
};
