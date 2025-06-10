let authors = [
  {
    id: "A1",
    name: "Kate Chopin",
    nationality: "Américain",
    birthYear: 1850
  },
  {
    id: "A2",
    name: "Paul Auster",
    nationality: "Américain",
    birthYear: 1947
  },
  {
    id: "A3",
    name: "Super mangaka",
    nationality: "Japonais",
    birthYear: 1980
  }
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
    }
  },
  Mutation: {
    addAuthor: (_: any, args: any) => {
      const newAuthor = {
        id: `A${Date.now()}`, // Génération simple d'un ID
        name: args.name,
        nationality: args.nationality,
        birthYear: args.birthYear
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
        birthYear: args.birthYear !== undefined ? args.birthYear : authors[authorIndex].birthYear
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
        message: "L'auteur a bien été supprimé"
      };
    }
  }
};