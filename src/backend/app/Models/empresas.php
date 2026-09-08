<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class empresas extends Model
{
    protected $fillable = ['id_empresa', 'nome', 'cnpj', 'endereco', 'telefone', 'email'];
}
