import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, onSnapshot, getFirestore } from "firebase/firestore";
import { app } from "../services/FirebaseConfig";
import Header from "@/components/Header";

const LibraryPage = () => {
  const { bibliotecaId } = useParams(); // Pegamos o ID da biblioteca da URL
  const [videos, setVideos] = useState([]);
  const firestore = getFirestore(app);

  useEffect(() => {
    if (!bibliotecaId) return;

    // Buscar vídeos apenas da biblioteca selecionada
    const videosCollection = collection(firestore, "videos");
    const q = query(videosCollection, where("bibliotecaId", "==", bibliotecaId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videosList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVideos(videosList);
    });

    return () => unsubscribe();
  }, [bibliotecaId, firestore]);

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <Header/>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Vídeos da Biblioteca</h1>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="p-4 bg-gray-100 rounded-lg">
                <strong>{video.title || "Sem Título"}</strong>
                <p>{video.description}</p>
                <video controls className="w-full rounded">
                  <source src={video.video_url} type="video/mp4" />
                  Seu navegador não suporta vídeos.
                </video>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhum vídeo encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
