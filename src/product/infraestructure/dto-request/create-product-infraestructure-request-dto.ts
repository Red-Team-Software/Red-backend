export interface CreateProductInfraestructureRequestDTO{
    name: string,
    desciption: string,
    caducityDate: Date,
    stock: number
    images:string[]
}