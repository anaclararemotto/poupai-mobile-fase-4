import { OptionsCard } from "@/app/components/OptionsCard";
import { useAuth } from "@/app/context/AuthContext"; // 1. O 'useAuth' já está aqui
import { deleteAccount } from "@/app/services/auth/auth.service";
import { useTheme } from "@/app/theme/ThemeContext";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { settingsStyles } from "./settings.styles";

export const SettingsView = () => {
  const { colors } = useTheme();
  const styles = settingsStyles(colors);

  // 2. PEGUE A FUNÇÃO 'logout' DO HOOK 'useAuth'
  const { user, logout } = useAuth();
  const userName = user?.displayName || "Usuário";

  const handleDeleteAccount = async () => {
    Alert.alert(
      // ... (sua função de deletar conta - sem alteração)
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteAccount();
          },
        },
      ]
    );
  };

  // 3. (OPCIONAL, MAS RECOMENDADO) CRIE UMA FUNÇÃO 'handle' PARA O LOGOUT
  const handleLogout = async () => {
    try {
      await logout();
      // O redirecionamento para a tela de Login será automático
      // graças ao seu _layout.js e ao AuthContext
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.push("/Home")}>
          <ChevronLeft color={colors.textColor} />
        </TouchableOpacity>
        <Text style={styles.text}>Olá {userName}!</Text>
        <View></View>
      </View>
      <OptionsCard type="theme" />
      <OptionsCard type="default" title="Alterar senha" />
      <OptionsCard type="default" title="Excluir conta" onPress={handleDeleteAccount} />
      {/* 4. PASSE A FUNÇÃO 'handleLogout' PARA O 'onPress' DO BOTÃO 'Sair' */}
      <OptionsCard type="default" title="Sair" onPress={handleLogout} />
    </View>
  );
};