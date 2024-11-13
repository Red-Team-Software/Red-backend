
export interface AMQPExchange {
    name: string
    type: string
    options:{
        durable:boolean
    }
    // durable: true permite que no se borre el exchange al reiniciar
    // persistence: true al publicar mensajes
}