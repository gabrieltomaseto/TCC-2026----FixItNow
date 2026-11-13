# 5. Guia de entrega e checklist

## Preparação

- [ ] confirmar que o arquivo `.env` não será enviado ao avaliador;
- [ ] instalar dependências do backend e frontend;
- [ ] configurar banco local;
- [ ] executar migrações;
- [ ] revisar dados de demonstração;
- [ ] conferir se não existem logs, caches ou `node_modules` no pacote final.

## Validação técnica

- [ ] `npm run lint` sem erros;
- [ ] `npm run build` concluído;
- [ ] `php artisan test` executado;
- [ ] `php artisan route:list` conferido;
- [ ] cadastro de empresa validado;
- [ ] cadastro de autônomo validado;
- [ ] login validado;
- [ ] serviço criado e consultado;
- [ ] solicitação criada e atualizada;
- [ ] pagamento e avaliação testados;
- [ ] modo escuro, tamanho de texto e contraste conferidos.

## Apresentação do TCC

Demonstrar o problema, os objetivos, a arquitetura, o modelo de dados, o fluxo principal e os resultados dos testes. Explicar claramente o que está implementado, o que está parcialmente implementado e o que pertence ao escopo futuro. Não apresentar telas estáticas como se fossem integrações concluídas.

## Limitações a declarar

A integração completa do frontend com todos os endpoints, autorização por perfil em todos os recursos, pagamentos reais, notificações e cobertura completa de testes são evoluções futuras caso ainda não estejam implementadas na versão entregue.
