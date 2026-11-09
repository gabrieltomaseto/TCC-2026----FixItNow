<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Solicitacao extends Model
{
    protected $table = 'solicitacoes';

    protected $fillable = [
        'data_solicitacao',
        'descricao_problema',
        'status',
        'id_empresa',
        'id_servico',
        'id_autonomo',
        'data_inicio',
        'data_fim',
        'nome_contato',
        'empresa_contato',
        'local_atendimento',
        'telefone_contato',
        'tipo_servico',
        'prioridade',
        'preco_estimado',
        'resposta_autonomo',
        'respondida_em',
    ];

    protected $casts = [
        'data_solicitacao' => 'date',
        'data_inicio' => 'date',
        'data_fim' => 'date',
        'preco_estimado' => 'decimal:2',
        'respondida_em' => 'datetime',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }

    public function servico()
    {
        return $this->belongsTo(Servico::class, 'id_servico');
    }

    public function autonomo()
    {
        return $this->belongsTo(Autonomo::class, 'id_autonomo');
    }

    public function avaliacao()
    {
        return $this->hasOne(Avaliacao::class, 'id_solicitacao');
    }

    public function pagamentos()
    {
        return $this->hasMany(Pagamento::class, 'id_solicitacao');
    }
}
