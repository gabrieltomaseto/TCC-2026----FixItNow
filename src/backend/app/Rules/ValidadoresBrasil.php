<?php

namespace App\Rules;

class ValidadoresBrasil
{
    public static function celular(string $valor): bool
    {
        $digitos = preg_replace('/\D/', '', $valor);
        return in_array(strlen($digitos), [10, 11], true);
    }

    public static function cpf(string $valor): bool
    {
        $cpf = preg_replace('/\D/', '', $valor);
        if (strlen($cpf) !== 11 || preg_match('/^(\d)\1{10}$/', $cpf)) return false;
        for ($tamanho = 9; $tamanho <= 10; $tamanho++) {
            $soma = 0;
            for ($i = 0; $i < $tamanho; $i++) $soma += (int) $cpf[$i] * (($tamanho + 1) - $i);
            $digito = ($soma * 10) % 11;
            if ($digito === 10) $digito = 0;
            if ((int) $cpf[$tamanho] !== $digito) return false;
        }
        return true;
    }

    public static function cnpj(string $valor): bool
    {
        $cnpj = preg_replace('/\D/', '', $valor);
        if (strlen($cnpj) !== 14 || preg_match('/^(\d)\1{13}$/', $cnpj)) return false;
        foreach ([12, 13] as $tamanho) {
            $pesos = $tamanho === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
            $soma = 0;
            for ($i = 0; $i < $tamanho; $i++) $soma += (int) $cnpj[$i] * $pesos[$i];
            $resto = $soma % 11;
            $digito = $resto < 2 ? 0 : 11 - $resto;
            if ((int) $cnpj[$tamanho] !== $digito) return false;
        }
        return true;
    }
}
