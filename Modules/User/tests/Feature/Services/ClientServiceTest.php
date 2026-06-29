<?php
namespace Modules\User\Tests\Feature\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\User\Models\Client;
use Modules\User\Models\Definition\Role;
use Modules\User\Models\User;
use Modules\User\Services\ClientService;
use Modules\User\Tests\Feature\Services\MemberBaseServiceTest;

class ClientServiceTest extends MemberBaseServiceTest
{
    use DatabaseTransactions;
    protected string $serviceClass=ClientService::class;
    protected string $roleName=Role::ROLE_CLIENT;
    protected string $modelClass=Client::class;
    protected bool $nameIsRequired=true;
    protected function createRecordWithUser(array $attributes = []): Model
    {
        $user = User::factory()->create();
        return $this->modelClass::factory()->create([
            'user_id' => $user->id,
            'first_name'=>$user->first_name,
        ]);
    }

    public function it_throws_exception_if_user_already_exists()
    {

    }

    public function it_not_throws_exception_if_user_already_exists()
    {
        $service = app($this->serviceClass);

        $user = User::factory()->create([
            'phone' => '0912000000',
            'email' => 'duplicate@example.com',
        ]);

        $service->create([
            'first_name' => 'Test',
            'last_name'  => 'User',
            'phone'      => $user->phone,
            'email'      => $user->email,
        ]);

        $this->assertDatabaseHas((new $this->modelClass)->getTable(),[
            'first_name' => 'Test',
            'last_name'  => 'User',
            'phone'      => $user->phone,
        ]);
    }
}
