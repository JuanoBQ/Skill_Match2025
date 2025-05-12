import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import Home from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { Dashboard } from "./pages/Dashboard.js";
import { Profile } from "./pages/Profile.js";
import { Helpcenter } from "./pages/helpcenter";
import { ContactUs } from "./pages/contactus";
import { About } from "./pages/About.js";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Admin } from "./pages/admis.js";
import Login from "./component/Login.jsx";
import Register from "./component/Register.jsx";
import EmployerProfile from "./component/EmployerProfile.jsx";
import FreelancerProfile from "./component/FreelancerProfile.jsx";
import FreelancerForm from "./component/FreelancerForm.jsx";
import DashboardFreelancer from "./component/DashboardFreelancer.jsx";
import DashboardProjects from "./component/DashboardProjects.jsx";
import PaymentPage from "./component/PaymentPage.jsx";
import EmployerForm from "./component/EmployerForm.jsx";
import SearchResults from "./component/SearchResults.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ProjectDetails from "./component/ProjectDetails.jsx";


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY, { link: false });


const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") {
        return <BackendURL />;
    }
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <div className="flex-grow-1">
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<EmployerProfile />} path="/employerProfile" />
                        <Route element={<FreelancerProfile />} path="/freelancerProfile" />
                        <Route element={<FreelancerForm />} path="/FreelancerForm" />
                        <Route element={<DashboardFreelancer />} path="/DashboardFreelancer" />
                        <Route element={<DashboardProjects />} path="/DashboardProjects" />
                        <Route element={<Dashboard />} path="/Dashboard" />               
                        <Route element={<EmployerForm />} path="/employerForm" />
                        <Route element={<Admin />} path="/admin" />
                        <Route path="*" element={<h1>Not found!</h1>} />
                  
                        <Route element={<SearchResults />} path="/search" />
                        <Route element={<Profile />} path="/Profile/:id" />
                        <Route path="/project/:id" element={<ProjectDetails />} />
                        <Route element={< ContactUs/>} path="/Contact" />
                        <Route element={< Helpcenter/>} path="/Help" />
                        <Route element={< About/>} path="/About" />
                        <Route element={<Elements stripe={stripePromise} options={{ link: false }}><PaymentPage /></Elements>} path="/payment/:proposalId" />


                        


                            <Route element={<h1>Not found!</h1>} />
                        </Routes>
                    </div>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);