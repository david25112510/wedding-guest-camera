# Personalização

## Dados do evento

Altere `lib/event-config.ts`. O arquivo controla nomes, iniciais, data e limite.

## Identidade visual

O acabamento visual está dividido entre:

- `app/globals.css`: estrutura e estilos-base;
- `app/luxury-mural.css`: tema All Black, dourado, monograma e profundidade;
- `app/mural-interactions.css`: animações, lightbox e estados do mural.

## Textos

Os textos da recepção, câmera e galeria ficam em `app/page.tsx`.

## Monograma

O logo principal atual é `public/monogram-la-3d.png`. Ao reutilizar:

1. substitua o arquivo por outro com o mesmo nome ou ajuste o caminho;
2. atualize o texto alternativo no componente `Monogram`;
3. mantenha proporções semelhantes para preservar a moldura;
4. confira contraste e legibilidade em telas pequenas.

## Quantidade de fotos

Mude `maximumPhotosPerGuest`. O mesmo valor alimenta a interface e a validação da API.

## Reutilização para outros eventos

1. duplique o repositório;
2. troque a configuração;
3. substitua o monograma;
4. ajuste paleta, textos e data;
5. crie um D1 e um R2 exclusivos para o evento;
6. aplique as migrações;
7. publique em uma URL nova;
8. teste câmera, galeria e limite em Android e iPhone;
9. gere o QR Code da URL definitiva.

Não reutilize o mesmo D1 ou bucket entre eventos, salvo quando houver separação de dados e política de retenção implementadas.
