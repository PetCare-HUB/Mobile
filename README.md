# 🐾 PetCare Hub Mobile

Aplicativo mobile desenvolvido em **React Native com Expo** para o Challenge FIAP 2026 — CLYVO VET.

O objetivo do app é permitir que o tutor acompanhe a saúde do pet de forma contínua e preventiva, visualizando score de saúde, alertas, dados simulados de sensores IoT e calendário preventivo.

---

## 📌 Contexto do projeto

A proposta do Challenge CLYVO VET é transformar a jornada de saúde animal de um modelo episódico e reativo para uma experiência contínua, preventiva, inteligente e integrada.

Dentro da solução **PetCare Hub**, o aplicativo mobile representa a interface do tutor, permitindo o acompanhamento do pet pelo celular.

O app foi construído como um **protótipo funcional**, utilizando dados mockados e persistência local com AsyncStorage para simular o uso real da solução.

---

## 🎯 Objetivo do app

O **PetCare Hub Mobile** permite que o responsável pelo pet:

- acompanhe o **Score de Saúde** do animal;
- visualize informações da **coleira smart**;
- acompanhe dados do **comedouro inteligente**;
- monitore dados do **ambiente**;
- gerencie um **calendário preventivo**;
- cadastre e salve o **perfil do pet** localmente;
- visualize dados restaurados após recarregar o aplicativo.

---

## 📱 Funcionalidades implementadas

### 1. Home / Dashboard

Tela inicial do aplicativo.

Funcionalidades:

- exibição do nome do pet;
- Score de Saúde com indicador visual;
- dados principais do pet cadastrados pelo tutor;
- alertas ativos;
- próximas ações preventivas;
- navegação para os módulos principais do app.

---

### 2. Coleira Smart

Tela que simula os dados da coleira inteligente.

Funcionalidades:

- status atual de atividade do pet;
- nível de bateria da coleira;
- resumo de atividade das últimas 24 horas;
- cards visuais com indicadores de saúde.

---

### 3. Comedouro Inteligente

Tela que simula o acompanhamento alimentar do pet.

Funcionalidades:

- nível atual de ração;
- consumo diário;
- última refeição registrada;
- alerta de reposição de ração.

---

### 4. Ambiente

Tela que simula sensores ambientais do cômodo onde o pet está.

Funcionalidades:

- temperatura ambiente;
- umidade;
- qualidade do ar;
- presença do pet no cômodo.

---

### 5. Calendário Preventivo

Tela para acompanhamento de ações preventivas.

Funcionalidades:

- listagem de vacinas, check-ups, vermífugo e medicamento;
- status de cada item: `Feito` ou `Pendente`;
- botão para marcar item como feito;
- botão para voltar item para pendente;
- resumo com total de itens, feitos e pendentes;
- persistência local dos status usando AsyncStorage;
- restauração dos dados após recarregar o aplicativo.

---

### 6. Perfil do Pet

Tela com formulário controlado por estado.

Funcionalidades:

- cadastro de nome do pet;
- cadastro de espécie;
- cadastro de raça;
- cadastro de idade;
- cadastro de peso;
- cadastro de clínica vinculada;
- validação de campos obrigatórios;
- prévia em tempo real dos dados digitados;
- salvamento local com AsyncStorage;
- restauração automática dos dados salvos;
- botão para limpar dados salvos.

---

## 🛠️ Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- React Navigation
- Native Stack Navigator
- AsyncStorage
- JavaScript/TypeScript
- NPM

---

## 📦 Bibliotecas principais

```bash
react-navigation/native
react-navigation/native-stack
react-native-screens
react-native-safe-area-context
react-native-async-storage/async-storage
```

---

## 🗂️ Estrutura de pastas

```txt
petcare-hub-mobile/
│
├── src/
│   ├── components/
│   │   ├── AlertCard.tsx
│   │   ├── PreventiveItem.tsx
│   │   ├── ScoreCard.tsx
│   │   └── SensorCard.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   │
│   ├── screens/
│   │   ├── CollarScreen.tsx
│   │   ├── EnvironmentScreen.tsx
│   │   ├── FeederScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── PetProfileScreen.tsx
│   │   └── PreventiveScreen.tsx
│   │
│   ├── storage/
│   │   ├── petStorage.ts
│   │   └── preventiveStorage.ts
│   │
│   └── types/
│       └── pet.ts
│
├── App.tsx
├── app.json
├── package.json
├── package-lock.json
└── README.md
```

---

## 🧠 Arquitetura da solução mobile

```txt
Usuário / Tutor
      │
      ▼
App Mobile React Native
      │
      ├── Home / Dashboard
      ├── Coleira Smart
      ├── Comedouro Inteligente
      ├── Ambiente
      ├── Calendário Preventivo
      └── Perfil do Pet
      │
      ├── Dados mockados
      │       └── src/data/mockData.ts
      │
      └── Persistência local
              └── AsyncStorage
```

Nesta sprint, o aplicativo funciona como protótipo funcional com dados mockados. Em uma evolução futura, os dados poderão ser consumidos da API Java principal, que processa leituras IoT e disponibiliza informações para o app mobile.

