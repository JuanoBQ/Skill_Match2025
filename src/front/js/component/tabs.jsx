import React, { useState, useContext } from "react";
import { Context } from "../store/appContext.js";
import DashboardFreelancer from "./DashboardFreelancer.jsx";
import DashboardProjects from "./DashboardProjects.jsx";

export const Tabs = () => {



    return (
        <div className="container mt-4">
            <ul className="nav nav-tabs ms-5" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link active"
                        id="projects-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#projects"
                        type="button"
                        role="tab"
                        aria-controls="projects"
                        aria-selected="true"
                    >
                        Trabajos
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="freelancers-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#freelancers"
                        type="button"
                        role="tab"
                        aria-controls="freelancers"
                        aria-selected="false"
                    >
                        Freelancers
                    </button>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div
                    className="tab-pane fade show active"
                    id="projects"
                    role="tabpanel"
                    aria-labelledby="projects-tab"
                >
                    <DashboardProjects />
                </div>
                <div
                    className="tab-pane fade"
                    id="freelancers"
                    role="tabpanel"
                    aria-labelledby="freelancers-tab"
                >
                    <DashboardFreelancer />
                </div>
            </div>
        </div>
    );
};
