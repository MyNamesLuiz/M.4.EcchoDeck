# PRD — Eccho Deck

## 1. Problema

### Qual problema específico estamos resolvendo?
Estudantes universitários de diversos cursos, seja superior ou tecnico, e os admiradores de concursos estudam muito conteudo extensivo (fórmulas, conceitos, definições, vocabulário) e os esquecem rapidamente porque não revisam no momento certo. Uma única sessão de leitura não é suficiente para consolidar memória de longo prazo.

### Por que esse problema vale a pena resolver?
Estudos feitos por especialistas de psicanálise mostram que a curva do esquecimento faz com que 70% de um conteúdo novo seja esquecido em 24 horas sem revisão. Ferramentas de repetição espaçada comprovadamente aumentam a retenção, mas a maioria dos estudantes não tem um sistema acessível e simples para isso.

### Quem é o usuário?
Estudante de cursos em geral e concurseiros:
- Precisa memorizar conteúdo denso para provas (ex: anatomia, direito, programação, idiomas)
- Já tentou decorar anotações, mas se perde na quantidade de material
- Quer saber **o que ainda não domina** para priorizar o tempo de estudo

"Estudantes em geral" é vago demais. O foco são estudantes com volume alto de conteúdo factual que precisam otimizar o tempo de revisão.

---

## 2. Funcionalidades Essenciais

Para cada funcionalidade, apliquei o teste de remoção: *"se eu tirar isso, a solução ainda resolve o problema?"*

| Funcionalidade | Essencial? | Justificativa |
|---|---|---|
| **Criar flashcard** (pergunta + resposta) | Sim | Sem criação não há conteúdo para estudar |
| **Modo de estudo com flip de carta** | Sim | É o mecanismo central de testagem da memória; sem ele é apenas uma lista de notas |
| **Avaliação de domínio (1–5)** | Sim | É o coração da repetição espaçada — sem registro do desempenho não há como priorizar revisões |
| **Visualizar todos os cards com progresso** | Sim | O estudante precisa saber o que ainda não domina para decidir o que revisar |
| **Remover flashcard** | Sim | Conteúdo desatualizado ou incorreto polui o deck e prejudica o estudo |
| Filtros avançados por tag/deck | Não (extra) | A solução já funciona sem isso — é uma melhoria de conforto |
| Algoritmo automático de agendamento de revisões | Não (extra) | O usuário pode fazer isso manualmente pela avaliação de domínio |
| Múltiplos decks | Não (extra) | Um deck único já resolve o problema central |

---

## 3. Decisões Técnicas

### Estrutura da API

A API usa **json-server** rodando localmente na porta `3001`, expondo um único endpoint REST:

```
GET    /flashcards          → lista todos os cards
POST   /flashcards          → cria um novo card
PATCH  /flashcards/:id      → atualiza o nível de domínio
DELETE /flashcards/:id      → remove um card
```

### Entidade principal: `Flashcard`

```typescript
interface Flashcard {
  id: string;
  question: string;       // frente do card
  answer: string;         // verso do card
  masteryLevel: number;   // 1 a 5 (domínio do conteúdo)
  createdAt: string;      // ISO 8601
  updatedAt: string;      // ISO 8601
}
```

### Por que essas operações?

| Operação | Por quê é necessária |
|---|---|
| `GET /flashcards` | Carregar todos os cards ao montar a aplicação |
| `POST /flashcards` | Persistir novos cards criados pelo usuário |
| `PATCH /flashcards/:id` | Atualizar apenas o `masteryLevel` após cada sessão de estudo — sem reescrever o card inteiro (por isso PATCH e não PUT) |
| `DELETE /flashcards/:id` | Remover cards obsoletos ou incorretos |

### Por que não PUT?
O `PATCH` é mais semântico: só o `masteryLevel` muda após uma sessão de estudo. O `PUT` exigiria enviar o objeto completo, o que aumentaria o risco de sobrescrever dados por acidente.

### Isolamento da camada de API
Todas as chamadas HTTP estão isoladas em `src/services/api.ts`. Os componentes nunca fazem `fetch` diretamente — consomem o hook `useFlashcards`, que por sua vez usa o serviço. Isso torna a substituição do backend (ex: trocar json-server por uma API real) trivial.
