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
        Schema::create('park_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")
                ->references("id")
                ->on("users")
                ->cascadeOnDelete();
            $table->foreignId("park_id")
                ->references("id")
                ->on("parks")
                ->cascadeOnDelete();
            $table->date("reservation_date");
//            $table->integer("max_persons");
            $table->integer("adults");
            $table->integer("child");
            $table->enum("status",["checked_in","late","no_show","cancelled","completed","pending"])->default("pending");
            $table->unique(["user_id","park_id","reservation_date"],"ui_pi_rd");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('park_reservations');
    }
};
