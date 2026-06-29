<?php

namespace Modules\User\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ExpertFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\User\Models\Expert::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [];
    }
}

