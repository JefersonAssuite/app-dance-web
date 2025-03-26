import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/services/FirebaseConfig";
import { getAuth } from "firebase/auth"; // Importando o getAuth
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button"; // Supondo que Button já está implementado
import { Input } from "@/components/ui/input"; // Supondo que Input já está implementado
import Modal from "@/components/ui/Modal"; // Importando o modal universal
import Header from "@/components/Header";
import { toast } from "@/components/ui/use-toast";

const Biblioteca = () => {
  const [bibliotecas, setBibliotecas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bibliotecas"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBibliotecas(lista);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImagem(file);
  };

  const handleCreateBiblioteca = () => {
    const user = getAuth().currentUser; // Obtendo o usuário autenticado

    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar autenticado para realizar essa ação.", variant: "destructive" });
      return;
    }

    if (!nome || !modalidade || !descricao || !imagem) {
      alert("Por favor, preencha todos os campos e selecione uma imagem.");
      return;
    }

    const storageRef = ref(storage, `bibliotecas/${Date.now()}_${imagem.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imagem);

    uploadTask.on(
      "state_changed",
      null,
      (error) => alert("Erro ao fazer upload da imagem: " + error),
      async () => {
        const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "bibliotecas"), {
          nome,
          modalidade,
          descricao,
          imageUrl,
        });
        setIsModalOpen(false);
        setNome("");
        setModalidade("");
        setDescricao("");
        setImagem(null);
      }
    );
  };

 

  return (
    <div className="p-6 max-w-4xl">
      <Header/>
      <div className="mt-14">
        <h1 className="text-2xl font-bold mb-4 text-left">Bibliotecas de Vídeos</h1>

        {/* Botão para abrir o modal */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          + Criar Nova Biblioteca
        </Button>
      </div>

        {/* Lista de bibliotecas */}
        <div className="space-y-3">
            {bibliotecas.map((biblioteca) => (
            <div
                key={biblioteca.id}
                className="bg-[#e9e9e9] p-4 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() => navigate(`/biblioteca/${biblioteca.id}`)}
            >
                <p className="font-semibold">{biblioteca.nome}</p>
            </div>
            ))}
        </div>

      {/* Modal Universal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" /> {/* Funda escura */}
          <Dialog.Content className="fixed inset-0 max-w-lg p-6 mb-8 mx-auto bg-white rounded-lg shadow-lg z-50">
            <Dialog.Close asChild>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Fechar"
              >
                <label>X</label>
              </button>
            </Dialog.Close>

            <Dialog.Title className="text-xl font-semibold mb-4">Nova Biblioteca</Dialog.Title>

            {/* Formulário de criação de biblioteca */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nome da Biblioteca</label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Ritmo/Modalidade</label>
              <Input
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value)}
                placeholder="Digite o ritmo ou modalidade"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <Input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva a biblioteca"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Imagem da Capa</label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            {/* Botão de Salvar */}
            <Button
              onClick={handleCreateBiblioteca}
              className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Salvar Biblioteca
            </Button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Biblioteca;
