import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/services/FirebaseConfig";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";

const Auth = () => {
  // Set page title
  document.title = "Login";
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login com Firebase
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });
        navigate("/dashboard");
      } else {
        // Cadastro com Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        if (userCredential.user && name) {
          // Adicionar nome de exibição ao usuário
          await updateProfile(userCredential.user, {
            displayName: name
          });
          
          toast({
            title: "Cadastro realizado com sucesso!",
            description: "Você já pode acessar sua conta.",
          });
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Erro de autenticação:", error);
      
      let errorMessage = "Ocorreu um erro durante a autenticação.";
      
      // Mensagens de erro personalizadas com base nos códigos do Firebase
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Email ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este email já está cadastrado. Por favor, faça login ou use outro email.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido. Por favor, verifique o formato do email.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Senha muito fraca. Use uma senha mais forte.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      }
      
      toast({
        title: "Erro na autenticação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{isLogin ? "Login" : "Cadastro"}</h2>
            <p className="text-neutral-600 mt-2">
              {isLogin
                ? "Entre com sua conta"
                : "Crie sua conta para começar"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-success hover:bg-success-dark"
              disabled={loading}
            >
              {loading
                ? "Carregando..."
                : isLogin
                ? "Entrar"
                : "Criar conta"}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-neutral-600 hover:text-neutral-800"
            >
             
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
