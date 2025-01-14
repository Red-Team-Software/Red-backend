export interface PromotionUpdatedInfraestructureRequestDTO {
    promotionId:          string;
    promotionDescription?: string;
    promotionName?:        string;
    promotionState?:       string;
    promotionDiscount?:    number;
    products?:             string[];
    bundles?:              string[];
    categories?:           string[];
}