import { cloudinary } from "../config/cloudinary.config";
import { prisma } from "../config/prisma.config";
import type { ProductImage } from "../generated/prisma/client";


/**
 * @description Upload image to Cloudinary
 * @param buffer 
 * @param productId 
 * @returns 
 */
async function uploadToCloudinary(
    buffer: Buffer,
    productId: string
): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: `products/${productId}`, resource_type: "image" },
            (error, result) => {
                if (error) reject(error);
                else
                    resolve({
                        url: result!.secure_url,       // ← Cloudinary calls it secure_url
                        publicId: result!.public_id,   // ← Cloudinary calls it public_id
                    });
            }
        );
        uploadStream.end(buffer);
    });
}


/**
 * @description Create images for a product
 * @param productId 
 * @param files 
 * @param altText 
 * @returns Promise<ProductImage[]>
 */
export const createProductImages = async (
    productId: string,
    files: Express.Multer.File[],
    altText?: string
): Promise<ProductImage[]> => {
    // Step 1: upload all buffers to Cloudinary
    const uploadResults = await Promise.all(
        files.map((file) => uploadToCloudinary(file.buffer, productId))
    );

    // Step 2: insert all rows in a transaction
    return await prisma.$transaction(
        uploadResults.map(({ url, publicId }) =>
            prisma.productImage.create({
                data: { url, publicId, altText: altText ?? null, productId },
            })
        )
    );
};


/**
 * @description Delete an image for a product
 * @param imageId 
 * @param productId 
 * @returns Promise<ProductImage>
 */
export const deleteProductImage = async (imageId: string, productId: string) => {
    const image = await prisma.productImage.findFirst({
        where: { id: imageId, productId },
    });

    if (!image) return null;

    // Delete from Cloudinary first (while we still have the public_id)
    if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
    }

    // Then delete the DB row
    return await prisma.productImage.delete({
        where: { id: imageId },
    });
};

/**
 * @description Set an image as primary for a product
 * @param productId 
 * @param imageId 
 * @returns Promise<ProductImage>
 */
export const setPrimaryImage = async (productId: string, imageId: string) => {
    const image = await prisma.productImage.findFirst({
        where: { id: imageId, productId },
    });

    if (!image) return null;

    return await prisma.$transaction([
        // Unset any existing primary
        prisma.productImage.updateMany({
            where: { productId, isPrimary: true },
            data: { isPrimary: false },
        }),
        // Set the new primary
        prisma.productImage.update({
            where: { id: imageId },
            data: { isPrimary: true },
        }),
    ]);
};