import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './styles/global.css';
import './styles/responsive.css';

const root = document.getElementById('root');
const prerendered = root.dataset.prerendered === 'true';
const application = <React.StrictMode><HelmetProvider><BrowserRouter><App initialIntroActive={!prerendered} /></BrowserRouter></HelmetProvider></React.StrictMode>;

if (prerendered) hydrateRoot(root, application);
else createRoot(root).render(application);
