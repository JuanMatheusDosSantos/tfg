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
            $table->integer("adults")->default(1);
            $table->integer("child")->default(0);
            $table->enum("status",["checked_in","late","no_show","cancelled","completed","pending",
//                "accepted",
                "paid"])->default("pending");
            $table->string('codigo_qr')->unique();

            $table->foreignId("tax_id")->constrained("taxes");
            $table->decimal("adult_price_total", 10, 2);
            $table->decimal("child_price_total", 10, 2);
            $table->decimal("applied_tax", 5, 2);

            $table->foreignId("park_reservation_type_id")->constrained("park_reservation_types");


            $table->unique(["user_id","park_id","reservation_date"],"ui_pi_rd");
            $table->timestamps();
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
