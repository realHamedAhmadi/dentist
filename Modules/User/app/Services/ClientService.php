<?php

namespace Modules\User\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Core\Helpers\Collect;
use Modules\User\Models\Client;
use Modules\User\Models\Definition\Role;
use Modules\User\Models\User;

class ClientService extends MemberBaseService
{
    public function __construct()
    {
        parent::__construct(
            modelClass: Client::class,
            roleName: Role::ROLE_CLIENT,
            relation: 'client',
            isUserRequired: false,
            protectedIds:[],
        );
    }

    public function createUser(int $id): User
    {
        $record = $this->modelClass::findOrFail($id);
        if ($record->user()->exists()) {
            throw new \RuntimeException('User already registered for this Person.');
        }

        DB::beginTransaction();
        try {
            $user = (new UserService())->create($record->toArray());

            if (!$user->exists) {
                throw new \RuntimeException('User already exists for Others!');
            }
            $record->update([
                'user_id'=>$user->id
            ]);

            $user->assignRole($this->roleName);

            DB::commit();
            return $user;

        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error($e->getMessage(), ['exception' => $e]);

            throw $e;
        }
    }

    protected function filterQuery(Builder $q, array $filers): Builder
    {
        $collect = new Collect($filers);
        $q->when($collect->name || $collect->full_name, function ($q) use ($collect) {
            $name = $collect->name ?? $collect->full_name;
            $q->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$name}%"]);
        });

        $q->when($collect->first_name,
            fn($q) => $q->where('first_name', 'LIKE', "%{$collect->first_name}%"));

        $q->when($collect->last_name,
            fn($q) => $q->where('last_name', 'LIKE', "%{$collect->last_name}%"));

        $q->when($collect->phone,
            fn($q) => $q->where('phone', $collect->phone));
        return $q;
    }
}
