import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Serviço preparado para o Encontro 2.
app.get("/", (_req, res) => {
  res.status(200).json({ mensagem: "Serviço de Pedidos preparado" });
});

app.listen(PORT, () => {
  console.log(`Pedidos rodando em http://localhost:${PORT}`);
});
