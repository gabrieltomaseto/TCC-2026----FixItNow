<?php
session_start();

$host = "localhost";
$banco = "";
$usuario = "root";
$senha = "";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

if (isset($_GET['email']) && isset($_GET['senha'])) {

    $email = $_GET['email'];
    $senha = $_GET['senha'];

    $sql = "SELECT id, nome, tipo
            FROM usuarios
            WHERE email = ?
            AND senha = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $email, $senha);
    $stmt->execute();

    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {

        $dados = $resultado->fetch_assoc();

        echo "<h2>Login realizado com sucesso!</h2>";
        echo "Nome: " . $dados['nome'] . "<br>";
        echo "Tipo: " . $dados['tipo'] . "<br>";

    } else {
        echo "Usuário ou senha inválidos.";
    }
}


/*
 - Empresa
 - Autônomo
 - Cliente
*/

// Usuários simulados
$usuarios = [
    [
        "email" => "empresa@teste.com",
        "senha" => "123456",
        "tipo" => "Empresa"
    ],
    [
        "email" => "autonomo@teste.com",
        "senha" => "123456",
        "tipo" => "Autônomo"
    ],
    [
        "email" => "cliente@teste.com",
        "senha" => "123456",
        "tipo" => "Cliente"
    ]
];

// Login
if (isset($_POST['login'])) {

    $email = $_POST['email'];
    $senha = $_POST['senha'];

    foreach ($usuarios as $usuario) {
        if ($usuario['email'] == $email && $usuario['senha'] == $senha) {
            $_SESSION['usuario'] = $usuario;
            break;
        }
    }

    if (!isset($_SESSION['usuario'])) {
        $erro = "E-mail ou senha inválidos!";
    }
}
?>


<?php if(!isset($_SESSION['usuario'])): ?>

    <?php if(isset($erro)): ?>
        <p class="erro"><?php echo $erro; ?></p>
    <?php endif; ?>

    <?php
    if(isset($_GET['busca']) && !empty($_GET['busca'])){
        $busca = $_GET['busca'];

        if($_SESSION['usuario']['tipo'] == "Empresa"){
           ;
        }

        if($_SESSION['usuario']['tipo'] == "Autônomo"){
           ;
        }

        if($_SESSION['usuario']['tipo'] == "Cliente"){
           ;
        }

        echo "</div>";
    };
?>