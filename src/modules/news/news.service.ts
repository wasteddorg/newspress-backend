import { prisma } from "../../lib/prisma.js";

const getAnyUser = async () => {
    return await prisma.user.findFirst({
        select: { id: true }
    });
};

const createNews = async (data: any, authorId: string) => {
    const baseSlug = data.title
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, "-") 
        .replace(/[^\u0980-\u09FFa-z0-9-]/g, "") 
        .replace(/-+/g, "-") 
        .replace(/^-+|-+$/g, ""); 

    const slug = `${baseSlug}-${Date.now()}`;

    return await prisma.post.create({
        data: {
            title: data.title,
            content: data.content,
            summary: data.summary,
            featuredImage: data.featuredImage,
            imageCaption: data.imageCaption,
            videoUrl: data.videoUrl,
            isFeatured: data.isFeatured,
            isBreaking: data.isBreaking,
            status: data.status,
            categoryId: data.categoryId,
            subCategoryId: data.subCategoryId || null,
            slug,
            authorId,
        },
    });
};

const getAllNews = async () => {
    return await prisma.post.findMany({
        include: {
            category: { select: { name: true, slug: true } },
            subCategory: { select: { name: true, slug: true } },
            author: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

const getNewsBySlug = async (slug: string) => {
    try {
        return await prisma.post.update({
            where: { slug },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
            include: {
                category: true, 
                subCategory: true,
                author: { 
                    select: { name: true, image: true } 
                },
                comments: {
                    include: {
                        user: { select: { name: true, image: true } },
                    },
                },
            },
        });
    } catch (error) {
        return await prisma.post.findUnique({
            where: { slug },
            include: {
                category: true,
                subCategory: true,
                author: { 
                    select: { name: true, image: true } 
                },
                comments: {
                    include: {
                        user: { select: { name: true, image: true } },
                    },
                },
            },
        });
    }
};

const updateNews = async (id: string, data: any) => {
    const updateData: any = {
        title: data.title,
        content: data.content,
        summary: data.summary,
        featuredImage: data.featuredImage,
        imageCaption: data.imageCaption,
        videoUrl: data.videoUrl,
        isFeatured: data.isFeatured,
        isBreaking: data.isBreaking,
        status: data.status,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId || null,
    };

    if (data.title) {
        updateData.slug = data.title
            .trim()
            .toLowerCase()
            .replace(/[\s_]+/g, "-") 
            .replace(/[^\u0980-\u09FFa-z0-9-]/g, "") 
            .replace(/-+/g, "-") 
            .replace(/^-+|-+$/g, "");
    }

    return await prisma.post.update({
        where: { id },
        data: updateData,
    });
};

const deleteNews = async (id: string) => {
    return await prisma.post.delete({
        where: { id },
    });
};

export const NewsService = {
    getAnyUser,
    createNews,
    getAllNews,
    getNewsBySlug,
    updateNews,
    deleteNews,
};