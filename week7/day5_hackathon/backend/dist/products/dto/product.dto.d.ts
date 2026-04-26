export declare class RecipeIngredientDto {
    rawMaterial: string;
    quantity: number;
}
export declare class CreateProductDto {
    name: string;
    price: number;
    description?: string;
    category?: string;
    recipe: RecipeIngredientDto[];
}
export declare class UpdateProductDto {
    name?: string;
    price?: number;
    description?: string;
    category?: string;
    recipe?: RecipeIngredientDto[];
}
