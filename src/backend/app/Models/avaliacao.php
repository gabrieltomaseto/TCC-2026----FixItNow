<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avaliacao extends Model
{
    protected $table = 'avaliacaos';

    protected $fillable = [
        'nota',
        'comentarios',
        'id_solicitacao',
    ];
}