# Wedding Guest Camera

Uma câmera descartável digital para casamentos e eventos. O convidado lê um QR Code, informa seu nome, abre a câmera do celular e registra até 24 fotos. Cada imagem é enviada automaticamente e passa a fazer parte de uma galeria coletiva.

O projeto original foi criado para o casamento de **Lidieyne & Alexandre**, em **19.09.2026**, mas sua configuração foi centralizada para permitir adaptação rápida a outros eventos.

## Experiência do convidado

1. Escaneia o QR Code do evento.
2. Informa seu nome.
3. Autoriza o acesso à câmera.
4. Registra a foto.
5. A imagem é enviada automaticamente.
6. O contador é atualizado.
7. A foto aparece na galeria coletiva.

## Principais recursos

- interface mobile-first;
- câmera traseira sugerida automaticamente;
- limite configurável de fotos;
- contador persistente no servidor;
- armazenamento no Cloudflare R2;
- metadados no Cloudflare D1;
- galeria coletiva editorial;
- identificação do autor;
- validação de formato e tamanho;
- configuração centralizada do evento.

## Tecnologias

Next.js 16, React 19, TypeScript, Vinext, Vite, Tailwind CSS, Drizzle ORM, Cloudflare Workers, D1 e R2.

## Início rápido

```bash
git clone https://github.com/david25112510/wedding-guest-camera.git
cd wedding-guest-camera
npm run install:ci
npm run db:generate
npm run dev
```

Requer Node.js 22.13 ou superior.

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [Instalação e implantação](docs/SETUP.md)
- [API](docs/API.md)
- [Banco de dados](docs/DATABASE.md)
- [Personalização](docs/CUSTOMIZATION.md)
- [Segurança e privacidade](SECURITY.md)
- [Como contribuir](CONTRIBUTING.md)

## Limite de 24 fotos

O servidor atribui ao navegador um identificador em cookie e registra a quantidade enviada no banco. Para controle nominal rígido, use códigos individuais de convite, autenticação ou tokens únicos no QR Code.

## Licença

MIT.
