# payz-app

The customer-facing Payz web application and progressive web app. It provides the storefront, checkout, and purchase and delivery screens.

## Workspace dependencies

This repository is part of a multi-repository pnpm workspace. It uses these separate Payz repositories and does not vendor their source:

- `payz-core`
- `payz-sdk`
- `payz-docs`

The checkout, build, and typecheck commands below require all four repositories to be available in the same workspace. The companion repositories remain independently maintained and must be published or otherwise accessible before cloning the complete workspace.

## Local development

Use Node.js 22 or newer and pnpm 10. Clone each repository into the `repos` folder, then copy this repository's minimal workspace files to the workspace root:

```sh
mkdir -p repos
git clone https://github.com/payz-world/payz-app.git repos/payz-app
git clone https://github.com/payz-world/payz-core.git repos/payz-core
git clone https://github.com/payz-world/payz-sdk.git repos/payz-sdk
git clone https://github.com/payz-world/payz-docs.git repos/payz-docs
cp repos/payz-app/development/package.json ./package.json
cp repos/payz-app/development/pnpm-workspace.yaml ./pnpm-workspace.yaml
cp repos/payz-app/development/tsconfig.base.json ./tsconfig.base.json
pnpm install
```

The SDK and documentation repository URLs are listed for the workspace layout; cloning them requires those repositories to be publicly available.

Start the app and run its checks from the workspace root:

```sh
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

## Configuration

The client uses relative API routes. Route the Payz API under the same origin. Set `BASE_PATH` only when serving the app below a URL prefix; `PORT` selects the local Vite server port.

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE).
