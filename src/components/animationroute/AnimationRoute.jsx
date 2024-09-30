import React from 'react'
import Home from '../home/Home';
import Fraud from '../fraud/Fraud';
import Website from '../website/Website';
import Statistics from '../statistics/Statistics';
import Login from '../login/Login';
import Admin from '../admin/Admin';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

function AnimationRoute() {
    const location = useLocation();
  return (
    <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/Fraud" element={<Fraud />} />
            <Route path="/Website" element={<Website />} />
            <Route path="/Statistics" element={<Statistics />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Admin" element={<Admin />} />
        </Routes>
    </AnimatePresence>
  )
}

export default AnimationRoute