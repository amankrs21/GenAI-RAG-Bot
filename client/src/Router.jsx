import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/login/Login';
import Account from './pages/login/Account';
import FileMain from './pages/files/FilesMain';
import Feedback from './pages/feedback/Feedback';
import ServerUnavl from './pages/error/ServerUnavl';
import PageNotFound from './pages/error/PageNotFound';
import PrivateRoutes from './middleware/PrivateRoutes';
import ChatMainLayout from './pages/chat/ChatMainLayout';


// Router Component
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/503" element={<ServerUnavl />} />
                <Route path="/404" element={<PageNotFound />} />
                <Route path="/chat" element={<ChatMainLayout />} />

                <Route path='*' element={<Navigate to='/404' />} />
                <Route path="/" element={<Navigate to="/chat" />} />

                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<Navigate to="/admin/login" />} />

                <Route path="/admin" element={<PrivateRoutes />}>
                    <Route path="/admin/source" element={<FileMain />} />
                    <Route path="/admin/account" element={<Account />} />
                    <Route path="/admin/feedback" element={<Feedback />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
