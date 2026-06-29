<?php

namespace Modules\User\Observers;

use Modules\User\Models\User;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void {}

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void {
        if ($user->isDirty(['first_name','last_name','phone']) && $user->client) {
            $user->client->update([
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'phone' => $user->phone,
            ]);
        }
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void {}

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void {}

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void {}
}
