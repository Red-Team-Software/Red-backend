export interface IBundleUpdatedPrice {
  bundleId:           string;
  bundlePrice:        BundlePrice;
}

export interface BundlePrice {
  currency: string;
  price:    number;
}