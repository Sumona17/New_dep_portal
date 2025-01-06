import React, { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AxiosInterceptor } from "./service/axiosInstance";

import AppRoutes from "routes";
import "./App.css";
import ScrollToTop from "./ScrollToTop";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleBeforeInstallPrompt = (e) => {
    // Prevent the default behavior of the event (showing the browser's install prompt)
    e.preventDefault();

    // Store the event for later use
    const deferredPrompt = e;
    const installButton = document.createElement('button');
    installButton.textContent = 'Install App';

    // Optionally, you can display your custom install button or message to the user
    // and attach a click event to it to trigger the install prompt.
    installButton.addEventListener('click', () => {
      // Show the browser's install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      });
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <AxiosInterceptor>
          <AppRoutes />
          <ToastContainer
            position="bottom-right"
            closeOnClick
            pauseOnHover
            theme="light"
            autoClose={1500}
          />
        </AxiosInterceptor>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
