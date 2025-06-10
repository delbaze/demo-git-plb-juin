let books = [
  {
    id: 1,
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    id: 2,
    title: "City of Glass",
    author: "Paul Auster",
  },
  {
    title: "Mon Manga",
    author: "Super mangaka"
  }
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
        if (obj.id){
            return 'TextBook';
        }

        return 'MangaBook';
    }
  }
};
