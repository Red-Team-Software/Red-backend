export interface CategoryUpdatedInfraestructureRequestDTO{
    categoryId: string,
    categoryName?: string,
    products?: string[],
    bundles?: string[]
    categoryImage?: string,
}