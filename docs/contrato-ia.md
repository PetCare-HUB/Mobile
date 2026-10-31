# Contrato do endpoint da PetCare AI

O app do tutor já chama este endpoint. Falta a implementação no backend.
Quem for construí-la só precisa respeitar o formato abaixo — o lado do app
não muda, e ligar a tela é definir `EXPO_PUBLIC_IA_API_URL` no `.env`.

## O endpoint

```
POST {EXPO_PUBLIC_IA_API_URL}/api/ia/pets/{petId}/perguntas
Authorization: Bearer <JWT>
Content-Type: application/json
```

### Requisição

```json
{ "pergunta": "O Rex está se movimentando menos que o normal?" }
```

O app limita a pergunta a 280 caracteres e envia sem espaços nas pontas.

### Resposta `200`

```json
{
  "resposta": "A atividade do Rex caiu nos últimos 7 dias...",
  "geradoEm": "2026-10-31T14:32:10Z",
  "fontes": [
    { "rotulo": "Score de saúde", "detalhe": "62 hoje, média de 78 nos 30 dias" },
    { "rotulo": "Coleira", "detalhe": "41 leituras sedentárias de 52 no período" }
  ]
}
```

`fontes` pode vir vazio, e o app lida com isso — mas vale preencher. O
enunciado da disciplina proíbe diagnóstico, e mostrar o dado que embasou a
resposta é o que separa orientação de parecer veterinário. Os tipos estão em
[`src/types/ia.ts`](../src/types/ia.ts).

### Erros

O app usa o mesmo tratamento da API Java: procura `mensagem`, `message`,
`erro` ou `error` no corpo e mostra o texto ao usuário.

```json
{ "mensagem": "Não há leituras suficientes para analisar este período." }
```

Um `401` com token presente desloga o app automaticamente, então só devolva
`401` para token inválido ou expirado — para pet de outro tutor, use `403`.

## Autenticação

**Não emita token.** O Java é o único emissor do projeto; valide o token dele.
É o que o .NET já faz (`PetCareHubServiceCollectionExtensions.cs`):

- RS256, chave pública igual à `RSA_PUBLIC_KEY` do Java
- `issuer` = `petcare-hub-api`, audience não validada
- claims disponíveis: `role`, `tutorId`, `clinicaId`

O token que o app manda é de tutor: `role = TUTOR` e `tutorId` preenchido,
**sem `clinicaId`**. Dois cuidados que vêm disso:

- Autorize `TUTOR`. O `ContextoIaController` do .NET hoje exige
  `Roles = "CLINICA"` e lê `clinicaId` — com o token do app ele devolve `403`.
- Use o `tutorId` do token para conferir que o `petId` da rota pertence a esse
  tutor. Não confie no `petId` sozinho.

## Cold start

O app já trata o cold start do plano gratuito do Render: timeout de 60s e uma
repetição automática em `503` ou falha de conexão. A chamada é um `POST`, mas
a repetição é segura desde que responder a uma pergunta não altere estado.
**Se o endpoint gravar algo**, ele precisa ser idempotente ou o histórico pode
ganhar entradas duplicadas.

## Onde isso encosta no app

| Arquivo | Papel |
|---|---|
| `src/types/ia.ts` | os tipos do contrato |
| `src/services/ia/iaService.ts` | a chamada e a leitura da variável de ambiente |
| `src/hooks/mutations/usePerguntarIa.ts` | o hook de mutation |
| `src/screens/IaScreen.tsx` | a tela |
