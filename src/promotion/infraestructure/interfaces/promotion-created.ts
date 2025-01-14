export interface IPromotionCreated {
    promotionId:          string;
    promotionDescription: string;
    promotionName:        PromotionName;
    promotionState:       PromotionState;
    promotionDiscount:    number;
    products:             string[];
    bundles:              string[];
    categories:           string[];
}

export interface PromotionName {
    name: string;
}

export interface PromotionState {
    state: string;
}
