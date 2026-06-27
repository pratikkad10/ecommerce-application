import { baseEmailLayout } from "./base.template";

export interface OrderItemTemplate {
    name: string;
    image: string;
    qty: number;
    price: string;
}

/**
 * 5. Order Confirmation
 */
export const getOrderConfirmationTemplate = (
    orderId: string, 
    customerName: string, 
    itemsList: OrderItemTemplate[], 
    subtotal: string, 
    tax: string, 
    discount: string, 
    totalAmount: string, 
    shippingAddress: string
) => {
    const itemsHtml = itemsList.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eaeaeb; padding: 15px 0;">
            <div style="display: flex; align-items: center; text-align: left;">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 15px;" />
                <div>
                    <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #333333;">${item.name}</p>
                    <p style="margin: 0; font-size: 12px; color: #888888;">Qty: ${item.qty}</p>
                </div>
            </div>
            <p style="margin: 0; font-size: 14px; font-weight: 700; color: #333333;">${item.price}</p>
        </div>
    `).join("");

    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 10px; color: #333333; line-height: 1.2;">
            Order Confirmed!
        </h2>
        <p style="font-size: 16px; color: #555555; margin-bottom: 30px;">
            Hi ${customerName}, thanks for shopping at Kraya. We've received your order!
        </p>
        
        <!-- Order Summary Box -->
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 0 20px 40px; text-align: left;">
            <p style="margin: 0 0 20px; font-size: 14px; color: #555555;"><strong>Order #:</strong> ${orderId}</p>
            
            ${itemsHtml}

            <div style="margin-top: 20px; font-size: 14px; color: #555555;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Subtotal:</span> <span>${subtotal}</span></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span>Tax:</span> <span>${tax}</span></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #f28522; font-weight: 700;"><span>Discount:</span> <span>-${discount}</span></div>
                <hr style="border: none; border-top: 1px solid #eaeaeb; margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #333333;"><span>Total:</span> <span>${totalAmount}</span></div>
            </div>
        </div>

        <!-- Shipping Address -->
        <div style="text-align: left; padding: 0 20px; margin-bottom: 40px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #333333; margin-bottom: 10px;">Shipping To:</h3>
            <p style="font-size: 14px; color: #555555; line-height: 1.6; margin: 0;">${shippingAddress.replace(/\n/g, '<br>')}</p>
        </div>
    `);
};

/**
 * 6. Shipping / Shipped Notification
 */
export const getShippedNotificationTemplate = (
    orderId: string, 
    customerName: string, 
    carrierName: string, 
    trackingNumber: string, 
    trackingUrl: string, 
    estimatedDeliveryDate: string
) => {
    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 20px; color: #333333; line-height: 1.2;">
            It's on the way!
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 40px; padding: 0 20px; font-weight: 500;">
            Hi ${customerName}, great news! Order <strong>#${orderId}</strong> has shipped and is currently with ${carrierName}.
        </p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 0 20px 40px; text-align: left;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #555555;"><strong>Estimated Delivery:</strong> ${estimatedDeliveryDate}</p>
            <p style="margin: 0; font-size: 14px; color: #555555;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
        </div>
        <div style="margin-bottom: 60px;">
            <a href="${trackingUrl}" style="display: inline-block; padding: 16px 40px; background-color: #f28522; color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 16px;">Track Package</a>
        </div>
    `);
};

/**
 * 7. Out for Delivery
 */
export const getOutForDeliveryTemplate = (customerName: string, deliveryAddress: string, etaWindow: string) => {
    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 20px; color: #333333; line-height: 1.2;">
            Out for Delivery!
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px; padding: 0 20px; font-weight: 500;">
            Hi ${customerName}, your Kraya order is out for delivery and will be arriving today!
        </p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 0 20px 40px; text-align: left;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #555555;"><strong>Arriving Between:</strong> ${etaWindow}</p>
            <p style="margin: 0; font-size: 14px; color: #555555;"><strong>Delivery Address:</strong><br>${deliveryAddress.replace(/\n/g, '<br>')}</p>
        </div>
    `);
};

/**
 * 8. Order Delivered
 */
export const getOrderDeliveredTemplate = (orderId: string, customerName: string, deliveryTimestamp: string) => {
    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 20px; color: #333333; line-height: 1.2;">
            Delivered!
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px; padding: 0 20px; font-weight: 500;">
            Hi ${customerName}, your order <strong>#${orderId}</strong> was successfully delivered on ${deliveryTimestamp}.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #888888; margin-bottom: 40px; padding: 0 20px;">
            Can't find your package? Please check around your porch, mailbox, or with your neighbors. If it's still missing, reply to this email!
        </p>
    `);
};

/**
 * 9. Order Cancelled
 */
export const getOrderCancelledTemplate = (orderId: string, customerName: string, cancellationReason: string, refundStatus: string) => {
    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 20px; color: #333333; line-height: 1.2;">
            Order Cancelled
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px; padding: 0 20px; font-weight: 500;">
            Hi ${customerName}, your order <strong>#${orderId}</strong> has been cancelled.
        </p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 0 20px 40px; text-align: left;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #555555;"><strong>Reason:</strong> ${cancellationReason}</p>
            <p style="margin: 0; font-size: 14px; color: #555555;"><strong>Refund Status:</strong> ${refundStatus}</p>
        </div>
    `);
};

/**
 * 10. Refund Processed
 */
export const getRefundProcessedTemplate = (orderId: string, refundAmount: string, paymentMethodUsed: string, timelineToReflect: string) => {
    return baseEmailLayout(`
        <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 20px; color: #333333; line-height: 1.2;">
            Refund Processed
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px; padding: 0 20px; font-weight: 500;">
            Good news! We have successfully processed a refund for order <strong>#${orderId}</strong>.
        </p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 0 20px 40px; text-align: left;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #555555;"><strong>Amount Refunded:</strong> ${refundAmount}</p>
            <p style="margin: 0; font-size: 14px; color: #555555;"><strong>Refunded To:</strong> ${paymentMethodUsed}</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #888888; margin-bottom: 40px; padding: 0 20px;">
            Please note that it may take <strong>${timelineToReflect}</strong> for the funds to appear on your statement depending on your bank.
        </p>
    `);
};
