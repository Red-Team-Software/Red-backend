import { ValueObject } from "src/common/domain";
import { ProductCurrencyEnum } from "src/product/domain/value-object/enums/product-currency.enum";
import { InvalidBundleDetailCurrencyException } from "../exceptions/invalid-bundle-detail-currency-exception";
import { InvalidBundleDetailPriceException } from "../exceptions/invalid-bundle-detail-price-exception";

export class BundleDetailPrice extends ValueObject<BundleDetailPrice> {
    private price: number;
    private currency: string;

    private constructor(price: number, currency: string) {
        super();

        currency=currency.toLowerCase()
        if (price<=0) throw new InvalidBundleDetailPriceException()
        if ( 
            ProductCurrencyEnum.bsf != currency &&
            ProductCurrencyEnum.eur != currency &&
            ProductCurrencyEnum.usd != currency
        ) throw new InvalidBundleDetailCurrencyException()

        this.currency = currency;
        this.price = price;
    }

    equals(obj: BundleDetailPrice): boolean {
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

    public static create(price: number, currency: string): BundleDetailPrice {
        return new BundleDetailPrice(price, currency);
    }
}