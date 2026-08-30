export interface Company {
    _id: string;

    business: string;
    name: string;
    website: string;
    companySize: string;
    leadSource: string;
    status: string;
    notes?: string;
    address?: {
        country: string;
        state: string;
        city: string;
        pc: string;
        street: string
    }
}

export interface CreateCompanyData {
    name: string;
    website: string;
    companySize: string;
    leadSource: string;
    status?: string;
    notes?: string;
    address?: {
        country?: string;
        state?: string;
        city?: string;
        pc?: string;
        street?: string
    }
}

export interface UpdateCompanyData {
    name?: string;
    website?: string;
    companySize?: string;
    leadSource?: string;
    status?: string;
    notes?: string;
    address?: {
        country?: string;
        state?: string;
        city?: string;
        pc?: string;
        street?: string
    }
}

export interface GetCompaniesResponse {
    companies: Company[];
}

export interface GetCompanyResponse {
    company: Company;
}

export interface CreateCompanyResponse {
    message: string;
    company: Company;
}

export interface UpdateCompanyResponse {
    message: string;
    company: Company;
}

export interface DeleteCompanyResponse {
    message: string;
}