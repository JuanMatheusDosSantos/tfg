<?php

namespace App\Policies;

use App\Models\Park_reservation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ParkReservationPolicy
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
    public function view(User $user, Park_reservation $parkReservation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin()||$user->isParkManager()||$user->isUser();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Park_reservation $parkReservation): bool
    {
        if ($user->isAdmin()||$user->isParkManager()) {
            return true;
        }
        if ($user->isUser()) {
            return $user->id===$parkReservation->user_id;
        }
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Park_reservation $parkReservation): bool
    {
        if ($user->isAdmin()||$user->isParkManager()) {
            return true;
        }
        if ($user->isUser()) {
            return $user->id===$parkReservation->user_id;
        }
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Park_reservation $parkReservation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Park_reservation $parkReservation): bool
    {
        return false;
    }
}
