import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import pedidosRoutes from "./routes/pedidos.routes";
import { AppError } from "./errors/AppError";

dotenv.config();

const app = express();
app.use(express.json());

app.use(pedidosRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      mensagem: err.message,
      codigo: err.code
    });
  }

  console.error("Erro não tratado:", err);
  return res.status(500).json({
    mensagem: "Erro interno do servidor",
    codigo: "ERRO_INTERNO"
  });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Pedidos rodando em http://localhost:${PORT}`);
});
