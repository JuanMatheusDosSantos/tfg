<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class AttractionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
//        DB::table("attractions")->insert([
//            [
//                "id" => 1,
//                "name" => "El SurcaOlas",
//                "type" => 1,
//                "duration" => 5,
//                "max_capacity" => 20,
//                "park_id" => 1,
//            ],
//            [
//                "id" => 2,
//                "name" => "El Remolino",
//                "type" => 2,
//                "duration" => 5,
//                "max_capacity" => 20,
//                "park_id" => 2,
//            ]
//        ]);

        DB::table("attractions")->insert([
            //parque 1
            // --- SUAVES ---
            [
                "name" => "El Carrusel Marino",
                "type" => "suave",
                "description" => "Un clásico carrusel con figuras de animales marinos.",
                "duration" => 3,
                "max_capacity" => 30,
                "min_height" => 0.00,
                "status" => "operational",
                "park_id" => 1,
                "created_at" => "2026-03-20 10:00:00",
                "updated_at" => "2026-03-20 10:00:00", // <--- FECHA FIJA COMPARTIDA
            ],
            [
                "name" => "Paseo en Góndola",
                "type" => "suave",
                "description" => "Relajante recorrido por los canales.",
                "duration" => 10,
                "max_capacity" => 12,
                "min_height" => 0.90,
                "status" => "operational",
                "park_id" => 1,
                "created_at" => "2026-03-25 11:30:00",
                "updated_at" => "2026-03-25 11:30:00",
            ],
            [
                "name" => "La Laguna de los Patos",
                "type" => "suave",
                "description" => "Barcas para los más pequeños.",
                "duration" => 5,
                "max_capacity" => 4,
                "min_height" => 0.80,
                "status" => "maintenance",
                "park_id" => 1,
                "created_at" => "2026-04-01 09:15:00",
                "updated_at" => "2026-04-01 09:15:00",
            ],

            // --- MODERADOS ---
            [
                "name" => "El SurcaOlas",
                "type" => "moderado",
                "description" => "Aventura sobre las olas.",
                "duration" => 5,
                "max_capacity" => 20,
                "min_height" => 1.10,
                "status" => "operational",
                "park_id" => 1,
                "created_at" => "2026-03-20 10:00:00",
                "updated_at" => "2026-03-20 10:00:00", // <--- FECHA FIJA COMPARTIDA
            ],
            [
                "name" => "Rápidos del Río",
                "type" => "moderado",
                "description" => "Descenso por aguas bravas.",
                "duration" => 6,
                "max_capacity" => 8,
                "min_height" => 1.20,
                "status" => "operational",
                "park_id" => 1,
                "created_at" => "2026-03-28 14:20:00",
                "updated_at" => "2026-03-28 14:20:00",
            ],
            [
                "name" => "Cataratas Misteriosas",
                "type" => "moderado",
                "description" => "Caída libre hacia una cueva.",
                "duration" => 4,
                "max_capacity" => 16,
                "min_height" => 1.15,
                "status" => "closed",
                "park_id" => 1,
                "created_at" => "2026-04-03 17:45:00",
                "updated_at" => "2026-04-03 17:45:00",
            ],

            // --- INTENSOS ---
            [
                "name" => "El Remolino",
                "type" => "intenso",
                "description" => "Giros vertiginosos y caídas.",
                "duration" => 2,
                "max_capacity" => 24,
                "min_height" => 1.40,
                "status" => "operational",
                "park_id" => 1,
                "created_at" => "2026-03-20 10:00:00",
                "updated_at" => "2026-03-20 10:00:00", // <--- FECHA FIJA COMPARTIDA
            ],
            [
                "name" => "Tifón Infernal",
                "type" => "intenso",
                "description" => "Montaña rusa de alta velocidad.",
                "duration" => 2,
                "max_capacity" => 20,
                "min_height" => 1.50,
                "status" => "maintenance",
                "park_id" => 1,
                "created_at" => "2026-03-30 12:00:00",
                "updated_at" => "2026-03-30 12:00:00",
            ],
            [
                "name" => "Abismo del Kraken",
                "type" => "intenso",
                "description" => "La caída más alta del parque.",
                "duration" => 3,
                "max_capacity" => 12,
                "min_height" => 1.45,
                "status" => "operational",
                "park_id" => 1,
                "created_at" => "2026-04-05 16:30:00",
                "updated_at" => "2026-04-05 16:30:00",
            ],
            //parque 2
            [
                "name" => "Gran Carrusel Real",
                "type" => "suave",
                "description" => "Versión de lujo del carrusel clásico.",
                "duration" => 3,
                "max_capacity" => 35,
                "min_height" => 0.00,
                "status" => "operational",
                "park_id" => 2,
                "created_at" => "2026-03-20 10:00:00",
                "updated_at" => "2026-03-20 10:00:00",
            ],
            [
                "name" => "Crucero del Canal",
                "type" => "suave",
                "description" => "Paseo panorámico por el segundo parque.",
                "duration" => 12,
                "max_capacity" => 15,
                "min_height" => 0.90,
                "status" => "operational",
                "park_id" => 2,
                "created_at" => "2026-03-25 11:30:00",
                "updated_at" => "2026-03-25 11:30:00",
            ],
            [
                "name" => "Estanque de los Cisnes",
                "type" => "suave",
                "description" => "Barcas infantiles con forma de cisne.",
                "duration" => 5,
                "max_capacity" => 4,
                "min_height" => 0.80,
                "status" => "operational",
                "park_id" => 2,
                "created_at" => "2026-04-01 09:15:00",
                "updated_at" => "2026-04-01 09:15:00",
            ],
            [
                "name" => "El SurcaOlas Extreme",
                "type" => "moderado",
                "description" => "Más rápido que el original.",
                "duration" => 5,
                "max_capacity" => 20,
                "min_height" => 1.20,
                "status" => "operational",
                "park_id" => 2,
                "created_at" => "2026-03-20 10:00:00",
                "updated_at" => "2026-03-20 10:00:00",
            ],
            [
                "name" => "Rápidos del Cañón",
                "type" => "moderado",
                "description" => "Descenso entre rocas y cascadas.",
                "duration" => 6,
                "max_capacity" => 10,
                "min_height" => 1.20,
                "status" => "operational",
                "park_id" => 2,
                "created_at" => "2026-03-28 14:20:00",
                "updated_at" => "2026-03-28 14:20:00",
            ],
            [
                "name" => "Cataratas Prohibidas",
                "type" => "moderado",
                "description" => "Caída libre en la oscuridad.",
                "duration" => 4,
                "max_capacity" => 16,
                "min_height" => 1.15,
                "status" => "closed",
                "park_id" => 2,
                "created_at" => "2026-04-03 17:45:00",
                "updated_at" => "2026-04-03 17:45:00",
            ],
            [
                "name" => "El Gran Remolino",
                "type" => "intenso",
                "description" => "La versión más grande del remolino.",
                "duration" => 2,
                "max_capacity" => 30,
                "min_height" => 1.40,
                "status" => "operational",
                "park_id" => 2,
                "created_at" => "2026-03-20 10:00:00",
                "updated_at" => "2026-03-20 10:00:00",
            ],
            [
                "name" => "Tifón del Pacífico",
                "type" => "intenso",
                "description" => "Montaña rusa con 3 loopings.",
                "duration" => 2,
                "max_capacity" => 24,
                "min_height" => 1.50,
                "status" => "operational",
                "park_id" => 2,
                "created_at" => "2026-03-30 12:00:00",
                "updated_at" => "2026-03-30 12:00:00",
            ],
            [
                "name" => "La Furia del Kraken",
                "type" => "intenso",
                "description" => "Atracción hermana del Abismo.",
                "duration" => 3,
                "max_capacity" => 12,
                "min_height" => 1.45,
                "status" => "operational",
                "park_id" => 2,
                "created_at" => "2026-04-05 16:30:00",
                "updated_at" => "2026-04-05 16:30:00",
            ]
        ]);

    }
}
