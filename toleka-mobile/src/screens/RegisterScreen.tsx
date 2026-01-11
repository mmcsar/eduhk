import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

import type { RootStackParamList } from "../../App";
import { register } from "../lib/auth";

type Role = "TENANT_ADMIN" | "BROKER" | "DISPATCHER" | "DRIVER";

type Props = NativeStackScreenProps<RootStackParamList, "Register"> & {
  onDone: () => void;
};

export function RegisterScreen({ navigation, onDone }: Props) {
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("TENANT_ADMIN");
  const [loading, setLoading] = useState(false);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#F8FAFC" }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: "#0F172A" }}>
        Créer une entreprise
      </Text>
      <Text style={{ color: "#475569" }}>
        Chaque abonné a son dashboard (RLS) + accès aux détails load/truck.
      </Text>

      <View style={{ marginTop: 10, gap: 10 }}>
        <Text style={{ fontWeight: "700", color: "#334155" }}>Entreprise</Text>
        <TextInput
          value={tenantName}
          onChangeText={setTenantName}
          placeholder="ex: MMC SARL"
          style={{
            backgroundColor: "white",
            borderColor: "#CBD5E1",
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        />

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

        <Text style={{ fontWeight: "700", color: "#334155" }}>Rôle</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {(["TENANT_ADMIN", "BROKER", "DISPATCHER", "DRIVER"] as const).map((r) => (
            <Pressable
              key={r}
              onPress={() => setRole(r)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: role === r ? "#2563EB" : "#CBD5E1",
                backgroundColor: role === r ? "#DBEAFE" : "white",
              }}
            >
              <Text style={{ color: "#0F172A", fontWeight: "700" }}>{r}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ fontWeight: "700", color: "#334155" }}>Mot de passe</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Minimum 8 caractères"
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
              await register({ tenantName, email, password, role });
              onDone();
            } catch (e) {
              Alert.alert("Erreur", e instanceof Error ? e.message : "Création impossible");
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
            {loading ? "Création…" : "Créer"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={{ paddingVertical: 10, alignItems: "center" }}
        >
          <Text style={{ color: "#2563EB", fontWeight: "700" }}>Déjà un compte ?</Text>
        </Pressable>
      </View>
    </View>
  );
}

