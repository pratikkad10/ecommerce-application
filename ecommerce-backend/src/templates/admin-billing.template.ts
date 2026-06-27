import { baseEmailLayout } from "./base.template";
import type { OrderItemTemplate } from "./transactional.template";

/**
 * 14. Invoice Generation (HTML Receipt)
 */
export const getInvoiceTemplate = (
    invoiceNumber: string,
    taxId: string,
    billingDetails: string,
    companyDetails: string,
    itemsList: OrderItemTemplate[],
    subtotal: string,
    breakdownOfTaxes: string,
    totalAmount: string
) => {
    const itemsHtml = itemsList.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eaeaeb; text-align: left; font-size: 14px; color: #333333;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eaeaeb; text-align: center; font-size: 14px; color: #555555;">${item.qty}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eaeaeb; text-align: right; font-size: 14px; color: #333333;">${item.price}</td>
        </tr>
    `).join("");

    return baseEmailLayout(`
        <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 10px; color: #333333;">
            Tax Invoice
        </h2>
        <p style="font-size: 14px; color: #888888; margin-bottom: 40px;">
            Invoice #: ${invoiceNumber}
        </p>
        
        <div style="text-align: left; margin: 0 20px 40px;">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 50%; vertical-align: top;">
                        <h3 style="font-size: 14px; font-weight: 700; color: #333333; margin-bottom: 10px;">Billed To:</h3>
                        <p style="font-size: 14px; color: #555555; line-height: 1.6; margin: 0;">${billingDetails.replace(/\n/g, '<br>')}</p>
                    </td>
                    <td style="width: 50%; vertical-align: top; text-align: right;">
                        <h3 style="font-size: 14px; font-weight: 700; color: #333333; margin-bottom: 10px;">From:</h3>
                        <p style="font-size: 14px; color: #555555; line-height: 1.6; margin: 0;">${companyDetails.replace(/\n/g, '<br>')}<br><strong>Tax ID:</strong> ${taxId}</p>
                    </td>
                </tr>
            </table>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
                <tr style="background-color: #f9f9f9;">
                    <th style="padding: 10px; text-align: left; font-size: 12px; font-weight: 700; color: #888888; text-transform: uppercase;">Item</th>
                    <th style="padding: 10px; text-align: center; font-size: 12px; font-weight: 700; color: #888888; text-transform: uppercase;">Qty</th>
                    <th style="padding: 10px; text-align: right; font-size: 12px; font-weight: 700; color: #888888; text-transform: uppercase;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
        </table>

        <div style="text-align: right; margin: 0 20px 40px;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #555555;">Subtotal: ${subtotal}</p>
            <p style="margin: 0 0 10px; font-size: 14px; color: #555555;">Taxes: ${breakdownOfTaxes}</p>
            <hr style="border: none; border-top: 1px solid #eaeaeb; margin: 15px 0 15px auto; width: 200px;">
            <p style="margin: 0; font-size: 18px; font-weight: 800; color: #333333;">Total: ${totalAmount}</p>
        </div>
        
        <p style="font-size: 14px; color: #888888; margin-bottom: 20px;">
            Thank you for your business! This is a computer-generated document and requires no signature.
        </p>
    `);
};
