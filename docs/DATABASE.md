# Banco de dados

## Tabela guests

| Coluna | Tipo | Regra |
|---|---|---|
| `id` | text | chave primária; identificador do cookie |
| `name` | text | nome exibido |
| `photo_count` | integer | contador oficial |
| `created_at` | text | data de criação |

## Tabela photos

| Coluna | Tipo | Regra |
|---|---|---|
| `id` | text | UUID da foto |
| `guest_id` | text | referência lógica ao convidado |
| `guest_name` | text | nome preservado no momento do envio |
| `object_key` | text | caminho do arquivo no R2 |
| `thumbnail_object_key` | text | caminho da miniatura no R2; nulo em fotos antigas |
| `content_type` | text | tipo MIME |
| `hidden` | integer | 0 para visível; 1 para oculta |
| `hidden_at` | text | data da ocultação, quando aplicável |
| `created_at` | text | data do registro |

## Armazenamento R2

Os objetos seguem o padrão:

```text
event/photos/{uuid}.{extensao}
event/thumbnails/{uuid}.{extensao}
```

O banco guarda apenas a chave, nunca o conteúdo binário.
