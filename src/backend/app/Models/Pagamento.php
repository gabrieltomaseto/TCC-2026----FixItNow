<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pagamento extends Model
{
    protected $table = 'pagamentos';

    protected $fillable = [
        'id_solicitacao',
        'valor',
        'metodo',
        'status',
    ];

    protected $casts = [
        'valor' => 'decimal:2',
    ];

    public function solicitacao()
    {
        return $this->belongsTo(Solicitacao::class, 'id_solicitacao');
    }
}
