export interface IOdmCourierInterface {
    id: string;
    name: string;
    image: IOdmCourierImage
    email: string;
    password: string;
}

export interface IOdmCourierImage{
    id:string,
    image:string
}