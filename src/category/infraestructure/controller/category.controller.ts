
import { Controller, Get, Post, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryApplication } from "src/category/application/services/create-category-application";
import { FindAllCategoriesApplication } from "src/category/application/services/find-all-categories-application";
import { DeleteCategoryApplication } from "src/category/application/services/delete-category-application";
import { FindCategoryByIdApplication } from "src/category/application/services/find-category-by-id-application";
import { CreateCategoryApplicationRequestDTO } from "src/category/application/dto/request/create-category-application-request.dto";
import { DeleteCategoryApplicationRequestDTO } from "src/category/application/dto/request/delete-category-application-request.dto";
import { FindCategoryByIdApplicationRequestDTO } from "src/category/application/dto/request/find-category-by-id-application-request.dto";

@Controller('categories')
export class CategoryController {
    constructor(
        private readonly createCategoryApp: CreateCategoryApplication,
        private readonly findAllCategoriesApp: FindAllCategoriesApplication,
        private readonly deleteCategoryApp: DeleteCategoryApplication,
        private readonly findCategoryByIdApp: FindCategoryByIdApplication,
    ) {}

    @Post()
    async createCategory(@Body() request: CreateCategoryApplicationRequestDTO) {
        return await this.createCategoryApp.execute(request);
    }

    @Get()
    async findAllCategories() {
        return await this.findAllCategoriesApp.execute();
    }

    @Get(':id')
    async findCategoryById(@Param('id') id: string) {
        const request: FindCategoryByIdApplicationRequestDTO = {
            id,
            userId: ''
        };
        const category = await this.findCategoryByIdApp.execute(request);
        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        return category;
    }

    @Delete(':id')
    async deleteCategory(@Param('id') id: string) {
        const request: DeleteCategoryApplicationRequestDTO = {
            id,
            userId: ''
        };
        await this.deleteCategoryApp.execute(request);
    }
}
