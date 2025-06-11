let books = [
  {
    id: 1,
    title: "The Awakening",
    author: "Kate Chopin",
    demo: {
      name: "toto",
      age: 12,
    },
  },
  {
    id: 2,
    title: "City of Glass",
    author: "Paul Auster",
    demo: {
      name: "tata",
      age: 12,
    },
  },
  {
    title: "Mon Manga",
    author: "Super mangaka",
    demo: {
      name: "titi",
      age: 12,
    },
  },
];

export default {
  Query: {
    books: () => books, // équivalent à un GET Liste de livres
    // équivalent d'un GET pour trouver 1 livre
    findBookById: (_: any, args: any) => {
      const book = books.find((b) => b.id == args.id);
      if (!book) {
        throw new Error("Le livre n'existe pas");
      }
      return book;
    },
    // équivalent d'un PATCH/PUT pour éditer un livre
  },
  Mutation: {
    deleteBookById: (_: any, args: any) => {
      const book = books.find((b) => b.id == args.id);
      if (!book) {
        throw new Error("Le livre n'existe pas");
      }
      books = books.filter((b) => b.id != args.id);
      return {
        message: "Le livre a bien été supprimé",
      };
    },
  },
  Book: {
    __resolveType(obj: any) {
      //   console.log("Obj", obj);
      if (obj.id) {
        return "TextBook";
      }

      return "MangaBook";
    },
  },
  TextBook: {
    demo: (parent: any, args: any) => {
      console.log("PARENT", parent);
      console.log("ARGS", args);

      return { name: (parent.demo.name as string).toUpperCase(), age: parent.demo.age };
    },
  },
};
