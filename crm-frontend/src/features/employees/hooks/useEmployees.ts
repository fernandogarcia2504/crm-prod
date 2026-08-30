import { useEffect, useState } from "react";

import {
    getEmployees,
    createEmployee as createEmployeeService,
    bulkCreateEmployees as bulkCreateEmployeesService,
    updateEmployee as updateEmployeeService,
    regenerateCourseCredentials as regenerateCourseCredentialsService,
    deleteEmployee as deleteEmployeeService,
    assignCourseToCompany as assignCourseToCompanyService
} from "../services/employeeService";

import type { Employee, CreateEmployeeData, UpdateEmployeeData } from "../types/employee.types";

export function useEmployees(companyId: string | null) {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!companyId) {
            setEmployees([]);
            return;
        }

        const fetchEmployees = async () => {
            try {

                setLoading(true);
                setError(null);

                const data = await getEmployees(companyId);

                setEmployees(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener los empleados"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchEmployees();

    }, [companyId]);

    const createEmployee = async (employeeData: CreateEmployeeData) => {

        if (!companyId) {
            throw new Error("No existe un proyecto seleccionado");
        }

        const newEmployee = await createEmployeeService(companyId, employeeData);

        setEmployees((current) => [...current, newEmployee]);

        return newEmployee;
    };

    const bulkCreateEmployees = async (employeesData: CreateEmployeeData[]) => {

        if (!companyId) {
            throw new Error("No existe un proyecto seleccionado");
        }

        const result = await bulkCreateEmployeesService(companyId, employeesData);

        setEmployees((current) => [...current, ...result.created]);

        return result;
    };

    const updateEmployee = async (employeeId: string, employeeData: UpdateEmployeeData) => {

        if (!companyId) {
            throw new Error("No existe un proyecto seleccionado");
        }

        const updatedEmployee = await updateEmployeeService(companyId, employeeId, employeeData);

        setEmployees((current) =>
            current.map((employee) => (employee._id === employeeId ? updatedEmployee : employee))
        );

        return updatedEmployee;
    };

    const regenerateCourseCredentials = async (employeeId: string) => {

        if (!companyId) {
            throw new Error("No existe un proyecto seleccionado");
        }

        const updatedEmployee = await regenerateCourseCredentialsService(companyId, employeeId);

        setEmployees((current) =>
            current.map((employee) => (employee._id === employeeId ? updatedEmployee : employee))
        );

        return updatedEmployee;
    };

    const deleteEmployee = async (employeeId: string) => {

        if (!companyId) {
            throw new Error("No existe un proyecto seleccionado");
        }

        await deleteEmployeeService(companyId, employeeId);

        setEmployees((current) => current.filter((employee) => employee._id !== employeeId));
    };

    const assignCourseToCompany = async () => {

        if (!companyId) {
            throw new Error("No existe un proyecto seleccionado");
        }

        const result = await assignCourseToCompanyService(companyId);

        // updateMany no devuelve los documentos actualizados, asi que se
        // vuelve a pedir la lista completa para reflejar el enrolamiento
        const refreshed = await getEmployees(companyId);
        setEmployees(refreshed);

        return result;
    };

    return {
        employees,
        loading,
        error,
        createEmployee,
        bulkCreateEmployees,
        updateEmployee,
        regenerateCourseCredentials,
        deleteEmployee,
        assignCourseToCompany
    };

}
