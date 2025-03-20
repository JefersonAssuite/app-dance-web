import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/services/FirebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Header from "@/components/Header"; 

const Video = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Campos adicionais
  const [title, setTitle] = useState<string>("");
  const [rhythm, setRhythm] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Função para selecionar o vídeo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Cria um preview do vídeo
    }
  };

  // Função para fazer o upload
  const handleUpload = async () => {
    if (!videoFile || !title || !rhythm || !description) {
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
          rhythm,
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
        setRhythm("");
        setDescription("");
      }
    );
  };
  const handleLogout = () => {
    // Sua lógica de logout
    console.log("Logout!");
  };
  return (
    <div className="p-6 mt-16 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
       <Header handleLogout={handleLogout} />
      <h2 className="text-xl font-semibold mb-4">Inserir Vídeos</h2>

      {/* Input de Título */}
      <Label>Título</Label>
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />

      {/* Input de Ritmo */}
      <Label>Ritmo</Label>
      <select
        value={rhythm}
        onChange={(e) => setRhythm(e.target.value)}
        className="mb-4 p-2 w-full"
      >
        <option value="">Selecione o ritmo</option>
        <option value="Pagode">Pagode</option>
        <option value="Funk">Funk</option>
        <option value="Pop">Pop</option>
      </select>

      {/* Input de Descrição */}
      <Label>Descrição</Label>
<textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  className="mb-4 p-2 w-full h-32 border rounded-lg"
  rows={5} // Controla a altura inicial do campo
  placeholder="Digite a descrição..."
/>

      {/* Input de arquivo */}
      <Label>Selecione um vídeo</Label>
      <Input type="file" accept="video/*" onChange={handleFileChange} />

      {/* Preview do vídeo */}
      {previewUrl && (
        <video controls className="w-full mt-4">
          <source src={previewUrl} type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
      )}

      {/* Barra de progresso */}
      {loading && <Progress value={uploadProgress} className="mt-4" />}

      {/* Botão de Upload */}
      <Button
        onClick={handleUpload}
        className="mt-4 w-full"
        disabled={loading || !videoFile || !title || !rhythm || !description}
      >
        {loading ? `Enviando... ${Math.round(uploadProgress)}%` : "Enviar Vídeo"}
      </Button>
    </div>
  );
};

export default Video;
