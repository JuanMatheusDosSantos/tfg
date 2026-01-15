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
        Schema::create('attractions', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("type");
            $table->integer("duration");
            $table->integer("max_capacity");
            $table->foreignId("park_id")
                ->references("id")
                ->on("parks")
                ->cascadeOnDelete();
            $table->unique(["name","park_id"]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attractions');
    }
};
