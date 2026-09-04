# Segurança e privacidade

## Dados tratados

O sistema armazena nome informado, identificador anônimo do navegador, horário e fotografias. Dependendo do conteúdo, as imagens podem envolver dados pessoais.

## Recomendações para produção

- apresente aviso de consentimento antes da primeira captura ou importação;
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

## Consentimento e direito de imagem

O aceite salvo no aparelho melhora a transparência e evita repetição desnecessária. O responsável pelo evento ainda deve definir finalidade, público autorizado, prazo de retenção e canal para remoção. Imagens de crianças devem ser compartilhadas somente com autorização do responsável.

## Upload pela galeria

Fotos escolhidas da galeria passam pelas mesmas verificações da câmera: tipos JPEG, PNG ou WebP, limite de 12 MB e validação da assinatura binária. O nome e a extensão enviados pelo aparelho não são considerados suficientes para validar o conteúdo.

## Relato de vulnerabilidade

Não publique vulnerabilidades em issues abertas. Entre em contato diretamente com o mantenedor do projeto.
