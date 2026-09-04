# Wedding Guest Camera

Plataforma colaborativa de fotografias para casamentos e eventos. O convidado acessa pelo QR Code, informa seu nome e registra até **24 momentos** usando a câmera ou escolhendo imagens da própria galeria. Cada arquivo validado é enviado automaticamente e aparece no mural coletivo.

O projeto foi criado para o casamento de **Lidieyne & Alexandre**, em **19.09.2026**, com identidade **All Black**, acabamento dourado e monograma tridimensional. Sua configuração centralizada permite reutilizá-lo em outros eventos.

## Experiência do convidado

1. Escaneia o QR Code e acessa o endereço HTTPS.
2. Informa o nome que será exibido no mural.
3. Confirma uma vez o aviso de privacidade.
4. Escolhe entre **Abrir câmera** e **Escolher da galeria**.
5. A foto é validada, armazenada e publicada no mural.
6. O saldo individual diminui até o limite de 24 fotos.

> O QR Code abre o site, mas os navegadores móveis exigem uma ação do usuário para abrir a câmera ou a galeria. Essa é uma proteção do Android e do iPhone.

## Recursos

- experiência responsiva e mobile-first;
- captura pela câmera traseira em dispositivos compatíveis;
- importação de JPEG, PNG e WebP da galeria;
- limite configurável e controlado no servidor;
- consentimento discreto salvo uma vez no aparelho;
- armazenamento privado de imagens no Cloudflare R2;
- convidados e metadados no Cloudflare D1;
- mural editorial com atualização automática;
- indicação do autor e visualização ampliada;
- validação de MIME, assinatura e tamanho do arquivo;
- compensação do contador quando o armazenamento falha;
- tema All Black com monograma 3D;
- execução compatível com Cloudflare Workers.

## Tecnologias

- Next.js 16 e React 19;
- TypeScript;
- Vinext, Vite e Tailwind CSS;
- Drizzle ORM;
- Cloudflare Workers, D1 e R2;
- Lucide React.

## Início rápido

~~~bash
git clone https://github.com/david25112510/wedding-guest-camera.git
cd wedding-guest-camera
npm install
npm run db:generate
npm run dev
~~~

Requer Node.js **22.13 ou superior**.

## Configuração do evento

Edite **lib/event-config.ts**:

~~~ts
export const eventConfig = {
  couple: {
    firstName: "Lidieyne",
    secondName: "Alexandre",
    initials: ["L", "A"],
  },
  date: "19.09.2026",
  maximumPhotosPerGuest: 24,
};
~~~

O monograma principal está em **public/monogram-la-3d.png**. Para outro evento, substitua o arquivo e atualize seu texto alternativo em **app/page.tsx**.

## Estrutura

~~~text
app/
  api/photos/          upload, listagem e entrega das imagens
  globals.css          estilos-base e responsividade
  luxury-mural.css     identidade All Black e acabamento dourado
  mural-interactions.css
  layout.tsx
  page.tsx
db/
  index.ts
  schema.ts
drizzle/               migrações SQL
lib/
  event-config.ts
public/
  monogram-la-3d.png
docs/
~~~

## Documentação

- [Guia de uso](docs/USER_GUIDE.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Instalação e implantação](docs/SETUP.md)
- [API](docs/API.md)
- [Banco de dados](docs/DATABASE.md)
- [Personalização e reutilização](docs/CUSTOMIZATION.md)
- [Segurança e privacidade](SECURITY.md)
- [Histórico de mudanças](CHANGELOG.md)
- [Como contribuir](CONTRIBUTING.md)

## Limites conhecidos

- o limite é associado ao cookie do navegador/dispositivo;
- apagar cookies ou usar outro navegador cria uma nova identificação;
- HEIC/HEIF não é aceito diretamente nesta versão;
- não há painel administrativo ou moderação;
- a listagem retorna até 1.200 fotos recentes.

Para controle rígido por pessoa, use tokens únicos por convite ou QR Codes individuais.

## Licença

Distribuído sob a licença MIT. Consulte [LICENSE](LICENSE).
