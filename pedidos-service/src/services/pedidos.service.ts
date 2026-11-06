import { pedidos } from "../data/pedidos";
import { AppError } from "../errors/AppError";
import { CriarPedidoInput, Pedido } from "../types";
import { reservarProduto } from "../clients/catalogo.client";

let proximoId = 1;

export async function criarPedido(input: CriarPedidoInput): Promise<Pedido> {
  const { produtoId, quantidade, clienteEmail } = input ?? ({} as CriarPedidoInput);

  const emailValido =
    typeof clienteEmail === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clienteEmail);

  if (
    !Number.isInteger(produtoId) || produtoId <= 0 ||
    !Number.isInteger(quantidade) || quantidade <= 0 ||
    !emailValido
  ) {
    throw new AppError(
      "Dados do pedido são inválidos",
      400,
      "DADOS_PEDIDO_INVALIDOS"
    );
  }

  // O pedido só será criado depois que o Catálogo confirmar a reserva.
  const reserva = await reservarProduto(produtoId, quantidade);

  const novoPedido: Pedido = {
    id: proximoId++,
    produtoId,
    quantidade,
    precoUnitario: reserva.precoUnitario,
    total: reserva.precoUnitario * quantidade,
    clienteEmail,
    status: "confirmado",
    notificacaoStatus: "nao_enviada",
    criadoEm: new Date().toISOString()
  };

  pedidos.push(novoPedido);
  return novoPedido;
}

export function listarPedidos(): Pedido[] {
  return pedidos;
}

export function buscarPedidoPorId(id: number): Pedido | undefined {
  return pedidos.find((pedido) => pedido.id === id);
}
