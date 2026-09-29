<?php

use Illuminate\Http\Request;
use App\Http\Controllers\ServicoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AutonomoController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\SolicitacaoController;
use App\Http\Controllers\PagamentoController;
use App\Http\Controllers\ServicoAutonomoController;
use App\Http\Controllers\AvaliacaoController;
use App\Http\Controllers\AuthController;



// Serviço
Route::prefix('servicos')
    ->controller(ServicoController::class)
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

// Autonomo
Route::prefix('autonomos')
    ->controller(AutonomoController::class)
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

// Empresa
Route::prefix('empresas')
    ->controller(EmpresaController::class)
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

// Solicitação - precisa dar post em empresa, servico e autonomo no sql primeiro e usar os id.
Route::prefix('solicitacoes')
    ->controller(SolicitacaoController::class)
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

// Pagamento

Route::prefix('pagamentos')
    ->controller(PagamentoController::class)
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    // Serviço_autonomo - Tabla associativa

    Route::prefix('servicos-autonomos')
    ->controller(ServicoAutonomoController::class)
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');

        Route::get(
            '/{id_servico}/{id_autonomo}',
            'show'
        );

        Route::put(
            '/{id_servico}/{id_autonomo}',
            'update'
        );

        Route::delete(
            '/{id_servico}/{id_autonomo}',
            'destroy'
        );
    });

    // Avaliação - precisa dar post em avalicoes primeiro e usar o id de servico eu acho
    Route::prefix('avaliacoes')
    ->controller(AvaliacaoController::class)
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

// loguin cadastro
Route::prefix('auth')
    ->controller(AuthController::class)
    ->group(function () {
        Route::post('/empresa/cadastro', 'registerEmpresa');
        Route::post('/autonomo/cadastro', 'registerAutonomo');
        Route::post('/login', 'login');
    });