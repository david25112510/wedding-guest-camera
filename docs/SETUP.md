# Instalação e implantação

## Pré-requisitos

- Node.js 22.13 ou superior;
- npm;
- conta Cloudflare;
- banco Cloudflare D1;
- bucket Cloudflare R2;
- HTTPS em produção, obrigatório para uma boa experiência de câmera.

## Instalação

```bash
npm run install:ci
npm run db:generate
npm run dev
```

## Bindings

O arquivo `.openai/hosting.json` declara:

```json
{
  "d1": "DB",
  "r2": "BUCKET"
}
```

O ambiente de produção deve expor exatamente os bindings `DB` e `BUCKET`.

## Banco

As migrações são geradas com:

```bash
npm run db:generate
```

Não altere uma migração já aplicada. Para mudanças de esquema, gere uma migração nova.

## Validação

```bash
npm run build
npm run lint
```

## QR Code

Depois da publicação pública:

1. copie a URL HTTPS definitiva;
2. gere o QR Code apontando diretamente para essa URL;
3. teste em Android e iPhone;
4. confirme câmera, upload, contador e galeria;
5. imprima o QR Code com uma URL legível como alternativa.

## Lista de testes antes do evento

- conexão Wi-Fi/4G no local;
- permissão da câmera;
- fotos em retrato e paisagem;
- arquivos HEIC/JPEG;
- limite de 24 capturas;
- recarga e reabertura da página;
- galeria em dois celulares;
- espaço disponível no bucket;
- política de consentimento visível aos convidados.
