<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicoAutonomo extends Model
{
<<<<<<< HEAD
    protected $table = 'servicos_autonomo';
=======
    protected $table = 'servico_autonomos';
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871

    public $incrementing = false;

    protected $fillable = [
        'id_servico',
        'id_autonomo',
        'status',
        'nivel_experiencia',
    ];
<<<<<<< HEAD

    public function servico()
    {
        return $this->belongsTo(Servico::class, 'id_servico');
    }

    public function autonomo()
    {
        return $this->belongsTo(Autonomo::class, 'id_autonomo');
    }
=======
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
}
