import { App } from "./App";
import { env } from "./config/env";

const { app } = new App();
app.listen(env.port, () => {
  console.log(`🚀 Servidor rodando na porta ${env.port} 🚀`);
});
