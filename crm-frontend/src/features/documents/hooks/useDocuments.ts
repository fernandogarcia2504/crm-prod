import { useEffect, useState } from "react";

import {
    getDocuments,
    uploadDocument as uploadDocumentService,
    deleteDocument as deleteDocumentService
} from "../services/documentService";

import type { UploadDocumentData } from "../services/documentService";
import type { CompanyDocument } from "../types/documents.types";

export function useDocuments(companyId: string | null) {

    const [documents, setDocuments] = useState<CompanyDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!companyId) {
            setDocuments([]);
            return;
        }

        const fetchDocuments = async () => {
            try {

                setLoading(true);
                setError(null);

                const data = await getDocuments(companyId);

                setDocuments(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener los documentos"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchDocuments();

    }, [companyId]);

    const uploadDocument = async (documentData: UploadDocumentData) => {

        if (!companyId) {
            throw new Error("No existe una empresa seleccionada");
        }

        const newDocument = await uploadDocumentService(companyId, documentData);

        setDocuments((currentDocuments) => [newDocument, ...currentDocuments]);

        return newDocument;
    };

    const deleteDocument = async (documentId: string) => {

        if (!companyId) {
            throw new Error("No existe una empresa seleccionada");
        }

        await deleteDocumentService(companyId, documentId);

        setDocuments((currentDocuments) =>
            currentDocuments.filter((document) => document._id !== documentId)
        );
    };

    return {
        documents,
        loading,
        error,
        uploadDocument,
        deleteDocument
    };

}