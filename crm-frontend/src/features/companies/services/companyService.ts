import type { Company, CreateCompanyData, UpdateCompanyData, GetCompaniesResponse, GetCompanyResponse, UpdateCompanyResponse, DeleteCompanyResponse, CreateCompanyResponse } from "../types/company.types";

const API_URL = "https://crmprod-70ae5fa5478a.herokuapp.com/api";

export const getCompanies = async (businessId: string): Promise<Company[]> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/companies/${businessId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok){
        throw new Error(
            "Error al obtener las empresas"
        );
    }

    const data: GetCompaniesResponse = await response.json();

    return data.companies
}

export const getCompany = async (businessId: string, companyId: string): Promise<Company> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/companies/${businessId}/${companyId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(
            "Error al obtener la empresa"
        );
    }

    const data: GetCompanyResponse = await response.json();

    return data.company;

}

export const createCompany = async (businessId: string, companyData: CreateCompanyData): Promise<Company> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/companies/${businessId}`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(companyData)
    })

    const data: CreateCompanyResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al crear la empresa"
        );
    }

    return data.company;
}

export const updateCompany = async (businessId: string, companyId: string, companyData: UpdateCompanyData ): Promise<Company> => {

    const token = localStorage.getItem("token");

    const response = await fetch( `${API_URL}/companies/${businessId}/${companyId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(companyData)
        }
    );

    const data: UpdateCompanyResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al actualizar la empresa"
        );
    }

    return data.company;
};

export const deleteCompany = async ( businessId: string, companyId: string ): Promise<string> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/companies/${businessId}/${companyId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const data: DeleteCompanyResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al eliminar la empresa"
        );
    }

    return data.message;
};
