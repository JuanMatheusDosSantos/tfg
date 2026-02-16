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
        Schema::create('restaurant_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")
                ->references("id")
                ->on("users")
                ->cascadeOnDelete();
            $table->foreignId("restaurant_id")
                ->references("id")
                ->on("restaurants")
                ->cascadeOnDelete();
            $table->date("reservation_date");
            $table->time("reservation_hour");
            $table->integer("party_size");
            $table->enum("status",["checked_in","late","no_show","cancelled","completed","pending"])->default("pending");
            $table->timestamps();
           $table->unique(["user_id","restaurant_id","reservation_date","reservation_hour"],"ui_ri_sd");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurant_reservations');
    }
};
