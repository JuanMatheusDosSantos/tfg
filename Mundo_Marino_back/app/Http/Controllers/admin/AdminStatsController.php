<?php

namespace App\Http\Controllers\admin;
use App\Http\Controllers\Controller;

use App\Models\Park_reservation;
use App\Models\Restaurant_reservation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminStatsController extends Controller
{
    public function stats()
    {
        try{
            $user = Auth::user();
            $now = Carbon::now();

            $inicioMes = $now->copy()->startOfMonth();
            $diaActual = $now->day;

            // Días transcurridos del mes anterior (mismo rango: día 1 al día actual)
            $inicioMesAnterior = $now->copy()->subMonth()->startOfMonth();
            $finMesAnterior = $now->copy()->subMonth()->setDay($diaActual)->endOfDay();

            $stats = [];

            if ($user->role === 'admin' || $user->role === 'park') {
                $reservasParqueMes = Park_reservation::whereNotIn('status', ['cancelled',"pending"])
                    ->whereDate('reservation_date', '>=', $inicioMes)
                    ->whereDate('reservation_date', '<=', $now)
                    ->get();

                $reservasParqueMesAnterior = Park_reservation::whereNotIn('status', ['cancelled', 'pending',"no_show"])
                    ->whereDate('reservation_date', '>=', $inicioMesAnterior)
                    ->whereDate('reservation_date', '<=', $finMesAnterior)
                    ->get();

                // Total visitantes del mes (adultos + niños)
                $visitantesMes = $reservasParqueMes->sum(fn($r) => $r->adults + $r->child);
                $visitantesMesAnterior = $reservasParqueMesAnterior->sum(fn($r) => $r->adults + $r->child);

                // Revenue del mes
                $revenueMes = $reservasParqueMes->sum(fn($r) => ($r->adult_price_total + $r->child_price_total) * (1 + $r->applied_tax / 100)
                );
                $revenueMesAnterior = $reservasParqueMesAnterior->sum(fn($r) => ($r->adult_price_total + $r->child_price_total) * (1 + $r->applied_tax / 100)
                );

                // Media diaria del mes actual
                $mediaDiaria = $diaActual > 0 ? $revenueMes / $diaActual : 0;
                $mediaDiariaAnterior = $diaActual > 0 ? $revenueMesAnterior / $diaActual : 0;

                // Reservas activas de parque (pending + accepted)
                $reservasActivasParque = Park_reservation::whereIn('status', ['pending', 'accepted'])->count();
                $reservasActivasParqueAnterior = Park_reservation::whereIn('status', ['pending', 'accepted'])
                    ->whereDate('created_at', '>=', $inicioMesAnterior)
                    ->whereDate('created_at', '<=', $finMesAnterior)
                    ->count();

                $stats['visitantes_mes'] = $visitantesMes;
                $stats['visitantes_mes_anterior'] = $visitantesMesAnterior;
                $stats['visitantes_variacion'] = $this->variacion($visitantesMes, $visitantesMesAnterior);

                $stats['reservas_activas_parque'] = $reservasActivasParque;
                $stats['reservas_activas_parque_anterior'] = $reservasActivasParqueAnterior;
                $stats['reservas_activas_parque_variacion'] = $this->variacion($reservasActivasParque, $reservasActivasParqueAnterior);

                $stats['revenue_mes'] = round($revenueMes, 2);
                $stats['revenue_mes_anterior'] = round($revenueMesAnterior, 2);
                $stats['revenue_variacion'] = $this->variacion($revenueMes, $revenueMesAnterior);

                $stats['media_diaria'] = round($mediaDiaria, 2);
                $stats['media_diaria_anterior'] = round($mediaDiariaAnterior, 2);
                $stats['media_diaria_variacion'] = $this->variacion($mediaDiaria, $mediaDiariaAnterior);

                // Últimas 5 reservas de parque
                $stats['ultimas_reservas_parque'] = Park_reservation::with('user')
                    ->orderByDesc('created_at')
                    ->limit(5)
                    ->get();
            }

            if ($user->role === 'admin' || $user->role === 'restaurant') {
                $reservasRestauranteMes = Restaurant_reservation::whereIn('status', ['accepted', 'completed'])
                    ->whereDate('reservation_date', '>=', $inicioMes)
                    ->whereDate('reservation_date', '<=', $now)
                    ->count();

                $reservasRestauranteMesAnterior = Restaurant_reservation::whereIn('status', ['accepted', 'completed'])
                    ->whereDate('reservation_date', '>=', $inicioMesAnterior)
                    ->whereDate('reservation_date', '<=', $finMesAnterior)
                    ->count();

                $stats['reservas_restaurante_mes'] = $reservasRestauranteMes;
                $stats['reservas_restaurante_mes_anterior'] = $reservasRestauranteMesAnterior;
                $stats['reservas_restaurante_variacion'] = $this->variacion($reservasRestauranteMes, $reservasRestauranteMesAnterior);

                // Últimas 5 reservas de restaurante
                $stats['ultimas_reservas_restaurante'] = Restaurant_reservation::with('user')
                    ->orderByDesc('created_at')
                    ->limit(5)
                    ->get();
            }

            // Actividad reciente (admin_logs)
            if ($user->role === 'admin') {
                $stats['actividad_reciente'] = \App\Models\Admin_log::with('user')
                    ->orderByDesc('created_at')
                    ->limit(5)
                    ->get();
            }

            return response()->json($stats);
        }catch (\Exception $e){
            return response()->json([$e->getMessage()],400);
        }

    }

    private function variacion(float $actual, float $anterior): float
    {
        if ($anterior == 0) return $actual > 0 ? 100 : 0;
        return round((($actual - $anterior) / $anterior) * 100, 1);
    }
}
