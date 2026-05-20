# ADR-001: Firebase como Backend-as-a-Service

**Status:** Aceito  
**Data:** 2026-05-20  
**Decisores:** Arquitetura / Product

---

## Contexto

O Minuto Offline precisa de autenticação social, persistência de sessões e leaderboards comparativos. O código atual é um protótipo React Native sem backend.

## Decisão

Adotar **Google Firebase** com:

- **Firebase Authentication** — identidade OAuth.
- **Cloud Firestore** — dados de usuário, sessões e rankings.
- **Cloud Functions** (fase 2) — agregação server-side anti-fraude.

## Alternativas consideradas

| Opção | Prós | Contras |
|-------|------|---------|
| **Firebase** | SDK maduro RN, Auth integrado, escala automática | Vendor lock-in Google |
| **Supabase** | SQL, open source | Mais setup RN para OAuth nativo |
| **API custom (Node)** | Controle total | Maior custo de desenvolvimento e ops |

## Consequências

### Positivas

- Time-to-market menor para MVP.
- Regras de segurança declarativas (`firestore.rules`).
- Escalabilidade gerenciada.

### Negativas

- Modelo de custo por leitura/escrita.
- Lógica complexa pode exigir Functions.
- Dependência do ecossistema Google.

## Conformidade

- Configurar projetos separados dev/staging/prod.
- Não commitar chaves sensíveis de produção em repositório público.

## Referências

- [data-model.md](../architecture/data-model.md)
- [firebase-runbook.md](../ops/firebase-runbook.md)
