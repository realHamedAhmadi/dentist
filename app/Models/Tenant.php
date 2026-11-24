<?php
namespace App\Models;

use Spatie\Multitenancy\Models\Tenant as BaseTenant;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Tenant extends BaseTenant
{
    protected $fillable = [
        'name',
        'domain',       // Custom full domain (highest priority)
        'subdomain',    // Subdomain slug (e.g. "clinic-a" → clinic-a.app.com)
        'database',     // Physical database name for this tenant
        'status',       // provisioning | active | suspended | failed
        'plan',
        'owner_email',
        'provisioned_at',
    ];

    protected $casts = [
        'provisioned_at' => 'datetime',
    ];

    // Relationship to the SaaS owner who registered this clinic
    public function saasOwner(): HasOne
    {
        return $this->hasOne(SaasOwner::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
