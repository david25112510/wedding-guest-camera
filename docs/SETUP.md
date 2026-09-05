# Instalação e implantação

## Pré-requisitos

- Node.js 22.13 ou superior;
- npm;
- conta Cloudflare;
- banco Cloudflare D1;
- bucket Cloudflare R2;
- HTTPS em produção, obrigatório para uma boa experiência de câmera.
- bindings de produção chamados exatamente `DB` e `BUCKET`.

## Instalação

```bash
npm install
npm run db:generate
npm run dev
```

Em ambientes de integração contínua com `package-lock.json`, prefira `npm ci`.

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

O projeto inclui duas versões do QR Code definitivo em `public/`:

- `qr-code-casamento.png`: arquivo de alta resolução para impressão e compartilhamento;
- `qr-code-casamento.svg`: arquivo vetorial para materiais gráficos.

Os dois arquivos apontam diretamente para:

```text
https://wedding-guest-camera.davibh16.chatgpt.site
```

Depois da publicação pública:

1. teste o QR Code em Android e iPhone;
2. confirme câmera, importação da galeria, upload, contador e mural;
3. imprima o QR Code com a URL legível como alternativa;
4. preserve a margem branca ao redor do código na arte final.

## Lista de testes antes do evento

- conexão Wi-Fi/4G no local;
- permissão da câmera;
- fotos em retrato e paisagem;
- importação de JPEG, PNG e WebP;
- comportamento de arquivos HEIC/HEIF;
- limite de 24 capturas;
- limite compartilhado entre câmera e galeria;
- consentimento exibido apenas antes do primeiro aceite;
- recarga e reabertura da página;
- galeria em dois celulares;
- espaço disponível no bucket;
- política de consentimento visível aos convidados.
