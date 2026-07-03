import { Request, Response } from "express";
import { prisma } from "../../config/prisma.config";



export const getActiveCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await prisma.campaign.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!campaign) {
      // Return a default campaign if none is found so the frontend doesn't break
      res.status(200).json({
        success: true,
        data: {
          title: "Up to",
          highlightText: "60% Off",
          subtitle: "Premium Essentials",
          description: "Exclusive markdowns on our highest-rated items. Prices vanish when the timer hits zero.",
          bannerImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxca4w5NqZyrdhTIAznM85nxBGcquhCYUt3YwFc0-KO8FY_A9t3sqYMaacImhTLyc7rsfXA3_cEVpDOYQef0hfrzNk-zwp2xZQumyOzxAYvvaUtVnQL49ONFIRBaNuDVCHmBeIi_Z4AgE9ijGtesgSoxKRae_gQgnhxbYsy3AWL9EkINFDBhWr23EZln4HO5UubswuIf6NJq1lbIsxDhG21ZWvbgq1gtMzNw2JLVqPDipDElH5miu8QwYp5FzKu9BtnKGEsqL6SoIL",
          // Set default end date to 2 days from now
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
