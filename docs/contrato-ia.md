# Integração com a PetCare AI

A IA roda dentro da própria API Java (Spring AI + Google Gemini, com RAG sobre
uma base veterinária em markdown). Não é um serviço separado: usa a mesma
`EXPO_PUBLIC_API_URL` do resto do app.

## O endpoint que o app consome

```
POST {EXPO_PUBLIC_API_URL}/pets/{petId}/ia/perguntar
Authorization: Bearer <JWT>
Content-Type: application/json
```

### Requisição

```json
{ "pergunta": "O Rex está se movimentando menos que o normal?" }
```

O backend valida `@NotBlank @Size(max = 500)`. A tela usa o mesmo limite de 500
(`LIMITE_PERGUNTA` em [`src/services/ia/iaService.ts`](../src/services/ia/iaService.ts))
e corta os espaços das pontas antes de enviar.

### Resposta `200`

```json
{
  "id": 12,
  "petId": 3,
  "petNome": "Rex",
  "tipo": "PERGUNTA",
  "pergunta": "O Rex está se movimentando menos que o normal?",
  "resposta": "A atividade do Rex caiu nos últimos 7 dias...",
  "scoreId": 48,
  "alertaId": null,
  "modelo": "gemini-2.5-flash",
  "fontes": ["03-atividade-e-sedentarismo.md — Sedentarismo"],
  "dataAnalise": "2026-10-31T16:14:55"
}
```

O app mostra `resposta` e `fontes`. Os outros campos estão tipados em
[`src/types/ia.ts`](../src/types/ia.ts) para que a resposta não precise ser
remapeada quando outra tela passar a usá-los.

`fontes` é uma lista de strings (o backend concatena e corta em 1000
caracteres), não um par rótulo/detalhe. Pode vir vazia, e o app lida com isso.

## Por que esta chamada não tem retry automático

O resto do app usa `requestWithColdStartRetry`, que repete uma vez em `503` ou
falha de conexão por causa do cold start do Render. Aqui não: responder uma
pergunta **grava uma linha em `ANALISE_IA`**, então repetir sozinho depois de um
timeout geraria uma segunda análise e cobraria duas vezes do Gemini.

No lugar disso, o timeout é de 120s — o suficiente para somar o cold start do
Render com o tempo do backend, que tenta o Gemini duas vezes com 60s cada
(`app.ia.timeout-ms` x `app.ia.tentativas`). Se falhar, quem decide tentar de
novo é o tutor.

## Endpoints disponíveis que o app ainda não usa

| Endpoint | O que faz |
|---|---|
| `POST /pets/{petId}/ia/analise` | análise de saúde sem pergunta, gravada no histórico |
| `GET /pets/{petId}/ia/analises` | últimas 20 análises do pet |
| `POST /pets/{petId}/ia/alertas/{alertaId}/explicar` | explica um alerta e a regra que o gerou |

O de explicar alerta encaixaria direto na tela de alertas.

## Autenticação

O Java é o único emissor de token do projeto. O que o app manda é de tutor:
`role = TUTOR` e `tutorId` preenchido, sem `clinicaId`. O `SecurityConfig`
cobre a rota pelo matcher genérico `/pets/*/**`, que exige `TUTOR` ou `CLINICA`.

Um `401` com token presente desloga o app automaticamente
([`client.ts`](../src/services/api/client.ts)), então o backend só deve
devolver `401` para token inválido ou expirado.

### Escopo por tutor

Os quatro métodos do `AnaliseSaudeService` começam por
`petService.findEntityByIdAutorizado(petId)`, que compara o dono do pet com o
`tutorId` do token e devolve `403` quando não bate. Então perguntar sobre o pet
de outro tutor não passa do primeiro comando, antes de montar contexto ou
chamar o Gemini.

O `tutorId` entra também no `conversationId`, de modo que a memória curta da
conversa não vaza entre tutores nem entre pets do mesmo tutor.

## Onde isso encosta no app

| Arquivo | Papel |
|---|---|
| `src/types/ia.ts` | os tipos do contrato |
| `src/services/ia/iaService.ts` | a chamada, o limite e o timeout |
| `src/hooks/mutations/usePerguntarIa.ts` | o hook de mutation |
| `src/screens/IaScreen.tsx` | a tela |
