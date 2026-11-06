import { Request, Response, NextFunction } from "express";
import {
  buscarPedidoPorId,
  criarPedido,
  listarPedidos
} from "../services/pedidos.service";
import { AppError } from "../errors/AppError";

export async function criar(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const pedido = await criarPedido(request.body);
    return response.status(201).json(pedido);
  } catch (error) {
    return next(error);
  }
}

export function listar(_request: Request, response: Response) {
  return response.status(200).json(listarPedidos());
}

export function buscarPorId(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const id = Number(request.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return next(new AppError(
      "ID do pedido inválido",
      400,
      "ID_INVALIDO"
    ));
  }

  const pedido = buscarPedidoPorId(id);

  if (!pedido) {
    return next(new AppError(
      "Pedido não encontrado",
      404,
      "PEDIDO_NAO_ENCONTRADO"
    ));
  }

  return response.status(200).json(pedido);
}
