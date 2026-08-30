import { useEffect, useState } from "react";

import { getContacts, createContact as createContactService, updateContact as updateContactService } from "../services/contactService";

import type { Contact, CreateContactData, UpdateContactData } from "../types/contact.types";

export function useContacts(companyId: string | null) {

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!companyId) {
            setContacts([]);
            return
        }

        const fetchContacts = async () => {
            try {
                setLoading(true);
                setError(null)

                const data = await getContacts(companyId);

                setContacts(data)

                console.log(data)
            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener los contactos de todas las empresas" );

            } finally {

                setLoading(false);

            }
        } 
        
        fetchContacts();
    }, [companyId])

    const createContact = async (contactData: CreateContactData) => {
        
        if(!companyId) {
            throw new Error("No existe un contacto seleccionado")
        }

        const newContact = await createContactService( companyId, contactData);

        setContacts((currentContacts) => [
            ...currentContacts,
            newContact
        ])

        return newContact
    };

    const updateContact = async ( contactId: string, contactData: UpdateContactData) => {
        
        if (!companyId) {
            throw new Error( "No existe un Business seleccionado" );
        }

        const updatedContact = await updateContactService(
            companyId,
            contactId,
            contactData
        );

        setContacts((currentContacts) =>
            currentContacts.map((contact) =>
                contact._id === contactId
                    ? updatedContact
                    : contact
            )
        );

        return updateContact;

    };

    return {
        contacts, 
        loading,
        error,
        createContact,
        updateContact    
    }
}