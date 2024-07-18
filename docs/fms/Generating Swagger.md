# Generating FMS API Swagger

In debug builds of FMS and/or FMS Offseason, Swagger will automatically generate an OpenAPI definition of public FMS APIs for use in this app. The full Swagger UI can be found by
browsing to `<fms-url>/swagger/index.html`. A yml or json copy of the specification can be downloaded by browsing to `<fml-url>/swagger/v1/swagger.yml` or `<fms-url>/swagger/v1/swagger.json`.

To generate the FMS API in this repository, run `npx openapi-typescript .\fms-swagger.yml -o src\fms\fms-api.d.ts --enum` in the `/ui` directory after updating the `fms.yml` file.
