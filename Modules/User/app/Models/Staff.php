<?php
namespace Modules\User\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\User\Database\Factories\StaffFactory;
use Modules\User\Models\Definition\ContractType;
use Modules\User\Models\Definition\Position;
use Modules\User\Models\Definition\Shift;

class Staff extends Model
{
    use HasFactory;

    protected $table = 'staff';

    protected $fillable = [
        'user_id',
        'shift_id',
        'position_id',
        'hire_date',
        'end_date',
        'is_active',
        'national_code',
        'employee_code',
        'contract_type',
        'address',
    ];
    protected $casts = [
        'hire_date' => 'date',
        'end_date' => 'date',
    ];

    protected function phone(): Attribute
    {
        return Attribute::make(
            get:fn()=>$this->user->phone,
        )->shouldCache();
    }

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user->full_name,
        )->shouldCache();
    }

    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user->first_name,
        )->shouldCache();
    }

    protected function lastName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user->last_name,
        )->shouldCache();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function contractType():BelongsTo
    {
        return $this->belongsTo(ContractType::class);
    }
}
