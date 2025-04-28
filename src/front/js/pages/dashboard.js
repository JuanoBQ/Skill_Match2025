import React from "react";
import { Tabs } from "../component/tabs.jsx";
import { UsefullCard } from "../component/usefullCard.jsx";
import { DashAccordion } from "../component/dashAccordion.jsx";

export const Dashboard = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-8">
                    <div className="d-flex">
                        <div className="container mb-5 background rounded-3 mx-5 mt-5">
                            <div className="ps-5 container-fluid py-5 text-start">
                                <h1 className="display-6">A Warm Welcome!</h1>
                                <p className="fs-5">
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore facere distinctio voluptates quia officiis unde nobis neque veniam hic. Sequi totam laudantium, velit a quaerat deleniti blanditiis facere reiciendis cumque!
                                </p>
                            </div>
                        </div>
                    </div>
                    <Tabs />
                </div>
                <aside className="col-4 mt-5">
                    <div className="card mx-0 shadow-sm border border-0 background" style={{maxWidth: "22rem"}}>
                        <div className="card-body d-flex pb-2 border-bottom">
                            <i className="fa-solid fa-circle-user fa-2xl mt-3 ms-2"></i><h4 className="ms-3">Name. L</h4>
                        </div>
                        <div className="card-body ms-3">
                            <h5>Trabajos terminados: 6</h5>
                        </div>
                    </div>
                    <DashAccordion />
                    <UsefullCard />
                </aside>
            </div>
        </div>
    )
}