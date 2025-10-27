// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { LoginView } from "../pages/login/login.view";
// import { ThemeProvider } from "../theme/ThemeContext";

// export default function LoginPage() {
//   return (
//     <ThemeProvider>
//       <SafeAreaProvider>
//         <SafeAreaView style={{ flex: 1 }}>
//           <LoginView />
//         </SafeAreaView>
//       </SafeAreaProvider>
//     </ThemeProvider>
//   );
// }

import React, { useState } from "react"; // <-- 1. Importar o React e useState
import { Alert } from "react-native"; // <-- 3. Importar o Alert para erros
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext"; // <-- 2. Importar o hook de autenticação
import { LoginView } from "../pages/login/login.view"; // A "Aparência"
import { ThemeProvider } from "../theme/ThemeContext";

export default function LoginPage() {
  // 4. CRIAR OS ESTADOS (A LÓGICA)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 5. OBTER A FUNÇÃO DE LOGIN DO SEU CONTEXTO
  const { login } = useAuth();

  // 6. CRIAR A FUNÇÃO QUE O BOTÃO "ENTRAR" VAI CHAMAR
  const handleLoginPress = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha o e-mail e a senha.");
      return;
    }
    
    setIsLoading(true);
    try {
      // Chamar a função do AuthContext
      await login(email, password);
      
      // O redirecionamento para a Home será feito automaticamente
      // pelo seu arquivo _layout.js, que está ouvindo a mudança no 'user'
    } catch (error: any) {
      console.error("Falha no login:", error);
      // Mostrar um erro amigável para o usuário
      Alert.alert("Erro no Login", "E-mail ou senha inválidos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          {/* 7. PASSAR OS ESTADOS E A FUNÇÃO PARA A "APARÊNCIA" */}
          <LoginView 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isChecked={isChecked}
            setChecked={setChecked}
            isLoading={isLoading}
            onLoginPress={handleLoginPress} // <-- O mais importante!
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
