import {MongoClient, Collection} from "mongodb";
import { BookModel, AutorModel, Book, Autor } from "./types.ts"
import { fromModelToBook } from "./utils.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
if(!MONGO_URL){
    console.error("error");
    Deno.exit(1);
}
const client = new MongoClient(MONGO_URL);
await client.connect();
console.info("conectado");
const db = client.db("biblioteca");

const bookCollection = db.collection<BookModel>("books");
const autorCollection = db.collection<AutorModel>("autores");

const handler = async (req: Request): Promise<Response>=>{
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;
    
    if (method ==="POST"){
        if (path === "/libro"){
            const book = await req.json();
            if(!book.titulo || !book.autores){
                return new Response("error: El título y los autores son campos requeridos.", {status: 400});
            }
            const autordb = await autorCollection.findOne({name: book.autores})

        if (!autordb){
            return new Response ("error: Autor no existe", {status: 400})
        }
        const {insertId} = await bookCollection.inertOne({
            titulo : book.titulo,
            autores: book.autores,
            copiasDisponibles: book.copiasDisponibles,
        });
        return new Response(
            JSON.stringify({
                titulo : book.titulo,
                autores: book.autores,
                copiasDisponibles: book.copiasDisponibles,
                id: insertId,
            }), {status: 201}
        )

        }
    }
    if (method ==="GET"){
        if (path === "/libros"){
            const titulo = url.searchParams.get("titulo");
            if (titulo){
                const bookDB = await bookCollection.find({titulo}).toArray();
                if(!bookDB){
                    return new Response("error: No se encontraron libros con ese título.", {status: 404});
                }
                const libros = await Promise.all(
                    bookDB.map((b)=>fromModelToBook(b,autorCollection))
                )
                return new Response(JSON.stringify(libros))
            }
            else {
                const bookDB = await bookCollection.find({}).toArray();
                const libros = await Promise.all(
                    bookDB.map((b)=>fromModelToBook(b,autorCollection))
                )
                return new Response(JSON.stringify(libros))
            }

        }
        if (path === "/libros"){
            const id = url.searchParams.get("id");
            if (id){
                const bookDB = await bookCollection.findOne({id}).toArray();
                if(!bookDB){
                    return new Response("error: Libro no encontrado.", {status: 404});
                }
                const libros = await Promise.all(
                    bookDB.map((b)=>fromModelToBook(b,autorCollection))
                )
                return new Response(JSON.stringify(libros))
            }
            else {
                const bookDB = await bookCollection.find({}).toArray();
                const libros = await Promise.all(
                    bookDB.map((b)=>fromModelToBook(b,autorCollection))
                )
                return new Response(JSON.stringify(libros))
            }

        }
    }
    if (method ==="POST"){
        if (path === "/autor"){
            const autor = await req.json();
            if(!autor.nombre || !autor.biografia){
                return new Response("error: El nombre del autor y la biografía son campos requeridos.", {status: 400});
            }
            const autordb = await autorCollection.findOne({id: autor._id})

        if (!autordb){
            return new Response ("error: Autor ya existe", {status: 400})
        }
        const {insertId} = await autorCollection.inertOne({
            nombre : autor.titulo,
            biografia: autor.autores,
        
        });
        return new Response(
            JSON.stringify({
                nombre : autor.titulo,
                biografia: autor.autores,
                id: insertId,
            }), {status: 201}
        )

        }
    }

    return new Response("error", {status: 400})
};
Deno.serve({port: 3001},handler);

