<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class solicitacao extends Model
{
    protected $fillable = ['id_solicitacao', 'data_solicitacao', 'descricao_problema', 'status'];
}
