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
* Run `npm i --force`
* Run `npm run dev`
    * This will start the app in debug mode. You can see the url it starts on in the log, should be `http://localhost:5173/`

At this point, the app should be running and doing live reloading. Changes to the code are usually automatically picked up on refresh, and setting breakpoints should work.

## Contributing

We enforce prettier on CI. To run locally, you can use `npx prettier --write .` in the `ui` folder, which will reformat your code to match our `.prettierrc`. General work should
be against the `dev` branch; we use `main` for active release and hotfixing.
