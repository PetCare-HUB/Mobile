# 🐾 PetCare Hub Mobile

Aplicativo mobile desenvolvido em **React Native com Expo** para o Challenge FIAP 2026 — CLYVO VET.

Interface do tutor dentro da plataforma **PetCare Hub**: acompanha a saúde do pet de forma contínua e preventiva, com login real, dados vindos da API Java (sem mock) e sessão persistida no dispositivo.

---

## 📲 Instalar o app (APK)

A versão avaliada está publicada como APK, gerada pelo EAS Build:

**[Baixar o APK — PetCare Hub 1.0.0](https://expo.dev/artifacts/eas/gKI9AyQ3e8JUVP2m8vkC4D5aKM2gAzTVTdosBslZwxo.apk)**

| | |
|---|---|
| Versão | 1.0.0 |
| Pacote | `br.com.petcarehub.mobile` |
| Gerado do commit | [`147c79d`](https://github.com/PetCare-HUB/Mobile/commit/147c79d) · tag [`v1.0.0`](https://github.com/PetCare-HUB/Mobile/tree/v1.0.0) |
| Android mínimo | 7.0 (API 24) |

**Como instalar:** abra o link no celular Android, baixe o arquivo e toque nele. O Android pede
para permitir a instalação de apps dessa origem — autorize e confirme. Para entrar, use a conta
em [Conta para testar](#5-conta-para-testar).

**Como conferir que é este código:** a tela **Perfil → Sobre o app** mostra o commit que gerou o
build, `147c79d`. A tag `v1.0.0` aponta para esse commit, e os commits posteriores alteram só a
documentação — dá para conferir em
[`v1.0.0...main`](https://github.com/PetCare-HUB/Mobile/compare/v1.0.0...main).

O APK sai do perfil `preview` do `eas.json`: `npx eas-cli build -p android --profile preview`.

---

## 📌 Contexto do projeto

A proposta do Challenge CLYVO VET é transformar a jornada de saúde animal de um modelo episódico e reativo para uma experiência contínua, preventiva e integrada — conectando tutor, clínica veterinária, dispositivos IoT e inteligência artificial.

O app é fechado: o tutor não se cadastra livremente. A clínica pré-cadastra o tutor (nome, CPF, e-mail e telefone) e o pet; o tutor só ativa o próprio acesso confirmando nome, CPF e e-mail batendo com esse pré-cadastro e definindo sua senha.

---

## 🎯 Objetivo do app

O **PetCare Hub Mobile** permite que o responsável pelo pet:

- ative a própria conta a partir de um pré-cadastro feito pela clínica e faça login com sessão JWT persistida;
- acompanhe o **Score de Saúde** do animal (calculado pelo backend);
- visualize alertas de saúde ativos, com detalhe individual;
- acompanhe dados reais da **coleira smart**, **comedouro inteligente** e **sensor de ambiente**;
- gerencie um **calendário preventivo** (vacinas, check-ups, vermífugo, medicamentos), com streak de adesão calculado a partir de eventos reais;
- tenha múltiplos pets vinculados à conta e alterne entre eles;
- cadastre, edite e exclua os próprios pets, e edite os próprios dados de contato;
- receba notificação no aparelho quando o backend abrir um alerta grave para algum dos seus pets;
- pergunte à **PetCare AI** sobre os dados do pet;
- use o app no **modo claro ou escuro**;
- confira em **Sobre o app** qual commit gerou a versão instalada.

---

## 📱 Telas implementadas

### Autenticação
- **Login** — e-mail e senha, sessão JWT persistida com `expo-secure-store`.
- **Primeiro acesso** — validação de nome, CPF e e-mail contra o pré-cadastro feito pela clínica (3 passos: dados → confirmação → criar senha).
- **Criar senha** — conclui a ativação da conta.

### Início (Home)
- Score de Saúde do pet selecionado, com indicador visual por categoria (verde/amarelo/vermelho, vindo do backend).
- Resumo de Atividade, Alimentação, Ambiente e Alertas ativos.
- Próximas ações do calendário preventivo.
- Troca entre múltiplos pets vinculados à conta, com opção de adicionar um novo.

### Saúde
- **Coleira** — estado de atividade atual, nível de bateria, tempo em cada estado e histórico recente, tudo a partir das leituras reais da coleira.
- **Alimentação** — nível do reservatório, consumo do dia e últimas refeições registradas pelo comedouro.
- **Ambiente** — temperatura, umidade, qualidade do ar e presença do pet, com aviso quando algum valor sai da faixa segura.

### Preventivo
- Calendário de vacinas, check-ups, vermífugo e medicamentos.
- CRUD completo do lembrete: criar, marcar como realizado (ação definitiva, sem desfazer), **editar** (tipo/descrição/data — ícone de lápis nos itens pendentes) e **excluir**. Edição e exclusão são bloqueadas pelo backend para um lembrete já realizado.
- A data prevista precisa ser hoje ou no futuro tanto para criar quanto para editar (regra do backend) — a tela avisa isso antes de tentar salvar.
- Streak de adesão calculado a partir de eventos concluídos reais.

### Alertas
- Lista de alertas ativos do pet, com filtro por gravidade e tela de detalhe.

### PetCare AI
- Campo de pergunta com envio real, estados de carregamento e erro, e as fontes que embasaram a resposta.
- A IA roda dentro da própria API Java (Spring AI + Gemini, com RAG sobre uma base veterinária), em `POST /pets/{petId}/ia/perguntar`. Não há segunda URL para configurar.
- Sem retry automático de cold start: a chamada grava a análise no histórico, então repetir sozinho geraria uma segunda. O timeout é de 120s e quem decide tentar de novo é o tutor.
- A integração está documentada em [`docs/contrato-ia.md`](docs/contrato-ia.md).

### Perfil
- Dados do pet (espécie, raça, data de nascimento, peso, sexo, condições crônicas) com edição real.
- Cadastro e exclusão de pet.
- Dados do tutor (nome, e-mail, telefone) com edição real; CPF fica somente leitura.
- Clínica responsável pelo pet. Se o tutor ainda não tiver nenhum pet, a clínica vem do próprio pré-cadastro (`GET /tutor/me`), então o cadastro do primeiro pet nunca fica bloqueado por falta de clínica.
- Status dos dispositivos vinculados (coleira, comedouro, sensor de ambiente).
- Histórico recente (alertas e eventos preventivos concluídos).
- Preferências de notificação (`AsyncStorage`) — governam os avisos disparados pelos alertas do backend.
- **Aparência → Tema escuro:** liga e desliga o modo escuro. A escolha fica salva no aparelho e o app
  reabre sozinho para aplicar. Sem escolha, o app segue o tema do celular.
- Acesso à tela **Sobre o app**.
- Logout.

### Sobre o app
- Versão e **hash do commit que gerou o build**, resolvidos em tempo de build pelo `app.config.js`.
- Avisa quando o build saiu de uma cópia com alterações não commitadas — nesse caso o código em execução não corresponde ao commit exibido.
- Animações de entrada e pulso, que respeitam a preferência de movimento reduzido do sistema.

---

## 🧭 Navegação

O app usa **Expo Router** (roteamento por arquivos):

- Grupo `(auth)` — pilha de login/ativação, exibida quando não há sessão.
- Grupo `(tabs)` — bottom tabs (Início, Saúde, Preventivo, IA, Perfil), exibida quando autenticado.
- `alertas/` — pilha própria (lista + detalhe) fora das tabs.
- `sobre/` — pilha própria com a tela **Sobre o app**.

O layout raiz (`app/_layout.tsx`) decide qual grupo mostrar com base no estado de autenticação, redirecionando automaticamente.

---

## 🛠️ Tecnologias utilizadas

- React Native 0.86 + Expo SDK 57
- TypeScript (modo `strict`)
- Expo Router (navegação por arquivos)
- TanStack Query (cache, loading/error/empty states, invalidação após mutações)
- `expo-secure-store` (sessão JWT)
- `expo-linear-gradient`, `react-native-svg` (telas de login e anel de score)
- `expo-notifications` (notificação local disparada por alerta do backend)
- `react-native-reanimated` (animações da tela Sobre o app)
- `expo-constants` (lê o commit do build injetado pelo `app.config.js`)

---

## 🗂️ Estrutura de pastas

```
petcare-hub-mobile/
│
├── app/                        # rotas (Expo Router)
│   ├── (auth)/                 # login, primeiro acesso, criar senha
│   ├── (tabs)/                 # início, saúde, preventivo, ia, perfil
│   ├── alertas/                # lista + detalhe
│   └── sobre/                  # versão e commit do build
│
├── src/
│   ├── components/             # componentes de UI reutilizáveis
│   ├── contexts/                # AuthContext, PetContext
│   ├── hooks/
│   │   ├── queries/             # TanStack Query — leitura
│   │   └── mutations/           # TanStack Query — escrita
│   ├── services/                 # chamadas HTTP por domínio (auth, pets, leituras, preventive, tutor)
│   │   └── api/client.ts         # wrapper fetch + retry de cold start + tratamento de erro
│   ├── screens/                  # telas (montadas pelas rotas em app/)
│   ├── storage/                  # AsyncStorage — só preferências locais
│   ├── theme/                    # cores, tipografia, espaçamento
│   ├── types/                    # tipos das respostas/requisições da API
│   └── utils/                    # mapeamento de dado da API pra UI
│
├── docs/contrato-ia.md         # integração com a PetCare AI
├── app.json                    # configuração estática
├── app.config.js               # injeta o commit do build
├── .env.example                # variáveis de ambiente
├── package.json
└── README.md
```

---

## 🌐 Integração com a API

O app consome a API Java (Spring Boot) do PetCare Hub, hospedada em produção — sem dados mockados. Alguns pontos importantes:

- Autenticação via JWT (`Authorization: Bearer`), token expira em 30 minutos; ao expirar (ou já vencido ao restaurar a sessão salva), o app desloga automaticamente e avisa o tutor.
- A API roda em plano gratuito (Render), então a primeira chamada depois de um tempo ocioso pode demorar — leituras (GET) têm retry automático pra esse cenário; criações (POST) não, pra não arriscar duplicar um cadastro.
- Um TUTOR não tem acesso a `GET /clinicas` — por isso não existe seletor de clínica ao cadastrar um pet novo; a clínica usada é a do primeiro pet já vinculado ao tutor (um tutor sem nenhum pet ainda não consegue cadastrar o primeiro por aqui — precisa ser feito pela clínica).
- O endereço da API vem de `EXPO_PUBLIC_API_URL` (ver `.env.example`), com a URL de produção como fallback. O Expo injeta variáveis com esse prefixo **no momento do build**: trocar o `.env` depois de gerar um APK não altera o binário, é preciso buildar de novo.

---

## 🔔 Notificações

O app avisa o tutor quando o backend abre um alerta de nível `ALTO` ou `CRITICO` para
algum pet dele. O caso principal é o `SCORE_CRITICO`, que o `ScoreSaudeService` da API
Java cria sozinho quando o score do pet cai abaixo de 50.

Não existe caminho no app para forçar uma notificação: o disparo é sempre consequência
de um alerta que já existe em `/pets/{id}/alertas/ativos`. O hook reconsulta esse
endpoint a cada minuto reaproveitando a mesma `queryKey` das telas, então o cache é
compartilhado e não há requisição duplicada.

Três cuidados que o uso real exige:

- **Expo Go não serve para testar isso:** o módulo nativo do `expo-notifications` não
  existe no Expo Go desde o SDK 53. O app detecta a ausência e segue sem notificar, com
  o resto funcionando normalmente — mas para ver o aviso é preciso um dev build
  (`npx expo run:android`) ou o APK.
- **Primeira execução:** os alertas já abertos são gravados como linha de base e não
  notificam. Sem isso, instalar o app com cinco alertas em aberto dispararia cinco
  avisos de uma vez.
- **Repetição:** os ids já avisados ficam no `AsyncStorage`, porque o endpoint devolve
  os mesmos alertas enquanto ninguém os resolve.

Um toque no aviso abre o alerta que o originou. O aviso é **local** — depende do app
estar em execução; notificação com o app fechado exigiria token de push e servidor.

---

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js e NPM
- Expo Go no celular (atualizado) ou Android Studio/Xcode com emulador
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/PetCare-HUB/Mobile.git
cd Mobile
```

### 2. Instalar dependências

```bash
npm install
```

> O repositório já inclui um `.npmrc` com `legacy-peer-deps=true` — necessário porque as dependências web do `expo-router` (usadas só quando o app roda no navegador) puxam uma versão de `react-dom` diferente da que o projeto fixa. Isso não afeta rodar no Expo Go ou emulador.

### 3. Configurar o ambiente

```bash
cp .env.example .env
```

O app funciona sem esse passo — `EXPO_PUBLIC_API_URL` tem a URL de produção como
fallback. O `.env` serve para apontar para outro ambiente:

| Variável | Para que serve |
|---|---|
| `EXPO_PUBLIC_API_URL` | API Java, PetCare AI incluída. Vazia = produção (Render) |

> O prefixo `EXPO_PUBLIC_` é obrigatório, e o valor é injetado **no build** — por isso
> ele fica visível no bundle. Não coloque segredo aí.

### 4. Rodar o projeto

```bash
# Via QR Code (Expo Go)
npx expo start

# Direto no Android (cabo ou emulador)
npx expo start --android

# Direto no iOS
npx expo start --ios
```

### 5. Conta para testar

O app não tem cadastro livre — o login (e o "Primeiro acesso") só funciona com um tutor que já exista no banco por trás da API, pré-cadastrado por uma clínica. Então já deixamos uma conta ativada:

| E-mail | Senha |
|---|---|
| `ana.souza@email.com` | `12345678` |

É a tutora do Rex, com pet, histórico, score e alertas já vinculados — a Home abre com conteúdo, não vazia. Basta entrar direto pelo **Login**; o "Primeiro acesso" não é necessário.

> A primeira tentativa pode demorar até ~1 minuto: a API roda no plano gratuito do Render e hiberna depois de um tempo ociosa. O app faz retry automático nas leituras, então vale esperar antes de concluir que falhou.

**Se preferir criar a sua própria conta**, o fluxo completo é o do pré-cadastro (ver o README do backend Java): uma clínica autenticada chama `POST /tutor` com nome, CPF, e-mail e telefone; depois, no app, o "Primeiro acesso" com esses mesmos nome/CPF/e-mail ativa a conta e define a senha. As credenciais de clínica para esse passo estão na seção "Contas de demonstração" do README da API Java.

## 📺 Demonstração em Vídeo

Vídeo de apresentação da Sprint 4, gravado com o APK publicado: [assista aqui](https://youtube.com/shorts/__s3I1YPjDA)

Vídeo da Sprint 3: [assista aqui](https://youtu.be/97hjtDnuxmY?si=wVhmzgkwjcXPI5as)

---

## 🔮 Evoluções futuras

- `/auth/logout` e `/auth/refresh` no backend (hoje a sessão só expira, sem renovação)
- Notificação com o app fechado (hoje o aviso é local e depende do app estar em execução)
- Ponte MQTT → Java para leituras de IoT em tempo real
- Publicação nas lojas e testes automatizados

---

## 👥 Integrantes da Equipe

| Nome | RM | Turma | GitHub | LinkedIn |
|---|---|---|---|---|
| Alexander Dennis Isidro Mamani | 565554 | 2TDSPG | [alex-isidro](https://github.com/alex-isidro) | [LinkedIn](https://www.linkedin.com/in/alexander-dennis-a3b48824b/) |
| Kelson Zhang | 563748 | 2TDSPG | [KelsonZh0](https://github.com/KelsonZh0) | [LinkedIn](https://www.linkedin.com/in/kelson-zhang-211456323/) |
