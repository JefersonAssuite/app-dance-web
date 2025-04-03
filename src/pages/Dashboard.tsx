import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, getFirestore } from "firebase/firestore";
import { app } from "../services/FirebaseConfig";
import Header from "@/components/Header";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [bibliotecas, setBibliotecas] = useState([]); // Estado das bibliotecas
  const navigate = useNavigate();
  const firestore = getFirestore(app);

  useEffect(() => {
    const messagesCollection = collection(firestore, "messages");
    const unsubscribeMessages = onSnapshot(messagesCollection, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Carregar as bibliotecas do Firestore
    const bibliotecasCollection = collection(firestore, "bibliotecas");
    const unsubscribeBibliotecas = onSnapshot(bibliotecasCollection, (snapshot) => {
      setBibliotecas(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeMessages();
      unsubscribeBibliotecas();
    };
  }, [firestore]);

  const handleLibraryClick = (libraryId) => {
    navigate(`/biblioteca/${libraryId}`); // Navega para a página da biblioteca escolhida
  };

  // Separar bibliotecas por categoria
  const alongamentoBibliotecas = bibliotecas.filter(bib => bib.categoria === "Alongamento e Exercícios");
  const dancaBibliotecas = bibliotecas.filter(bib => bib.categoria === "Aula de Dança");

  return (
    <div className="min-h-screen bg-neutral-50 p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <Header />

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

        {/* Exibição das Bibliotecas Separadas por Categoria */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-2">Bibliotecas</h2>

          {/* Seção - Alongamento e Exercícios */}
          {alongamentoBibliotecas.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Alongamento e Exercícios</h3>
              <div className="overflow-x-auto flex space-x-4 py-4">
                {alongamentoBibliotecas.map((biblioteca) => (
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
                ))}
              </div>
            </div>
          )}

          {/* Seção - Aulas de Dança */}
          {dancaBibliotecas.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Aulas de Dança</h3>
              <div className="overflow-x-auto flex space-x-4 py-4">
                {dancaBibliotecas.map((biblioteca) => (
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
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
