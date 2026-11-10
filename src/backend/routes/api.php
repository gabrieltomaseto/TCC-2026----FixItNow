<?php

<<<<<<< HEAD
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AvaliacaoController;
use App\Http\Controllers\AutonomoController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\PagamentoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfilePhotoController;
use App\Http\Controllers\ServicoAutonomoController;
=======
use Illuminate\Http\Request;
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
use App\Http\Controllers\ServicoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AutonomoController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\SolicitacaoController;
<<<<<<< HEAD
use App\Http\Controllers\SwipeFuncionarioController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Leituras de catálogo permanecem públicas; mutações exigem conta autenticada.
Route::prefix('servicos')->controller(ServicoController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/{id}', 'show');
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', 'store');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });
});

Route::prefix('autonomos')->controller(AutonomoController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/{id}', 'show');
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', 'store');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });
});

Route::prefix('empresas')->controller(EmpresaController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/{id}', 'show');
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', 'store');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });
});

Route::middleware('auth:sanctum')->prefix('solicitacoes')->controller(SolicitacaoController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});

Route::middleware('auth:sanctum')->prefix('pagamentos')->controller(PagamentoController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});

Route::prefix('servicos-autonomos')->controller(ServicoAutonomoController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/{id_servico}/{id_autonomo}', 'show');
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', 'store');
        Route::put('/{id_servico}/{id_autonomo}', 'update');
        Route::delete('/{id_servico}/{id_autonomo}', 'destroy');
    });
});

Route::middleware('auth:sanctum')->prefix('swipe-funcionarios')->controller(SwipeFuncionarioController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
});
Route::middleware('auth:sanctum')->prefix('avaliacoes')->controller(AvaliacaoController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});

Route::prefix('auth')->controller(AuthController::class)->group(function () {
    Route::post('/empresa/cadastro', 'registerEmpresa');
    Route::post('/autonomo/cadastro', 'registerAutonomo');
    Route::post('/login', 'login');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/perfil', [ProfileController::class, 'show']);
    Route::put('/perfil', [ProfileController::class, 'update']);
    Route::post('/perfil/foto', [ProfilePhotoController::class, 'update']);
    Route::post('/auth/logout', function (Request $request) {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['mensagem' => 'Sessão encerrada com sucesso.']);
    });
});
=======
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
>>>>>>> d63d01b90c99aec16c7eafaaf043bb2ec5654871
