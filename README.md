## 🎯 YouTube Quiz Generator

API desenvolvida em Node.js + TypeScript que extrai a transcrição de um vídeo do YouTube e gera automaticamente um quiz educacional utilizando a API da OpenAI.

<br>

## 📦 Tecnologias Utilizadas

- TypeScript
- Express
- OvernightJS (estrutura de controllers)
- YouTube Transcript API
- OpenAI SDK
- dotenv para variáveis de ambiente
- ts-node-dev para desenvolvimento com hot-reload

<br>

## 🏛️ Estrutura de Pastas (Clean Architecture)

```pgsql
src/
├── application/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Quiz.ts
│   │   └── services/
│   │       ├── IQuizGeneratorService.ts
│   │       └── ITranscriptService.ts
│   └── use-cases/
│       ├── __tests__/
│       │   ├── GenerateQuizUseCase.test.ts
│       │   └── GetTranscriptUseCase.test.ts
│       ├── GenerateQuizUseCase.ts
│       └── GetTranscriptUseCase.ts
├── infra/
│   └── providers/
│       ├── __tests__/
│       │   ├── OpenAIProvider.test.ts
│       │   └── YoutubeTranscriptProvider.test.ts
│       ├── OpenAIProvider.ts
│       └── YoutubeTranscriptProvider.ts
├── presentation/
│   └── controllers/
│       ├── __tests__/
│       │   └── QuizController.test.ts
│       └── QuizController.ts
├── config/
│   └── env.ts
└── App.ts
└── index.ts

```

<br>

## 🚀 Como Executar o Projeto

1️⃣ Clone o repositório

```bash
git clone https://github.com/danvinicius/youtube-quiz-generator.git
cd youtube-quiz-generator
```

2️⃣ Instale as dependências

```bash
yarn
```

3️⃣ Configure as variáveis de ambiente<br>
Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

```bash
OPENAI_API_KEY=your_openai_key
PORT=3000
```

Substitua your_openai_key pela sua chave da API OpenAI.

4️⃣ Execute o projeto em modo desenvolvimento

```bash
yarn dev
```

A API ficará disponível em:
➡️ http://localhost:3000

5️⃣ Compilar e rodar a versão de produção

```bash
yarn build
yarn start
```

<br>

## ⚙️ Scripts Disponíveis

| Script     | Descrição                                      |
| ---------- | ---------------------------------------------- |
| yarn dev   | Executa o projeto com hot-reload (ts-node-dev) |
| yarn build | Compila o TypeScript para JavaScript (dist/)   |
| yarn start | Executa o projeto compilado                    |
| yarn test  | Roda os testes do projeto com Jest             |

<br>

## 🛠️ Endpoints

✅ GET /quiz
<br><br>
**Descrição:** Gera um quiz educacional baseado na transcrição de um vídeo do YouTube.
<br><br>
**Exemplo real:**

```bash
http://localhost:3000/quiz?url=https://www.youtube.com/watch?v=CwATgiK8Jzo
```

Resposta (200):

