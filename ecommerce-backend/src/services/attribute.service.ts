import { prisma } from "../config/prisma.config";
import { CreateSizeInput, UpdateSizeInput, CreateColorInput, UpdateColorInput } from "../validation/attribute.validation";
import { Prisma } from "../generated/prisma/client";

// --- SIZES ---

export const getAllSizes = async () => {
    return await prisma.size.findMany({
        orderBy: { name: 'asc' }
    });
};

export const createSize = async (data: CreateSizeInput) => {
    return await prisma.size.create({
        data: data as Prisma.SizeUncheckedCreateInput
    });
};

export const updateSize = async (id: string, data: UpdateSizeInput) => {
    return await prisma.size.update({
        where: { id },
        data: data as Prisma.SizeUncheckedUpdateInput
    });
};

export const deleteSize = async (id: string) => {
    return await prisma.size.delete({
        where: { id }
    });
};


// --- COLORS ---

export const getAllColors = async () => {
    return await prisma.color.findMany({
        orderBy: { name: 'asc' }
    });
};

export const createColor = async (data: CreateColorInput) => {
    return await prisma.color.create({
        data: data as Prisma.ColorUncheckedCreateInput
    });
};

export const updateColor = async (id: string, data: UpdateColorInput) => {
    return await prisma.color.update({
        where: { id },
        data: data as Prisma.ColorUncheckedUpdateInput
    });
};

export const deleteColor = async (id: string) => {
    return await prisma.color.delete({
        where: { id }
    });
};
