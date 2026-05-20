# ADR-003: Timezone para ranking diário

**Status:** Aceito  
**Data:** 2026-05-20

---

## Contexto

O ranking **diário** precisa de uma chave de data (`YYYY-MM-DD`) para particionar documentos em `leaderboards/daily/{dateKey}/users/{uid}`.

Usuários podem estar em fusos diferentes. Sem regra fixa, o mesmo instante UTC cai em dias diferentes e gera disputas no leaderboard.

## Decisão

Usar timezone fixa **`America/Sao_Paulo`** para calcular `dateKey` em:

- Escrita de scores (`syncOfflineSession`).
- Leitura do leaderboard diário (`LeaderboardScreen`).
- Reset local de `totalTodayMs` no cliente.

## Implementação sugerida

```typescript
// src/utils/dateKey.ts
const TZ = 'America/Sao_Paulo';

export function getDateKey(date: Date = new Date()): string {
  return date.toLocaleDateString('en-CA', { timeZone: TZ }); // YYYY-MM-DD
}
```

## Alternativas rejeitadas

| Opção | Motivo da rejeição |
|-------|-------------------|
| UTC global | “Dia” não alinha com expectativa do usuário BR |
| Timezone do device | Rankings inconsistentes entre usuários |
| Dia rolante 24h | Complexo de explicar na UI |

## Consequências

- Documentar na UI: “Ranking de hoje (horário de Brasília)”.
- Usuários fora do Brasil podem ver o “dia” deslocado — aceitável no MVP.
- Fase futura: leaderboard por região ou UTC com label clara.

## Referências

- [data-model.md](../architecture/data-model.md)
