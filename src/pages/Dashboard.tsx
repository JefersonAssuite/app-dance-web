import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, getFirestore } from "firebase/firestore";
import { app } from "../services/FirebaseConfig";
import Header from "@/components/Header";


const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [videos, setVideos] = useState([]); // Estado para armazenar os vídeos
  const [bibliotecas, setBibliotecas] = useState([]); // Estado para armazenar as bibliotecas
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

    // Carregar bibliotecas
    const bibliotecasCollection = collection(firestore, "bibliotecas");
    const unsubscribeBibliotecas = onSnapshot(bibliotecasCollection, (snapshot) => {
      const bibliotecasList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBibliotecas(bibliotecasList);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeVideos();
      unsubscribeBibliotecas();
    };
  }, [firestore]);

  const handleLibraryClick = (libraryId) => {
    navigate(`/biblioteca/${libraryId}`); // Navega para a página da biblioteca escolhida
  };



  return (
    
    <div className="min-h-screen bg-neutral-50 p-6 animate-fade-in">
     
      <div className="max-w-6xl mx-auto">
        <Header/>

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

        


        {/* Exibição das Bibliotecas */}
      <div className="mt-12">
            <h2 className="text-xl font-semibold mb-2">Bibliotecas</h2>
            <div className="overflow-x-auto flex space-x-4 py-4">
              {bibliotecas.length > 0 ? (
                bibliotecas.map((biblioteca) => {
                  console.log("Dados da biblioteca:", biblioteca); // Verifica os dados no console

                  return (
                    <div 
                      key={biblioteca.id}
                      onClick={() => handleLibraryClick(biblioteca.id)} 
                      className="flex-none w-32 h-40 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transform transition-all flex flex-col items-center"
                    >
                      <img 
                        src={biblioteca.imageUrl} 
                        alt={biblioteca.nome || "Imagem da biblioteca"} 
                        className="w-full h-32 object-cover rounded-t-lg" 
                      />
                      <p className="text-center text-sm font-semibold mt-2">
                        {biblioteca.nome || "Sem nome"}
                      </p>
                    </div>
        );
      })
    ) : (
      <p className="text-gray-600">Nenhuma biblioteca encontrada.</p>
    )}
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
