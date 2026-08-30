import express from "express";

import { courseContentUpload } from "../middlewares/upload.middleware.js";

import {
    createCourse,
    getCourses,
    getCourse,
    updateCourse,
    deleteCourse,
    addModule,
    updateModule,
    deleteModule,
    uploadModulePdf,
    uploadModuleVideo
} from "../controllers/course.controller.js";

const router = express.Router();

router.post("/:businessId", createCourse);

router.get("/:businessId", getCourses);

router.get("/:businessId/courses/:courseId", getCourse);

router.put("/:businessId/courses/:courseId", updateCourse);

router.delete("/:businessId/courses/:courseId", deleteCourse);

router.post("/:businessId/courses/:courseId/modules", addModule);

router.put("/:businessId/courses/:courseId/modules/:moduleId", updateModule);

router.delete("/:businessId/courses/:courseId/modules/:moduleId", deleteModule);

router.post(
    "/:businessId/courses/:courseId/modules/:moduleId/pdf",
    courseContentUpload.single("file"),
    uploadModulePdf
);

router.post(
    "/:businessId/courses/:courseId/modules/:moduleId/video",
    courseContentUpload.single("file"),
    uploadModuleVideo
);

export default router;
