<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;

class EmpresaController extends Controller
{
    // CREATE
    public function store(Request $request)
    {
        $empresa = Empresa::create($request->all());

        return response()->json($empresa, 201);
    }

    // READ
    public function index()
    {
        $empresas = Empresa::all();

        return response()->json($empresas, 200);
    }

    // READ ONE
    public function show($id)
    {
        $empresa = Empresa::findOrFail($id);

        return response()->json($empresa, 200);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $empresa = Empresa::findOrFail($id);

        $empresa->update($request->all());

        return response()->json($empresa, 200);
    }

    // DELETE
    public function destroy($id)
    {
        $empresa = Empresa::findOrFail($id);

        $empresa->delete();

        return response()->json([
            'mensagem' => 'Empresa apagada com sucesso.'
        ], 200);
    }
}
