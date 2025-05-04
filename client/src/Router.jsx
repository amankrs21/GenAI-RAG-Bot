import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ChatHome from './pages/chat/ChatHome';
import Welcome from './pages/welcome/Welcome';
import FileMain from './pages/files/FilesMain';
import ServerUnavl from './pages/error/ServerUnavl';
import PageNotFound from './pages/error/PageNotFound';
import PrivateRoutes from './middleware/PrivateRoutes';


export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/404" element={<PageNotFound />} />
                <Route path="/503" element={<ServerUnavl />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path='*' element={<Navigate to='/404' />} />
                <Route path="/" element={<Navigate to="/welcome" />} />
                <Route path="/" element={<PrivateRoutes />}>
                    <Route path="/chat" element={<ChatHome />} />
                    <Route path="/source" element={<FileMain />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
