import fetch from "cross-fetch";
export default {
  Query: {
    users: async () => {
      // ici je vais faire ma requête vers l'API rest, et je retournerai le résultat
      const result = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await result.json();
      return data;
    },
    findUserById: async (_: any, args: any) => {
      const id = args.id;
      const result = await fetch(
        "https://jsonplaceholder.typicode.com/users/" + id
      );
      const data = await result.json();
      if (Object.keys(data).length == 0) {
        throw new Error("Cet utilisateur n'existe pas");
      }
      return data;
    },
  },
};
