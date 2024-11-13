import { AMQPExchange } from "./amqp-exchange"

export interface AMQPQueue {
    name: string
    pattern?: string
    exchange?: AMQPExchange
}