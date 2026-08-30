import express from "express";

import { getDocuments, uploadDocument, deleteDocument } from "../controllers/document.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/:companyId", getDocuments);

router.post("/:companyId", (req, res, next) => {

    upload.single("file")(req, res, (err) => {

        if (err) {

            return res.status(400).json({
                message: err.message || "Error al procesar el archivo"
            });

        }

        next();

    });

}, uploadDocument);

router.delete("/:companyId/:documentId", deleteDocument);

export default router;