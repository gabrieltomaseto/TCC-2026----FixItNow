<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacao extends Model
{
    protected $table = 'notificacoes';

    protected $fillable = [
        'user_id',
        'id_solicitacao',
        'tipo',
        'titulo',
        'mensagem',
        'lida_em',
    ];

    protected $casts = [
        'lida_em' => 'datetime',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function solicitacao()
    {
        return $this->belongsTo(Solicitacao::class, 'id_solicitacao');
    }
}
