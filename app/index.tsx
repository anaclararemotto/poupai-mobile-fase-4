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

  if (loading) {
    return <LoadingView />;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <InitialView />
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
