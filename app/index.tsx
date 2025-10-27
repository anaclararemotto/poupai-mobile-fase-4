import { NavigationContainer } from '@react-navigation/native'; // <-- 1. IMPORTAR
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./context/AuthContext";
import { InitialView } from "./pages/initial/initial.view";
import { LoadingView } from "./pages/Loading/loading.view";
import { ThemeProvider } from "./theme/ThemeContext";

export default function Index() {

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // MOSTRAR A TELA DE LOADING ENQUANTO ESTIVER CARREGANDO
  if (loading) {
    return <LoadingView />;
  }

  // QUANDO O LOADING TERMINAR, MOSTRAR O APP
  return (
    <AuthProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          {/* 2. ENVOLVER A PARTE QUE USA NAVEGAÇÃO */}
          <NavigationContainer> 
            {/* O InitialView é quem renderiza seu StackNavigator */}
            <InitialView />
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}