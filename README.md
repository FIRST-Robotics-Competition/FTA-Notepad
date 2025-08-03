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

If you have a Apple Silicon mac, see the instructions in the `docs/` folder.

To create a key:
 1. Install [Microsoft SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
 2. Open SSMS and connect to the FRCSQLEXPRESS database server
 3. Under the `FRC_Prod_{YEAR}_V1_System` database, right click the `dbo.FieldApiAuth` table and select "edit top 200 rows"
 4. Add an entry for yourself. You can use whatever username you'd like, and the authorization key can be any valid GUID string (format is `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`). Make sure to mark is as active!

## Contributing

We enforce prettier on CI. To run locally, you can use `npx prettier --write .` in the `ui` folder, which will reformat your code to match our `.prettierrc`. General work should
be against the `dev` branch; we use `main` for active release and hotfixing.
