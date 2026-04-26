<?php

namespace App\Http\Middleware;

use App\Models\Admin_log;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            if (Auth::user()->role==="admin"||Auth::user()->role==="park"||Auth::user()->role==="restaurant") {
                return $next($request);
            }
            return response()->json(['message' => 'Acceso denegado. Se requieren permisos de administrador.'], 403);
        }else{
            return response()->json(['message' => 'Acceso denegado. Se requieren permisos de administrador.'], 403);
        }
    }
}
