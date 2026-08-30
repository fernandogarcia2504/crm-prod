import bcrypt from "bcrypt";
import crypto from "crypto";

import Employee from "../models/employee.model.js";
import Company from "../models/company.model.js";
import Course from "../models/course.model.js";

// Genera una contraseña temporal legible para el curso (12 caracteres,
// sin ambiguos como 0/O o l/1)
const generateTempPassword = () => {

    const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

    let password = "";

    for (let i = 0; i < 12; i++) {
        const index = crypto.randomInt(0, alphabet.length);
        password += alphabet[index];
    }

    return password;
};

// Busca el curso activo de un negocio. Solo deberia existir uno (por eso
// no hay selector de curso en ningun lado del CRM), pero si llegara a
// haber mas de uno activo por error, toma el mas reciente.
const findActiveCourse = async (businessId) => {

    return Course
        .findOne({ business: businessId, active: true })
        .sort({ createdAt: -1 });

};

// Crea el username + hash de contraseña para el curso, y devuelve
// tambien la contraseña en texto plano (solo para esta respuesta).
// Si se le pasa un curso activo, enrola al empleado de una vez.
const issueCourseCredentials = async (email, activeCourse) => {

    const plainPassword = generateTempPassword();

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const normalizedUsername = email.trim().toLowerCase();

    return {
        courseAccount: {
            username: normalizedUsername,
            passwordHash,
            credentialsIssuedAt: new Date(),
            mustChangePassword: true,
            course: activeCourse?._id ?? null,
            enrolled: Boolean(activeCourse),
            enrolledAt: activeCourse ? new Date() : null,
            completed: false,
            progress: 0,
            moduleProgress: []
        },
        plainPassword
    };
};

const serializeEmployee = (employee, plainPassword) => ({
    ...employee.toObject(),
    courseAccount: {
        ...employee.courseAccount.toObject(),
        passwordHash: undefined
    },
    ...(plainPassword ? { temporaryPassword: plainPassword } : {})
});


// CREAR UN EMPLEADO (y sus credenciales del curso)
export const createEmployee = async (req, res) => {

    try {

        const { companyId } = req.params;

        const { fullName, position, email, sector, notes } = req.body;

        if (!fullName || !email) {
            return res.status(400).json({
                message: "El nombre completo y el correo son requeridos"
            });
        }

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "La empresa no existe"
            });
        }

        const existingEmployee = await Employee.findOne({
            company: companyId,
            email
        });

        if (existingEmployee) {
            return res.status(409).json({
                message: "Ya existe un empleado con este correo en la empresa"
            });
        }

        const { courseAccount, plainPassword } = await issueCourseCredentials(
            email,
            await findActiveCourse(company.business)
        );

        const employee = await Employee.create({
            business: company.business,
            company: companyId,
            fullName,
            position,
            email,
            sector,
            notes,
            courseAccount
        });

        const persisted = await Employee.findById(employee._id);

        return res.status(201).json({
            message: "Empleado creado exitosamente",
            employee: serializeEmployee(employee, plainPassword)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al crear el empleado"
        });

    }

};


// CARGA MASIVA DE EMPLEADOS (ej. pegar la nomina completa de una vez)
export const bulkCreateEmployees = async (req, res) => {

    try {

        const { companyId } = req.params;
        const { employees } = req.body;

        if (!Array.isArray(employees) || employees.length === 0) {
            return res.status(400).json({
                message: "Se requiere un arreglo de empleados"
            });
        }

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "La empresa no existe"
            });
        }

        const existingEmails = new Set(
            (await Employee.find({ company: companyId }).select("email"))
                .map((employee) => employee.email)
        );

        // Se busca una sola vez fuera del loop, no por cada fila
        const activeCourse = await findActiveCourse(company.business);

        const created = [];
        const skipped = [];

        for (const row of employees) {

            const { fullName, position, email, sector, notes } = row;

            if (!fullName || !email) {
                skipped.push({ row, reason: "Falta nombre completo o correo" });
                continue;
            }

            if (existingEmails.has(email)) {
                skipped.push({ row, reason: "Correo duplicado en la empresa" });
                continue;
            }

            const { courseAccount, plainPassword } = await issueCourseCredentials(email, activeCourse);

            const employee = await Employee.create({
                business: company.business,
                company: companyId,
                fullName,
                position,
                email,
                sector,
                notes,
                courseAccount
            });

            existingEmails.add(email);

            created.push(serializeEmployee(employee, plainPassword));

        }

        return res.status(201).json({
            message: `${created.length} empleado(s) creado(s), ${skipped.length} omitido(s)`,
            created,
            skipped
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al cargar los empleados"
        });

    }

};


// LISTAR EMPLEADOS DE UNA EMPRESA
export const getEmployees = async (req, res) => {

    try {

        const { companyId } = req.params;

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "La empresa no existe"
            });
        }

        const employees = await Employee
            .find({ company: companyId })
            .sort({ sector: 1, fullName: 1 });

        return res.status(200).json({
            employees: employees.map((employee) => serializeEmployee(employee))
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener los empleados"
        });

    }

};


