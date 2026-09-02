# Wedding Guest Camera

Uma câmera descartável digital para casamentos e eventos. O convidado lê um QR Code, informa seu nome, abre a câmera do celular e registra até 24 fotos. Cada imagem é enviada automaticamente e passa a fazer parte de uma galeria coletiva.

O projeto original foi criado para o casamento de **Lidieyne & Alexandre**, em **19.09.2026**, mas sua configuração foi centralizada para permitir adaptação rápida a outros eventos.

## Experiência do convidado

1. Escaneia o QR Code do evento.
2. Informa o nome pelo qual deseja ser identificado.
3. Autoriza o navegador a acessar a câmera.
4. Tira uma foto sem sair da experiência.
5. A foto é enviada automaticamente.
6. O contador é reduzido de 24 para 23 e assim por diante.
7. A imagem aparece na galeria coletiva.

> Navegadores móveis exigem autorização do usuário para acessar a câmera. Por isso, o QR Code abre diretamente a tela de entrada, mas a primeira captura ainda depende da permissão padrão do celular.

## Principais recursos

- interface mobile-first;
- câmera traseira sugerida automaticamente;
- limite configurável de fotos;
- contador persistente no servidor;
- armazenamento de imagens no Cloudflare R2;
- metadados no Cloudflare D1;
- galeria coletiva em formato editorial;
- atualização automática a cada 10 segundos;
- identificação do autor de cada foto;
- validação de formato e tamanho;
- design e dados do evento centralizados;
- implantação compatível com Cloudflare Workers.

## Tecnologias

- Next.js 16;
- React 19;
- TypeScript;
- Vinext e Vite;
- Tailwind CSS;
- Drizzle ORM;
- Cloudflare Workers;
- Cloudflare D1;
- Cloudflare R2;
- Lucide React.

## Início rápido

```bash
git clone URL_DO_REPOSITORIO
cd wedding-guest-camera
npm run install:ci
npm run db:generate
npm run dev
```

Requer Node.js 22.13 ou superior.

## Personalização

Edite `lib/event-config.ts`:

```ts
export const eventConfig = {
  couple: {
    firstName: "Lidieyne",
    secondName: "Alexandre",
    initials: ["L", "A"],
  },
  date: "19.09.2026",
  maximumPhotosPerGuest: 24,
};
```

Para alterar cores, fontes, molduras e acabamento visual, edite `app/globals.css`.

## Estrutura principal

```text
app/
  api/photos/          upload, listagem e entrega das imagens
  globals.css          identidade visual e responsividade
  layout.tsx           metadados do site
  page.tsx             experiência do convidado e galeria
db/
  index.ts             conexão com D1
  schema.ts            tabelas guests e photos
drizzle/               migrações SQL
lib/
  event-config.ts      configuração reutilizável do evento
docs/                  documentação técnica
```

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [Instalação e implantação](docs/SETUP.md)
- [API](docs/API.md)
- [Banco de dados](docs/DATABASE.md)
- [Personalização](docs/CUSTOMIZATION.md)
- [Segurança e privacidade](SECURITY.md)
- [Como contribuir](CONTRIBUTING.md)

## Limite de 24 fotos

O servidor atribui ao navegador um identificador em cookie e registra a quantidade enviada no banco. Esse modelo é simples para convidados e evita que atualizar ou fechar a página reinicie o contador.

O limite atual é por navegador/dispositivo. Para impedir que alguém apague cookies ou troque de aparelho, implemente códigos individuais de convite, autenticação ou tokens únicos no QR Code.

## Licença

Distribuído sob a licença MIT. Consulte [LICENSE](LICENSE).
