# Runbook — Firebase (Minuto Offline)

Operações para configurar, implantar regras e diagnosticar o backend Firebase.

---

## 1. Pré-requisitos

- Conta Google Cloud / Firebase
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`
- Login: `firebase login`
- Node.js >= 18

## 2. Criar projeto

1. [Console Firebase](https://console.firebase.google.com/) → **Add project**.
2. Repetir para `dev`, `staging`, `prod` (recomendado).
3. Ativar **Authentication** → Sign-in method → **Google**, **Apple**.
4. Ativar **Firestore** → modo produção.

## 3. Registrar apps mobile

### Android

1. Add app → Android → package `com.minutoofflinetemp` (verificar em `AndroidManifest`).
2. Baixar `google-services.json` → `android/app/`.
3. Adicionar SHA-1 e SHA-256 (debug e release):

```bash
cd android && ./gradlew signingReport
```

4. Configurar Web Client ID para Google Sign-In no console.

### iOS

1. Add app → iOS → bundle ID do Xcode.
2. Baixar `GoogleService-Info.plist` → `ios/MinutoOffline/`.
3. Xcode → Signing & Capabilities → **Sign in with Apple**.
4. URL Types → reversed client ID do plist.

## 4. Estrutura local do repositório

```
firebase.json          # Config CLI
firestore.rules        # Regras de segurança
.firebaserc            # Alias de projetos (criar localmente)
```

### `.firebaserc` (exemplo — não commitar IDs reais se sensível)

```json
{
  "projects": {
    "default": "minuto-offline-dev",
    "staging": "minuto-offline-stg",
    "prod": "minuto-offline-prod"
  }
}
```

## 5. Deploy de regras Firestore

Na raiz do repositório:

```bash
firebase use dev
firebase deploy --only firestore:rules
```

Validar no Console → Firestore → Rules → simulador de regras.

## 6. Índices compostos

Ao executar queries de leaderboard, o Firestore pode retornar link para criar índice. Clicar no link ou adicionar em `firestore.indexes.json` (opcional):

```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "totalMs", "order": "DESCENDING" }
      ]
    }
  ]
}
```

> Ajustar `collectionGroup` conforme estrutura real após primeiro deploy.

## 7. Checklist pós-setup

- [ ] Google Sign-In funciona no Android (device/emulador com Play Services)
- [ ] Apple Sign-In funciona no iOS (device real)
- [ ] Rules bloqueiam escrita anônima
- [ ] Rules bloqueiam escrita em `uid` alheio
- [ ] Sessão de teste aparece em `users/{uid}/sessions`
- [ ] Leaderboard incrementa `totalMs`

## 8. Troubleshooting

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| `PERMISSION_DENIED` | Rules ou uid | Verificar auth e path |
| Google Sign-In falha Android | SHA incorreto | Atualizar SHA no console |
| Apple Sign-In falha | Capability ausente | Habilitar no Xcode |
| Query sem índice | Índice ausente | Criar via link do erro |
| Sync não aparece | Offline / fila | Ver AsyncStorage pending |
| `DEVELOPER_ERROR` Google | `google-services.json` | Rebaixar do console correto |

## 9. Monitoramento

- Console → **Usage** (reads/writes/storage)
- Console → **Authentication** → usuários ativos
- Habilitar **Crashlytics** no app (futuro)

## 10. Backup e disaster recovery

- Firestore: export agendado para GCS (Console → Import/Export).
- Documentar RPO/RTO com stakeholders.

## 11. Exclusão de usuário (LGPD)

Procedimento manual MVP:

1. Authentication → deletar usuário.
2. Firestore → deletar `users/{uid}` e subcoleções.
3. Deletar `leaderboards/allTime/users/{uid}`.
4. Deletar entradas em `leaderboards/daily/*/users/{uid}` (script admin).

Automatizar com Cloud Function `onUserDeleted` na fase 2.

## 12. Referências

- [firestore.rules](../../firestore.rules)
- [data-model.md](../architecture/data-model.md)
- [threat-model.md](../security/threat-model.md)
