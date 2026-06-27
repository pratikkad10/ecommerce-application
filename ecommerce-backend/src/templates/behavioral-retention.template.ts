import { baseEmailLayout } from "./base.template";

export interface CartItemTemplate {
    name: string;
    image: string;
    price: string;
}

/**
 * 11. Abandoned Cart Reminder
 */
export const getAbandonedCartTemplate = (
    customerName: string, 
    cartItemsList: CartItemTemplate[], 
    checkoutUrl: string
) => {
    const itemsHtml = cartItemsList.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eaeaeb; padding: 15px 0;">
            <div style="display: flex; align-items: center; text-align: left;">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 15px;" />
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #333333;">${item.name}</p>
            </div>
            <p style="margin: 0; font-size: 14px; font-weight: 700; color: #333333;">${item.price}</p>
        </div>
    `).join("");

    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 20px; color: #333333; line-height: 1.2;">
            Did you forget<br>something?
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px; padding: 0 20px; font-weight: 500;">
            Hi ${customerName}, we noticed you left some great items in your cart. They are selling out fast, so grab them before they're gone!
        </p>
        
        <div style="background-color: #f9f9f9; padding: 10px 20px; border-radius: 10px; margin: 0 20px 40px; text-align: left;">
            ${itemsHtml}
        </div>

        <div style="margin-bottom: 60px;">
            <a href="${checkoutUrl}" style="display: inline-block; padding: 16px 40px; background-color: #f28522; color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px;">Complete Checkout</a>
        </div>
    `);
};

export interface ReviewItemTemplate {
    name: string;
    image: string;
    reviewUrl: string;
}

/**
 * 12. Product Review / Feedback Request
 */
export const getProductReviewTemplate = (
    customerName: string, 
    itemsPurchased: ReviewItemTemplate[]
) => {
    const itemsHtml = itemsPurchased.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eaeaeb; padding: 15px 0;">
            <div style="display: flex; align-items: center; text-align: left;">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 15px;" />
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #333333;">${item.name}</p>
            </div>
            <a href="${item.reviewUrl}" style="font-size: 14px; font-weight: 700; color: #f28522; text-decoration: none;">Write Review</a>
        </div>
    `).join("");

    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 20px; color: #333333; line-height: 1.2;">
            How did we do?
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px; padding: 0 20px; font-weight: 500;">
            Hi ${customerName}, we hope you're loving your recent purchase! Your feedback helps us improve and helps other shoppers make great choices.
        </p>
        
        <div style="background-color: #f9f9f9; padding: 10px 20px; border-radius: 10px; margin: 0 20px 40px; text-align: left;">
            ${itemsHtml}
        </div>
    `);
};

/**
 * 13. Back-in-Stock Alert
 */
export const getBackInStockTemplate = (
    customerName: string, 
    productName: string, 
    productImage: string, 
    productUrl: string
) => {
    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 20px; color: #333333; line-height: 1.2;">
            Back in Stock!
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px; padding: 0 20px; font-weight: 500;">
            Hi ${customerName}, the wait is over! <strong>${productName}</strong> is finally back in stock. Hurry, it might sell out again!
        </p>
        
        <div style="margin-bottom: 40px;">
            <img src="${productImage}" alt="${productName}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 10px;" />
        </div>

        <div style="margin-bottom: 60px;">
            <a href="${productUrl}" style="display: inline-block; padding: 16px 40px; background-color: #f28522; color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px;">Shop Now</a>
        </div>
    `);
};
