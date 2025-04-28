import React from "react";
import DashboardFreelancer from "./DashboardFreelancer.jsx";

export const Tabs = () => {
    return (
        <div>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Talent</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Contacts</button>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active d-flex justify-content-center flex-column" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0"><DashboardFreelancer /></div>
                <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0"><DashboardFreelancer /></div>
            </div>
        </div>
    );
};