# C4 — Nível 3: Diagrama de componentes (Mobile App)

Detalhamento interno do container **Mobile App**.

---

## Diagrama

```mermaid
flowchart TB
  subgraph screens [Screens]
    Login[LoginScreen]
    Home[HomeScreen]
    Board[LeaderboardScreen]
  end

  subgraph components [Components]
    MainBtn[MainButton]
    Timer[TimerDisplay]
    Stats[StatsRow]
    History[SessionHistory]
    Modal[AirplaneModeModal]
  end

  subgraph app_core [Core]
    Nav[RootNavigator]
    AuthCtx[AuthContext]
    TimerHook[useOfflineTimer]
  end

  subgraph services [Services]
    AuthSvc[auth.ts]
    SyncSvc[syncOfflineSession.ts]
    LbSvc[leaderboard.ts]
  end

  AppEntry[App.tsx] --> Nav
  AppEntry --> AuthCtx
  Nav --> Login
  Nav --> Home
  Nav --> Board

  Home --> MainBtn
  Home --> Timer
  Home --> Stats
  Home --> History
  Home --> Modal
  Home --> TimerHook
  Home --> SyncSvc

  Login --> AuthCtx
  AuthCtx --> AuthSvc
  Board --> LbSvc
  TimerHook --> SyncSvc
```

## Componentes existentes (AS-IS)

| Arquivo | Função |
|---------|--------|
| `App.tsx` | Entry point |
| `HomeScreen.tsx` | Orquestra UI do timer |
| `useOfflineTimer.ts` | Estado e lógica de sessão |
| `MainButton.tsx` | Toggle start/stop |
| `TimerDisplay.tsx` | Exibição hh:mm:ss |
| `StatsRow.tsx` | Cards estatísticos |
| `SessionHistory.tsx` | Últimas sessões |
| `AirplaneModeModal.tsx` | Atalho configurações |
| `theme.ts` | Design tokens |

## Componentes planejados (TO-BE)

| Arquivo | Função |
|---------|--------|
| `RootNavigator.tsx` | Auth vs Main stacks |
| `AuthContext.tsx` | Sessão global do usuário |
| `LoginScreen.tsx` | Botões OAuth |
| `LeaderboardScreen.tsx` | Abas diário/geral |
| `auth.ts` | Google/Apple sign-in |
| `syncOfflineSession.ts` | Batch Firestore |
| `leaderboard.ts` | Queries ranqueadas |
| `config/firebase.ts` | Inicialização SDK |

## Dependências entre componentes

```mermaid
flowchart LR
  AuthCtx --> AuthSvc
  TimerHook -->|onSessionComplete| SyncSvc
  SyncSvc --> Firestore[(Firestore)]
  LbSvc --> Firestore
  AuthSvc --> FirebaseAuth[Firebase Auth]
```

## Links

- [Aplicação](../application.md)
- [Dados](../data-model.md)
