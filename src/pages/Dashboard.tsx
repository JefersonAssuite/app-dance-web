import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Upload, LogOut, MessageCircle } from "lucide-react";
import { auth } from "@/services/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, getFirestore } from "firebase/firestore";
import { app } from "../services/FirebaseConfig";
import Header from "@/components/Header"; 

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [videos, setVideos] = useState([]); // Estado para armazenar os vídeos
  const navigate = useNavigate();
  const firestore = getFirestore(app);

  useEffect(() => {
    // Carregar mensagens
    const messagesCollection = collection(firestore, "messages");
    const unsubscribeMessages = onSnapshot(messagesCollection, (snapshot) => {
      const messagesList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesList);
    });

    // Carregar vídeos
    const videosCollection = collection(firestore, "videos");
    const unsubscribeVideos = onSnapshot(videosCollection, (snapshot) => {
      const videosList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVideos(videosList);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeVideos();
    };
  }, [firestore]);

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
    <div className="min-h-screen bg-neutral-50 p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
      <Header handleLogout={handleLogout} />

        {/* Exibição das Mensagens */}
        <div className="mb-8 mt-12">
          <h2 className="text-xl font-semibold mb-2">Mensagens</h2>
          <div>
            {messages.map((msg) => (
              <div key={msg.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
                <strong className="text-success">{msg.user_name || "Anônimo"}</strong>
                <p>{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Exibição dos Vídeos */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Vídeos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div key={video.id} className="p-4 bg-gray-100 rounded-lg">
                  <strong>{video.title || "Sem Título"}</strong>
                  <p>{video.description}</p>
                  <video controls className="w-full rounded">
                    <source src={video.video_url} type="video/mp4" />
                    Seu navegador não suporta vídeos.
                  </video>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Nenhum vídeo encontrado.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
