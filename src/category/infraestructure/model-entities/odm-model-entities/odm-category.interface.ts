export interface IOdmCategory {
    id: string;
    name: string;
    image: string; 
    products?: {
      id:string
      name:string
    }[];
    bundles?: {
      id:string
      name:string
    }[];
}