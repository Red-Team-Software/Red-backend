export interface PushNotifierDto {
    token: string
    notification: { 
        title: string 
        body: string
        icon?: string
    } 
}