<?php

namespace Modules\User\Tests\Feature\Services;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Core\Exceptions\RecordCannotBeDeletedException;
use Modules\User\Exceptions\AlreadyRegisteredForUserException;
use Modules\User\Exceptions\UniqueValueAlreadyExistsException;
use Modules\User\Models\User;
use Tests\TestCase;

abstract class MemberBaseServiceTest extends TestCase
{
    protected string $serviceClass;
    protected string $modelClass;
    protected string $roleName;

    protected array $otherData=[];

    protected bool $nameIsRequired=false;

    abstract protected function createRecordWithUser(array $attributes = []): Model;

    protected function setOtherData(array $data){
        $this->otherData=$data;
    }
    /** @test */
    public function it_can_find_a_record()
    {
        $record = $this->createRecordWithUser();
        $service = app($this->serviceClass);

        $found = $service->find($record->id);

        $this->assertEquals($record->id, $found->id);
    }

    /** @test */
    public function it_can_create_record_with_user()
    {
        $service = app($this->serviceClass);

        $user = User::factory()->make();
        $data=$user->toArray();
        $data['password'] = 'secret';
        $data['is_active'] = true;

        $record = $service->create(array_merge($data,$this->otherData));
        Log::info($record->user??false);
        $this->assertDatabaseHas((new $this->modelClass)->getTable(), [
            'id'        => $record->id,
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('users', [
            'id'         => $record->user_id,
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
        ]);

        self::assertTrue($record->user->hasRole($this->roleName));
    }

    /** @test */
    public function it_throws_exception_if_Unique_value_already_exists()
    {
        $service = app($this->serviceClass);

        $user = User::factory()->create([
            'phone' => '0912000000',
            'email' => 'mail@example.com',
        ]);

        $user2 = User::factory()->create([
            'phone' => '0912000001',
            'email' => 'duplicate@example.com',
        ]);

        $this->expectException(UniqueValueAlreadyExistsException::class);

        $service->create(array_merge([
            'first_name' => 'Test',
            'last_name'  => 'User',
            'phone'      => $user->phone,
            'email'      => $user->email,
        ],$this->otherData));

        $service->create(array_merge([
            'first_name' => 'Test',
            'last_name'  => 'User',
            'phone'      => $user2->phone,
            'email'      => 'sebicate@example.com',
        ],$this->otherData));
    }

    /** @test */
    public function it_can_create_for_existing_user()
    {
        $service = app($this->serviceClass);

        $user = User::factory()->create();
        $data=[
            'is_active' => true,
        ];
        if ($this->nameIsRequired)
            $data['first_name']=$user->first_name;
        $record = $service->createForUser($data, $user->id);

        $this->assertDatabaseHas((new $this->modelClass)->getTable(), [
            'id'      => $record->id,
            'user_id' => $user->id,
        ]);
    }

    /** @test */
    public function it_cannot_create_for_user_that_already_has_record()
    {
        $service = app($this->serviceClass);

        $record = $this->createRecordWithUser();

        $this->expectException(AlreadyRegisteredForUserException::class);

        $service->createForUser(['is_active' => true], $record->user_id);
    }

    /** @test */
    public function it_can_update_record_and_user()
    {
        $record = $this->createRecordWithUser();
        $service = app($this->serviceClass);


        $result = $service->update(array_merge([
            'first_name' => 'Reza',
            'last_name'  => 'Ahmadi',
            'is_active'  => true,
        ],$this->otherData), $record->id);

        $this->assertDatabaseHas((new $this->modelClass)->getTable(), [
            'id'        => $record->id,
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('users', [
            'id'         => $record->user_id,
            'first_name' => 'Reza',
            'last_name'  => 'Ahmadi',
        ]);
    }

    /** @test */
    public function it_can_delete_record()
    {
        $record = $this->createRecordWithUser();
        $service = app($this->serviceClass);

        $result = $service->delete($record->id);

        $this->assertTrue($result);
        $this->assertDatabaseMissing((new $this->modelClass)->getTable(), [
            'id' => $record->id,
        ]);
    }

    /** @test */
    public function it_cannot_delete_if_id_in_not_deletable()
    {
        $record = $this->createRecordWithUser();
        $service = app($this->serviceClass);

        $reflection = new \ReflectionClass($service);
        $property = $reflection->getProperty('notDeletableIds');
        $property->setAccessible(true);
        $property->setValue($service, [$record->id]);

        $this->expectException(RecordCannotBeDeletedException::class);

        $service->delete($record->id);
    }

    /**
     * @test
     * @dataProvider filterProvider
     */
    public function it_can_filter_records(array $filter, string $expectedField, string $expectedValue)
    {
        $user = User::factory()->create([
            'first_name' => 'Ali',
            'last_name'  => 'Karimi',
            'phone'      => '09121234567',
        ]);

        $data=[
            'user_id' => $user->id,
        ];
        if ($this->nameIsRequired)
            $data=array_merge($data,[
                'first_name' => 'Ali',
                'last_name'  => 'Karimi',
                'phone'      => '09121234567',
            ]);
        $this->modelClass::factory()->create($data);

        $service = app($this->serviceClass);
        $results = $service->get($filter);

        $this->assertTrue($results->count() > 0);
        $this->assertEquals($expectedValue, $results->first()->user->{$expectedField});
    }

    public static function filterProvider(): array
    {
        return [
            [['first_name' => 'Ali'], 'first_name', 'Ali'],
            [['last_name' => 'Karimi'], 'last_name', 'Karimi'],
            [['phone' => '09121234567'], 'phone', '09121234567'],
            [['name' => 'Ali Karimi'], 'last_name', 'Karimi'],
        ];
    }

    /** @test */
    public function it_rolls_back_transaction_on_exception()
    {
        $record = $this->createRecordWithUser();
        $record->is_active=true;
        $record->save();
        $service = app($this->serviceClass);

        DB::shouldReceive('commit')->andThrow(new \Exception("DB Error"));
        Log::shouldReceive('error');

        $this->expectException(\Exception::class);

        $service->update(array_merge(['is_active' => false],$this->otherData), $record->id);

        $this->assertDatabaseMissing((new $this->modelClass)->getTable(), [
            'is_active' => false
        ]);
    }
}
