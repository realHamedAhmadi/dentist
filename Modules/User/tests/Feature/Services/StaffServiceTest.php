<?php
namespace Modules\User\Tests\Feature\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\User\Models\Client;
use Modules\User\Models\Staff;
use Modules\User\Models\User;
use Modules\User\Services\StaffService;
use Modules\User\Models\Definition\Role;
use Modules\User\Tests\Feature\Services\MemberBaseServiceTest;

class StaffServiceTest extends MemberBaseServiceTest
{
    use DatabaseTransactions;
    protected string $serviceClass=StaffService::class;
    protected string $roleName=Role::ROLE_STAFF;
    protected string $modelClass=Staff::class;

    protected function createRecordWithUser(array $attributes = []): Model
    {
        $user = User::factory()->create();
        return $this->modelClass::factory()->create([
            'user_id' => $user->id,
        ]);
    }

    protected function callProtected(object $object, string $method, array $params = [])
    {
        $reflection = new \ReflectionClass($object);
        $method = $reflection->getMethod($method);
        $method->setAccessible(true);
        return $method->invokeArgs($object, $params);
    }

    /** @test */
    public function it_create_client_on_create()
    {
        $owner = $this->createRecordWithUser();

        $data=[
            'first_name'=>$owner->first_name,
        ];
        $this->callProtected(app($this->serviceClass), 'created', [$owner,$data]);

        $this->assertDatabaseHas(Client::table(), [
            'user_id' => $owner->user_id,
        ]);
    }
}
