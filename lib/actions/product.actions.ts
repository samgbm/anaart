'use server';
import { convertToPlainObject, formatError } from '../utils';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validator';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Get the latest products
export async function getLatestProducts() {

    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { createdAt: 'desc' },
    });

    return convertToPlainObject(data);
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: { slug: slug },
    });
}

// Get single product by id
export async function getProductById(productId: string) {
    const data = await prisma.product.findFirst({
        where: { id: productId },
    });

    return convertToPlainObject(data);
}

// Get all products
export async function getAllProducts({
    style,
    subject,
    medium,
    material,
    size,
    category,
    query,
    price,
    rating,
    page,
    sort,
    limit = PAGE_SIZE,
}: {
    style: string;
    subject: string;
    medium: string;
    material: string;
    size: string;
    category?: string;
    query: string;
    price?: string;
    rating?: string;
    limit?: number;
    page: number;
    sort?: string;
}) {

    // style filter
    const styleFilter = style && style !== 'all' ? { style } : {};

    // subject filter
    const subjectFilter = subject && subject !== 'all' ? { subject } : {};

    // medium filter
    const mediumFilter = medium && medium !== 'all' ? { medium } : {};

    // material filter
    const materialFilter = material && material !== 'all' ? { material } : {};

    // size filter
    const sizeFilter = size && size !== 'all' ? { size } : {};

    // Category filter
    const categoryFilter = category && category !== 'all' ? { category } : {};

    // Query filter
    const queryFilter: Prisma.ProductWhereInput =
        query && query !== 'all'
            ? {
                name: {
                    contains: query,
                    mode: 'insensitive',
                } as Prisma.StringFilter,
            }
            : {};

    // Price filter
    const priceFilter: Prisma.ProductWhereInput =
        price && price !== 'all'
            ? {
                price: {
                    gte: Number(price.split('-')[0]),
                    lte: Number(price.split('-')[1]),
                },
            }
            : {};

    // Rating filter
    const ratingFilter =
        rating && rating !== 'all'
            ? {
                rating: {
                    gte: Number(rating),
                },
            }
            : {};

    // Fetch products
    const data = await prisma.product.findMany({
        where: {
            ...styleFilter,
            ...subjectFilter,
            ...mediumFilter,
            ...materialFilter,
            ...sizeFilter,
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter,
        },
        orderBy:
            sort === 'lowest'
                ? { price: 'asc' }
                : sort === 'highest'
                    ? { price: 'desc' }
                    : sort === 'rating'
                        ? { rating: 'desc' }
                        : { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.product.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    };
}


// Delete Product
export async function deleteProduct(id: string) {
    try {
        const productExists = await prisma.product.findFirst({
            where: { id },
        });

        if (!productExists) throw new Error('Product not found');

        await prisma.product.delete({ where: { id } });

        revalidatePath('/admin/products');

        return {
            success: true,
            message: 'Product deleted successfully',
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

// Create Product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
    try {
        // Validate and create product
        const product = insertProductSchema.parse(data);
        await prisma.product.create({ data: product });

        revalidatePath('/admin/products');

        return {
            success: true,
            message: 'Product created successfully',
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

// Update Product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
    try {
        // Validate and find product
        const product = updateProductSchema.parse(data);
        const productExists = await prisma.product.findFirst({
            where: { id: product.id },
        });

        if (!productExists) throw new Error('Product not found');

        // Update product
        await prisma.product.update({ where: { id: product.id }, data: product });

        revalidatePath('/admin/products');

        return {
            success: true,
            message: 'Product updated successfully',
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

// Get product categories
export async function getAllCategories() {
    const data = await prisma.product.groupBy({
        by: ['category'],
        _count: true,
    });

    return data;
}

// Get featured products
export async function getFeaturedProducts() {
    const data = await prisma.product.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
    });

    return convertToPlainObject(data);
}