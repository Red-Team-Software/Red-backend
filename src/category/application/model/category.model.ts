export interface ICategory{
    id:string
    name: string;
    image: string; // Opcional para manejar categorías sin imagen
    products: {
        id:string
        name:string,
        description :string,
        price :number,
        images:string[]
    }[] 
}