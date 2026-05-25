# 🐾 PetCare Hub Mobile

Aplicativo mobile desenvolvido em **React Native com Expo** para o Challenge FIAP 2026 — CLYVO VET.

Permite que o tutor acompanhe a saúde do pet de forma contínua e preventiva, visualizando score de saúde, alertas, dados de sensores IoT e calendário preventivo.

---

## 📌 Contexto do projeto

A proposta do Challenge CLYVO VET é transformar a jornada de saúde animal de um modelo episódico e reativo para uma experiência contínua, preventiva, inteligente e integrada.

O aplicativo mobile representa a interface do tutor dentro da solução **PetCare Hub**, construído como protótipo funcional com dados mockados e persistência local com AsyncStorage.

---

## 🎯 Objetivo do app

O **PetCare Hub Mobile** permite que o responsável pelo pet:

- acompanhe o **Score de Saúde** do animal;
- visualize informações da **coleira smart**;
- acompanhe dados do **comedouro inteligente**;
- monitore dados do **ambiente**;
- gerencie um **calendário preventivo** com streak de adesão;
- cadastre e salve o **perfil do pet** localmente;
- configure **preferências de notificação**;
- visualize dados restaurados após recarregar o aplicativo.

---

## 📱 Telas implementadas

### 1. Home / Dashboard
- Score de Saúde com indicador visual (🟢🟡🔴)
- Dados do pet cadastrado pelo tutor
- Alertas ativos do dia
- Acesso rápido ao Calendário Preventivo com badge de pendentes
- Próximas ações preventivas

### 2. Coleira Smart
- Status atual de atividade do pet
- Nível de bateria da coleira
- Resumo de atividade das últimas 24 horas
- Último estado restaurado do AsyncStorage

### 3. Comedouro Inteligente
- Nível atual de ração com barra visual
- Consumo diário
- Última refeição registrada
- Alerta automático quando nível está abaixo do ideal
- Último estado restaurado do AsyncStorage

### 4. Ambiente
- Temperatura e umidade do cômodo
- Qualidade do ar (sensor MQ-135)
- Presença do pet no cômodo (sensor PIR)
- Último estado restaurado do AsyncStorage

### 5. Calendário Preventivo
- Listagem de vacinas, check-ups, vermífugo e medicamento
- Status feito/pendente com botão de toggle
- Resumo com total, feitos, pendentes e streak de adesão 🔥
- Persistência local com AsyncStorage
- Restauração dos dados após recarregar o app

### 6. Perfil do Pet
- Formulário com 6 campos controlados por useState
- Prévia em tempo real dos dados digitados
- Validação de campos obrigatórios
- Salvamento local com AsyncStorage
- Restauração automática dos dados ao abrir o app
- Preferências de notificação com toggles (salvas no AsyncStorage)
- Botão para limpar dados salvos

---

## 🧭 Navegação

O app utiliza navegação combinada com **React Navigation**:

- **Bottom Tab Navigator** — barra inferior com 5 tabs: Home, Coleira, Comedouro, Ambiente e Perfil
- **Native Stack Navigator** — Calendário Preventivo abre em stack a partir da Home com botão de voltar

---

## 🛠️ Tecnologias utilizadas

- React Native
- Expo SDK 55
- TypeScript
- React Navigation (Native Stack + Bottom Tabs)
- AsyncStorage
- NPM

---

## 📦 Bibliotecas principais

```bash
@react-navigation/native
@react-navigation/native-stack
@react-navigation/bottom-tabs
@react-native-async-storage/async-storage
@expo/vector-icons
react-native-screens
react-native-safe-area-context
react-native-gesture-handler
react-native-reanimated
```

---

## 🗂️ Estrutura de pastas

```
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
│   │   ├── preventiveStorage.ts
│   │   ├── sensorStorage.ts
│   │   └── preferencesStorage.ts
│   │
│   └── types/
│       └── pet.ts
│
├── App.tsx
├── app.json
├── package.json
└── README.md
```

---

## 💾 Persistência local com AsyncStorage

