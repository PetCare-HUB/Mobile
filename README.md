# 🐾 PetCare Hub Mobile

Aplicativo mobile desenvolvido em **React Native com Expo** para o Challenge FIAP 2026 — CLYVO VET.

aInterface do tutor dentro da plataforma **PetCare Hub**: acompanha a saúde do pet de forma contínua e preventiva, com login real, dados vindos da API Java (sem mock) e sessão persistida no dispositivo.

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
- Consome o serviço de IA apontado por `EXPO_PUBLIC_IA_API_URL`. Enquanto a variável não estiver definida, a tela informa que a assistente não está conectada em vez de simular uma resposta.
- O contrato que o app espera está em [`docs/contrato-ia.md`](docs/contrato-ia.md).

### Perfil
- Dados do pet (espécie, raça, data de nascimento, peso, sexo, condições crônicas) com edição real.
- Cadastro e exclusão de pet.
- Dados do tutor (nome, e-mail, telefone) com edição real; CPF fica somente leitura.
- Clínica responsável pelo pet. Se o tutor ainda não tiver nenhum pet, a clínica vem do próprio pré-cadastro (`GET /tutor/me`), então o cadastro do primeiro pet nunca fica bloqueado por falta de clínica.
- Status dos dispositivos vinculados (coleira, comedouro, sensor de ambiente).
- Histórico recente (alertas e eventos preventivos concluídos).
- Preferências de notificação (`AsyncStorage`) — governam os avisos disparados pelos alertas do backend.
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
├── docs/contrato-ia.md         # contrato do endpoint da PetCare AI
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

Dois cuidados que o uso real exige:

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
fallback. O `.env` serve para apontar para outro ambiente e para ligar a PetCare AI:

| Variável | Para que serve |
|---|---|
| `EXPO_PUBLIC_API_URL` | API Java. Vazia = produção (Render) |
| `EXPO_PUBLIC_IA_API_URL` | Serviço da PetCare AI. Vazia = aba informa que não está conectada |

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

O app não tem cadastro livre — o login (e o "Primeiro acesso") só funciona com um tutor que já exista no banco por trás da API (pré-cadastrado por uma clínica).

**Procedimento reproduzível, sem depender de pedir conta a ninguém** (backend Java, ver seu README):

1. A API Java, ao subir contra um banco Oracle **vazio**, insere sozinha uma clínica de exemplo:
   `contato@clinicavidapet.test` / `Senha123` (ver `DataLoader`, ligado por `app.seed.enabled=true`).
2. Abra o Swagger da API (`/swagger-ui.html`) e chame `POST /auth/login` com esse e-mail/senha pra pegar o token da clínica.
3. Com esse token, chame `POST /tutor` (Swagger tem botão "Authorize") informando nome, CPF, e-mail e telefone de um tutor de teste qualquer.
4. No app, use "Primeiro acesso" com esse mesmo nome/CPF/e-mail pra ativar a conta e definir a senha.
5. Pronto — login normal a partir daí, com a clínica do pré-cadastro já resolvida automaticamente.

> Isso funciona de ponta a ponta contra um Oracle novo (ambiente do próprio avaliador). Se estiver testando contra o ambiente compartilhado do grupo (Render), que já tem clínicas cadastradas, o seed automático não roda (só age em banco vazio) — nesse caso, peça uma conta de tutor já ativada ou os dados de um pré-cadastro a quem administra esse ambiente específico.

## 📺 Demonstração em Vídeo

Vídeo de apresentação do app, publicado no YouTube: [assista aqui](https://youtu.be/97hjtDnuxmY?si=wVhmzgkwjcXPI5as)

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
