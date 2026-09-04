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
      "url": "/api/photos/uuid",
      "thumbnailUrl": "/api/photos/uuid?variant=thumbnail"
    }
  ]
}
```

## POST /api/photos

Recebe `multipart/form-data`.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| `photo` | arquivo | sim | JPEG, PNG ou WebP de até 12 MB, vindo da câmera ou galeria |
| `thumbnail` | arquivo | sim | Miniatura otimizada, com até 2 MB e o mesmo tipo da foto |
| `guestName` | texto | sim | Nome exibido, limitado a 40 caracteres |

Resposta de sucesso:

```json
{ "remaining": 22 }
```

Erros:

- `400`: arquivo ausente, tipo não permitido, assinatura inválida ou tamanho acima de 12 MB;
- `403`: limite de fotos atingido;
- `500`: falha inesperada de armazenamento ou banco.

## GET /api/photos/:id

Entrega a imagem principal pelo identificador. Com `?variant=thumbnail`, entrega a miniatura quando disponível e usa a imagem principal como fallback para registros antigos. Objetos encontrados recebem `Content-Type`, proteção `nosniff`, exibição inline e cache privado de uma hora.

## Evoluções recomendadas

- paginação por cursor;
- rate limiting;
- código único por convite;
- processamento assíncrono de imagens.

## Observação sobre HEIC

Muitos iPhones convertem a imagem para JPEG ao compartilhar pelo navegador, mas isso não é garantido. Arquivos enviados como `image/heic` ou `image/heif` são recusados nesta versão.
