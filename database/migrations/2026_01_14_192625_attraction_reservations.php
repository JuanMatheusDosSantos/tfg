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
        Schema::create('attraction_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")
                ->references("id")
                ->on("users")
                ->cascadeOnDelete();
            $table->foreignId("park_id")
                ->references("id")
                ->on("parks")
                ->cascadeOnDelete();
            $table->foreignId("attraction_id")
                ->references("id")
                ->on("attractions")
                ->cascadeOnDelete();
            $table->date("reservation_date");
            $table->date("time_reservation");
            $table->timestamps();
            $table->unique(["user_id","attraction_id","park_id","reservation_date"],"ui_ai_pi_rd");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attraction_reservations');
    }
};
