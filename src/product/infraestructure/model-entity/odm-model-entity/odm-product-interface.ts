
export interface IOdmProduct {
  id: string;
  name: string;
  description: string;
  image: string[];
  caducityDate?: Date;
  stock: number;
  price: number;
  currency: string;
  weigth: number;
  measurament: string;
  category: {
    id:string
    name:string
  }[];
}