import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PDF Generation API",
      version: "1.0.0",
      description: "API для генерації PDF документів",
    },
    servers: [
      {
        url: "http://localhost:3345/api/professions",
        description: "Development server",
      },
      {
        url: "https://gdzapp.com/api/professions",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        PdfRequest: {
          type: "object",
          properties: {
            docName: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Назва документу (масив рядків)",
              minItems: 1,
              example: ["document1", "document2"],
            },
            landscape: {
              type: "boolean",
              description: "Чи буде PDF у ландшафтному режимі",
              example: false,
            },
            zip: {
              type: "boolean",
              description:
                "Якщо true, генерується ZIP архів з PDF, HTML та CSS",
              example: false,
            },
            html: {
              type: "string",
              description: "HTML в форматі encodeURIComponent",
              example: encodeURIComponent(
                "<html><body>Document content</body></html>"
              ),
            },
          },
          required: ["docName", "html"], // Обов'язкові поля
        },
      },
    },
  },
  apis: ["../routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app, port) => {
  app.use(
    "/api/professions/swagger-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
  console.log(
    `Swagger Docs доступні за адресою: http://localhost:${port}/api/professions/swagger-docs`
  );
};
