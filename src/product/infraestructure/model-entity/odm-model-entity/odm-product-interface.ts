import { IOdmCategory } from "src/category/infraestructure/model-entities/odm-model-entities/odm-category.interface";

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
  category?: IOdmCategory[];
}