import { useState } from "react";

import {
    Pencil,
    Trash2,
    Plus,
    X,
    FileText,
    Video,
    ChevronDown,
    ChevronUp,
    Check
} from "lucide-react";

import type { CourseModule, QuizQuestion, UpdateModuleData } from "../types/course.types";

interface ModuleEditorProps {
    module: CourseModule;

    onUpdate: (moduleId: string, data: UpdateModuleData) => Promise<unknown>;
    onDelete: (moduleId: string) => Promise<unknown>;
    onUploadPdf: (moduleId: string, file: File) => Promise<unknown>;
    onUploadVideo: (moduleId: string, file: File) => Promise<unknown>;
}

const emptyQuestion = (): QuizQuestion => ({
    question: "",
    options: ["", ""],
    correctIndex: 0
});

export default function ModuleEditor({ module, onUpdate, onDelete, onUploadPdf, onUploadVideo }: ModuleEditorProps) {

    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(false);

    const [title, setTitle] = useState(module.title);
    const [description, setDescription] = useState(module.description ?? "");
    const [order, setOrder] = useState(module.order);
    const [passingScore, setPassingScore] = useState(module.passingScore);
    const [videoExternalUrl, setVideoExternalUrl] = useState(module.video?.externalUrl ?? "");
    const [quiz, setQuiz] = useState<QuizQuestion[]>(module.quiz ?? []);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);

    const resetLocalState = () => {
        setTitle(module.title);
        setDescription(module.description ?? "");
        setOrder(module.order);
        setPassingScore(module.passingScore);
        setVideoExternalUrl(module.video?.externalUrl ?? "");
        setQuiz(module.quiz ?? []);
    };

    const startEditing = () => {
        resetLocalState();
        setEditing(true);
        setExpanded(true);
    };

    const cancelEditing = () => {
        resetLocalState();
        setEditing(false);
        setSaveError(null);
    };

    const handleSave = async () => {

        if (!title.trim()) {
            setSaveError("El título del módulo es requerido");
            return;
        }

        try {

            setSaving(true);
            setSaveError(null);

            await onUpdate(module._id, {
                title,
                description,
                order,
                passingScore,
                videoExternalUrl,
                quiz: quiz.filter((q) => q.question.trim() && q.options.every((opt) => opt.trim()))
            });

            setEditing(false);

        } catch (error) {
            console.error(error);
            setSaveError(error instanceof Error ? error.message : "Error al guardar el módulo");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`¿Eliminar el módulo "${module.title}"? Esto borra también su PDF/video de S3.`)) return;
        await onDelete(module._id);
    };

    const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingPdf(true);
            setFileError(null);
            await onUploadPdf(module._id, file);
        } catch (error) {
            console.error(error);
            setFileError(error instanceof Error ? error.message : "Error al subir el PDF");
        } finally {
            setUploadingPdf(false);
            e.target.value = "";
        }
    };

    const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingVideo(true);
            setFileError(null);
            await onUploadVideo(module._id, file);
        } catch (error) {
            console.error(error);
            setFileError(error instanceof Error ? error.message : "Error al subir el video");
        } finally {
            setUploadingVideo(false);
            e.target.value = "";
        }
    };

    const addQuestion = () => setQuiz((current) => [...current, emptyQuestion()]);

    const removeQuestion = (index: number) =>
        setQuiz((current) => current.filter((_, i) => i !== index));

    const updateQuestionText = (index: number, value: string) =>
        setQuiz((current) => current.map((q, i) => (i === index ? { ...q, question: value } : q)));

    const updateOptionText = (qIndex: number, oIndex: number, value: string) =>
        setQuiz((current) => current.map((q, i) => {
            if (i !== qIndex) return q;
            const options = q.options.map((opt, oi) => (oi === oIndex ? value : opt));
            return { ...q, options };
        }));

    const addOption = (qIndex: number) =>
        setQuiz((current) => current.map((q, i) =>
            i === qIndex ? { ...q, options: [...q.options, ""] } : q
        ));

    const removeOption = (qIndex: number, oIndex: number) =>
        setQuiz((current) => current.map((q, i) => {
            if (i !== qIndex) return q;
            const options = q.options.filter((_, oi) => oi !== oIndex);
            const correctIndex = q.correctIndex === oIndex ? 0 : q.correctIndex;
            return { ...q, options, correctIndex };
        }));

    const setCorrectOption = (qIndex: number, oIndex: number) =>
        setQuiz((current) => current.map((q, i) => (i === qIndex ? { ...q, correctIndex: oIndex } : q)));

    const fileLabel = (name?: string) => name ? name : null;

    return (
        <div className="w-full bg-[#1A1A1A] rounded-md">

            <div className="w-full flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setExpanded((current) => !current)}>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-[#5c5c5c]">#{module.order}</span>
                    <p className="text-sm">{module.title}</p>
                    <div className="flex items-center gap-2 text-[#5c5c5c]">
                        {module.pdf?.s3Key && <span title="Tiene PDF"><FileText size={13} /></span>}
                        {(module.video?.s3Key || module.video?.externalUrl) && <span title="Tiene video"><Video size={13} /></span>}
                        {module.quiz?.length > 0 && (
                            <span className="text-xs">{module.quiz.length} pregunta{module.quiz.length !== 1 ? "s" : ""}</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <button title="Editar" onClick={startEditing}>
                        <Pencil size={14} className="text-[#959595] hover:text-[#ECECEC] transition-colors" />
                    </button>
                    <button title="Eliminar módulo" onClick={handleDelete}>
                        <Trash2 size={14} className="text-[#959595] hover:text-red-400 transition-colors" />
                    </button>
                    <button onClick={() => setExpanded((current) => !current)}>
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="w-full px-4 pb-4 flex flex-col gap-4 border-t border-[#2b2b2b] pt-4">

                    {!editing && (
                        <>
                            {module.description && (
                                <p className="text-sm text-[#959595]">{module.description}</p>
                            )}
                            <p className="text-xs text-[#5c5c5c]">
                                {fileLabel(module.pdf?.originalName) ?? "Sin PDF"} · {fileLabel(module.video?.originalName) ?? (module.video?.externalUrl ? "Video externo" : "Sin video")} · Puntaje mínimo del quiz: {module.passingScore}%
                            </p>
                        </>
                    )}

                    {editing && (
                        <div className="w-full flex flex-col gap-4">

                            {saveError && <p className="text-sm text-red-400">{saveError}</p>}

                            <div className="w-full flex gap-3">
                                <div className="flex-1 flex flex-col gap-2">
                                    <p className="text-xs text-[#959595]">Título</p>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full rounded-md px-3 py-1 bg-[#212121] text-sm"
                                    />
                                </div>
                                <div className="w-20 flex flex-col gap-2">
                                    <p className="text-xs text-[#959595]">Orden</p>
                                    <input
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(Number(e.target.value))}
                                        className="w-full rounded-md px-3 py-1 bg-[#212121] text-sm"
                                    />
                                </div>
                                <div className="w-32 flex flex-col gap-2">
                                    <p className="text-xs text-[#959595]">Puntaje mínimo (%)</p>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={passingScore}
                                        onChange={(e) => setPassingScore(Number(e.target.value))}
                                        className="w-full rounded-md px-3 py-1 bg-[#212121] text-sm"
                                    />
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-2">
                                <p className="text-xs text-[#959595]">Descripción</p>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full h-16 rounded-md px-3 py-1 bg-[#212121] text-sm"
                                />
                            </div>

                            <div className="w-full flex flex-col gap-2">
                                <p className="text-xs text-[#959595]">Link de video externo (opcional, ej. Vimeo/YouTube no listado)</p>
                                <input
                                    type="text"
                                    value={videoExternalUrl}
                                    onChange={(e) => setVideoExternalUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full rounded-md px-3 py-1 bg-[#212121] text-sm"
                                />
                            </div>

                            {/* Quiz builder */}
                            <div className="w-full flex flex-col gap-3">
                                <div className="w-full flex justify-between items-center">
                                    <p className="text-xs text-[#959595]">Quiz</p>
                                    <button type="button" onClick={addQuestion} className="flex items-center gap-1 text-xs text-[#3550CB]">
                                        <Plus size={12} /> Agregar pregunta
                                    </button>
                                </div>

                                {quiz.length === 0 && (
                                    <p className="text-xs text-[#5c5c5c]">Este módulo no tiene quiz (lectura/video libre).</p>
                                )}

                                {quiz.map((question, qIndex) => (
                                    <div key={qIndex} className="w-full bg-[#212121] rounded-md p-3 flex flex-col gap-2">

                                        <div className="w-full flex gap-2 items-center">
                                            <input
                                                type="text"
                                                value={question.question}
                                                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                                placeholder={`Pregunta ${qIndex + 1}`}
                                                className="flex-1 rounded-md px-3 py-1 bg-[#1A1A1A] text-sm"
                                            />
                                            <button type="button" onClick={() => removeQuestion(qIndex)}>
                                                <Trash2 size={13} className="text-[#959595] hover:text-red-400 transition-colors" />
                                            </button>
                                        </div>

                                        <div className="w-full flex flex-col gap-1 pl-2">
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="w-full flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={`correct-${module._id}-${qIndex}`}
                                                        checked={question.correctIndex === oIndex}
                                                        onChange={() => setCorrectOption(qIndex, oIndex)}
                                                        title="Marcar como respuesta correcta"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                                                        placeholder={`Opción ${oIndex + 1}`}
                                                        className="flex-1 rounded-md px-3 py-1 bg-[#1A1A1A] text-sm"
                                                    />
                                                    {question.options.length > 2 && (
                                                        <button type="button" onClick={() => removeOption(qIndex, oIndex)}>
                                                            <X size={12} className="text-[#5c5c5c]" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => addOption(qIndex)} className="text-xs text-[#3550CB] self-start mt-1">
                                                + Agregar opción
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-1 bg-[#2F76D2] rounded-md px-3 py-1 text-sm"
                                >
                                    <Check size={13} />
                                    {saving ? "Guardando..." : "Guardar cambios"}
                                </button>
                                <button type="button" onClick={cancelEditing} className="text-sm text-[#959595]">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Subida de archivos: siempre disponible, dentro o fuera de modo edicion */}
                    <div className="w-full flex gap-6 pt-2 border-t border-[#2b2b2b]">

                        <label className="flex items-center gap-2 text-xs text-[#959595] cursor-pointer">
                            <FileText size={14} />
                            {uploadingPdf ? "Subiendo PDF..." : (module.pdf?.s3Key ? "Reemplazar PDF" : "Subir PDF")}
                            <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfChange} disabled={uploadingPdf} />
                        </label>

                        <label className="flex items-center gap-2 text-xs text-[#959595] cursor-pointer">
                            <Video size={14} />
                            {uploadingVideo ? "Subiendo video..." : (module.video?.s3Key ? "Reemplazar video" : "Subir video")}
                            <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleVideoChange} disabled={uploadingVideo} />
                        </label>

                    </div>

                    {fileError && <p className="text-xs text-red-400">{fileError}</p>}

                </div>
            )}

        </div>
    );
}