| Chave | Conteúdo | Arquivo |
|---|---|---|
| `@petcarehub:pet_profile` | Perfil do pet | `petStorage.ts` |
| `@petcarehub:preventive_items` | Status do calendário | `preventiveStorage.ts` |
| `@petcarehub:streak` | Streak de adesão medicamentosa | `preventiveStorage.ts` |
| `@petcarehub:streak_date` | Data da última adesão | `preventiveStorage.ts` |
| `@petcarehub:sensor_coleira` | Último estado da coleira | `sensorStorage.ts` |
| `@petcarehub:sensor_comedouro` | Último estado do comedouro | `sensorStorage.ts` |
| `@petcarehub:sensor_ambiente` | Último estado do ambiente | `sensorStorage.ts` |
| `@petcarehub:preferences` | Preferências de notificação | `preferencesStorage.ts` |

---

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js e NPM
- Expo Go no celular (atualizado) ou Android Studio com emulador
- Git

### 1. Clonar o repositório

```bash
https://github.com/PetCare-HUB/Mobile.git
cd petcare-hub-mobile
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar o projeto

```bash
# Via QR Code
npx expo start

# Direto no Android (cabo ou emulador)
npx expo start --android

# Direto no iOS
npx expo start --ios
```

---

## 🧪 Como testar os requisitos

### Teste 1 — Navegação com tabs
1. Abra o app
2. Navegue pelas 5 tabs na barra inferior: Home, Coleira, Comedouro, Ambiente e Perfil
3. Na Home, toque em **Calendário Preventivo** — abre em stack com botão voltar

### Teste 2 — Formulário com useState
1. Acesse a tab **Perfil**
2. Digite os dados do pet
3. Observe a **Prévia em tempo real** atualizar enquanto digita
4. Toque em **Salvar perfil**

### Teste 3 — AsyncStorage do perfil
1. Preencha e salve o perfil
2. Feche e reabra o app
3. Os dados continuam preenchidos e o nome aparece na Home

### Teste 4 — AsyncStorage dos sensores
1. Acesse Coleira, Comedouro e Ambiente
2. Feche e reabra o app
3. Os dados são restaurados do último estado conhecido

### Teste 5 — Streak de adesão
1. Acesse **Calendário Preventivo**
2. Marque **Medicamento diário** como feito
3. O contador de streak aumenta
4. Feche e reabra o app — o streak continua salvo

### Teste 6 — Preferências de notificação
1. Acesse a tab **Perfil**
2. Ajuste os toggles de notificação
3. Salve e reabra o app — preferências restauradas

---

## 🎥 Vídeo de demonstração

```
https://youtu.be/Vm_NwziuN7A
```

O vídeo demonstra:
- execução em emulador ou dispositivo físico
- navegação pelas tabs e pelo stack
- formulário com useState e prévia em tempo real
- salvamento e restauração do perfil com AsyncStorage
- calendário preventivo com streak
- persistência após recarregar o app

---

## 🔄 Fluxo de uso

```
Tutor abre o app
      │
      ▼
Tab Home — Score de Saúde + alertas
      │
      ├── Tab Coleira    → atividade e bateria
      ├── Tab Comedouro  → ração e consumo
      ├── Tab Ambiente   → temperatura, ar, presença
      ├── Tab Perfil     → cadastro + preferências
      └── Stack Preventivo → calendário + streak
              │
              ▼
        Dados salvos localmente
              │
              ▼
        Restaurados ao reabrir o app
```

---

## 🔮 Evoluções futuras

- integração com a API Java (dados reais dos sensores IoT)
- gráficos históricos de saúde
- autenticação do tutor
- notificações push
- histórico longitudinal do pet
- recomendações personalizadas com IA

---

## 👥 Integrantes da Equipe

| Nome | RM | Turma | GitHub | LinkedIn |
|---|---|---|---|---|
| Alexander Dennis Isidro Mamani | 565554 | 2TDSPG | [alex-isidro](https://github.com/alex-isidro) | [LinkedIn](https://www.linkedin.com/in/alexander-dennis-a3b48824b/) |
| Kelson Zhang | 563748 | 2TDSPG | [KelsonZh0](https://github.com/KelsonZh0) | [LinkedIn](https://www.linkedin.com/in/kelson-zhang-211456323/) |

---