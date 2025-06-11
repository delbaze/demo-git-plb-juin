import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import express from "express";

import { makeExecutableSchema } from "graphql-tools";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { authorLoader } from "./dataloaders/authorLoader";
import upperDirective from "./directives/upperCaseDirective";
import http from "http";

import { WebSocketServer } from "ws";
import * as  useServer from 'graphql-ws/dist/use/ws';
const app = express();
const httpServer = http.createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/",
});

let schema = makeExecutableSchema({ typeDefs, resolvers });

schema = upperDirective("upper")(schema); // ça permet de déclarer la directive upper et le code à appelé lorsqu'elle est invoquée
const serverCleanup = useServer({ schema }, wsServer);
const server = new ApolloServer({
  schema,
  formatError(formattedError, error) {
    return formattedError;
  },
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

async function main() {
  await server.start();
  app.use(
    "/",
    cors<cors.CorsRequest>({ origin: ["http://localhost:5173"] }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let user = null;
        const authorization = req.headers.authorization;
        const token = authorization?.replace("Bearer ", "");
        console.log(token);
        // jwt.verify(token, JWT_SECRET);
        // si le token est bon, on récupère le payload, on pourrait aller chercher l'utilisateur côté
        //BDD
        if (token) {
          // je simule mais il faudrait bien sûr vérifier que le token est bien valide, etc...
          user = { name: "toto", age: 14 };
        }
        return { authorLoader, user };
      },
    })
  );

  // Modified server startup

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/`);
}

main();
// import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";
// import { makeExecutableSchema } from "graphql-tools";
// import typeDefs from "./typeDefs";
// import resolvers from "./resolvers";
// import { authorLoader } from "./dataloaders/authorLoader";
// import upperDirective from "./directives/upperCaseDirective";

// let schema = makeExecutableSchema({ typeDefs, resolvers });

// schema = upperDirective("upper")(schema); // ça permet de déclarer la directive upper et le code à appelé lorsqu'elle est invoquée

// const server = new ApolloServer({
//   schema,
//   formatError(formattedError, error) {
//     return formattedError;
//   },

// });

// async function main() {

//   const { url } = await startStandaloneServer(server, {
//     listen: { port: 4000 },
//     context: async ({ req, res }) => {
//       let user = null;
//       const authorization = req.headers.authorization;
//       const token = authorization?.replace("Bearer ", "");
//       console.log(token);
//       // jwt.verify(token, JWT_SECRET);
//       // si le token est bon, on récupère le payload, on pourrait aller chercher l'utilisateur côté
//       //BDD
//       if (token) { // je simule mais il faudrait bien sûr vérifier que le token est bien valide, etc...
//         user = { name: "toto", age: 14 };
//       }

//       return { authorLoader, user };
//     },
//   });

//   console.log(`🚀  Server ready at: ${url}`);
// }

// main();
