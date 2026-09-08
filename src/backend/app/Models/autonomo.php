<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class autonomo extends Model
{
    protected $fillable = ['id_autonomo', 'nome', 'cpf', 'telefone', 'email', 'especialidade', 'disponibilidade' ];

}

