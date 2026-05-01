<?php

namespace App\Http\Controllers;

use App\Models\Admin_log;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $users = User::with(["park","restaurant"])->get();
            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json(["Ha ocurrido un error a la hora de mostrar todos los usuarios"], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'name'  => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'phone' => 'nullable|integer',
                'role'  => 'required|in:admin,park,restaurant,user',
            ];

            // Validaciones condicionales según el rol
            if ($request->role === 'park') {
                $rules['park_id'] = 'required|exists:parks,id';
            }

            if ($request->role === 'restaurant') {
                $rules['park_id']       = 'required|exists:parks,id';
                $rules['restaurant_id'] = 'required|exists:restaurants,id';
            }

            $request->validate($rules);

        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }

        try {
            $user = User::findOrFail($id);
            $old  = "name: {$user->name}, email: {$user->email}, role: {$user->role}";

            $user->name  = $request->name;
            $user->email = $request->email;
            $user->phone = $request->phone;
            $user->role  = $request->role;

            // Asignar o limpiar park_id y restaurant_id según el rol
            if ($request->role === 'park') {
                $user->park_id       = $request->park_id;
                $user->restaurant_id = null;

            } elseif ($request->role === 'restaurant') {
                $user->park_id       = $request->park_id;
                $user->restaurant_id = $request->restaurant_id;

            } else {
                // admin y user no tienen entidad asignada
                $user->park_id       = null;
                $user->restaurant_id = null;
            }

            $user->save();

            $this->log(
                'update', 'users', $old,
                "name: {$user->name}, email: {$user->email}, role: {$user->role}"
            );

            return response()->json(["Usuario actualizado correctamente"]);

        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function delete($id)
    {
        try {
            $user = User::findOrFail($id);

            if ($user->id === auth()->id()) {
                return response()->json(["No puedes eliminarte a ti mismo"], 400);
            }

            $old = "name: {$user->name}, email: {$user->email}, role: {$user->role}";
            $user->delete();

            $this->log('delete', 'users', $old, '');

            return response()->json(["Usuario eliminado correctamente"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }

    public function updateRole(Request $request, $id)
    {
        try {
            $request->validate([
                'role' => 'required|in:admin,park,restaurant,user',
            ]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 400);
        }

        try {
            $user = User::findOrFail($id);
            $old = "role: {$user->role}";
            $user->role = $request->role;
            $user->save();

            $this->log('update', 'users', $old, "role: {$user->role}");

            return response()->json(["Rol actualizado correctamente"]);
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 500);
        }
    }

    private function log(string $action, string $table, string $old, string $new): void
    {
        Admin_log::create([
            'action'         => $action,
            'affected_table' => $table,
            'old_value'      => $old,
            'new_value'      => $new,
            'user_id'        => auth()->id(),
        ]);
    }
}
