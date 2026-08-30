export type CampaignStatus = "Planeada" | "En curso" | "Completada";

export type TargetEvent = "sent" | "opened" | "clicked" | "submittedData" | "reported";

export interface CampaignTargetEmployee {
    _id: string;
    fullName: string;
    email: string;
    position?: string;
    sector?: string;
}

export interface CampaignTarget {
    _id: string;
    employee: string | CampaignTargetEmployee;

    sent: boolean;
    sentAt: string | null;

    opened: boolean;
    openedAt: string | null;

    clicked: boolean;
    clickedAt: string | null;

    submittedData: boolean;
    submittedAt: string | null;

    reported: boolean;
    reportedAt: string | null;
}

export interface CampaignMetrics {
    totalTargets: number;
    sent: number;
    opened: number;
    clicked: number;
    submittedData: number;
    reported: number;
    clickRate: number;
    reportRate: number;
}

export interface PhishingCampaign {
    _id: string;
    business: string;
    company: string;
    project: string;

    name: string;

    gophishCampaignId?: string;
    emailTemplate?: string;
    landingPage?: string;
    sendingProfile?: string;
    senderDomain?: string;
    campaignUrl?: string;

    launchDate: string | null;

    status: CampaignStatus;

    targets: CampaignTarget[];
    metrics: CampaignMetrics;

    notes?: string;

    createdAt: string;
    updatedAt: string;
}

export interface CreateCampaignData {
    name: string;
    emailTemplate?: string;
    landingPage?: string;
    sendingProfile?: string;
    senderDomain?: string;
    campaignUrl?: string;
    launchDate?: string;
    gophishCampaignId?: string;
    notes?: string;
    employeeIds: string[];
}

export interface UpdateCampaignData {
    name?: string;
    emailTemplate?: string;
    landingPage?: string;
    sendingProfile?: string;
    senderDomain?: string;
    campaignUrl?: string;
    launchDate?: string;
    status?: CampaignStatus;
    gophishCampaignId?: string;
    notes?: string;
}

export interface GetCampaignsResponse {
    campaigns: PhishingCampaign[];
}

export interface GetCampaignResponse {
    campaign: PhishingCampaign;
}

export interface CampaignResponse {
    message: string;
    campaign: PhishingCampaign;
}

export interface DeleteCampaignResponse {
    message: string;
    gophishWarning: string | null;
}
