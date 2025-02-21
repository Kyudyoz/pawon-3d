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
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->decimal('total_amount', 10, 0);
            $table->decimal('dp', 10, 0)->nullable();
            $table->decimal('discount', 10, 0)->nullable();
            $table->enum('payment_method', ['tunai', 'non tunai']);
            $table->string('payment_status', 20);
            $table->string('status', 20);
            $table->string('type', 20);
            $table->string('prize_code', 8)->nullable();
            $table->decimal('spin_chance', 3, 0)->nullable();
            $table->timestamps();


            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('prize_code')->references('code')->on('prizes')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
