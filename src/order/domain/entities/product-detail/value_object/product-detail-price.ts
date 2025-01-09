import { ValueObject } from "src/common/domain";
import { ProductCurrencyEnum } from "src/product/domain/value-object/enums/product-currency.enum";
import { InvalidProductDetailCurrencyException } from "../exceptions/invalid-product-detail-currency-exception";
import { InvalidProductDetailPriceException } from "../exceptions/invalid-product-detail-price-exception";

export class ProductDetailPrice extends ValueObject<ProductDetailPrice> {
    private price: number;
    private currency: string;

    private constructor(price: number, currency: string) {
        super();

        currency=currency.toLowerCase()
        if (price<=0) throw new InvalidProductDetailPriceException()
        if ( 
            ProductCurrencyEnum.bsf != currency &&
            ProductCurrencyEnum.eur != currency &&
            ProductCurrencyEnum.usd != currency
        ) throw new InvalidProductDetailCurrencyException()

        this.currency = currency;
        this.price = price;
    }

    equals(obj: ProductDetailPrice): boolean {
        if (this.price === obj.price &&
            this.currency === obj.currency
        ) return true
        return false;
    }

    get Price() {
        return this.price;
    }

    get Currency() {
        return this.currency;
    }

    public static create(price: number, currency: string): ProductDetailPrice {
        return new ProductDetailPrice(price, currency);
    }
}