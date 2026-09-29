<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Solicitacao extends Model
{
    protected $table = 'solicitacaos';

    protected $fillable = [
        'data_solicitacao',
        'descricao_problema',
        'status',
        'id_empresa',
        'id_servico',
        'id_autonomo',
        'data_inicio',
        'data_fim',
    ];
}