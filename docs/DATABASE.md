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
| `content_type` | text | tipo MIME |
| `created_at` | text | data do registro |

## Armazenamento R2

Os objetos seguem o padrão:

```text
event/photos/{uuid}.{extensao}
```

O banco guarda apenas a chave, nunca o conteúdo binário.
