import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/services/FirebaseConfig";
import { getAuth } from "firebase/auth";
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { toast } from "@/components/ui/use-toast";

const Biblioteca = () => {
  const [bibliotecas, setBibliotecas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBiblioteca, setSelectedBiblioteca] = useState(null);
  const [nome, setNome] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [categoria, setCategoria] = useState("");
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

  const handleSaveBiblioteca = async () => {
    const user = getAuth().currentUser;
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar autenticado para realizar essa ação.", variant: "destructive" });
      return;
    }
    if (!nome || !modalidade || !descricao || !categoria) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (editMode) {
      const bibliotecaRef = doc(db, "bibliotecas", selectedBiblioteca.id);
      await updateDoc(bibliotecaRef, { nome, modalidade, descricao, categoria });
    } else {
      const storageRef = ref(storage, `bibliotecas/${Date.now()}_${imagem.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imagem);
      uploadTask.on(
        "state_changed",
        null,
        (error) => alert("Erro ao fazer upload da imagem: " + error),
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, "bibliotecas"), { nome, modalidade, descricao, imageUrl, categoria });
          toast({ title: "Biblioteca criada", description: "A nova biblioteca foi adicionada com sucesso." });
        }
      );
    }
    setIsModalOpen(false);
    setEditMode(false);
    setNome("");
    setModalidade("");
    setDescricao("");
    setImagem(null);
  };

  const handleEditBiblioteca = (biblioteca) => {
    setSelectedBiblioteca(biblioteca);
    setNome(biblioteca.nome);
    setModalidade(biblioteca.modalidade);
    setDescricao(biblioteca.descricao);
    setCategoria(biblioteca.categoria);
    setIsModalOpen(true);
    setEditMode(true);
  };

  const handleDeleteBiblioteca = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta biblioteca?")) {
      await deleteDoc(doc(db, "bibliotecas", id));
      toast({ title: "Biblioteca excluída", description: "A biblioteca foi removida com sucesso." });
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <Header/>
      <div className="mt-14">
        <h1 className="text-2xl font-bold mb-4 text-left">Bibliotecas de Vídeos</h1>
        <Button onClick={() => { setIsModalOpen(true); setEditMode(false); }} className="mb-4 bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400">
          + Criar Nova Biblioteca
        </Button>
      </div>

      <div className="space-y-3">
        {bibliotecas.map((biblioteca) => (
          <div key={biblioteca.id} className="bg-[#e9e9e9] p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200">
            <p className="font-semibold" onClick={() => navigate(`/biblioteca/${biblioteca.id}`)}>{biblioteca.nome}</p>
            <p className="text-sm text-gray-500">{biblioteca.categoria || "Sem categoria"}</p>
            <div className="flex gap-2">
              <Button onClick={() => handleEditBiblioteca(biblioteca)} className="bg-blue-500 text-white px-2 py-1 rounded">Editar</Button>
              <Button onClick={() => handleDeleteBiblioteca(biblioteca.id)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
          <Dialog.Content className="fixed inset-0 max-w-lg p-6 mb-8 mx-auto bg-white rounded-lg shadow-lg z-50">
            <Dialog.Close asChild>
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">X</button>
            </Dialog.Close>
            <Dialog.Title className="text-xl font-semibold mb-4">{editMode ? "Editar Biblioteca" : "Nova Biblioteca"}</Dialog.Title>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome" className="w-full p-2 border border-gray-300 rounded mb-4" />
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full p-2 border border-gray-300 rounded mb-4">
              <option value="">Selecione uma categoria</option>
              <option value="Aula de Dança">Aula de Dança</option>
              <option value="Alongamento e Exercícios">Alongamento e Exercícios</option>
            </select>
            <Input value={modalidade} onChange={(e) => setModalidade(e.target.value)} placeholder="Digite o ritmo ou modalidade" className="w-full p-2 border border-gray-300 rounded mb-4" />
            <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva a biblioteca" className="w-full p-2 border border-gray-300 rounded mb-4" />
            {!editMode && <Input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />}
            <Button onClick={handleSaveBiblioteca} className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              {editMode ? "Salvar Alterações" : "Criar Biblioteca"}
            </Button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Biblioteca;
