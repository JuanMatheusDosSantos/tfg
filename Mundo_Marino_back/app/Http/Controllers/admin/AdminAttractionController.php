<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Admin_log;
use App\Models\Attraction;
use App\Models\Park;
use Illuminate\Http\Request;

class AdminAttractionController extends Controller
{
    function index()
    {
        try {
            $attractions = Attraction::all();
            return response()->json($attractions);
        } catch (\Exception $e) {
            return response()->json(["Ha ocurrido un error a la hora de mostrar todas las attraciones"], 400);
        }
    }

    function show($id)
    {
        try {
            $attraction = Attraction::findOrFail($id);
            return response()->json($attraction);
        } catch (\Exception $e) {
            return response()->json(["Ha ocurrido un fallo a la hora de buscar esta atracción"], 404);
        }
    }


    function store(Request $request)
    {
        $request->validate([
            "name" => "required|string|max:255",
            "type" => "required|string",
            "duration" => "required|integer|min:1|max:99",
            "max_capacity" => "required|integer|min:1",
            "park_id" => "required|integer|exists:parks,id",
            "description" => "required|string",
        ]);
        $this->authorize("create", Attraction::class);
        try {
            $image = null;
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('attractions', 'public');
                $image = asset('storage/' . $path);
            }

            $attraction = Attraction::create([
                "name" => $request->name,
                "type" => $request->type,
                "duration" => $request->duration,
                "max_capacity" => $request->max_capacity,
                "park_id" => $request->park_id,
                "description" => $request->description,
                "status" => $request->status ?? 'operational',
                "min_height" => $request->min_height ?? null,
                "image" => $image,
            ]);

            $this->log('insert', 'attractions', '', "name: {$attraction->name}, type: {$attraction->type}, park_id: {$attraction->park_id}");

            return response()->json(["se ha guardado correctamente la atracción"], 201);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }

    function update(Request $request, $id)
    {
        $request->validate([
            "name" => "required|string|max:255",
            "type" => "required|string",
            "duration" => "required|integer|min:1|max:99",
            "max_capacity" => "required|integer|min:1",
            "park_id" => "required|integer|exists:parks,id"
        ]);

        $attraction = Attraction::findOrFail($id);
        $this->authorize("update", $attraction);
        try {
            $old = "name: {$attraction->name}, type: {$attraction->type}, status: {$attraction->status}, duration: {$attraction->duration}";

            $attraction->name = $request->name;
            $attraction->type = $request->type;
            $attraction->duration = $request->duration;
            $attraction->max_capacity = $request->max_capacity;
            $attraction->park_id = $request->park_id;
            $attraction->status = $request->status ?? $attraction->status;
            $attraction->min_height = $request->min_height;

            if ($request->hasFile('image')) {
                if ($attraction->image) {
                    $oldPath = str_replace(asset('storage/'), '', $attraction->image);
                    \Storage::disk('public')->delete($oldPath);
                }
                $path = $request->file('image')->store('attractions', 'public');
                $attraction->image = asset('storage/' . $path);
            }

            $attraction->save();

            $new = "name: {$attraction->name}, type: {$attraction->type}, status: {$attraction->status}, duration: {$attraction->duration}";
            $this->log('update', 'attractions', $old, $new);

            return response()->json(["se ha cambiado correctamente la informacion de la atraccion"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }

    function delete($id)
    {
        $attraction = Attraction::findOrFail($id);
        $this->authorize("delete", $attraction);
        try {
            $old = "name: {$attraction->name}, status: {$attraction->status}";
            $attraction->status = "permanently_closed";
            $attraction->save();

            $this->log('delete', 'attractions', $old, "status: permanently_closed");

            return response()->json(["la atracción ahora esta permanentemente cerrada"], 200);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }

    public function editStatus(Request $request, $id)
    {
        try {
            $request->validate([
                "status" => "required|in:operational,maintenance,closed,permanently_closed"
            ]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }

        try {
            $attraction = Attraction::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["No se ha encontrado la atracción"], 400);
        }
        $this->authorize("update", $attraction);
        try {
            $old = "status: {$attraction->status}";
            $attraction->status = $request->status;
            $attraction->save();

            $this->log('update', 'attractions', $old, "status: {$request->status}");

            return response()->json(["Estado actualizado correctamente"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }
    }

    private function log(string $action, string $table, string $old, string $new): void
    {
        Admin_log::create([
            'action' => $action,
            'affected_table' => $table,
            'old_value' => $old,
            'new_value' => $new,
            'user_id' => auth()->id(),
        ]);
    }

}
