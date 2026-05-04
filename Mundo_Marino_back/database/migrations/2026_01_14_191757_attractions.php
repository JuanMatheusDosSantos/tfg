<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attractions', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("description");
            $table->enum("type", ["suave", "moderado", "intenso"]);
            $table->integer("duration");
            $table->integer("max_capacity");


            $table->foreignId("park_id")
                ->constrained("parks")
                ->cascadeOnDelete();

            $table->enum('status', ['operational', 'maintenance', 'closed',"permanently_closed"])
                ->default('operational');

            $table->decimal('min_height', 3, 2)->nullable();
            $table->text('image')->nullable();
            $table->unique(["name", "park_id"]);
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
