import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import Header from '../layout/Header';


// PrivateRoutes component to protect routes
export default function PrivateRoutes() {

    const navigate = useNavigate();
    const { isAuthLoading, isAuthenticated } = useAuth();

    useEffect(() => {

        if (!isAuthenticated) {
            navigate('/');
        };

        if (isAuthLoading) return;

    }, [isAuthLoading, isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            {!isAuthLoading && isAuthenticated ? (

                <>
                    <Header />
                    <Outlet />
                </>

            ) :
                null
            }
        </>
    );
};
