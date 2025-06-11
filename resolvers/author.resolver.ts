export let authors = [
  {
    id: "A1",
    name: "Kate Chopin",
    nationality: "Américain",
    birthYear: 1850,
    novels: ["The Awakening"], // Champ pour Novelist
  },
  {
    id: "A2",
    name: "Paul Auster",
    nationality: "Américain",
    birthYear: 1947,
    novels: ["City of Glass"], // Champ pour Novelist*
  },
  {
    id: "A3",
    name: "Super mangaka",
    nationality: "Japonais",
    birthYear: 1980,
    mangas: ["Mon Manga"], // Champ pour Mangaka
  },
];

export default {
  Query: {
    authors: () => authors,
    findAuthorById: (_: any, args: any) => {
      const author = authors.find((a) => a.id === args.id);
      if (!author) {
        throw new Error("L'auteur n'existe pas");
      }
      return author;
    },
    findNovelistById: (_: any, args: any, ctx: any) => {
      console.log("ctx", ctx);
      if (!ctx.user) {
        throw new Error("Vous devez être authentifié");
      }
      const author = authors.find((a) => a.id === args.id);
      if (!author) {
        throw new Error("L'auteur n'existe pas");
      }
      if (!author.novels) {
        throw new Error("L'auteur n'est pas un romancier");
      }
      return author;
    },
    findMangakaById: (_: any, args: any) => {
      const author = authors.find((a) => a.id === args.id);
      if (!author) {
        throw new Error("L'auteur n'existe pas");
      }
      if (!author.mangas) {
        throw new Error("L'auteur n'est pas un mangaka");
      }
      return author;
    },
  },
  Mutation: {
    addAuthor: (_: any, { data }: any) => {
      const newAuthor = {
        id: `A${Date.now()}`, // Génération simple d'un ID
        name: data.name,
        nationality: data.nationality,
        birthYear: data.birthYear,
        ...(data.isMangaka
          ? { mangas: ["Nouveau Manga"] }
          : { novels: ["Nouveau Roman"] }),
      };
      authors.push(newAuthor);
      return newAuthor;
    },
    updateAuthor: (_: any, args: any) => {
      const authorIndex = authors.findIndex((a) => a.id === args.id);
      if (authorIndex === -1) {
        throw new Error("L'auteur n'existe pas");
      }
      const updatedAuthor = {
        ...authors[authorIndex],
        name: args.name || authors[authorIndex].name, // Garde l'existant si non fourni
        nationality: args.nationality || authors[authorIndex].nationality,
        birthYear:
          args.birthYear !== undefined
            ? args.birthYear
            : authors[authorIndex].birthYear,
      };
      authors[authorIndex] = updatedAuthor;
      return updatedAuthor;
    },
    deleteAuthorById: (_: any, args: any) => {
      const author = authors.find((a) => a.id === args.id);
      if (!author) {
        throw new Error("L'auteur n'existe pas");
      }
      authors = authors.filter((a) => a.id !== args.id);
      return {
        message: "L'auteur a bien été supprimé",
      };
    },
  },
  AnyAuthor: {
    __resolveType(obj: any) {
      if (obj.novels) {
        return "Novelist";
      }
      if (obj.mangas) {
        return "Mangaka";
      }
      throw new Error("Impossible de résoudre le type pour cet auteur");
    },
  },
};
