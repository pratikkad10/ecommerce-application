import { apiClient } from "../client";

export const getActiveCampaign = async () => {
    const response = await apiClient.get('/campaigns/active');
    return response.data;
};
