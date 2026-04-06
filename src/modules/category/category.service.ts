import { prisma } from "../../lib/prisma.js";

const createCategory = async (name: string, parentId?: string | null) => {
    if (!name || typeof name !== 'string') {
        throw new Error("Category name is required and must be a string");
    }

    if (parentId && parentId.trim() !== "") {
        const parentExists = await prisma.category.findUnique({
            where: { id: parentId }
        });

        if (!parentExists) {
            throw new Error("আপনার দেওয়া Parent ID-টি ডাটাবেজে পাওয়া যায়নি। দয়া করে সঠিক ID দিন অথবা ফিল্ডটি খালি রাখুন।");
        }
    }

    const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

    return await prisma.category.create({
        data: {
            name,
            slug: `${slug}-${Date.now().toString().slice(-4)}`,
            parentId: (parentId && parentId.trim() !== "") ? parentId : null
        },
        include: {
            parent: {
                select: { name: true }
            }
        }
    });
};

const getAllCategories = async () => {
    return await prisma.category.findMany({
        where: {
            parentId: null
        },
        include: {
            children: {
                orderBy: { createdAt: 'asc' }
            }
        },
        orderBy: { createdAt: 'asc' }
    });
};

const updateCategory = async (id: string, name: string, parentId?: string | null) => {
    if (!name) {
        throw new Error("Category name is required for update");
    }

    // আপডেট করার সময়ও parentId চেক করে নিচ্ছি
    if (parentId && parentId.trim() !== "") {
        const parentExists = await prisma.category.findUnique({
            where: { id: parentId }
        });
        if (!parentExists) throw new Error("Invalid Parent ID");
    }

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
    
    return await prisma.category.update({
        where: { id },
        data: {
            name,
            slug: `${slug}-${id.slice(-4)}`,
            parentId: (parentId && parentId.trim() !== "") ? parentId : null
        }
    });
};

const deleteCategory = async (id: string) => {
    return await prisma.category.delete({
        where: { id }
    });
};

export const CategoryService = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};