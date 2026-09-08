<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class avaliacao extends Model
{
     protected $fillable = ['id_servico', 'nome_servico', 'descricao', 'categoria', 'id_solicitacao'];
}
