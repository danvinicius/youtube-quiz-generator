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

3️⃣ Configure as variáveis de ambiente
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

## 🛠️ Endpoints

✅ GET /quiz
<br><br>
Descrição: Gera um quiz educacional baseado na transcrição de um vídeo do YouTube.

```bash
http://localhost:3000/quiz?url=https://www.youtube.com/watch?v=EXEMPLO123
```

Resposta (200):

```json
[
  {
    "question": "Texto da pergunta",
    "options": [
      {"option": "a", "text": "Texto", "correct": false},
      {"option": "b", "text": "Texto", "correct": true},
      {"option": "c", "text": "Texto", "correct": false}
      {"option": "d", "text": "Texto", "correct": false}
      {"option": "e", "text": "Texto", "correct": false}
    ],
    "explanation": "Texto da explicação da resposta correta"
  },
  ...
]
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

## 🧪 Testes

Os testes unitários da aplicação foram implementados utilizando Jest.

A estrutura de pastas foi organizada de modo a manter os testes próximos aos seus respectivos arquivos de implementação, seguindo a convenção de criar uma pasta \***\*tests\*\*** dentro de cada módulo principal.

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
