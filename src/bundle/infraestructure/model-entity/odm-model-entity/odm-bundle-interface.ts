import { IOdmCategory } from "src/category/infraestructure/model-entities/odm-model-entities/odm-category.interface";
import { IOdmProduct } from "src/product/infraestructure/model-entity/odm-model-entity/odm-product-interface";

export interface IOdmBundle {
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
  products: {
    id:string
    name:string
  }[];}