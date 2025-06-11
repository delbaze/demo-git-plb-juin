import { authors } from "./author.resolver";
// import { authorLoader } from "../dataloaders/authorLoader";

let books = [
  {
    id: 1,
    title: "The Awakening",
    author: authors[0],
    demo: {
      name: "toto",
      age: 12,
    },
  },
  {
    id: 2,
    title: "City of Glass",
    author: authors[1],
    demo: {
      name: "tata",
      age: 12,
    },
  },
  {
    title: "Mon Manga",
    author: authors[2],
    demo: {
      name: "titi",
      age: 12,
    },
  },
];

export default {
  Query: {
    books: (_: any, args: any, ctx: any) => {
      console.log("CTX", ctx);
      return books;
    }, // équivalent à un GET Liste de livres

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

      return {
        name: (parent.demo.name as string).toUpperCase(),
        age: parent.demo.age,
      };
    },

    author: async (parent: any, args: any, ctx: any) => {
      console.log(
        "TextBook.author :  chargement de l'auteur ID " +
          parent.author.id +
          "pour le livre : " +
          parent.title
      );

      //sans le dataloader :
      // return authors.find((a) => a.id === parent.author.id);

      //avec le dataloader :
      return ctx.authorLoader.load(parent.author.id);
    },
  },
  MangaBook: {
    author: async (parent: any, args: any, ctx: any) => {
      console.log(
        "MangaBook.author :  chargement de l'auteur ID " +
          parent.author.id +
          "pour le manga : " +
          parent.title
      );

      //sans le dataloader :
      // return authors.find((a) => a.id === parent.author.id);
      console.log("TEST", await ctx.authorLoader.load(parent.author.id));
      //avec le dataloader :
      return ctx.authorLoader.load(parent.author.id);
    },
  },
};
