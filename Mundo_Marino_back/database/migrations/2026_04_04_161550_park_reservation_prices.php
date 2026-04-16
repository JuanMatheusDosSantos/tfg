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
        Schema::create('park_reservation_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId("park_id")->constrained("parks");
            $table->foreignId("park_reservation_type_id")->constrained("park_reservation_types");
            $table->decimal('adult_price', 8, 2)->default(10);
            $table->decimal('child_price', 8, 2)->default(5);
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
