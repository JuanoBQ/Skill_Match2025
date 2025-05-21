import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Spinner, Card, Button, Badge } from "react-bootstrap";
export const Historial = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const res = await fetch(`${process.env.BACKEND_URL}/api/freelancer/${store.userId}/proposals`);
                const data = await res.json();
                setProposals(data.proposals);
                console.log()
                setLoading(false);
            } catch (error) {
                console.error("Error fetching proposals:", error);
                setLoading(false);
            }
        };
        fetchProposals();
    }, [store.userId]);
    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }
    return (
        <div className="container mt-5">
            <h2 className="mb-4 fw-bold text-primary">Historial de Pagos</h2>
            <div className="row">
                {proposals.map((proposal) => (
                    <div className="col-md-6 mb-4" key={proposal.id}>
                        <Card className="shadow-sm rounded-4">
                            <Card.Body>
                                <Card.Title className="text-dark">
                                    {proposal.project?.title || "Proyecto sin título"}
                                </Card.Title>
                                <Card.Text>
                                    <strong>Presupuesto:</strong> ${proposal.proposed_budget}
                                    <br />
                                    <strong>Estado:</strong>{" "}
                                    <Badge
                                        pill
                                        bg={
                                            proposal.status === "completed"
                                                ? "success"
                                                : proposal.status === "pending"
                                                    ? "warning"
                                                    : "secondary"
                                        }
                                        className="text-uppercase"
                                    >
                                        {proposal.status}
                                    </Badge>
                                    <br />
                                    <strong>Fecha:</strong> {new Date(proposal.created_at).toLocaleDateString()}
                                </Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/proyecto/${proposal.project_id}`)}>
                                    Ver Proyecto
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};