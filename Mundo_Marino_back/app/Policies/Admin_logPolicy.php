<?php

namespace App\Policies;

use App\Models\Admin_log;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class Admin_logPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Admin_log $adminLog): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        return false;    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Admin_log $adminLog): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Admin_log $adminLog): bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Admin_log $adminLog): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Admin_log $adminLog): bool
    {
        return false;
    }
}
