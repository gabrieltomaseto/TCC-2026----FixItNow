<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pagamento extends Model
{
    protected $table = 'pagamentos';

    protected $fillable = [
<<<<<<< HEAD
        'id_solicitacao',
=======
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
        'valor',
        'metodo',
        'status',
    ];
<<<<<<< HEAD

    protected $casts = [
        'valor' => 'decimal:2',
    ];

    public function solicitacao()
    {
        return $this->belongsTo(Solicitacao::class, 'id_solicitacao');
    }
=======
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
}