---

## 💾 Persistência local

O projeto utiliza `AsyncStorage` para salvar dados simples no dispositivo.

### Dados persistidos

| Dado | Arquivo responsável | Chave local |
|---|---|---|
| Perfil do pet | `src/storage/petStorage.ts` | `@petcarehub:pet_profile` |
| Calendário preventivo | `src/storage/preventiveStorage.ts` | `@petcarehub:preventive_items` |

### Exemplo de comportamento

1. O usuário entra na tela **Perfil do Pet**.
2. Preenche os dados do animal.
3. Clica em **Salvar perfil**.
4. Recarrega o app.
5. Os dados continuam preenchidos.

O mesmo comportamento ocorre no **Calendário Preventivo**, onde os itens marcados como feitos continuam salvos após recarregar o aplicativo.

---

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de começar, instale:

- Node.js
- NPM
- Expo Go no celular ou Android Studio com emulador
- Git

---

### 1. Clonar o repositório

```bash
git clone COLE_AQUI_O_LINK_DO_REPOSITORIO
```

```bash
cd petcare-hub-mobile
```

---

### 2. Instalar dependências

```bash
npm install
```

---

### 3. Rodar o projeto

```bash
npx expo start
```

Depois disso, escolha uma das opções:

- apertar `a` para abrir no emulador Android;
- escanear o QR Code com o Expo Go no celular;
- usar dispositivo físico conectado.

---

## 🧪 Como testar as funcionalidades

### Teste 1 — Navegação

1. Abra o app.
2. Na Home, acesse cada módulo:
   - Coleira;
   - Comedouro;
   - Ambiente;
   - Preventivo;
   - Perfil do Pet.
3. Verifique se todas as telas abrem corretamente.

---

### Teste 2 — Formulário com estado

1. Acesse **Perfil do Pet**.
2. Digite os dados do pet.
3. Observe a seção **Prévia em tempo real**.
4. Verifique se os dados aparecem enquanto são digitados.

---

### Teste 3 — AsyncStorage do perfil

1. Preencha todos os campos do perfil.
2. Clique em **Salvar perfil**.
3. Recarregue o app pelo terminal do Expo usando `r`.
4. Volte para **Perfil do Pet**.
5. Confira se os dados foram restaurados.
6. Volte para a Home e confira se o nome do pet também foi atualizado.

---

### Teste 4 — Calendário preventivo

1. Acesse **Calendário Preventivo**.
2. Clique em **Marcar como feito** em algum item.
3. Verifique se o contador de feitos e pendentes muda.
4. Recarregue o app.
5. Confira se o status continua salvo.

---

## 🎥 Vídeo de demonstração

Link do vídeo no YouTube:

```txt
COLE_AQUI_O_LINK_DO_VIDEO_NAO_LISTADO
```

O vídeo deve demonstrar:

- execução do app em emulador ou dispositivo físico;
- navegação entre todas as telas;
- funcionamento do formulário com `useState`;
- salvamento do perfil com AsyncStorage;
- restauração dos dados após recarregar o app;
- calendário preventivo interativo;
- persistência do calendário após recarregar o app.

---

## 🔄 Fluxo de uso do app

```txt
Tutor abre o app
      │
      ▼
Visualiza Score de Saúde na Home
      │
      ├── Consulta dados da coleira
      ├── Consulta dados do comedouro
      ├── Consulta dados do ambiente
      ├── Gerencia calendário preventivo
      └── Edita perfil do pet
              │
              ▼
        Dados salvos localmente
              │
              ▼
        Dados restaurados ao reabrir o app
```

---

## 📊 Dados mockados

Nesta versão, os dados de sensores e alertas são simulados no arquivo:

```txt
src/data/mockData.ts
```

Essa escolha permite demonstrar o fluxo funcional do aplicativo sem depender da API ou do hardware IoT durante a Sprint 1.

Dados simulados:

- Score de Saúde;
- status da coleira;
- bateria da coleira;
- nível de ração;
- consumo alimentar;
- temperatura ambiente;
- umidade;
- qualidade do ar;
- alertas ativos;
- calendário preventivo.

---

## 🔮 Evoluções futuras

Melhorias previstas para próximas sprints:

- integrar o app com a API Java;
- consumir dados reais dos sensores IoT;
- exibir gráficos históricos de saúde;
- adicionar autenticação do tutor;
- adicionar notificações push;
- criar tela de histórico longitudinal do pet;
- criar integração com clínicas veterinárias parceiras;
- implementar recomendações personalizadas baseadas em IA.

---

## 👥 Integrantes da Equipe

| Nome | RM | Turma | GitHub | LinkedIn |
|---|---|---|---|---|
| Alexander Dennis Isidro Mamani | 565554 | 2TDSPG | [alex-isidro](https://github.com/alex-isidro) | [LinkedIn](https://www.linkedin.com/in/alexander-dennis-a3b48824b/) |
| Kelson Zhang | 563748 | 2TDSPG | [KelsonZh0](https://github.com/KelsonZh0) | [LinkedIn](https://www.linkedin.com/in/kelson-zhang-211456323/) |

---