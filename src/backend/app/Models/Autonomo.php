<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Autonomo extends Model
{
    protected $fillable = [
        'nome',
        'cpf',
        'telefone',
        'email',
        'especialidade',
        'disponibilidade',
        'ativo',
        'foto_path',
        'descricao',
        'created_by',
    ];

    protected $hidden = ['foto_path'];

    protected $appends = ['foto_url'];

    protected $casts = [
        'ativo' => 'boolean',
    ];

    public function getFotoUrlAttribute(): ?string
    {
        return $this->foto_path
            ? '/storage/' . ltrim($this->foto_path, '/')
            : null;
    }

    public function usuario()
    {
        return $this->hasOne(User::class, 'autonomo_id');
    }

    public function servicos()
    {
        return $this->belongsToMany(
            Servico::class,
            'servicos_autonomo',
            'id_autonomo',
            'id_servico'
        )->withPivot(['status', 'nivel_experiencia'])->withTimestamps();
    }
}
