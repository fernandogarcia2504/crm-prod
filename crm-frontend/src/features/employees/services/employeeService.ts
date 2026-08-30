import type {
    Employee,
    CreateEmployeeData,
    UpdateEmployeeData,
    GetEmployeesResponse,
    CreateEmployeeResponse,
    BulkCreateEmployeesResponse,
    AssignCourseResponse
} from "../types/employee.types";

const API_URL = "http://localhost:3000/api/employees";

export const getEmployees = async (companyId: string): Promise<Employee[]> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data: GetEmployeesResponse = await response.json();

    if (!response.ok) {
        throw new Error("Error al obtener los empleados");
    }

    return data.employees;
};

export const createEmployee = async (
    companyId: string,
    employeeData: CreateEmployeeData
): Promise<Employee> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(employeeData)
    });

    const data: CreateEmployeeResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al crear el empleado");
    }

    return data.employee;
};

export const bulkCreateEmployees = async (
    companyId: string,
    employees: CreateEmployeeData[]
): Promise<BulkCreateEmployeesResponse> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}/bulk`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ employees })
    });

    const data: BulkCreateEmployeesResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al cargar los empleados");
    }

    return data;
};

export const updateEmployee = async (
    companyId: string,
    employeeId: string,
    employeeData: UpdateEmployeeData
): Promise<Employee> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}/employees/${employeeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(employeeData)
    });

    const data: CreateEmployeeResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el empleado");
    }

    return data.employee;
};

export const regenerateCourseCredentials = async (
    companyId: string,
    employeeId: string
): Promise<Employee> => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/${companyId}/employees/${employeeId}/regenerate-credentials`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const data: CreateEmployeeResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al regenerar las credenciales");
    }

    return data.employee;
};

export const deleteEmployee = async (
    companyId: string,
    employeeId: string
): Promise<void> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}/employees/${employeeId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar el empleado");
    }
};

// Re-sincroniza el curso activo del negocio a todos los empleados de la
// empresa. Sirve como respaldo manual para nomina que ya existia antes
// de crear el curso (los empleados nuevos ya se enrolan solos).
export const assignCourseToCompany = async (
    companyId: string
): Promise<AssignCourseResponse> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}/assign-course`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({})
    });

    const data: AssignCourseResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al asignar el curso");
    }

    return data;
};
