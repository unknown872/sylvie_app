import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      } else {
        console.log("Successfully authenticated:", result);
        router.push("/admin/dashboard");
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion.");
      setIsLoading(false);
    }
  };

  if (session) {
    router.push("/admin/dashboard");
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50">
      {/* Left side - decorative section */}
      <div
        style={{
          backgroundImage: "url('/admin/admin.jpg')", // Remplacez par le chemin de votre backgroundSize: "cover", // Couvre tout l'espace disponible
          backgroundSize: "cover",
          backgroundPosition: "center", // Centre l'image
          backgroundRepeat: "no-repeat",
        }}
        className="relative hidden lg:flex lg:w-1/2 bg-bl flex-col justify-center items-center text-blue-950 p-8"
      >
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold mb-6">Bienvenue</h1>
          <p className="text-xl mb-6">
            Connectez-vous pour accéder à votre tableau de bord administrateur.
          </p>
        </div>
        {/* Couche noire semi-transparente */}
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
      </div>

      {/* Right side - login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800">Connexion</h2>
              <p className="text-gray-600 mt-2">
                Entrez vos identifiants pour continuer
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                <p className="text-red-600 text-sm font-medium flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <span className="text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
                    Mot de passe oublié?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                  />
                  <div
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                        className="text-gray-400 hover:text-gray-600"
                      />
                    ) : (
                      <Eye
                        size={18}
                        className="text-gray-400 hover:text-gray-600"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Se souvenir de moi
                </label>
              </div>

              <div
                onClick={handleSubmit}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${
                  isLoading
                    ? "bg-blue-500"
                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Se connecter
                    <ArrowRight size={18} className="ml-2" />
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous n'avez pas de compte?{" "}
                <span className="font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
                  Contactez l'administrateur
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 Les Senteurs de Sylvie. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
