<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
    'name',
    'email',
    'password',
    'tipo',
    'empresa_id',
    'autonomo_id',
];
    protected $hidden = [
        'password',
        'remember_token',
    ];

public function empresa()
{
    return $this->belongsTo(Empresa::class, 'empresa_id');
}

public function autonomo()
{
    return $this->belongsTo(Autonomo::class, 'autonomo_id');
}
}
