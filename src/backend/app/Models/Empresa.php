<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Empresa extends Model
{
    protected $table = 'empresas';

    protected $fillable = [
        'nome',
        'cnpj',
        'endereco',
        'telefone',
        'email',
        'foto_path',
        'descricao',
        'created_by',
    ];

    protected $hidden = ['foto_path'];

    protected $appends = ['foto_url'];

    public function getFotoUrlAttribute(): ?string
    {
        return $this->foto_path
            ? '/storage/' . ltrim($this->foto_path, '/')
            : null;
    }

    public function usuario()
    {
        return $this->hasOne(User::class, 'empresa_id');
    }
}