// OBTENER UN EMPLEADO
export const getEmployee = async (req, res) => {

    try {

        const { companyId, employeeId } = req.params;

        const employee = await Employee.findOne({
            _id: employeeId,
            company: companyId
        });

        if (!employee) {
            return res.status(404).json({
                message: "El empleado no existe"
            });
        }

        return res.status(200).json({
            employee: serializeEmployee(employee)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener el empleado"
        });

    }

};


// ACTUALIZAR UN EMPLEADO
export const updateEmployee = async (req, res) => {

    try {

        const { companyId, employeeId } = req.params;

        const { fullName, position, sector, status, notes, courseAccount } = req.body;

        const employee = await Employee.findOne({
            _id: employeeId,
            company: companyId
        });

        if (!employee) {
            return res.status(404).json({
                message: "El empleado no existe"
            });
        }

        if (fullName !== undefined) employee.fullName = fullName;
        if (position !== undefined) employee.position = position;
        if (sector !== undefined) employee.sector = sector;
        if (status !== undefined) employee.status = status;
        if (notes !== undefined) employee.notes = notes;

        // Permite marcar avance/enrolamiento/finalizacion del curso
        if (courseAccount !== undefined) {

            if (courseAccount.enrolled !== undefined) {
                employee.courseAccount.enrolled = courseAccount.enrolled;
                if (courseAccount.enrolled && !employee.courseAccount.enrolledAt) {
                    employee.courseAccount.enrolledAt = new Date();
                }
            }

            if (courseAccount.completed !== undefined) {
                employee.courseAccount.completed = courseAccount.completed;
                employee.courseAccount.completedAt = courseAccount.completed
                    ? new Date()
                    : null;
            }

            if (courseAccount.progress !== undefined) {
                employee.courseAccount.progress = courseAccount.progress;
            }

            if (courseAccount.course !== undefined) {
                employee.courseAccount.course = courseAccount.course;
            }

        }

        await employee.save();

        return res.status(200).json({
            message: "Empleado actualizado correctamente",
            employee: serializeEmployee(employee)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al actualizar el empleado"
        });

    }

};


// REGENERAR CREDENCIALES DEL CURSO (ej. el empleado perdio su contraseña)
export const regenerateCourseCredentials = async (req, res) => {

    try {

        const { companyId, employeeId } = req.params;

        const employee = await Employee.findOne({
            _id: employeeId,
            company: companyId
        });

        if (!employee) {
            return res.status(404).json({
                message: "El empleado no existe"
            });
        }

        const { courseAccount, plainPassword } = await issueCourseCredentials(employee.email);

        // Conserva enrolled/completed/progress, solo rota la contraseña.
        // Al ser una contraseña temporal nueva, se vuelve a pedir el
        // cambio en el próximo login.
        employee.courseAccount.username = courseAccount.username;
        employee.courseAccount.passwordHash = courseAccount.passwordHash;
        employee.courseAccount.credentialsIssuedAt = courseAccount.credentialsIssuedAt;
        employee.courseAccount.mustChangePassword = true;

        await employee.save();

        const persisted = await Employee.findById(employee._id);
        return res.status(200).json({
            message: "Credenciales regeneradas exitosamente",
            employee: serializeEmployee(employee, plainPassword)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al regenerar las credenciales"
        });

    }

};


// ASIGNAR/RE-SINCRONIZAR EL CURSO A TODOS LOS EMPLEADOS DE UNA EMPRESA
// Sirve para: 1) empleados que ya existian antes de crear el curso, o
// 2) forzar que todos vuelvan a ver el curso desde cero si se reemplazo
// su contenido. Nuevos empleados ya se enrolan solos al crearse
// (ver issueCourseCredentials), asi que esto es el respaldo manual.
export const assignCourseToCompany = async (req, res) => {

    try {

        const { companyId } = req.params;
        const { courseId } = req.body;

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: "La empresa no existe" });
        }

        // Si no se manda courseId, se usa el curso activo del negocio
        // (es lo normal, ya que solo hay uno)
        const course = courseId
            ? await Course.findById(courseId)
            : await findActiveCourse(company.business);

        if (!course) {
            return res.status(404).json({
                message: courseId
                    ? "El curso no existe"
                    : "Este negocio todavia no tiene un curso activo"
            });
        }

        if (String(course.business) !== String(company.business)) {
            return res.status(400).json({
                message: "Este curso pertenece a otro negocio"
            });
        }

        const result = await Employee.updateMany(
            { company: companyId },
            {
                $set: {
                    "courseAccount.course": course._id,
                    "courseAccount.enrolled": true,
                    "courseAccount.enrolledAt": new Date(),
                    "courseAccount.progress": 0,
                    "courseAccount.completed": false,
                    "courseAccount.completedAt": null,
                    "courseAccount.moduleProgress": []
                }
            }
        );

        return res.status(200).json({
            message: `Curso asignado a ${result.modifiedCount} empleado(s)`
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Error al asignar el curso" });

    }

};


// ELIMINAR UN EMPLEADO
export const deleteEmployee = async (req, res) => {

    try {

        const { companyId, employeeId } = req.params;

        const employee = await Employee.findOne({
            _id: employeeId,
            company: companyId
        });

        if (!employee) {
            return res.status(404).json({
                message: "El empleado no existe"
            });
        }

        await Employee.findByIdAndDelete(employeeId);

        return res.status(200).json({
            message: "Empleado eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al eliminar el empleado"
        });

    }

};
