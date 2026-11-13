# 2. Fundamentação teórica e tecnológica

## 2.1 Sistemas de gerenciamento de chamados

Um sistema de chamados registra uma solicitação, associa responsáveis, acompanha mudanças de status e mantém histórico. No contexto do FixItNow, o chamado representa a necessidade de manutenção de uma empresa e pode ser relacionado a um serviço e a um profissional autônomo.

## 2.2 Sistemas web e arquitetura cliente-servidor

A aplicação é dividida entre frontend e backend. O frontend apresenta telas e interações no navegador. O backend concentra regras de negócio, validações, acesso ao banco e exposição da API. Essa separação permite evoluir a interface sem duplicar as regras do servidor.

## 2.3 API REST

A API utiliza recursos identificados por URLs e métodos HTTP: `GET` para consulta, `POST` para criação, `PUT` para alteração e `DELETE` para remoção. As respostas são disponibilizadas em JSON e os códigos HTTP indicam o resultado da operação.

## 2.4 React e componentes

React permite construir a interface a partir de componentes reutilizáveis. No projeto, páginas e componentes são separados, enquanto o React Router organiza a navegação. O contexto de configuração centraliza preferências como idioma, modo de exibição, tamanho de texto e contraste.

## 2.5 Laravel e Eloquent

Laravel fornece roteamento, validação, autenticação, migrações e uma estrutura organizada para a API. O Eloquent representa tabelas por meio de modelos e permite declarar relações entre entidades. As migrações são a fonte de verdade da estrutura do banco.

## 2.6 Banco de dados relacional

O modelo relacional organiza dados em tabelas relacionadas por chaves. Empresas, autônomos e serviços possuem registros próprios; solicitações relacionam empresa, serviço e, opcionalmente, autônomo; avaliações dependem de uma solicitação. A tabela associativa `servicos_autonomo` representa a relação muitos-para-muitos entre serviços e profissionais.

## 2.7 Acessibilidade e usabilidade

A interface inclui preferências de modo claro/escuro, tamanho do texto, alto contraste e idioma. Esses recursos devem ser acompanhados por contraste suficiente, textos alternativos, foco visível, rótulos em formulários, mensagens de erro compreensíveis e navegação por teclado.

## 2.8 Segurança

As credenciais não devem ser armazenadas no código nem no controle de versão. Entradas devem ser validadas no servidor, campos permitidos devem ser selecionados explicitamente e senhas devem ser armazenadas com hash. Em produção, a aplicação deve usar HTTPS, chaves secretas protegidas e políticas de autenticação adequadas.
