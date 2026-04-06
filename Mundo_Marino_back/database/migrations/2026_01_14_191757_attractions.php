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
//        Schema::create('attractions', function (Blueprint $table) {
//            $table->id();
//            $table->string("name");
//            $table->enum("type",["suave","moderado","intenso"]);//suave, moderada, intensa
//            $table->integer("duration");
//            $table->integer("max_capacity");
//            $table->enum('status', ['operational', 'maintenance', 'closed'])
//                ->default('operational')
//                ->after('park_id');
//            $table->foreignId("park_id")
//                ->references("id")
//                ->on("parks")
//                ->cascadeOnDelete();
//            $table->unique(["name","park_id"]);
//            $table->timestamps();
//        });
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

            $table->enum('status', ['operational', 'maintenance', 'closed'])
                ->default('operational');

            $table->decimal('min_height', 3, 2)->nullable();

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
