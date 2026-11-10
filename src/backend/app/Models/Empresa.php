<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
<<<<<<< HEAD
use Illuminate\Support\Facades\Storage;
=======
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871

class Empresa extends Model
{
    protected $table = 'empresas';

    protected $fillable = [
        'nome',
        'cnpj',
        'endereco',
        'telefone',
        'email',
<<<<<<< HEAD
        'foto_path',
        'descricao',
        'created_by',
    ];

    protected $hidden = ['foto_path'];

    protected $appends = ['foto_url'];

    public function getFotoUrlAttribute(): ?string
    {
        return $this->foto_path
            ? rtrim(config('app.url'), '/') . '/storage/' . ltrim($this->foto_path, '/')
            : null;
    }

=======
    ];

>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
    public function usuario()
    {
        return $this->hasOne(User::class, 'empresa_id');
    }
}
