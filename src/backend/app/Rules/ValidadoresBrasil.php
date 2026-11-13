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
        return strlen($cpf) === 11;
    }

    public static function cnpj(string $valor): bool
    {
        $cnpj = preg_replace('/\D/', '', $valor);
        return strlen($cnpj) === 14;
    }
}
