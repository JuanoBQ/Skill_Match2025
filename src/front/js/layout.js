import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { Dashboard } from "./pages/Dashboard.js";
import { Helpcenter } from "./pages/helpcenter";
import { ContactUs } from "./pages/contactus";
import { Historial } from "./pages/historial";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Login from "./component/Login.jsx";
import Register from "./component/Register.jsx";
import EmployerProfile from "./component/EmployerProfile.jsx";
import FreelancerProfile from "./component/FreelancerProfile.jsx";
import ProfileForm from "./component/ProfileForm.jsx";
import DashboardFreelancer from "./component/DashboardFreelancer.jsx";
import DashboardProjects from "./component/DashboardProjects.jsx";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") {
        return <BackendURL />;
    }

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<EmployerProfile />} path="/employerProfile" />
                        <Route element={<FreelancerProfile />} path="/freelancerProfile" />
                        <Route element={<ProfileForm />} path="/profileform" />
                        <Route element={<DashboardFreelancer />} path="/DashboardFreelancer" />
                        <Route element={<DashboardProjects />} path="/DashboardProjects" />
                        <Route element={<Dashboard />} path="/Dashboard" />

               
                        <Route path="*" element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
