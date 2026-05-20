# ADR-002: Provedores OAuth — Google e Apple

**Status:** Aceito  
**Data:** 2026-05-20

---

## Contexto

Usuários devem fazer login com Google ou outros provedores. O app terá presença em **iOS** e **Android**.

## Decisão

MVP com dois provedores:

1. **Google Sign-In** — via `@react-native-google-signin/google-signin` + credencial Firebase.
2. **Sign in with Apple** — via `@invertase/react-native-apple-authentication`.

Ambos integrados ao **Firebase Authentication**.

## Justificativa Apple obrigatória

Se o app oferece login com Google no iOS, a [App Store Review Guideline 4.8](https://developer.apple.com/app-store/review/guidelines/) exige oferecer **Sign in with Apple** como opção equivalente.

## Provedores futuros (não MVP)

| Provedor | Esforço adicional |
|----------|-------------------|
| Facebook | Configurar no Firebase Console + SDK |
| E-mail/senha | UI de cadastro/recuperação |

## Consequências

- Configuração nativa em Android (SHA) e iOS (capabilities, URL schemes).
- Testes em dispositivo real para Apple.
- Perfil do usuário (`displayName`, `photoURL`) pode variar por provedor.

## Referências

- [application.md](../architecture/application.md)
- [firebase-runbook.md](../ops/firebase-runbook.md)
