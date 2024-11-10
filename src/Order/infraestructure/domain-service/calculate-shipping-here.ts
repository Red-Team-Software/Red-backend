import { ICalculateShippingFee } from "src/Order/domain/domain-services/calculate-shippping-fee.interfafe";
import { HereMapsSingelton } from "src/payments/infraestructure/here-maps-singleton";


export class CalculateShippingHereMaps  {
    private hereMap: HereMapsSingelton;


    constructor(
        hereMap: HereMapsSingelton
    ){
        this.hereMap = hereMap;
    }
    
    
    async calculateShippingFee( origin: string, destination: string) {
        const url = `https://router.hereapi.com/v8/routes?origin=${origin}&destination=${destination}&return=summary&transportMode=car&apiKey=${this.hereMap}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${errorData.message}`);
        }
        const data = await response.json();
        const distance = data.routes[0].sections[0].summary.length;
        console.log(`La distancia entre ${origin} y ${destination} es de ${distance} metros.`);
    } catch (error) {
        console.error('Error al calcular la distancia:', error);
    }
    }
}