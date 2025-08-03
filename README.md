# FTA Notepad

The official FTA notepad tool, for collaboration on the field between FTAs, FTAAs, and CSAs.

## Prerequisites

* A node environment, version 20.15.
    * Windows: https://github.com/coreybutler/nvm-windows
    * Mac/Linux: https://github.com/nvm-sh/nvm
* Your favorite editor. These instructions will assume vscode.
    * We include a set of recommended extensions for working with Svelte and ViTest on VSCode.

## Building

* Open the folder in VS Code
* Open a Javascript Debug Console (`Ctrl-Shft-p`, search for `Javascript Debug Console`)
* Run `cd ui`
* Run `npm i`
* Run `npm run dev`
    * This will start the app in debug mode. You can see the url it starts on in the log, should be `http://localhost:5173/`

At this point, the app should be running and doing live reloading. Changes to the code are usually automatically picked up on refresh, and setting breakpoints should work.

## FMS Configuration
You'll want an FMS build that allows CORS requests from `http://localhost:5173` to allow your local development version of FTA Notepad to talk to FMS APIs.

You'll also need to manually create an entry in the FMS database for an API key to use - the off-season FMS builds will not have any API keys configured out of the box.

If you have a Apple Silicon mac, see [these instructions](docs/Apple_Silicon_Dev_Setup.md).

To create a token for development, see [the instructions to use SSMS to create a token](docs/Creating_FTA_Token.md)

## Contributing

We enforce prettier on CI. To run locally, you can use `npx prettier --write .` in the `ui` folder, which will reformat your code to match our `.prettierrc`. General work should
be against the `dev` branch; we use `main` for active release and hotfixing.
