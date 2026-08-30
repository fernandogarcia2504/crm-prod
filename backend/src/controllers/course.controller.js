import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import s3Client, { S3_BUCKET } from "../config/s3.js";
import Business from "../models/business.model.js";
import Course from "../models/course.model.js";

const sanitizeFileName = (fileName) =>
    fileName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.\-_]/g, "_");

const getModulePrefix = (courseId, moduleId) =>
    `courses/${courseId}/modules/${moduleId}/`;

const uploadModuleFile = async (courseId, moduleId, file) => {

    const safeName = sanitizeFileName(file.originalname);
    const s3Key = `${getModulePrefix(courseId, moduleId)}${Date.now()}-${safeName}`;

    await s3Client.send(
        new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: s3Key,
            Body: file.buffer,
            ContentType: file.mimetype
        })
    );

    return {
        s3Key,
        s3Bucket: S3_BUCKET,
        originalName: file.originalname
    };

};


// CREAR UN CURSO
export const createCourse = async (req, res) => {

    try {

        const { businessId } = req.params;
        const { title, description, active } = req.body;

        if (!title) {
            return res.status(400).json({ message: "El titulo es requerido" });
        }

        const business = await Business.findById(businessId);

        if (!business) {
            return res.status(404).json({ message: "Business no encontrado" });
        }

        const course = await Course.create({
            business: businessId,
            title,
            description,
            active: active ?? true,
            modules: []
        });

        return res.status(201).json({
            message: "Curso creado exitosamente",
            course
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Error al crear el curso" });

    }

};


// LISTAR CURSOS DE UN BUSINESS
export const getCourses = async (req, res) => {

    try {

        const { businessId } = req.params;

        const courses = await Course
            .find({ business: businessId })
            .select("-modules.quiz.correctIndex")
            .sort({ createdAt: -1 });

        return res.status(200).json({ courses });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Error al obtener los cursos" });

    }

};


// OBTENER UN CURSO (con las respuestas correctas, para edicion en el CRM)
export const getCourse = async (req, res) => {

    try {

        const { courseId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "El curso no existe" });
        }

        return res.status(200).json({ course });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Error al obtener el curso" });

    }

};


// ACTUALIZAR DATOS GENERALES DEL CURSO
export const updateCourse = async (req, res) => {

    try {

        const { courseId } = req.params;
        const { title, description, active } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "El curso no existe" });
        }

        if (title !== undefined) course.title = title;
        if (description !== undefined) course.description = description;
        if (active !== undefined) course.active = active;

        await course.save();

        return res.status(200).json({
            message: "Curso actualizado correctamente",
            course
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Error al actualizar el curso" });

    }

};


// ELIMINAR UN CURSO
export const deleteCourse = async (req, res) => {

    try {

        const { courseId } = req.params;

        const course = await Course.findByIdAndDelete(courseId);

        if (!course) {
            return res.status(404).json({ message: "El curso no existe" });
        }

        return res.status(200).json({ message: "Curso eliminado correctamente" });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Error al eliminar el curso" });

    }

};


// AGREGAR UN MODULO (titulo/descripcion/orden/quiz; el PDF/video se
// suben despues con los endpoints dedicados una vez existe el moduleId)
export const addModule = async (req, res) => {

    try {

        const { courseId } = req.params;
        const { title, description, order, quiz, passingScore } = req.body;

        if (!title) {
            return res.status(400).json({ message: "El titulo del modulo es requerido" });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "El curso no existe" });
        }

        course.modules.push({
            title,
            description,
            order: order ?? course.modules.length,
            quiz: quiz || [],
            passingScore: passingScore ?? 80
        });

        await course.save();

        return res.status(201).json({
            message: "Modulo agregado correctamente",
            course
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Error al agregar el modulo" });

    }

};


// ACTUALIZAR UN MODULO (titulo/descripcion/orden/quiz/link de video externo)
export const updateModule = async (req, res) => {

    try {

        const { courseId, moduleId } = req.params;
        const { title, description, order, quiz, passingScore, videoExternalUrl } = req.body;

        const course = await Course.findById(courseId);
        const mod = course?.modules.id(moduleId);

        if (!mod) {
            return res.status(404).json({ message: "El modulo no existe" });
        }

        if (title !== undefined) mod.title = title;
        if (description !== undefined) mod.description = description;
        if (order !== undefined) mod.order = order;
        if (quiz !== undefined) mod.quiz = quiz;
        if (passingScore !== undefined) mod.passingScore = passingScore;

        if (videoExternalUrl !== undefined) {
            mod.video = mod.video || {};
            mod.video.externalUrl = videoExternalUrl;
        }

        await course.save();

        return res.status(200).json({
            message: "Modulo actualizado correctamente",
            course
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Error al actualizar el modulo" });

    }

};


// SUBIR/REEMPLAZAR EL PDF DE UN MODULO
export const uploadModulePdf = async (req, res) => {

    try {

        const { courseId, moduleId } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No se proporciono ningun archivo" });
        }

        const course = await Course.findById(courseId);
        const mod = course?.modules.id(moduleId);

        if (!mod) {
            return res.status(404).json({ message: "El modulo no existe" });
        }

        // Si ya habia un PDF anterior, se borra de S3 antes de subir el nuevo
        if (mod.pdf?.s3Key) {
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: mod.pdf.s3Bucket,
                    Key: mod.pdf.s3Key
                })
            );
        }

        mod.pdf = await uploadModuleFile(courseId, moduleId, req.file);

        await course.save();

        return res.status(200).json({
            message: "PDF subido correctamente",
            course
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Error al subir el PDF" });

    }

};


// SUBIR/REEMPLAZAR EL VIDEO DE UN MODULO (archivo a S3)
export const uploadModuleVideo = async (req, res) => {

    try {

        const { courseId, moduleId } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No se proporciono ningun archivo" });
        }

        const course = await Course.findById(courseId);
        const mod = course?.modules.id(moduleId);

        if (!mod) {
            return res.status(404).json({ message: "El modulo no existe" });
        }

        if (mod.video?.s3Key) {
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: mod.video.s3Bucket,
                    Key: mod.video.s3Key
                })
            );
        }

        const uploaded = await uploadModuleFile(courseId, moduleId, req.file);

        mod.video = { ...uploaded, externalUrl: undefined };

        await course.save();

        return res.status(200).json({
            message: "Video subido correctamente",
            course
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Error al subir el video" });

    }

};


// ELIMINAR UN MODULO
export const deleteModule = async (req, res) => {

    try {

        const { courseId, moduleId } = req.params;

        const course = await Course.findById(courseId);
        const mod = course?.modules.id(moduleId);

        if (!mod) {
            return res.status(404).json({ message: "El modulo no existe" });
        }

        if (mod.pdf?.s3Key) {
            await s3Client.send(
                new DeleteObjectCommand({ Bucket: mod.pdf.s3Bucket, Key: mod.pdf.s3Key })
            );
        }

        if (mod.video?.s3Key) {
            await s3Client.send(
                new DeleteObjectCommand({ Bucket: mod.video.s3Bucket, Key: mod.video.s3Key })
            );
        }

        mod.deleteOne();

        await course.save();

        return res.status(200).json({
            message: "Modulo eliminado correctamente",
            course
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({ message: "Error al eliminar el modulo" });

    }

};
