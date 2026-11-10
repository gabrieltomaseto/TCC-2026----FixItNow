<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class SwipeFuncionario extends Model
{
    protected $table = 'swipes_funcionarios';
    protected $fillable = ['empresa_id', 'autonomo_id', 'acao'];
    public function empresa() { return $this->belongsTo(Empresa::class); }
    public function autonomo() { return $this->belongsTo(Autonomo::class); }
}
