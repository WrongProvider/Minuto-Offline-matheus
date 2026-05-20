# Documentação — Minuto Offline

Índice da documentação arquitetural e operacional do projeto.

## Arquitetura (TOGAF)

| Documento | Descrição |
|-----------|-----------|
| [Visão arquitetural](architecture/vision.md) | Propósito, princípios, AS-IS vs TO-BE, roadmap ADM |
| [Arquitetura de negócio](architecture/business.md) | Capacidades, processos, stakeholders |
| [Arquitetura de dados](architecture/data-model.md) | Modelo conceitual, Firestore, sync, governança |
| [Arquitetura de aplicação](architecture/application.md) | Camadas, componentes, fluxos, pacotes |
| [Arquitetura de tecnologia](architecture/technology.md) | Stack, deployment, NFRs |
| [C4 — Contexto](architecture/c4/context.md) | Diagrama de contexto do sistema |
| [C4 — Containers](architecture/c4/containers.md) | Cliente, Firebase, integrações |
| [C4 — Componentes](architecture/c4/components.md) | Módulos internos do app mobile |

## Decisões (ADR)

| ADR | Tópico |
|-----|--------|
| [ADR-001](adr/001-firebase-baas.md) | Firebase como BaaS |
| [ADR-002](adr/002-oauth-providers.md) | Provedores OAuth (Google, Apple) |
| [ADR-003](adr/003-ranking-timezone.md) | Timezone e chave do ranking diário |

## Segurança e operações

| Documento | Descrição |
|-----------|-----------|
| [Threat model](security/threat-model.md) | Ameaças, controles, evolução |
| [Runbook Firebase](ops/firebase-runbook.md) | Setup, deploy de rules, troubleshooting |

## Infraestrutura como código

| Artefato | Descrição |
|----------|-----------|
| [`firestore.rules`](../firestore.rules) | Regras de segurança Firestore |
| [`firebase.json`](../firebase.json) | Configuração CLI Firebase |
