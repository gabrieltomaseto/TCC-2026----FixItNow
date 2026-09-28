<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicoAutonomo extends Model
{
    protected $table = 'servicos_autonomo';

    public $incrementing = false;

    protected $fillable = [
        'id_servico',
        'id_autonomo',
        'status',
        'nivel_experiencia',
    ];
}
