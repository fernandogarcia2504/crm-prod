import { useEffect, useState } from "react";

import {
    getAllContacts,
    createContact as createContactService
} from "../services/contactService";

import type {
    Contact,
    CreateContactData
} from "../types/contact.types";


export function useAllContacts(businessId: string | null) {

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {

        if (!businessId) {
            setContacts([]);
            return;
        }

        const fetchContacts = async () => {

            try {

                setLoading(true);
                setError(null);

                const data = await getAllContacts(businessId);

                setContacts(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Error al obtener los contactos"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchContacts();

    }, [businessId]);


    const createContact = async (
        companyId: string,
        contactData: CreateContactData
    ) => {

        const newContact = await createContactService(
            companyId,
            contactData
        );

        setContacts((currentContacts) => [
            ...currentContacts,
            newContact
        ]);

        return newContact;
    };


    return {
        contacts,
        loading,
        error,
        createContact
    };
}
