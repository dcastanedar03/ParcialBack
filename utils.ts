import { BookModel, AutorModel, Book, Autor } from "./types.ts"
import type {Collection} from "mongodb";


export const fromModelToBook = async (
    bookDB: BookModel,
    autorCollection: Collection<AutorModel>
)
: Promise<Book>=>{
    const autores = await autorCollection.find({_id:{ $in: bookDB.autores }}).toArray();
    return { 
            id: bookDB._id.toString(),
            titulo: bookDB.titulo,
            autores: autores.map((a)=>fromModelToAutor(a)),
            copiasDisponibles:bookDB.copiasDisponibles

    };
};

export const fromModelToAutor = (model: AutorModel): Autor=> ({

            id: model._id.toString(),
            name: model.titulo,
            biografia: model.biografi

}); 