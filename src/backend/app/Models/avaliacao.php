<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avaliacao extends Model
{
<<<<<<< HEAD
    protected $table = 'avaliacoes';
=======
    protected $table = 'avaliacaos';
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871

    protected $fillable = [
        'nota',
        'comentarios',
        'id_solicitacao',
    ];
<<<<<<< HEAD

    protected $casts = [
        'nota' => 'integer',
    ];

    public function solicitacao()
    {
        return $this->belongsTo(Solicitacao::class, 'id_solicitacao');
    }
}
=======
}
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
