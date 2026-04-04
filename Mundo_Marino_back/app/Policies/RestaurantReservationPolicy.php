<?php

namespace App\Policies;

use App\Models\Restaurant_reservation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RestaurantReservationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Restaurant_reservation $restaurantReservation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isRestaurantManager() || $user->isUser();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Restaurant_reservation $restaurantReservation): bool
    {
        if ($user->isAdmin() || $user->isRestaurantManager()) {
            return true;
        }
        if ($user->isUser()) {
            return $user->id === $restaurantReservation->user_id;
        }
        return false;
    }


    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Restaurant_reservation $restaurantReservation): bool
    {
        if ($user->isAdmin() || $user->isRestaurantManager()) {
            return true;
        }
        if ($user->isUser()) {
            return $user->id === $restaurantReservation->user_id;
        }
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Restaurant_reservation $restaurantReservation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Restaurant_reservation $restaurantReservation): bool
    {
        return false;
    }
}
