import { Request, Response } from "express";
import { CategoryService } from "./category.service.js";

const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, parentId } = req.body;
        const result = await CategoryService.createCategory(name, parentId);
        
        res.status(201).json({
            success: true,
            message: parentId ? "Sub-category created successfully!" : "Category created successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};

const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await CategoryService.getAllCategories();
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};

const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, parentId } = req.body;
        const result = await CategoryService.updateCategory(id, name, parentId);
        
        res.status(200).json({
            success: true,
            message: "Category updated successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Update failed"
        });
    }
};

const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await CategoryService.deleteCategory(id);
        
        res.status(200).json({
            success: true,
            message: "Category and its sub-categories deleted successfully!"
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Delete failed"
        });
    }
};

export const CategoryController = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};