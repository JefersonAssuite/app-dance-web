import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/services/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Auth = () => {
  // Set page title
  document.title = "Login";
  const [loading, setLoading] = useState(false);

  // Consolidando o estado em um único objeto
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Login com Firebase
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro de autenticação:", error);

      let errorMessage = "Ocorreu um erro durante a autenticação.";

      // Mensagens de erro personalizadas com base nos códigos do Firebase
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        errorMessage =
          "Email ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage =
          "Erro de conexão. Verifique sua internet e tente novamente.";
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

  // Função para atualizar o estado de formData
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="text-neutral-600 mt-2">Entre com sua conta</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Digite seu e-mail"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-success hover:bg-success-dark"
              disabled={loading}
            >
              {loading ? "Carregando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Auth;
