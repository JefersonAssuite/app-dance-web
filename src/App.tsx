
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Mensagem from "./pages/Mensagem";
import SendVideo from "./pages/Video";
import Biblioteca from "./pages/Biblioteca";
import LibraryPage from "./pages/LibraryPage";
import ProtectedRoute from "./components/ProtectedRoute";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace /> } />
          <Route path="/auth" element={<Auth />} />
          <Route path="/video" element={<ProtectedRoute><SendVideo/> </ProtectedRoute>} />
          <Route path="biblioteca/:bibliotecaId" element={<LibraryPage/>} />
          <Route path="biblioteca" element={<ProtectedRoute><Biblioteca/></ProtectedRoute>}/>
          <Route path="/mensagem" element={<ProtectedRoute><Mensagem/></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
