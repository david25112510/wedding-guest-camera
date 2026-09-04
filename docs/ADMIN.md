# Painel administrativo

## Acesso

Abra `/admin` no endereço publicado. O painel solicita o login do ChatGPT e libera o acesso somente quando o e-mail autenticado coincide com a variável de produção `ADMIN_EMAIL`.

Não armazene o e-mail administrativo, senhas ou tokens no repositório.

## Recursos

- total de fotos;
- fotos visíveis e ocultas;
- total de convidados identificados;
- busca por nome;
- filtro por situação;
- visualização ampliada;
- ocultar e restaurar;
- exclusão definitiva com confirmação.

## Comportamento das ações

**Ocultar:** remove imediatamente a foto do mural e bloqueia sua entrega pela rota pública. O arquivo permanece no R2 e pode ser restaurado.

**Restaurar:** devolve a foto ao mural coletivo.

**Excluir:** remove o registro do D1, solicita a remoção do objeto no R2 e devolve uma unidade ao saldo do convidado. A ação não pode ser desfeita.

## Configuração

Defina `ADMIN_EMAIL` como variável protegida no ambiente de hospedagem. Depois de alterá-la, publique novamente uma versão para aplicar a nova configuração.

## Segurança operacional

- não compartilhe a sessão administrativa;
- saia do painel em equipamentos de terceiros;
- revise as fotos antes de liberar o site ao público;
- prefira ocultar quando houver dúvida;
- use exclusão apenas para conteúdo inadequado ou a pedido do titular.
