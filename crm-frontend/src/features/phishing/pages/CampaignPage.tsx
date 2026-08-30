import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { motion } from "framer-motion";
import { ChevronLeft, Check, Rocket, RefreshCw, Trash2 } from "lucide-react";

import { BusinessContext } from "../../../app/context/BusinessContext";

import { useCampaign } from "../hooks/useCampaign";
import GophishServerBar from "../components/GophishServerBar";
import CampaignFunnelChart from "../components/CampaignFunnelChart";

import type { CampaignStatus, TargetEvent, CampaignTargetEmployee } from "../types/phishingCampaign.types";

const STATUS_OPTIONS: CampaignStatus[] = ["Planeada", "En curso", "Completada"];

const EVENT_COLUMNS: { event: TargetEvent; label: string }[] = [
    { event: "sent", label: "Enviado" },
    { event: "opened", label: "Abierto" },
    { event: "clicked", label: "Clic" },
    { event: "submittedData", label: "Envió datos" },
    { event: "reported", label: "Reportó" }
];

const isPopulatedEmployee = (
    employee: string | CampaignTargetEmployee
): employee is CampaignTargetEmployee => typeof employee !== "string";

export default function CampaignPage() {

    const navigate = useNavigate();
    const { companyId, projectId, campaignId } = useParams();

    const businessContext = useContext(BusinessContext);

    const { campaign, loading, error, updateCampaign, updateTargetEvent, launchCampaign, syncResults, deleteCampaign } = useCampaign(
        projectId ?? null,
        campaignId ?? null
    );

    const [launching, setLaunching] = useState(false);
    const [launchError, setLaunchError] = useState<string | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [syncError, setSyncError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [campaignUrlInput, setCampaignUrlInput] = useState("");
    const [savingUrl, setSavingUrl] = useState(false);
    const [urlSaveError, setUrlSaveError] = useState<string | null>(null);

    useEffect(() => {

        if (businessContext && !businessContext.businessLoading && !businessContext.isSecurityAwarenessBusiness) {
            navigate(`/entrepeneurship/${companyId}/projects/${projectId}`);
        }

    }, [businessContext, companyId, projectId, navigate]);

    useEffect(() => {
        setCampaignUrlInput(campaign?.campaignUrl ?? "");
    }, [campaign?.campaignUrl]);

    const handleStatusChange = (status: CampaignStatus) => {
        updateCampaign({ status }).catch((error) => console.error(error));
    };

    const handleSaveUrl = async () => {

        try {
            setSavingUrl(true);
            setUrlSaveError(null);
            await updateCampaign({ campaignUrl: campaignUrlInput });
        } catch (error) {
            console.error(error);
            setUrlSaveError(error instanceof Error ? error.message : "Error al guardar la URL");
        } finally {
            setSavingUrl(false);
        }
    };

    const handleToggle = (targetId: string, event: TargetEvent, currentValue: boolean) => {
        updateTargetEvent(targetId, event, !currentValue).catch((error) => console.error(error));
    };

    const handleLaunch = async () => {

        if (!window.confirm("Esto crea el grupo en Gophish y lanza la campaña real, enviando correos a los empleados seleccionados. ¿Continuar?")) {
            return;
        }

        try {
            setLaunching(true);
            setLaunchError(null);
            await launchCampaign();
        } catch (error) {
            console.error(error);
            setLaunchError(error instanceof Error ? error.message : "Error al lanzar en Gophish");
        } finally {
            setLaunching(false);
        }
    };

    const handleSync = async () => {

        try {
            setSyncing(true);
            setSyncError(null);
            await syncResults();
        } catch (error) {
            console.error(error);
            setSyncError(error instanceof Error ? error.message : "Error al sincronizar resultados");
        } finally {
            setSyncing(false);
        }
    };

    const handleDelete = async () => {

        if (!window.confirm("¿Eliminar esta campaña? Se borrará también en Gophish y esta acción no se puede deshacer.")) {
            return;
        }

        try {

            setDeleting(true);
            setDeleteError(null);

            const gophishWarning = await deleteCampaign();

            if (gophishWarning && !window.confirm(`${gophishWarning}\n\n¿Salir de todas formas?`)) {
                setDeleting(false);
                return;
            }

            navigate(`/entrepeneurship/${companyId}/projects/${projectId}/campaigns`);

        } catch (error) {
            console.error(error);
            setDeleteError(error instanceof Error ? error.message : "Error al eliminar la campaña");
            setDeleting(false);
        }

    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col mb-16">

            <button onClick={() => navigate(`/entrepeneurship/${companyId}/projects/${projectId}/campaigns`)} className="w-full flex flex-row items-center mt-12">
                <ChevronLeft />
                <p>Regresar a campañas</p>
            </button>

            {loading && (
                <p className="mt-8 text-[#959595]">Cargando campaña...</p>
            )}

            {error && (
                <p className="mt-8 text-red-400">{error}</p>
            )}

            {!loading && !error && campaign && (
                <>
                    <div className="w-full flex justify-between items-center mt-8">
                        <p>{campaign.name}</p>

                        <div className="flex items-center gap-3">
                            <select
                                value={campaign.status}
                                onChange={(e) => handleStatusChange(e.target.value as CampaignStatus)}
                                className="bg-[#212121] rounded-md px-3 py-1 text-sm"
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>

                            <button title="Eliminar campaña" onClick={handleDelete} disabled={deleting}>
                                <Trash2 size={16} className="text-[#959595] hover:text-red-400 transition-colors" />
                            </button>
                        </div>
                    </div>

                    {deleteError && <p className="text-sm text-red-400 mt-2">{deleteError}</p>}

                    <div className="w-full flex flex-col gap-2 mt-4">
                        <p className="text-xs text-[#959595]">URL pública de la landing page</p>

                        {campaign.gophishCampaignId ? (
                            <p className="text-sm text-[#5c5c5c]">
                                {campaign.campaignUrl || "(vacía — así se lanzó esta campaña, por eso los links del correo salen rotos)"}
                                <span className="block text-xs mt-1">Ya lanzada en Gophish: este campo ya no se puede cambiar aquí. Borra y vuelve a crear la campaña si necesitas corregirlo.</span>
                            </p>
                        ) : (
                            <div className="w-full flex items-center gap-3">
                                <input
                                    type="text"
                                    value={campaignUrlInput}
                                    onChange={(e) => setCampaignUrlInput(e.target.value)}
                                    placeholder="https://track.tudominio.com"
                                    className="flex-1 rounded-md px-3 py-1 bg-[#212121] text-sm"
                                />
                                <button
                                    onClick={handleSaveUrl}
                                    disabled={savingUrl || campaignUrlInput === (campaign.campaignUrl ?? "")}
                                    className="text-sm bg-[#2F76D2] rounded-md px-3 py-1 disabled:opacity-50"
                                >
                                    {savingUrl ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        )}

                        {urlSaveError && <p className="text-xs text-red-400">{urlSaveError}</p>}
                    </div>

                    <GophishServerBar />

                    <div className="w-full flex items-center gap-3 mt-4">
                        {!campaign.gophishCampaignId ? (
                            <button
                                type="button"
                                onClick={handleLaunch}
                                disabled={launching || !campaign.campaignUrl}
                                title={!campaign.campaignUrl ? "Falta la URL pública de la landing page" : undefined}
                                className="flex items-center gap-2 bg-[#2F76D2] rounded-md px-4 py-2 text-sm disabled:opacity-50"
                            >
                                <Rocket size={14} />
                                <p>{launching ? "Lanzando..." : "Lanzar en Gophish"}</p>
                            </button>
                        ) : (
                            <>
                                <p className="text-sm text-[#959595]">Gophish ID: {campaign.gophishCampaignId}</p>
                                <button
                                    type="button"
                                    onClick={handleSync}
                                    disabled={syncing}
                                    className="flex items-center gap-2 bg-[#232323] hover:bg-[#2F2F2F] rounded-md px-4 py-2 text-sm transition duration-300"
                                >
                                    <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
                                    <p>{syncing ? "Sincronizando..." : "Sincronizar resultados"}</p>
                                </button>
                            </>
                        )}
                    </div>

                    {launchError && <p className="text-sm text-red-400 mt-2">{launchError}</p>}
                    {syncError && <p className="text-sm text-red-400 mt-2">{syncError}</p>}

                    <div className="w-full grid grid-cols-5 gap-4 mt-6">
                        {[
                            { label: "Enviados", value: campaign.metrics.sent },
                            { label: "Abiertos", value: campaign.metrics.opened },
                            { label: "Clics", value: campaign.metrics.clicked },
                            { label: "Tasa de clics", value: `${campaign.metrics.clickRate}%` },
                            { label: "Tasa de reporte", value: `${campaign.metrics.reportRate}%` }
                        ].map((metric) => (
                            <div key={metric.label} className="bg-[#171717] rounded-md p-4 flex flex-col gap-1">
                                <p className="text-xs text-[#959595]">{metric.label}</p>
                                <p className="text-lg">{metric.value}</p>
                            </div>
                        ))}
                    </div>

                    <CampaignFunnelChart metrics={campaign.metrics} />

                    <div className="border-b border-b-[#777777] w-full mt-8 mb-6"></div>

                    <div className="w-full flex bg-[#171717] rounded-t-md px-4 py-2 text-sm text-[#959595]">
                        <p className="w-[26%]">Empleado</p>
                        <p className="w-[14%]">Sector</p>
                        {EVENT_COLUMNS.map((column) => (
                            <p key={column.event} className="w-[12%] text-center">{column.label}</p>
                        ))}
                    </div>

                    {campaign.targets.map((target) => {

                        const employee = isPopulatedEmployee(target.employee) ? target.employee : null;

                        return (
                            <div key={target._id} className="w-full flex items-center bg-[#1A1A1A] rounded-md px-4 py-3 mt-1">
                                <div className="w-[26%]">
                                    <p className="text-sm">{employee?.fullName ?? "Empleado"}</p>
                                    <p className="text-xs text-[#959595]">{employee?.email}</p>
                                </div>
                                <p className="w-[14%] text-sm text-[#959595]">{employee?.sector || "—"}</p>

                                {EVENT_COLUMNS.map((column) => {

                                    const active = target[column.event];

                                    return (
                                        <div key={column.event} className="w-[12%] flex justify-center">
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(target._id, column.event, active)}
                                                className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                                                    active ? "bg-[#2F76D2]" : "bg-[#212121]"
                                                }`}
                                            >
                                                {active && <Check size={14} />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </>
            )}

        </motion.div>
    )
}
