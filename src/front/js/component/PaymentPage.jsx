import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const BASE_URL = "https://special-guacamole-v6pw5wqpv4ppcx7gg-3001.app.github.dev/api";

const PaymentPage = () => {
    const { proposalId } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);

    // Stripe
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [payLoading, setPayLoading] = useState(false);

    // 1) Cargar la propuesta
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

    // 2) Cuando la propuesta ya esté cargada, pedimos client_secret y payment_id
    useEffect(() => {
        if (!proposal) return;

        const createIntent = async () => {
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
                    setClientSecret(data.client_secret);
                    setPaymentId(data.payment_id);
                } else {
                    console.error("Error creando payment intent:", data.error);
                }
            } catch (error) {
                console.error("Error de conexión al crear intent:", error);
            }
        };
        createIntent();
    }, [proposal, proposalId]);

    // 3) Al hacer submit del form, confirmamos con Stripe y avisamos al backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;
        setPayLoading(true);

        const cardEl = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardEl }
        });

        if (error) {
            alert("Error al procesar la tarjeta: " + error.message);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Avisamos a nuestro backend para cambiar status -> completed
            await fetch(`${BASE_URL}/payments/${paymentId}/complete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });
            alert("¡Pago exitoso y status actualizado!");
            navigate("/employerProfile");
        }
        setPayLoading(false);
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

            <div className="card mb-4">
                <div className="card-body">
                    <h5>Proyecto: {proposal.project?.title || "Proyecto desconocido"}</h5>
                    <p><strong>Freelancer:</strong> {proposal.freelancer?.first_name} {proposal.freelancer?.last_name}</p>
                    <p><strong>Mensaje del Freelancer:</strong> {proposal.message}</p>
                    <p><strong>Presupuesto acordado:</strong> ${proposal.proposed_budget}</p>
                    <p><strong>Estado actual:</strong> {proposal.status}</p>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="mb-3">Método de Pago</h5>
                    {!clientSecret ? (
                        <p>Cargando formulario de pago…</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CardElement
                                    options={{
                                        style: {
                                            base: { fontSize: '16px', color: '#424770' },
                                            invalid: { color: '#9e2146' }
                                        }
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-success w-100"
                                disabled={!stripe || payLoading}
                            >
                                {payLoading ? "Procesando…" : `Pagar $${proposal.proposed_budget}`}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;