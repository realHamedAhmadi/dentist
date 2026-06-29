<?php

namespace Modules\User\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\User\Models\Client::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'first_name'=>$this->faker->firstName(),
            'last_name'=>$this->faker->lastName(),
            'phone'=>ltrim($this->faker->e164PhoneNumber(),'+'),
        ];
    }
}

