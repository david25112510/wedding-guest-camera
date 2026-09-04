# Histórico de mudanças

## Otimização de imagens

### Adicionado

- redimensionamento da foto principal para até 2.048 pixels;
- compressão JPEG no navegador antes do upload;
- miniatura independente de 720 pixels para o mural e painel;
- fallback para a imagem principal em registros anteriores à otimização;
- migração para armazenar a chave da miniatura no D1.

### Alterado

- mural e painel passam a carregar miniaturas nas grades;
- visualização ampliada continua usando a imagem principal;
- exclusão administrativa remove as duas versões do R2.

## Painel administrativo

### Adicionado

- rota protegida `/admin`;
- autenticação pela conta ChatGPT do proprietário;
- indicadores de fotos totais, visíveis, ocultas e convidados;
- filtro por situação e busca pelo nome do convidado;
- ampliação das imagens;
- ações para ocultar, restaurar e excluir;
- migrações para moderação e índice da galeria pública.

### Segurança

- autorização administrativa validada novamente em todas as APIs;
- fotos ocultas bloqueadas também na rota pública de arquivos;
- credencial administrativa mantida fora do repositório.

## 2026-09-04

### Adicionado

- importação de fotos pela galeria do celular;
- botão **Escolher da galeria** integrado à área da câmera;
- guia de uso para convidados e organizadores;
- documentação de formatos, consentimento e limitações de HEIC.

### Alterado

- consentimento transformado em aviso discreto e persistente no aparelho;
- documentação atualizada para o limite compartilhado entre câmera e galeria.

## 2026-09-03

### Adicionado

- identidade All Black com acabamento dourado;
- monograma tridimensional de Lidieyne e Alexandre;
- mural interativo, visualização ampliada e aviso de novas fotos;
- armazenamento em Cloudflare D1 e R2;
- validações de tipo, tamanho e assinatura dos arquivos;
- limite de 24 fotos por navegador/dispositivo.
