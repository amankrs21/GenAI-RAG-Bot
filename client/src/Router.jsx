import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ChatHome from './pages/chat/ChatHome';
import Welcome from './pages/welcome/Welcome';
import FileMain from './pages/files/FilesMain';
import ServerUnavl from './pages/error/ServerUnavl';
import PageNotFound from './pages/error/PageNotFound';
import PrivateRoutes from './middleware/PrivateRoutes';
import Feedback from './pages/feedback/Feedback';
import ChatMainLayout from './pages/chat/ChatMainLayout';


export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/503" element={<ServerUnavl />} />
                <Route path="/404" element={<PageNotFound />} />
                <Route path="/chat" element={<ChatMainLayout />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path='*' element={<Navigate to='/404' />} />
                <Route path="/" element={<Navigate to="/chat" />} />
                <Route path="/" element={<PrivateRoutes />}>
                    <Route path="/source" element={<FileMain />} />
                    <Route path="/feedback" element={<Feedback />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
