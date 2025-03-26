import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { signOut } from "firebase/auth";
import { auth } from "@/services/FirebaseConfig";

const Header = () => {
  const navigate = useNavigate();

  // Função de logout embutida no Header
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logout realizado", description: "Você foi desconectado com sucesso." });
      navigate("/auth");
    } catch (error) {
      toast({ title: "Erro ao sair", description: "Não foi possível fazer logout.", variant: "destructive" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 mb-8 flex justify-between items-center bg-white z-10 shadow-md p-4">
      <h1 className="text-3xl font-semibold text-neutral-800 cursor-pointer" onClick={() => navigate("/Dashboard")}>
        Dashboard
      </h1>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/video")} className="bg-success hover:bg-success-dark flex items-center gap-2">
          Inserir Vídeo
        </Button>
        <Button onClick={() => navigate("/biblioteca")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2">
          Bibliotecas
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
