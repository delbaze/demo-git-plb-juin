import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import path from "path";


const typesArray = loadFilesSync(path.join(__dirname, "."), {
    extensions: ["gql"],
    recursive: true
})


export default mergeTypeDefs(typesArray); // créé un gros typedefs qui réunira tous les fichiers gql