# 3. Metodologia

## 3.1 Abordagem

O projeto utiliza uma abordagem incremental: levantamento do problema, definição do escopo, modelagem das entidades, implementação da API, desenvolvimento das telas, integração e validação. As funcionalidades são organizadas por fluxos de usuário, priorizando o cadastro, a solicitação e o acompanhamento do serviço.

## 3.2 Etapas

1. analisar o problema e os perfis envolvidos;
2. definir requisitos funcionais e não funcionais;
3. modelar entidades, relacionamentos e estados da solicitação;
4. criar migrações e modelos no backend;
5. implementar endpoints e validações da API;
6. organizar componentes, páginas e rotas do frontend;
7. conectar a interface à API;
8. executar lint, build, testes automatizados e testes manuais;
9. registrar limitações e possibilidades de evolução.

## 3.3 Tecnologias

- **Frontend:** React, Vite, React Router, Tailwind CSS e Axios;
- **Backend:** PHP, Laravel 12, Eloquent e Laravel Sanctum;
- **Banco:** SQLite para desenvolvimento local, com possibilidade de MySQL;
- **Validação:** ESLint, build do Vite, PHPUnit e cenários manuais;
- **Versionamento:** Git, sem inclusão de dependências, credenciais ou artefatos gerados.

## 3.4 Estratégia de validação

A validação deve combinar testes de unidade, testes de integração dos endpoints e testes manuais dos fluxos principais. Os cenários mínimos são: cadastro válido e inválido, login, criação de serviço, abertura de solicitação, atualização de status, registro de pagamento e criação de avaliação.

Também devem ser verificados casos de erro, como e-mail duplicado, campos obrigatórios ausentes, identificadores inexistentes, valores negativos, acesso sem autenticação e tentativa de envio de campos não permitidos.

## 3.5 Critérios de aceite

Uma funcionalidade é considerada pronta quando possui fluxo demonstrável, validação de dados, resposta de erro compreensível, persistência correta, documentação mínima e não introduz falhas no lint, no build ou nos testes existentes.

## 3.6 Limitações

A versão atual ainda requer evolução para autenticação completa com tokens, autorização por perfil em todos os endpoints, integração efetiva entre frontend e API, pagamentos reais, notificações e cobertura ampla de testes. Essas limitações devem ser apresentadas no TCC como delimitação da versão entregue, e não como funcionalidades já concluídas.
