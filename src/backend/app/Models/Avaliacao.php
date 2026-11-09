<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avaliacao extends Model
{
    protected $table = 'avaliacoes';

    protected $fillable = [
        'nota',
        'comentarios',
        'id_solicitacao',
    ];

    protected $casts = [
        'nota' => 'integer',
    ];

    public function solicitacao()
    {
        return $this->belongsTo(Solicitacao::class, 'id_solicitacao');
    }
}
