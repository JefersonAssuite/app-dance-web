import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig"; // Importe seu db do Firebase

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verificar se o usuário tem o campo isAdmin como true
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData?.isAdmin) {
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo ao painel administrativo.",
          });
          navigate("/dashboard"); // Redireciona para o painel administrativo
        } else {
          // Caso não seja admin, redireciona para uma página de erro ou home
          toast({
            title: "Acesso negado",
            description: "Você não tem permissões para acessar o painel administrativo.",
            variant: "destructive",
          });
          navigate("/home"); // Redireciona para a página inicial (ou uma página de erro)
        }
      } else {
        toast({
          title: "Erro no login",
          description: "Usuário não encontrado.",
          variant: "destructive",
        });
        navigate("/home"); // Caso o usuário não exista no banco
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Credenciais inválidas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 animate-fade-in">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-8 text-neutral-800">
          Painel Administrativo
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-neutral-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              placeholder="seu@email.com"
              autoComplete="off"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-neutral-700">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              placeholder="••••••••"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-success hover:bg-success-dark"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
