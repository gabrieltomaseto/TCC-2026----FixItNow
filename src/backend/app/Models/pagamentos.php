<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class pagamentos extends Model
{
    protected $fillable = ['id_pagamento', 'debito', 'credito', 'pix'];
}
