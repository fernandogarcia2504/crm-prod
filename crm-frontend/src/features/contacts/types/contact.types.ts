export interface Contact {
    _id: string;
    company: ContactCompany;

    fullName: string;
    position: string;
    email: string;
    phone: string;
    linkedin?: string;
    isPrimary: boolean;
    notes?: string;
}

export interface ContactCompany {
    _id: string;
    name: string;
}

export interface CreateContactData {
    fullName: string;
    position: string;
    email: string;
    phone: string;
    linkedin?: string;
    isPrimary?: boolean;
    notes?: string;
}

export interface UpdateContactData {
    fullName?: string;
    position?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    isPrimary?: boolean;
    notes?: string;
}

export interface DeleteCompanyData {

}

export interface GetContactsResponse {
    contacts: Contact[]
}

export interface GetContactResponse {
    contact: Contact
}

export interface GetAllContactsResponse {
    contacts: Contact[]
}

export interface CreateContactResponse {
    message: string;
    contact: Contact;
}

export interface UpdateContactResponse {
    message: string;
    contact: Contact;
}

export interface DeleteCompanyResponse {
    message: string;
}