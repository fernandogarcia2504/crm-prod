import { useEffect, useState } from "react";

import { getCompanies, createCompany as createCompanyService, updateCompany as updateCompanyService, deleteCompany as deleteCompanyService } from "../services/companyService";

import type { Company, CreateCompanyData, UpdateCompanyData } from "../types/company.types";


export function useCompanies(businessId: string | null) {

    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!businessId) {
            setCompanies([]);
            return;
        }

        const fetchCompanies = async () => {
            try {

                setLoading(true);
                setError(null);

                const data = await getCompanies( businessId );

                setCompanies(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener las empresas" );

            } finally {

                setLoading(false);

            }
        };

        fetchCompanies();

    }, [businessId]);

    const createCompany = async ( companyData: CreateCompanyData ) => {

        if (!businessId) {
            throw new Error( "No existe un Business seleccionado" );
        }

        const newCompany = await createCompanyService( businessId, companyData );

        setCompanies((currentCompanies) => [
            ...currentCompanies,
            newCompany
        ]);

        return newCompany;
    };


    const updateCompany = async ( companyId: string, companyData: UpdateCompanyData ) => {

        if (!businessId) {
            throw new Error( "No existe un Business seleccionado" );
        }

        const updatedCompany = await updateCompanyService(
                businessId,
                companyId,
                companyData
            );

        setCompanies((currentCompanies) =>
            currentCompanies.map((company) =>
                company._id === companyId
                    ? updatedCompany
                    : company
            )
        );

        return updatedCompany;
    };

    const deleteCompany = async (companyId: string ) => {

        if (!businessId) {
            throw new Error(
                "No existe un Business seleccionado"
            );
        }

        await deleteCompanyService(
            businessId,
            companyId
        );

        setCompanies((currentCompanies) =>
            currentCompanies.filter(
                (company) =>
                    company._id !== companyId
            )
        );
    };


    return {
        companies,
        loading,
        error,
        createCompany,
        updateCompany,
        deleteCompany
    };
}