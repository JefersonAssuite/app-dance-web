import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, onSnapshot, getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { app } from "../services/FirebaseConfig";
import Header from "@/components/Header";

const LibraryPage = () => {
  const { bibliotecaId } = useParams();
  const [videos, setVideos] = useState([]);
  const firestore = getFirestore(app);

  // Estado para modal de edição
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string, title: string, description: string } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    if (!bibliotecaId) return;

    const videosCollection = collection(firestore, "videos");
    const q = query(videosCollection, where("bibliotecaId", "==", bibliotecaId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videosList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVideos(videosList);
    });

    return () => unsubscribe();
  }, [bibliotecaId, firestore]);

  // Abrir modal de edição
  const openEditModal = (video: any) => {
    setSelectedVideo(video);
    setNewTitle(video.title);
    setNewDescription(video.description);
    setIsEditing(true);
  };

  // Fechar modal
  const closeModal = () => {
    setIsEditing(false);
    setSelectedVideo(null);
  };

  // Salvar edição no Firestore
  const handleSaveEdit = async () => {
    if (selectedVideo) {
      const videoRef = doc(firestore, "videos", selectedVideo.id);
      await updateDoc(videoRef, {
        title: newTitle,
        description: newDescription,
      });
      closeModal();
    }
  };

  // Excluir vídeo
  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este vídeo?")) {
      const videoRef = doc(firestore, "videos", id);
      await deleteDoc(videoRef);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <Header />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Vídeos da Biblioteca</h1>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="p-4 bg-gray-100 rounded-lg relative">
                <strong>{video.title || "Sem Título"}</strong>
                <p>{video.description}</p>
                <video controls className="w-full rounded">
                  <source src={video.video_url} type="video/mp4" />
                  Seu navegador não suporta vídeos.
                </video>

                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(video)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhum vídeo encontrado.</p>
        )}
      </div>

      {/* Modal de Edição */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Editar Vídeo</h2>
            <label className="block mb-2">Título:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <label className="block mt-4 mb-2">Descrição:</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600">
                Cancelar
              </button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
