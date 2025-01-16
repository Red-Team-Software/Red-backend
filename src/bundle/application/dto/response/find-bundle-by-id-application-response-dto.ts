
export interface FindBundleByIdApplicationResponseDTO {
    name: string
    description: string
    images:string []
    price: number
    currency: string 
    weight: number
    measurement: string 
    stock: number
    caducityDate?:Date
    discount:{
        id:string,
        percentage:number 
    }[]
    category: {
        id: string
        name:string
    }[]
    product:{
        id: string
        name:string
    }[]
}