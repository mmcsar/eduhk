import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

import type { RootStackParamList } from "../../App";
import { login } from "../lib/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Login"> & {
  onDone: () => void;
};

export function LoginScreen({ navigation, onDone }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#F8FAFC" }}>
      <Text style={{ fontSize: 28, fontWeight: "800", color: "#0F172A" }}>
        Toleka
      </Text>
      <Text style={{ color: "#475569" }}>
        Connecte-toi (abonné) pour débloquer les détails et envoyer des offres.
      </Text>

      <View style={{ marginTop: 16, gap: 10 }}>
        <Text style={{ fontWeight: "700", color: "#334155" }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="ex: admin@mmc.cd"
          style={{
            backgroundColor: "white",
            borderColor: "#CBD5E1",
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        />

        <Text style={{ fontWeight: "700", color: "#334155" }}>Mot de passe</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          style={{
            backgroundColor: "white",
            borderColor: "#CBD5E1",
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        />

        <Pressable
          disabled={loading}
          onPress={async () => {
            setLoading(true);
            try {
              await login(email, password);
              onDone();
            } catch (e) {
              Alert.alert("Erreur", e instanceof Error ? e.message : "Connexion impossible");
            } finally {
              setLoading(false);
            }
          }}
          style={{
            marginTop: 8,
            backgroundColor: "#2563EB",
            paddingVertical: 12,
            borderRadius: 12,
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text style={{ color: "white", fontWeight: "800" }}>
            {loading ? "Connexion…" : "Se connecter"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ paddingVertical: 10, alignItems: "center" }}
        >
          <Text style={{ color: "#2563EB", fontWeight: "700" }}>
            Créer une entreprise (abonnement)
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Loadboard")}
          style={{ paddingVertical: 6, alignItems: "center" }}
        >
          <Text style={{ color: "#0F172A", fontWeight: "700" }}>
            Voir le loadboard public
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

