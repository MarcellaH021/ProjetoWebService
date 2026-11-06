import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Produto } from "./types";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3001;

// Dados temporários: serão perdidos quando o serviço for reiniciado.
let produtos: Produto[] = [
  { id: 1, nome: "Mouse", preco: 50, estoque: 8 },
  { id: 2, nome: "Teclado", preco: 120.5, estoque: 5 },
  { id: 3, nome: "Monitor", preco: 899.9, estoque: 3 }
];

let proximoId = 4;

// GET /produtos — lista todos os produtos.
app.get("/produtos", (_req: Request, res: Response) => {
  return res.status(200).json(produtos);
});

// GET /produtos/:id — busca um produto pelo ID.
app.get("/produtos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID do produto inválido",
      codigo: "ID_INVALIDO"
    });
  }

  const produto = produtos.find((item) => item.id === id);

  if (!produto) {
    return res.status(404).json({
      mensagem: "Produto não encontrado",
      codigo: "PRODUTO_NAO_ENCONTRADO"
    });
  }

  return res.status(200).json(produto);
});

// POST /produtos — cadastra um produto.
app.post("/produtos", (req: Request, res: Response) => {
  const { nome, preco, estoque } = req.body ?? {};

  if (
    typeof nome !== "string" ||
    nome.trim() === "" ||
    typeof preco !== "number" ||
    !Number.isFinite(preco) ||
    preco <= 0 ||
    !Number.isInteger(estoque) ||
    estoque < 0
  ) {
    return res.status(400).json({
      mensagem: "Dados do produto são inválidos",
      codigo: "DADOS_INVALIDOS"
    });
  }

  const novoProduto: Produto = {
    id: proximoId++,
    nome: nome.trim(),
    preco,
    estoque
  };

  produtos.push(novoProduto);
  return res.status(201).json(novoProduto);
});

// POST /produtos/:id/reservas — reduz o estoque se houver quantidade disponível.
app.post("/produtos/:id/reservas", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { quantidade } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID do produto inválido",
      codigo: "ID_INVALIDO"
    });
  }

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    return res.status(400).json({
      mensagem: "Quantidade deve ser um número inteiro maior que zero",
      codigo: "QUANTIDADE_INVALIDA"
    });
  }

  const produto = produtos.find((item) => item.id === id);

  if (!produto) {
    return res.status(404).json({
      mensagem: "Produto não encontrado",
      codigo: "PRODUTO_NAO_ENCONTRADO"
    });
  }

  if (quantidade > produto.estoque) {
    return res.status(409).json({
      mensagem: "Estoque insuficiente",
      codigo: "ESTOQUE_INSUFICIENTE"
    });
  }

  produto.estoque -= quantidade;

  //Parte 2: devolve o preço oficial para Pedidos calcular o total.
  return res.status(200).json({
    produtoId: produto.id,
    reservado: quantidade,
    precoUnitario: produto.preco,
    estoqueRestante: produto.estoque
  });
});



// Resposta para JSON malformado.
app.use((err: unknown, _req: Request, res: Response, _next: express.NextFunction) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      mensagem: "JSON inválido",
      codigo: "JSON_INVALIDO"
    });
  }
  return res.status(500).json({
    mensagem: "Erro interno do servidor",
    codigo: "ERRO_INTERNO"
  });
});

app.listen(PORT, () => {
  console.log(`Catálogo/Estoque rodando em http://localhost:${PORT}`);
});
