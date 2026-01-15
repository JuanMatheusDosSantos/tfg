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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")
                ->references("id")
                ->on("users")
                ->cascadeOnDelete();
            $table->foreignId("park_id")
                ->references("id")
                ->on("parks")
                ->cascadeOnDelete();
            $table->date("date");
            $table->decimal("amount",6,2);
            $table->string("method");
            $table->enum("state",["accepted","denied","pending"])->default("pending");
            $table->string("reference")->unique();
            $table->timestamps();
            $table->unique(["user_id","park_id","date"]);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
