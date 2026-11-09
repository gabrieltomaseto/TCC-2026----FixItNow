<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Autonomo extends Model
{
    protected $fillable = [
        'nome',
        'cpf',
        'telefone',
        'email',
        'especialidade',
        'disponibilidade',
    ];
}
