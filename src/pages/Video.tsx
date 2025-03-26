import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/services/FirebaseConfig";
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import Header from "@/components/Header";


const Video = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [bibliotecaId, setBibliotecaId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [bibliotecas, setBibliotecas] = useState<{ id: string; nome: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBibliotecas = async () => {
      const querySnapshot = await getDocs(collection(db, "bibliotecas"));
      const bibliotecasList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
      }));
      setBibliotecas(bibliotecasList);
    };
    fetchBibliotecas();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !title || !bibliotecaId || !description) {
      return alert("Por favor, preencha todos os campos.");
    }

    setLoading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `videos/${Date.now()}_${videoFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Erro no upload:", error);
        setLoading(false);
      },
      async () => {
        const videoUrl = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "videos"), {
          title,
          bibliotecaId,
          description,
          video_url: videoUrl,
          created_at: Timestamp.now(),
        });
        setLoading(false);
        alert("Upload concluído!");
        setVideoFile(null);
        setPreviewUrl(null);
        setUploadProgress(0);
        setTitle("");
        setBibliotecaId("");
        setDescription("");
      }
    );
  };


  return (
    <div className="p-6 mt-16 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <Header/>
      <h2 className="text-xl font-semibold mb-4">Inserir Vídeos</h2>

      <Label>Título</Label>
      <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-4" />

      <Label>Biblioteca*</Label>
      <select value={bibliotecaId} onChange={(e) => setBibliotecaId(e.target.value)} className="mb-4 p-2 w-full">
        <option value="">Selecione uma biblioteca</option>
        {bibliotecas.map((biblioteca) => (
          <option key={biblioteca.id} value={biblioteca.id}>{biblioteca.nome}</option>
        ))}
      </select>

      <Label>Descrição</Label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4 p-2 w-full h-32 border rounded-lg"
        placeholder="Digite a descrição..."
      />

      <Label>Selecione um vídeo</Label>
      <Input type="file" accept="video/*" onChange={handleFileChange} />

      {previewUrl && (
        <video controls className="w-full mt-4">
          <source src={previewUrl} type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
      )}

      {loading && <Progress value={uploadProgress} className="mt-4" />}

      <Button onClick={handleUpload} className="mt-4 w-full" disabled={loading || !videoFile || !title || !bibliotecaId || !description}>
        {loading ? `Enviando... ${Math.round(uploadProgress)}%` : "Enviar Vídeo"}
      </Button>
    </div>
  );
};

export default Video;
