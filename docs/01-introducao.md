# 1. Introdução

## 1.1 Contextualização

A contratação de serviços de manutenção costuma envolver comunicação dispersa, dificuldade para comparar profissionais, pouca visibilidade do andamento do atendimento e ausência de um histórico centralizado. Empresas que dependem de manutenção predial, elétrica, hidráulica ou de equipamentos precisam registrar solicitações e acompanhar prazos, responsáveis, valores e avaliações.

O FixItNow é uma proposta de sistema web para organizar esse fluxo. A solução aproxima empresas e profissionais autônomos, permitindo que os dados do serviço sejam registrados em uma plataforma única.

## 1.2 Problema de pesquisa

Como um sistema web pode organizar a solicitação, o acompanhamento e a avaliação de serviços de manutenção, reduzindo a perda de informações e melhorando a comunicação entre empresas e profissionais autônomos?

## 1.3 Justificativa

A centralização das informações pode reduzir retrabalho, facilitar o acompanhamento das solicitações e criar um histórico útil para decisões futuras. Para o profissional autônomo, a plataforma pode melhorar a visibilidade dos serviços disponíveis e organizar seus atendimentos. Para a empresa, pode facilitar a abertura de chamados, o acompanhamento do status e a avaliação do serviço recebido.

O desenvolvimento também é relevante academicamente por integrar análise de requisitos, modelagem de dados, desenvolvimento de uma API, construção de uma interface responsiva e testes de um sistema com usuários e perfis distintos.

## 1.4 Objetivo geral

Desenvolver e organizar um sistema web para gerenciamento de serviços de manutenção, conectando empresas e profissionais autônomos em um fluxo de cadastro, solicitação, acompanhamento, pagamento e avaliação.

## 1.5 Objetivos específicos

- levantar os principais dados envolvidos na contratação e no acompanhamento de serviços;
- modelar as entidades de usuários, empresas, autônomos, serviços, solicitações, pagamentos e avaliações;
- implementar uma API REST para as operações do sistema;
- desenvolver uma interface web com navegação por páginas e componentes reutilizáveis;
- oferecer recursos básicos de acessibilidade e personalização da interface;
- permitir o registro do ciclo de uma solicitação, desde a abertura até a avaliação;
- validar a aplicação por meio de lint, build, testes automatizados e cenários manuais;
- documentar a instalação, a arquitetura e os limites da solução.

## 1.6 Escopo

O escopo atual contempla o cadastro de empresas e autônomos, autenticação inicial, cadastro e consulta de serviços, associação entre profissionais e serviços, solicitações de manutenção, pagamentos e avaliações. A interface inclui painel, novo chamado, histórico, perfil, configurações e telas de cadastro.

Integrações financeiras reais, envio de e-mails, notificações em tempo real, geolocalização, assinatura digital e publicação em ambiente de produção não fazem parte da primeira versão e devem ser tratados como evolução futura.

## 1.7 Organização do documento

A fundamentação apresenta os conceitos e as tecnologias que sustentam a solução. A metodologia descreve o processo de desenvolvimento e validação. O documento de requisitos detalha os comportamentos esperados e o guia de entrega reúne os procedimentos para execução e apresentação.
