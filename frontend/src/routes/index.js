import React, { useState, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useIsFetching, useIsMutating } from 'react-query'
import { Spin, Modal } from 'antd'

import useLoader, { LoaderProvider } from 'context/loader'
import routes from 'constants/routes'
import PrivateLayout from 'components/Layout/PrivateLayout'
import PublicLayout from 'components/Layout/PublicLayout'
import { MetaDataProvider } from 'context/metaData'
import { getSessionExpiration, handleLogout } from '../utils/services';

let logoutTimer = null;
let alertTimer = null;
let countdownInterval = null;

export const RenderRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [countdown, setCountdown] = useState(null); // Countdown timer
  const [showAlert, setShowAlert] = useState(false); // Show alert modal
  const accountType = localStorage.getItem('account_type')
  // const accessToken = localStorage.getItem('token')
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  const { loader, setLoader } = useLoader();

  const checkSession = async () => {
    try {
      const expirationTime = await getSessionExpiration();
      console.log('Session expiration time:', expirationTime);
      if (expirationTime === 0) {
          handleLogout(setIsAuthenticated);
      } else {
          // Show countdown alert 1 minute before expiration
          const alertTime = expirationTime - 60000;
          if (alertTime > 0) {
            alertTimer = setTimeout(() => {
              setShowAlert(true);
              setCountdown(60); // Start countdown at 60 seconds

              // Countdown interval
              countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                  if (prev <= 1) {
                    clearInterval(countdownInterval);
                    setCountdown(null);
                    handleLogout(setIsAuthenticated);
                    setIsAuthenticated(false);
                    logoutTimer = true;
                    return null;
                  }
                  return prev - 1;
                });
              }, 1000);
            }, alertTime);
          }
          setIsAuthenticated(true);
          console.log(isAuthenticated);
      }
    } catch (err) {
      console.error('Error checking session:', err);
      handleLogout(setIsAuthenticated);
    }  
  };

  const clearTimers = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    if (alertTimer) clearTimeout(alertTimer);
    if (countdownInterval) clearInterval(countdownInterval);
  };

  useEffect(() => {
    checkSession();
    
    // Clean up timer on logout
    return () => {
      // Clear timers on component unmount or re-initialization
      clearTimers();
    }
  }, []);


  useEffect(() => {
    if (isFetching || isMutating){
      setLoader(true)      
    } 
    else {
      setLoader(false)      
    } 
  }, [isFetching, isMutating])

  if (isAuthenticated) {
    return (
      <>
      {showAlert && (
            <Modal
              title="Session Expiration Warning"
              visible={showAlert}
              onCancel={() => setShowAlert(false)}
              footer={[
                 
              ]}
              closable={false}
              maskClosable={false}
              keyboard={false}
            >
            <p>Your session will expire in {countdown} seconds. Please refresh the page to continue.</p>
          </Modal>
        )}
      <Routes>
        {routes[accountType].map((route, index) => {
          const { component: Component, path, } = route
          return (
            <Route
              key={index}
              path={path}
              element={
                <>
                <Spin className={`${loader && 'custom-loader'}`} size="large" spinning={loader}></Spin>
                <PrivateLayout>
                  <Component />
                </PrivateLayout>
                </>
              }
            />
          )
        })}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
      </>
    )
  } else {
    return (
      <Routes>
        {routes['UN_AUTH_ROUTES'].map((route, index) => {
          const { component: Component, path, } = route
          return (
            <Route
              key={index}
              path={path}
              element={
                <PublicLayout>
                  <Spin className={`${loader && 'custom-loader'}`} size="large" spinning={loader}></Spin>
                  <Component />
                </PublicLayout>
              }
            />

          )
        })}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    )
  }
}

const AppRoutes = () => {

  return (
      <LoaderProvider>
        <MetaDataProvider>
          <RenderRoutes />
        </MetaDataProvider>
      </LoaderProvider>
  )
}

export default AppRoutes
