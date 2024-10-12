import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Professions API",
      version: "1.0.0",
      description: "API для пошуку професій та їх коду",
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
        // Схема для пошуку професій
        ProfessionSearchRequest: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Пошуковий запит по назві або коду професії",
              example: "інженер",
            },
          },
          required: ["query"],
        },
        Profession: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Унікальний ідентифікатор професії",
              example: 1,
            },
            code_kp: {
              type: "string",
              description: "Код класифікації професії",
              example: "1234",
            },
            name: {
              type: "string",
              description: "Назва професії",
              example: "Інженер",
            },
          },
        },
      },
      responses: {
        ProfessionNotFound: {
          description: "Професію не знайдено",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Професію не знайдено",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
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
