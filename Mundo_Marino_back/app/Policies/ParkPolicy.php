<?php

namespace App\Policies;

use App\Models\Park;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ParkPolicy
{
    public function before(User $user, string $ability)
    {
        return $user->isAdmin()||$user->isParkManager();
    }
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
    public function view(User $user, Park $park): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin()||$user->isParkManager();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Park $park): bool
    {
        return $user->isParkManager()||$user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Park $park): bool
    {
        return $user->isParkManager()||$user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Park $park): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Park $park): bool
    {
        return false;
    }
}
