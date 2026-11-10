<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
<<<<<<< HEAD
    use HasApiTokens, Notifiable;
=======
    use Notifiable;
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871

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
