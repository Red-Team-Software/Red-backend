export interface IProductModel{
    id:string,
    description:string,
    caducityDate?:Date,
    name:string,
    stock:number,
    images:string[],
    price:number,
    currency:string,
    weigth:number,
    measurement:string
    categories:{
        id:string
        name:string
    }[]
    promotion:{
        id:string
        name:string
        discount:number
    }[]
}