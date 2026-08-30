import type { CompanyDocument, DocumentCategory, GetDocumentsResponse, UploadDocumentResponse } from "../types/documents.types";

const API_URL = "http://localhost:3000/api/documents";

export interface UploadDocumentData {
    file: File;
    category: DocumentCategory;
    notes: string;
}

export const getDocuments = async (companyId: string): Promise<CompanyDocument[]> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data: GetDocumentsResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            "Error al obtener los documentos"
        );
    }

    return data.documents;
};

export const uploadDocument = async (companyId: string, documentData: UploadDocumentData): Promise<CompanyDocument> => {

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("file", documentData.file);
    formData.append("category", documentData.category);
    formData.append("notes", documentData.notes);

    // Sin "Content-Type": el navegador arma el boundary de multipart solo.
    const response = await fetch(`${API_URL}/${companyId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    const data: UploadDocumentResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al subir el documento"
        );
    }

    return data.document;
};

export const deleteDocument = async (companyId: string, documentId: string): Promise<void> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}/${documentId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {

        const data = await response.json().catch(() => ({}));

        throw new Error(
            data.message || "Error al eliminar el documento"
        );

    }

};