```json
[
  {
    "question": "Qual é o argumento moral apresentado na aula?",
    "options": [
      {
        "option": "a",
        "text": "A moral é subjetiva e não depende de Deus.",
        "correct": false
      },
      {
        "option": "b",
        "text": "A moral objetiva só é real se Deus for real.",
        "correct": true
      },
      {
        "option": "c",
        "text": "A moral é determinada pelas leis da sociedade.",
        "correct": false
      },
      {
        "option": "d",
        "text": "A moral não existe, apenas opiniões pessoais.",
        "correct": false
      },
      {
        "option": "e",
        "text": "A moral é um construto evolutivo.",
        "correct": false
      }
    ],
    "explanation": "O argumento moral afirma que para que haja uma moral objetiva, deve existir uma autoridade suprema, que é Deus. Se Deus não existir, a moral se torna relativa."
  },
  {
    "question": "O que o argumento cosmológico defende?",
    "options": [
      {
        "option": "a",
        "text": "Tudo no universo é causado por outras causas.",
        "correct": true
      },
      {
        "option": "b",
        "text": "O universo é eterno e não teve um começo.",
        "correct": false
      },
      {
        "option": "c",
        "text": "As causas não precisam ser explicadas.",
        "correct": false
      },
      {
        "option": "d",
        "text": "A causa do universo é o acaso.",
        "correct": false
      },
      {
        "option": "e",
        "text": "Não há necessidade de uma causa primeira.",
        "correct": false
      }
    ],
    "explanation": "O argumento cosmológico afirma que tudo tem uma causa e que deve haver uma causa primeira, que é Deus, que não é causado por nada."
  },
  {
    "question": "Qual é a essência do argumento teleológico?",
    "options": [
      {
        "option": "a",
        "text": "O universo é aleatório e sem propósito.",
        "correct": false
      },
      {
        "option": "b",
        "text": "Todas as coisas no universo têm um propósito e foram projetadas.",
        "correct": true
      },
      {
        "option": "c",
        "text": "O design do universo é uma ilusão.",
        "correct": false
      },
      {
        "option": "d",
        "text": "A evolução é suficiente para explicar a complexidade do universo.",
        "correct": false
      },
      {
        "option": "e",
        "text": "O universo foi criado sem um designer.",
        "correct": false
      }
    ],
    "explanation": "O argumento teleológico afirma que a complexidade e o propósito observados no universo indicam que ele deve ter sido projetado por um designer, ou seja, Deus."
  },
  {
    "question": "O que caracteriza o argumento ontológico?",
    "options": [
      {
        "option": "a",
        "text": "Deus deve ser concebido como o ser mais poderoso.",
        "correct": true
      },
      {
        "option": "b",
        "text": "A existência de Deus é baseada em evidências físicas.",
        "correct": false
      },
      {
        "option": "c",
        "text": "Deus pode ser limitado em suas capacidades.",
        "correct": false
      },
      {
        "option": "d",
        "text": "A ideia de Deus é apenas uma construção cultural.",
        "correct": false
      },
      {
        "option": "e",
        "text": "Deus não pode ser definido.",
        "correct": false
      }
    ],
    "explanation": "O argumento ontológico se baseia na definição de Deus como o ser que não pode ser superado em grandeza, implicando que Ele deve existir, pois a existência é maior do que a não existência."
  },
  {
    "question": "Qual argumento sugere que a consciência não pode ser explicada apenas por processos naturais?",
    "options": [
      {
        "option": "a",
        "text": "Argumento da Lei das Nações.",
        "correct": false
      },
      {
        "option": "b",
        "text": "Argumento da experiência pessoal.",
        "correct": false
      },
      {
        "option": "c",
        "text": "Argumento da mente ou consciência.",
        "correct": true
      },
      {
        "option": "d",
        "text": "Argumento transcendental.",
        "correct": false
      },
      {
        "option": "e",
        "text": "Argumento evidencialista.",
        "correct": false
      }
    ],
    "explanation": "O argumento da mente ou consciência afirma que a experiência da consciência não pode ser reduzida a meros processos biológicos, sugerindo a necessidade de algo imaterial, que é a alma humana."
  }
]
```

<br>

## 🧪 Testes

Os testes unitários da aplicação foram implementados utilizando Jest.

A estrutura de pastas foi organizada de modo a manter os testes próximos aos seus respectivos arquivos de implementação, seguindo a convenção de criar uma pasta \_\_**tests\_\_** dentro de cada módulo principal.

Para rodar os testes, basta executar o comando:

```bash
yarn test
```

<br>

## 🤝 Contribuição

Fork este repositório.

Crie uma branch: git checkout -b feature/nova-feature

Commit suas mudanças: git commit -m 'feat: nova feature'

Push para a branch: git push origin feature/nova-feature

Abra um Pull Request.

<br>

## 📝 Licença

Este projeto está licenciado sob a licença MIT.
