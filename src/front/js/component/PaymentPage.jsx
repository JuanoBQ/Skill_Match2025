import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const BASE_URL = "https://verbose-orbit-4jq6r6wq7xwv2j6j6-3001.app.github.dev/api";

const PaymentPage = () => {
    const { proposalId } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                const res = await fetch(`${BASE_URL}/proposals/${proposalId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });

                const data = await res.json();
                if (res.ok) {
                    setProposal(data);
                } else {
                    console.error("Error al cargar la propuesta:", data.msg);
                }
            } catch (error) {
                console.error("Error de conexión:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProposal();
    }, [proposalId]);

    const handlePayment = async () => {
        try {
            const res = await fetch(`${BASE_URL}/create-payment-intent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ proposal_id: proposalId })
            });

            const data = await res.json();

            if (res.ok) {
                alert("¡Pago procesado exitosamente en Stripe!");
                navigate("/employerProfile");
            } else {
                alert("Error en el pago: " + data.error);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión al procesar el pago");
        }
    };

    if (loading) {
        return <div className="container mt-5 text-center">Cargando detalles de pago...</div>;
    }

    if (!proposal) {
        return <div className="container mt-5 text-center">No se encontró la propuesta.</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Resumen de Pago</h2>

            <div className="card">
                <div className="card-body">
                    <h5>Proyecto: {proposal.project?.title || "Proyecto desconocido"}</h5>
                    <p><strong>Freelancer:</strong> {proposal.freelancer?.first_name} {proposal.freelancer?.last_name}</p>
                    <p><strong>Mensaje del Freelancer:</strong> {proposal.message}</p>
                    <p><strong>Presupuesto acordado:</strong> ${proposal.proposed_budget}</p>
                    <p><strong>Estado actual:</strong> {proposal.status}</p>

                    <button className="btn btn-primary w-100 mt-4" onClick={handlePayment}>
                        Confirmar Pago
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;