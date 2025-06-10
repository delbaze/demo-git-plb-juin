import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { makeExecutableSchema } from "graphql-tools";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

const server = new ApolloServer({
//   typeDefs,
//   resolvers,
  schema: makeExecutableSchema({typeDefs, resolvers}),
  formatError(formattedError, error) {
    return formattedError
  },
});

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

main();
