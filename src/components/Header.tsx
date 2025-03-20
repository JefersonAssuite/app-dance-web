// /components/Header.tsx
import React from "react";
import { Button } from "@/components/ui/button";
 
import { useNavigate } from "react-router-dom";

const Header = ({ handleLogout }: { handleLogout: () => void }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 mb-8 flex justify-between items-center bg-white z-10 shadow-md p-4">
      <h1 className="text-3xl font-semibold text-neutral-800" onClick={()=>navigate("/Dashboard")}>Dashboard</h1>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/video")} className="bg-success hover:bg-success-dark flex items-center gap-2">
          Inserir Vídeo
        </Button>
        <Button onClick={() => navigate("/mensagem")} className="bg-primary hover:bg-primary-dark flex items-center gap-2">
           Enviar Mensagem
        </Button>
        <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
           Sair
        </Button>
      </div>
    </header>
  );
};

export default Header;
