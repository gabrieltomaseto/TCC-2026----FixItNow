<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class servicos_autonomo extends Model
{
    protected $fillable = ['id_autonomo', 'id_servico', 'status', 'nivel_experiencia',];
}
