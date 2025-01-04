export interface IBundle{
    id:string,
    name: string,
    desciption: string,
    caducityDate?: Date,
    stock: number
    price:number
    currency:string
    weigth:number
    measurament:string
    idProducts?:string[]
}