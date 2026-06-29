<?php
namespace Modules\User\Tests\Feature\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\User\Models\Client;
use Modules\User\Models\Owner;
use Modules\User\Models\User;
use Modules\User\Services\OwnerService;
use Modules\User\Models\Definition\Role;
use Modules\User\Tests\Feature\Services\MemberBaseServiceTest;
use Tests\TestCase;

class OwnerServiceTest extends MemberBaseServiceTest
{
    use DatabaseTransactions;
    protected string $serviceClass=OwnerService::class;
    protected string $roleName=Role::ROLE_OWNER;
    protected string $modelClass=Owner::class;
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
