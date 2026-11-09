<?php

namespace App\Http\Controllers;

use App\Models\Pagamento;
use Illuminate\Http\Request;

class PagamentoController extends Controller
{
    // CREATE
    public function store(Request $request)
    {
        $pagamento = Pagamento::create($request->all());

        return response()->json($pagamento, 201);
    }

    // READ ALL
    public function index()
    {
        $pagamentos = Pagamento::all();

        return response()->json($pagamentos, 200);
    }

    // READ ONE
    public function show($id)
    {
        $pagamento = Pagamento::findOrFail($id);

        return response()->json($pagamento, 200);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $pagamento = Pagamento::findOrFail($id);

        $pagamento->update($request->all());

        return response()->json($pagamento, 200);
    }

    // DELETE
    public function destroy($id)
    {
        $pagamento = Pagamento::findOrFail($id);

        $pagamento->delete();

        return response()->json([
            'mensagem' => 'Pagamento apagado com sucesso.'
        ], 200);
    }
}
