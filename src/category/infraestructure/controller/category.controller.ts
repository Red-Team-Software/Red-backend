
import { Controller, Get, Post, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryApplication } from "src/category/application/services/create-category-application";
import { FindAllCategoriesApplication } from "src/category/application/services/find-all-categories-application";
import { DeleteCategoryApplication } from "src/category/application/services/delete-category-application";
import { FindCategoryByIdApplication } from "src/category/application/services/find-category-by-id-application";
import { CreateCategoryApplicationRequestDTO } from "src/category/application/dto/request/create-category-application-request.dto";
import { DeleteCategoryApplicationRequestDTO } from "src/category/application/dto/request/delete-category-application-request.dto";
import { FindCategoryByIdApplicationRequestDTO } from "src/category/application/dto/request/find-category-by-id-application-request.dto";
import { CreateCategoryApplicationResponseDTO } from 'src/category/application/dto/response/create-category-application-response.dto';
import { Result } from 'src/common/utils/result-handler/result';
import { FindAllCategoriesResponseDTO } from 'src/category/application/dto/response/find-all-categories-response.dto';
import { NotFoundCategoryApplicationException } from 'src/category/application/application-exception/not-found-category-application-exception';
@Controller('categories')
export class CategoryController {
    constructor(
        private readonly createCategoryApp: CreateCategoryApplication,
        private readonly findAllCategoriesApp: FindAllCategoriesApplication,
        private readonly deleteCategoryApp: DeleteCategoryApplication,
        private readonly findCategoryByIdApp: FindCategoryByIdApplication,
    ) {}

    @Post()
    async createCategory(@Body() request: CreateCategoryApplicationRequestDTO): Promise<Result<CreateCategoryApplicationResponseDTO>> {
        return await this.createCategoryApp.execute(request);
    }

    @Get()
    async findAllCategories(@Body() request: FindCategoryByIdApplicationRequestDTO): Promise<Result<FindAllCategoriesResponseDTO>> {
        return await this.findAllCategoriesApp.execute(request);
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
        userId: '' // Puedes proporcionar un userId si es necesario
    };
    
    const result = await this.deleteCategoryApp.execute(request);

    if (!result.isSuccess()) {
        throw new NotFoundCategoryApplicationException();
    }

    return result.getValue;
}
}
