<?php

namespace Modules\User\Tests\Feature\Models;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Log;
use Modules\User\Http\Resources\Api\V1\Admin\ClientResource;
use Modules\User\Models\Client;
use Modules\User\Models\Definition\Education;
use Modules\User\Models\User;
use Tests\TestCase;

class ClientTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic test example.
     */
    protected string $modelClass=Client::class;

    function test_full_name()
    {
        $record=$this->modelClass::factory()->create([
            'first_name'=>'hamed',
            'last_name'=>'ahmadi',
        ]);
        $this->assertEquals('Hamed Ahmadi',$record->full_name);
    }

    function test_blood_group()
    {
        $record=$this->modelClass::factory()->create([
            'first_name'=>'hamed',
            'last_name'=>'ahmadi',
            'blood_group_id'=>1,
        ]);

        $this->assertEquals('A+',$record->bloodGroup->type);
    }

    function test_education()
    {
        $edu=Education::factory()->create([
            'name'=>'لیسانس'
        ]);
        $record=$this->modelClass::factory()->create([
            'first_name'=>'hamed',
            'last_name'=>'ahmadi',
            'education_id'=>$edu->id
        ]);

        $this->assertEquals('لیسانس',$record->education->name);
    }

    function test_is_not_active()
    {
        $record=$this->modelClass::factory()->create([
            'first_name'=>'ali',
            'is_active'=>true
        ]);
        $this->assertDatabaseHas('clients',[
            'id'=>$record->id
        ]);
        $this->assertNotTrue($record->is_active);
        $updated=$record->update([
            'first_name'=>'Ali',
            'is_active'=>true
        ]);

        $this->assertTrue($updated);

        $this->assertNotTrue($record->fresh()->is_active);
    }


    function test_is_active()
    {
        $user=User::factory()->create();
        $record=$this->modelClass::factory()->create([
            'user_id'=>$user->id,
            'first_name'=>'ali',
            'is_active'=>true
        ]);
        $this->assertDatabaseHas('clients',[
            'id'=>$record->id
        ]);
        $this->assertTrue($record->is_active);
    }
}
