export interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
}

export interface Pedido {
  id: number;
  produtoId: number;
  quantidade: number;
  total: number;
  status: string;
}

export interface Notificacao {
  id: number;
  pedidoId: number;
  destino: string;
  mensagem: string;
  status: string;
}
