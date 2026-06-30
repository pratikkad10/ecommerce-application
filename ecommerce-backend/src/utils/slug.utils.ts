/**
 * Generates a URL-friendly slug from a given string.
 * @param text - The string to convert (e.g., "Nike Air Max")
 * @param appendTimestamp - Whether to append a unique timestamp to avoid collisions
 * @returns A unique slug (e.g., "nike-air-max-1719758784321")
 */
export const generateSlug = (text: string, appendTimestamp: boolean = true): string => {
    const baseSlug = text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    return appendTimestamp ? `${baseSlug}-${Date.now()}` : baseSlug;
};
