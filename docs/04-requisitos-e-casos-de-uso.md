# 4. Requisitos e casos de uso

## 4.1 Atores

- **Empresa:** cadastra-se, consulta serviços, abre solicitações, acompanha atendimentos, registra pagamentos e avalia o serviço.
- **Autônomo:** cadastra-se, informa especialidades, consulta serviços associados e acompanha solicitações atribuídas.
- **Sistema:** valida dados, persiste informações, controla estados e retorna mensagens de sucesso ou erro.

## 4.2 Requisitos funcionais

| Código | Requisito |
|---|---|
| RF01 | Permitir cadastro de empresa com dados obrigatórios e e-mail único. |
| RF02 | Permitir cadastro de autônomo com CPF, contato, especialidade e e-mail único. |
| RF03 | Permitir login com e-mail e senha. |
| RF04 | Permitir cadastrar, listar, consultar, atualizar e remover serviços. |
| RF05 | Permitir associar serviços a autônomos com status e nível de experiência. |
| RF06 | Permitir criar e consultar solicitações de manutenção. |
| RF07 | Permitir acompanhar e atualizar o status de uma solicitação. |
| RF08 | Permitir registrar pagamentos relacionados ao atendimento. |
| RF09 | Permitir registrar avaliação de uma solicitação concluída. |
| RF10 | Permitir configurar idioma, modo de exibição, tamanho de texto, contraste e notificações. |

## 4.3 Requisitos não funcionais

- RNF01: a API deve retornar JSON e códigos HTTP coerentes;
- RNF02: dados obrigatórios devem ser validados no servidor;
- RNF03: senhas devem ser armazenadas com hash;
- RNF04: credenciais e chaves não devem ser versionadas;
- RNF05: a interface deve permitir navegação por teclado e leitura visual clara;
- RNF06: o projeto deve ser executável conforme o README;
- RNF07: build e lint devem ser executados antes da entrega;
- RNF08: a aplicação deve manter separação entre frontend, backend e documentação.

## 4.4 Fluxo principal de solicitação

1. A empresa autentica-se.
2. A empresa consulta os serviços disponíveis.
3. A empresa cria uma solicitação com descrição, serviço e data.
4. O sistema valida e grava a solicitação como `pendente`.
5. Um autônomo é associado ao atendimento.
6. O status é atualizado durante o serviço.
7. O pagamento é registrado.
8. Após a conclusão, a empresa registra a avaliação.

## 4.5 Regras de negócio iniciais

- e-mails de usuário, CPF e CNPJ devem ser únicos quando aplicável;
- uma solicitação deve referenciar empresa e serviço existentes;
- o autônomo da solicitação pode ser nulo antes da atribuição;
- avaliação deve referenciar uma solicitação existente;
- valores monetários não podem ser negativos;
- campos não previstos no endpoint não devem ser persistidos.
