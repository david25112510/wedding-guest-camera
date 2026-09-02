# Segurança e privacidade

## Dados tratados

O sistema armazena nome informado, identificador anônimo do navegador, horário e fotografias. Dependendo do conteúdo, as imagens podem envolver dados pessoais.

## Recomendações para produção

- apresente aviso de consentimento antes da captura;
- explique quem pode visualizar as fotos;
- defina prazo de retenção;
- disponibilize um canal para solicitar exclusão;
- limite tipos e tamanhos de arquivo;
- aplique rate limiting;
- crie moderação administrativa;
- mantenha o bucket privado;
- entregue imagens somente pela aplicação;
- registre incidentes sem gravar conteúdo sensível.

## Modelo de limite

O limite por cookie reduz abuso casual, mas não é uma barreira de segurança forte. Quem apagar cookies ou trocar de navegador pode receber um novo identificador. Para controle por pessoa, use tokens únicos associados aos convites.

## Relato de vulnerabilidade

Não publique vulnerabilidades em issues abertas. Entre em contato diretamente com o mantenedor do projeto.
