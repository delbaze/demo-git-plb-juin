import DataLoader from "dataloader";
import { authors } from "../resolvers/author.resolver";

export const authorLoader = new DataLoader<string, any>(
  async (authorIds) => {
    console.log(
      "Dataloader: Batch loader pour auteurs sur les IDS:",
      authorIds
    );
    // en vrai : SELECT * FROM authors WHERE id IN ("A1", "A2", "A3")

    const results = authorIds.map((id) => {
      const author = authors.find((a) => a.id == id);
      console.log("Auteur trouvé : ", author);

      return author || null;
    });

    return results;
  },
  {
    cacheKeyFn: (key) => key.toString(),
    maxBatchSize: 10,
    cache: true,
  }
);
