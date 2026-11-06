# Projeto Integrador — Sistema Distribuído de Pedidos (Parte 1)

## Requisitos
- Node.js 18 ou superior
- npm

## Estrutura
```text
projeto-webservices-parte-2/
├── catalogo-service/       # Parte 1 + resposta de reserva com precoUnitario
├── pedidos-service/        # Parte 2 implementada
└── notificacoes-service/   # estrutura inicial para a Parte 3
```

## Requisitos
- Node.js 18 ou superior (usa `fetch` nativo)
- npm

## 1. Configurar os serviços
Em cada pasta (`catalogo-service` e `pedidos-service`), execute `npm install` e crie o `.env` a partir de `.env.example`.

No PowerShell:
```powershell
Copy-Item .env.example .env
```

No Git Bash/Linux/macOS:
```bash
cp .env.example .env
```

Confira:
- `catalogo-service/.env`: `PORT=3001`
- `pedidos-service/.env`: `PORT=3000` e `CATALOG_URL=http://localhost:3001`

## 2. Iniciar os dois serviços
Abra dois terminais diferentes.

Terminal 1:
```bash
cd catalogo-service
npm install
npm run dev
```

Terminal 2:
```bash
cd pedidos-service
npm install
npm run dev
```

Catálogo fica em `http://localhost:3001` e Pedidos em `http://localhost:3000`. Os dois precisam permanecer ligados ao mesmo tempo.

## 3. Endpoints

### Catálogo/Estoque
| Método | Rota | Descrição |
|---|---|---|
| GET | `/produtos` | Lista produtos |
| GET | `/produtos/:id` | Busca produto |
| POST | `/produtos` | Cadastra produto |
| POST | `/produtos/:id/reservas` | Reserva estoque e devolve preço unitário |

Exemplo de reserva:
`POST http://localhost:3001/produtos/1/reservas`
```json
{ "quantidade": 2 }
```

Resposta 200:
```json
{
  "produtoId": 1,
  "reservado": 2,
  "precoUnitario": 50,
  "estoqueRestante": 6
}
```

### Pedidos
| Método | Rota | Descrição |
|---|---|---|
| POST | `/pedidos` | Cria pedido após reservar estoque |
| GET | `/pedidos` | Lista pedidos criados |
| GET | `/pedidos/:id` | Busca pedido por ID |

Exemplo:
`POST http://localhost:3000/pedidos`
```json
{
  "produtoId": 1,
  "quantidade": 2,
  "clienteEmail": "aluno@estudante.ifms.edu.br"
}
```

O cliente não envia preço nem total. Pedidos usa `precoUnitario` devolvido pelo Catálogo e calcula `total = precoUnitario * quantidade`.

## 4. Testes no Thunder Client
Execute nesta ordem:

1. `GET http://localhost:3001/produtos` — esperado 200.
2. `POST http://localhost:3001/produtos/1/reservas` com `{"quantidade":2}` — esperado 200 e deve conter `precoUnitario`.
3. `POST http://localhost:3000/pedidos` com o JSON válido acima — esperado 201.
4. `GET http://localhost:3000/pedidos` — deve listar o pedido.
5. `GET http://localhost:3000/pedidos/1` — deve retornar o pedido.
6. Remova `clienteEmail` do body — esperado 400.
7. Use `quantidade: 0` — esperado 400.
8. Use `produtoId: 999` — esperado 404.
9. Solicite quantidade maior que o estoque disponível — esperado 409.
10. Desligue Catálogo e tente criar um pedido — esperado 502.
11. Depois dos erros, consulte `GET /pedidos`: nenhum pedido inválido deve ter sido salvo.

**Atenção:** cada reserva bem-sucedida reduz o estoque. Como os dados ficam em memória, reiniciar o Catálogo restaura os produtos e quantidades iniciais.

## 5. Organização do código
- `clients/catalogo.client.ts`: chamada HTTP e tradução dos erros do Catálogo.
- `services/pedidos.service.ts`: validação, reserva, cálculo e criação do pedido.
- `controllers/pedidos.controller.ts`: recebe a requisição e envia a resposta.
- `routes/pedidos.routes.ts`: registra as rotas.
- `data/pedidos.ts`: coleção local de pedidos.
- `server.ts`: configura e inicia o Express.

## 6. Regras atendidas
- Catálogo é dono de produtos, preços e estoque.
- Pedidos não acessa os dados internos do Catálogo.
- O pedido só é inserido no array após a reserva confirmada.
- 400, 404 e 409 são tratados conforme o resultado da integração.
- Falha de conexão ou resposta 5xx do Catálogo vira 502.
- `.env` e `node_modules` não devem ser enviados ao Git.

## Commit sugerido
```bash
git add .
git commit -m "Parte 2 - integração de Pedidos com Catálogo"
```

## Observações
- Os dados ficam em memória: reiniciar o serviço restaura os produtos iniciais.
- O formato de produto adotado nesta implementação é `id`, `nome`, `preco` e `estoque`, pois a aula define os comportamentos dos endpoints, mas não fixa todos os campos do cadastro.
- Não envie `node_modules`  e nem arquivos `.env` reais ao Git. Os arquivos `.env.example` podem ser versionados.

# Projeto Integrador — Web Services (Parte 2)

Implementação da Parte 2: o serviço **Pedidos** chama o serviço **Catálogo/Estoque** por HTTP. O pedido só é registrado depois que a reserva de estoque é confirmada.