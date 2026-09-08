<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\AutonomoController;
use App\Http\Controllers\ServicoController;
use App\Http\Controllers\SolicitacaoController;
use App\Http\Controllers\PagamentoController;
use App\Http\Controllers\AvaliacaoController;

// Rotas de Empresa
Route::prefix('empresas')->group(function () {
    Route::get('/', [EmpresaController::class, 'index']);
    Route::post('/', [EmpresaController::class, 'store']);
    Route::get('/{id}', [EmpresaController::class, 'show']);
    Route::delete('/{id}', [EmpresaController::class, 'destroy']);
});

// Rotas de Autônomo
Route::prefix('autonomos')->group(function () {
    Route::get('/', [AutonomoController::class, 'index']);
    Route::post('/', [AutonomoController::class, 'store']);
    Route::get('/{id}', [AutonomoController::class, 'show']);
});

// Rotas de Serviço
Route::prefix('servicos')->group(function () {
    Route::get('/', [ServicoController::class, 'index']);
    Route::post('/', [ServicoController::class, 'store']);
});

// Rotas de Solicitação
Route::prefix('solicitacoes')->group(function () {
    Route::get('/', [SolicitacaoController::class, 'index']);
    Route::post('/', [SolicitacaoController::class, 'store']);
});

// Rotas de Pagamento
Route::prefix('pagamentos')->group(function () {
    Route::get('/', [PagamentoController::class, 'index']);
    Route::post('/', [PagamentoController::class, 'store']);
});

// Rotas de Avaliação
Route::prefix('avaliacoes')->group(function () {
    Route::get('/', [AvaliacaoController::class, 'index']);
    Route::post('/', [AvaliacaoController::class, 'store']);
});