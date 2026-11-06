import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3002;

// Serviço preparado para o Encontro 3.
app.get("/", (_req, res) => {
  res.status(200).json({ mensagem: "Serviço de Notificações preparado" });
});

app.listen(PORT, () => {
  console.log(`Notificações rodando em http://localhost:${PORT}`);
});
