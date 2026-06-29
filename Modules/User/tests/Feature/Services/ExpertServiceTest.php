<?php
namespace Modules\User\Tests\Feature\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Modules\User\Enums\ShareType;
use Modules\User\Http\Resources\Api\V1\Admin\AdminResource;
use Modules\User\Http\Resources\Api\V1\Admin\ExpertResource;
use Modules\User\Models\Client;
use Modules\User\Models\Definition\Specialty;
use Modules\User\Models\Expert;
use Modules\User\Models\User;
use Modules\User\Services\ExpertService;
use Modules\User\Models\Definition\Role;
use Modules\User\Tests\Feature\Services\MemberBaseServiceTest;
use Tests\TestCase;

class ExpertServiceTest extends MemberBaseServiceTest
{
    use DatabaseTransactions;

    protected string $serviceClass=ExpertService::class;
    protected string $roleName=Role::ROLE_EXPERT;
    protected string $modelClass=Expert::class;
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

    public function it_returns_expert_specialties()
    {
        $user=User::factory()->create();
        $expert = $this->modelClass::factory()->has(Specialty::factory()->count(2))->create([
            'user_id'=>$user->id
        ]);

        $specialties = app($this->serviceClass)->getSpecialties($expert->id);

        $this->assertCount(2, $specialties);
    }

    /** @test */
    public function it_syncs_specialties_on_create()
    {
        $expert = $this->createRecordWithUser();
        $specialty1 = Specialty::factory()->create();
        $specialty2 = Specialty::factory()->create();

        $data = [
            'first_name'=>$expert->first_name,
            'specialties' => [
                ['id' => $specialty1->id, 'share_type' => ShareType::PERCENTAGE->value, 'share_value' => 40],
                ['id' => $specialty2->id, 'share_type' => ShareType::FIXED->value, 'share_value' => 500],
            ]
        ];

        $this->callProtected(app($this->serviceClass), 'created', [$expert, $data]);

        $this->assertDatabaseHas('expert_specialty', [
            'expert_id' => $expert->id,
            'specialty_id' => $specialty1->id,
            'share_value' => 40,
        ]);
    }

    /** @test */
    public function it_create_client_on_create()
    {
        $expert = $this->createRecordWithUser();

        $data=[
            'first_name'=>$expert->first_name,
        ];
        $this->callProtected(app($this->serviceClass), 'created', [$expert,$data]);

        $this->assertDatabaseHas(Client::table(), [
            'user_id' => $expert->user_id,
        ]);
    }

    /** @test */
    public function it_syncs_specialties_on_update()
    {
        $expert = $this->createRecordWithUser();
        $specialty = Specialty::factory()->create();

        $expert->specialties()->attach($specialty->id, [
            'share_type' => ShareType::PERCENTAGE->value,
            'share_value' => 10,
        ]);

        $data = [
            'specialties' => [
                ['id' => $specialty->id, 'share_type' => ShareType::FIXED->value, 'share_value' => 300]
            ]
        ];

        $this->callProtected(app($this->serviceClass), 'updated', [$expert, $data]);

        $this->assertDatabaseHas('expert_specialty', [
            'expert_id' => $expert->id,
            'specialty_id' => $specialty->id,
            'share_value' => 300,
        ]);
    }

    /** @test */
    public function it_detaches_specialties_when_deleting_expert()
    {
        $expert = $this->createRecordWithUser();
        $specialty = Specialty::factory()->create();

        $expert->specialties()->attach($specialty->id);
        $this->assertDatabaseCount('expert_specialty', 1);

        $this->callProtected(app($this->serviceClass), 'deleting', [$expert]);

        $this->assertDatabaseCount('expert_specialty', 0);
    }

    /** @test */
    public function it_formats_specialty_inputs_correctly()
    {
        $data = [
            ['id' => 10, 'share_type' => ShareType::PERCENTAGE->value, 'share_value' => 25],
            ['id' => 20],
        ];

        $result = $this->callProtected(app($this->serviceClass), 'specialtiesInputs', [$data]);

        $this->assertEquals([
            10 => ['share_type' => ShareType::PERCENTAGE->value, 'share_value' => 25],
            20 => ['share_type' => ShareType::PERCENTAGE->value, 'share_value' => 0],
        ], $result);
    }
}


