
export interface UpdateBundleApplicationResponseDTO {
    bundleId:string
    name: string,
    description: string,
    caducityDate: Date,
    stock: number
    images:string[]
    price:number
    currency:string
    weigth:number
    measurement:string
    productId:string[]
}