# 🐾 PetCare Hub Mobile

Aplicativo mobile desenvolvido em **React Native com Expo** para o Challenge FIAP 2026 — CLYVO VET.

aInterface do tutor dentro da plataforma **PetCare Hub**: acompanha a saúde do pet de forma contínua e preventiva, com login real, dados vindos da API Java (sem mock) e sessão persistida no dispositivo.

---

## 📌 Contexto do projeto

A proposta do Challenge CLYVO VET é transformar a jornada de saúde animal de um modelo episódico e reativo para uma experiência contínua, preventiva e integrada — conectando tutor, clínica veterinária, dispositivos IoT e inteligência artificial.

O app é fechado: o tutor não se cadastra livremente. A clínica pré-cadastra o tutor e o pet; o tutor só ativa o próprio acesso informando CPF, e-mail e código de ativação.

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
- configure preferências de notificação (local, sem endpoint correspondente no backend).

---

## 📱 Telas implementadas

### Autenticação
- **Login** — e-mail e senha, sessão JWT persistida com `expo-secure-store`.
- **Primeiro acesso** — validação de CPF, e-mail e código de ativação contra o pré-cadastro feito pela clínica.
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
- Marcar item como realizado (ação definitiva, sem desfazer) e adicionar novo lembrete.
- Streak de adesão calculado a partir de eventos concluídos reais.

### Alertas
- Lista de alertas ativos do pet, com filtro por gravidade e tela de detalhe.

### PetCare AI
- Tela reservada para o assistente de orientação preventiva — ainda não implementada (prioridade P2, depois da integração completa do Mobile).

### Perfil
- Dados do pet (espécie, raça, data de nascimento, peso, sexo, condições crônicas) com edição real.
- Cadastro e exclusão de pet.
- Dados do tutor (nome, e-mail, telefone) com edição real; CPF fica somente leitura.
- Clínica responsável pelo pet.
- Status dos dispositivos vinculados (coleira, comedouro, sensor de ambiente).
- Histórico recente (alertas e eventos preventivos concluídos).
- Preferências de notificação (local, `AsyncStorage`).
- Logout.

---

## 🧭 Navegação

O app usa **Expo Router** (roteamento por arquivos):

- Grupo `(auth)` — pilha de login/ativação, exibida quando não há sessão.
- Grupo `(tabs)` — bottom tabs (Início, Saúde, Preventivo, IA, Perfil), exibida quando autenticado.
- `alertas/` — pilha própria (lista + detalhe) fora das tabs.

O layout raiz (`app/_layout.tsx`) decide qual grupo mostrar com base no estado de autenticação, redirecionando automaticamente.

---

## 🛠️ Tecnologias utilizadas

- React Native 0.83 + Expo SDK 55
- TypeScript (modo `strict`)
- Expo Router (navegação por arquivos)
- TanStack Query (cache, loading/error/empty states, invalidação após mutações)
- `expo-secure-store` (sessão JWT)
- `expo-linear-gradient`, `react-native-svg` (telas de login e anel de score)

---

## 🗂️ Estrutura de pastas

```
petcare-hub-mobile/
│
├── app/                        # rotas (Expo Router)
│   ├── (auth)/                 # login, primeiro acesso, criar senha
│   ├── (tabs)/                 # início, saúde, preventivo, ia, perfil
│   └── alertas/                # lista + detalhe
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
├── app.json
├── package.json
└── README.md
```

---

## 🌐 Integração com a API

O app consome a API Java (Spring Boot) do PetCare Hub, hospedada em produção — sem dados mockados. Alguns pontos importantes:

- Autenticação via JWT (`Authorization: Bearer`), token expira em 30 minutos; ao expirar, o app desloga automaticamente e avisa o tutor.
- A API roda em plano gratuito (Render), então a primeira chamada depois de um tempo ocioso pode demorar — o client tem retry automático pra esse cenário.
- Um TUTOR não tem acesso a `GET /clinicas` — por isso não existe seletor de clínica ao cadastrar um pet novo; a clínica usada é a do primeiro pet já vinculado ao tutor.

---

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js e NPM
- Expo Go no celular (atualizado) ou Android Studio/Xcode com emulador
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/PetCare-HUB/Mobile.git
cd Mobile/petcare-hub-mobile
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar o projeto

```bash
# Via QR Code (Expo Go)
npx expo start

# Direto no Android (cabo ou emulador)
npx expo start --android

# Direto no iOS
npx expo start --ios
```

> Login exige uma conta previamente pré-cadastrada por uma clínica no backend. Peça credenciais de teste a quem administra o ambiente.

---

## 🔮 Evoluções futuras

- PetCare AI contextual (orientação preventiva baseada nos dados reais do pet)
- `/auth/logout` e `/auth/refresh` no backend (hoje a sessão só expira, sem renovação)
- Notificações push reais ligadas a alertas do backend
- Ponte MQTT → Java para leituras de IoT em tempo real
- Publicação nas lojas, tela de versão/hash, testes automatizados

---

## 👥 Integrantes da Equipe

| Nome | RM | Turma | GitHub | LinkedIn |
|---|---|---|---|---|
| Alexander Dennis Isidro Mamani | 565554 | 2TDSPG | [alex-isidro](https://github.com/alex-isidro) | [LinkedIn](https://www.linkedin.com/in/alexander-dennis-a3b48824b/) |
| Kelson Zhang | 563748 | 2TDSPG | [KelsonZh0](https://github.com/KelsonZh0) | [LinkedIn](https://www.linkedin.com/in/kelson-zhang-211456323/) |
