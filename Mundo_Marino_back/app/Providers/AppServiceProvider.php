<?php

namespace App\Providers;

use App\Models\Attraction;
use App\Models\Park;
use App\Models\Park_reservation;
use App\Models\Restaurant;
use App\Models\Restaurant_reservation;
use App\Policies\AttractionPolicy;
use App\Policies\ParkPolicy;
use App\Policies\ParkReservationPolicy;
use App\Policies\RestaurantPolicy;
use App\Policies\RestaurantReservationPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Restaurant_reservation::class, RestaurantReservationPolicy::class);
        Gate::policy(Park_reservation::class, ParkReservationPolicy::class);
        Gate::policy(Attraction::class, AttractionPolicy::class);
        Gate::policy(Restaurant::class, RestaurantPolicy::class);
        Gate::policy(Park::class, ParkPolicy::class);
    }
}
