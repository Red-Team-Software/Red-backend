export interface PushNotifierRequestDto {
    token: string
    notification: { 
        title: string 
        body: string
        icon?: string
    }
    data?:{
        route:string
    }
}