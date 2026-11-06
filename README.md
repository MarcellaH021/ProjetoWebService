# Projeto Integrador — Sistema Distribuído de Pedidos

## Requisitos
- Node.js 18 ou superior
- npm

## Estrutura
```text
projeto-webservices-final/
├── catalogo-service/
├── pedidos-service/
├── notificacoes-service/
└── README.md
```

## Como executar o Catálogo/Estoque
Abra um terminal na pasta `catalogo-service` e execute:

```bash
npm install
cp .env.example .env
npm run dev
```

No Windows PowerShell, se `cp` não funcionar, use:
```powershell
Copy-Item .env.example .env
```

O serviço ficará disponível em `http://localhost:3001`.

## Endpoints do Catálogo
| Método | Rota | Resultado |
|---|---|---|
| GET | `/produtos` | Lista os produtos |
| GET | `/produtos/:id` | Busca um produto; 404 se não existir |
| POST | `/produtos` | Cadastra produto; 201 ou 400 |
| POST | `/produtos/:id/reservas` | Reserva estoque; 200, 400, 404 ou 409 |

### Exemplo: cadastrar produto
`POST http://localhost:3001/produtos`
```json
{
  "nome": "Teclado",
  "preco": 120.5,
  "estoque": 10
}
```

### Exemplo: reservar estoque
`POST http://localhost:3001/produtos/1/reservas`
```json
{
  "quantidade": 2
}
```

Resposta esperada:
```json
{
  "reservado": 2,
  "estoqueRestante": 6
}
```
O valor exato do estoque restante depende dos testes anteriores executados.

## Testes rápidos
Use Thunder Client, Postman ou Insomnia:
1. `GET http://localhost:3001/produtos`
2. `GET http://localhost:3001/produtos/1`
3. `POST http://localhost:3001/produtos` com os dados do exemplo.
4. `POST http://localhost:3001/produtos/1/reservas` com `{"quantidade":2}`.
5. Teste quantidade inválida (`0`) e confira status 400.
6. Teste um ID inexistente e confira status 404.
7. Solicite quantidade maior que o estoque e confira status 409.

## Observações
- Os dados ficam em memória: reiniciar o serviço restaura os produtos iniciais.
- O formato de produto adotado nesta implementação é `id`, `nome`, `preco` e `estoque`, pois a aula define os comportamentos dos endpoints, mas não fixa todos os campos do cadastro.
- Não envie `node_modules`  e nem arquivos `.env` reais ao Git. Os arquivos `.env.example` podem ser versionados.
