# API

## GET /api/photos

Retorna as fotos mais recentes e o saldo do convidado identificado pelo cookie.

```json
{
  "remaining": 23,
  "photos": [
    {
      "id": "uuid",
      "guestName": "Convidado",
      "createdAt": "2026-09-19 20:30:00",
      "url": "/api/photos/uuid"
    }
  ]
}
```

## POST /api/photos

Recebe `multipart/form-data`.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| `photo` | arquivo | sim | Imagem de até 12 MB |
| `guestName` | texto | sim | Nome exibido, limitado a 40 caracteres |

Resposta de sucesso:

```json
{ "remaining": 22 }
```

Erros:

- `400`: arquivo ausente, inválido ou muito grande;
- `403`: limite de fotos atingido;
- `500`: falha inesperada de armazenamento ou banco.

## GET /api/photos/:id

Entrega a imagem pelo identificador. Objetos encontrados recebem cache imutável de longo prazo.

## Evoluções recomendadas

- paginação por cursor;
- miniaturas otimizadas;
- moderação;
- exclusão administrativa;
- rate limiting;
- código único por convite;
- processamento assíncrono de imagens.
