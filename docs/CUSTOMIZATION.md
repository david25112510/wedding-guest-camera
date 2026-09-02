# Personalização

## Dados do evento

Altere `lib/event-config.ts`. O arquivo controla nomes, iniciais, data e limite.

## Identidade visual

As variáveis no início de `app/globals.css` concentram as cores:

- `--ink`: textos;
- `--wine`: botões e destaques;
- `--rose`: rosa de apoio;
- `--blush`: fundo rosado;
- `--paper`: fundo marfim.

## Textos

Os textos da recepção, câmera e galeria ficam em `app/page.tsx`.

## Monograma

As iniciais vêm da configuração do evento. Para usar um logo em imagem, adicione o arquivo em `public/` e substitua o componente `Monogram` por uma imagem com texto alternativo.

## Quantidade de fotos

Mude `maximumPhotosPerGuest`. O mesmo valor alimenta a interface e a validação da API.

## Reutilização para outros eventos

1. duplique o repositório;
2. troque a configuração;
3. ajuste a paleta;
4. crie um novo banco e bucket;
5. publique em uma URL nova;
6. gere o QR Code da nova URL.
