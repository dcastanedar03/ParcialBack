import {ObjectId, type OptionnalId} from "mongodb";

export type BookModel = OptionnalId<{
    titulo : string;
    autores: ObjectId[];
    copiasDisponibles: number;
}>;

export type AutorModel = OptionnalId<{
    name : string;
    biografia: string;
}>;

export type Book ={
    id: string;
    titulo : string;
    autores: Autor[];
    copiasDisponibles: number;
};

export type Autor ={
    id : string;
    name : string;
    biografia: string;
};



