import { useState } from "react";
import Layout from "@/components/admin/layout/layout";
import { useRouter } from "next/router";
import { Alert } from "@mui/material";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Shield,
  UserPlus,
} from "lucide-react";

export default function Register() {
  //const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //const [role, setRole] = useState("user");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    setPasswordError(null);
    setIsLoading(true);

    // ✅ Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // ✅ Vérifier que le mot de passe contient au moins 8 caractères
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (password.length < 8 || !passwordRegex.test(password)) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre et un chiffre.");
      setIsLoading(false)
      return;
    }

    // ✅ Vérifier que l'email est valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Veuillez entrer une adresse email valide.");
      setIsLoading(false)
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setIsLoading(false);
        return;
      }

      setSuccess(`L'utilisateur ${email} a été créé avec succès!`);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      //setRole("user");
      setIsLoading(false);
      //router.push("/auth/dashboard");
    } catch (error) {
      setError("Une erreur est survenue lors de l'inscription.");
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg ">
        <div className="flex items-center mb-6">
          <div className="bg-blue-600 p-3 rounded-lg mr-4">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Ajouter un utilisateur
            </h1>
            <p className="text-gray-600 text-sm">
              Créez un compte utilisateur pour votre plateforme
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border-l-4 border-green-500 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  placeholder="email@exemple.com"
                  required
                />
              </div>
              {!emailError ? null : (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  placeholder="Mot de passe"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                  )}
                </div>
              </div>
              <div className="mt-1">
                {passwordError ? (
                  <p className="text-red-500 text-xs font-bold">
                    {passwordError}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Le mot de passe doit contenir au moins 8 caractères
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-300 bg-red-50"
                      : confirmPassword && password === confirmPassword
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirmer le mot de passe"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-700" />
                  )}
                </div>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  Les mots de passe ne correspondent pas
                </p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="mt-1 text-xs text-green-600">
                  Les mots de passe correspondent
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <button onClick={() => router.push("/admin/accounts")} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Voir la liste des utilisateurs
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin mr-2 h-4 w-4 text-white"
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
                <span>Traitement...</span>
              </div>
            ) : (
              "Ajouter l'utilisateur"
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
}
