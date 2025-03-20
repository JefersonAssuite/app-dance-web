import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { db, auth } from "@/services/FirebaseConfig";
import { collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";


const MessageScreen = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({ title: "Erro", description: "A mensagem não pode estar vazia.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast({ title: "Erro de autenticação", description: "Você precisa estar logado para enviar mensagens.", variant: "destructive" });
        navigate("/auth");
        return;
      }

      // Buscar o nome do usuário no Firestore
      const userRef = doc(db, "usuarios", currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error("Usuário não encontrado no banco de dados.");
      }

      const userName = userSnap.data().nomeCompleto; // Nome do usuário

      // Salvar a mensagem no Firestore com o nome do usuário
      await addDoc(collection(db, "messages"), {
        user_id: currentUser.uid,
        user_name: userName, // Adiciona o nome do usuário
        message,
        created_at: Timestamp.now()
      });

      toast({ title: "Mensagem enviada", description: "Sua mensagem foi enviada com sucesso." });
      setMessage("");

      // Redireciona para o Dashboard após o envio da mensagem
      navigate("/dashboard");

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({ title: "Erro", description: "Não foi possível enviar a mensagem.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Sua lógica de logout
    console.log("Logout!");
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 flex justify-center items-center">
      <Header handleLogout={handleLogout} />
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-4">Enviar Mensagem</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem*</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui..."
              className="h-32"
              required
            />
          </div>
          <Button type="submit" className="bg-success hover:bg-success-dark w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MessageScreen;
