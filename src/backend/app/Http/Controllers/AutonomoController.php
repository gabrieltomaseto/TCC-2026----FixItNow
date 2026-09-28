<?php

namespace App\Http\Controllers;

use App\Models\Autonomo;
use Illuminate\Http\Request;

class AutonomoController extends Controller
{
    // CREATE 
    public function store(Request $request)
    {
        $autonomo = Autonomo::create($request->all());

        return response()->json($autonomo, 201);
    }

    // READ
    public function index()
    {
        $autonomos = Autonomo::all();

        return response()->json($autonomos, 200);
    }

    // READ 
    public function show($id)
    {
        $autonomo = Autonomo::findOrFail($id);

        return response()->json($autonomo, 200);
    }

    // UPDATE 
    public function update(Request $request, $id)
    {
        $autonomo = Autonomo::findOrFail($id);

        $autonomo->update($request->all());

        return response()->json($autonomo, 200);
    }

    // DELETE
    public function destroy($id)
    {
        $autonomo = Autonomo::findOrFail($id);

        $autonomo->delete();

        return response()->json([
            'mensagem' => 'Autônomo apagado com sucesso.'
        ], 200);
    }
}
