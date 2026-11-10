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

    public function servico()
    {
        return $this->belongsTo(Servico::class, 'id_servico');
    }

    public function autonomo()
    {
        return $this->belongsTo(Autonomo::class, 'id_autonomo');
    }
}
