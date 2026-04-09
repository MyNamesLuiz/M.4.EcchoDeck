# M.4.EcchoDeck

# Eccho Deck

Aplicação de estudo com flashcards baseada em repetição espaçada.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Interface | React 18 + TypeScript |
| Estilização | Tailwind CSS |
| Estado e lógica | React Hooks (`useState`, `useEffect`, `useCallback`) |
| API local | json-server |
| Build | Vite |

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+
- npm

### Instalação

```bash
npm install
```

### Rodar a API (json-server)

```bash
npm run api
```

### Rodar o frontend (em outro terminal)

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

> A API precisa estar rodando na porta **3001** antes de iniciar o frontend.

---

## Estrutura do projeto

```
fixed-flashcards/
├── db.json                
├── .env.example           
├── .env.local             
├── src/
│   ├── App.tsx
│   ├── types/index.ts
│   ├── services/api.ts     
│   ├── hooks/useFlashcards.ts
│   └── components/
│       ├── Sidebar.tsx
│       ├── DeckHeader.tsx
│       ├── MasteryCircle.tsx
│       ├── StudyMode.tsx
│       ├── FlashcardList.tsx
│       ├── FlashcardItem.tsx
│       ├── FlashcardForm.tsx
│       └── ConfirmationModal.tsx
```

---

## Funcionalidades

- Criar flashcards com pergunta e resposta
- Modo de estudo full-screen com flip de carta (animação 3D)
- Avaliação de domínio de 1 a 5 após cada card estudado
- Visualização de todos os cards com barra de progresso individual
- Ordenação por data, domínio ou aleatório
- Indicador circular de domínio médio do deck
- Remoção de cards com confirmação

##Link deploy:
- https://m-4-eccho-deck.vercel.app/
