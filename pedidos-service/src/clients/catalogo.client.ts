import dotenv from "dotenv";
import { AppError } from "../errors/AppError";
import { ReservaEstoque } from "../types";

dotenv.config();

const CATALOG_URL = process.env.CATALOG_URL;

if (!CATALOG_URL) {
  throw new Error("CATALOG_URL não configurada");
}

export async function reservarProduto(
  produtoId: number,
  quantidade: number
): Promise<ReservaEstoque> {
  let resposta: Response;

  try {
    resposta = await fetch(
      `${CATALOG_URL}/produtos/${produtoId}/reservas`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade })
      }
    );
  } catch {
    throw new AppError(
      "Catálogo indisponível",
      502,
      "CATALOGO_INDISPONIVEL"
    );
  }

  let dados: any;

  try {
    dados = await resposta.json();
  } catch {
    throw new AppError(
      "Resposta inválida do Catálogo",
      502,
      "RESPOSTA_CATALOGO_INVALIDA"
    );
  }

  if (!resposta.ok) {
    if (resposta.status === 400) {
      throw new AppError(
        dados.mensagem ?? "Quantidade inválida",
        400,
        dados.codigo ?? "QUANTIDADE_INVALIDA"
      );
    }

    if (resposta.status === 404) {
      throw new AppError(
        "Produto não encontrado",
        404,
        "PRODUTO_NAO_ENCONTRADO"
      );
    }

    if (resposta.status === 409) {
      throw new AppError(
        "Estoque insuficiente",
        409,
        "ESTOQUE_INSUFICIENTE"
      );
    }

    // Erros 5xx ou outros status inesperados do serviço dependente.
    throw new AppError(
      "Catálogo indisponível",
      502,
      "CATALOGO_INDISPONIVEL"
    );
  }

  if (
    typeof dados.produtoId !== "number" ||
    typeof dados.reservado !== "number" ||
    typeof dados.precoUnitario !== "number" ||
    typeof dados.estoqueRestante !== "number"
  ) {
    throw new AppError(
      "Resposta inválida do Catálogo",
      502,
      "RESPOSTA_CATALOGO_INVALIDA"
    );
  }

  return dados as ReservaEstoque;
}
