import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import type { RootStackParamList } from "../../App";
import { apiFetch } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "SavedSearches">;

type SavedSearch = {
  id: string;
  name: string;
  criteria: Record<string, string>;
  createdAt: string;
};

function toQuery(criteria: Record<string, string>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(criteria ?? {})) {
    if (!v) continue;
    sp.set(k, v);
  }
  return sp.toString();
}

export function SavedSearchesScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<SavedSearch[]>([]);

  async function refresh() {
    setLoading(true);
    try {
      const data = await apiFetch<{ data: SavedSearch[] }>("/api/saved-searches");
      setRows(data.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh().catch((e) => Alert.alert("Erreur", e instanceof Error ? e.message : "Erreur"));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        ListEmptyComponent={
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              borderColor: "#E2E8F0",
              borderWidth: 1,
              padding: 12,
            }}
          >
            <Text style={{ fontWeight: "900", color: "#0F172A" }}>Aucune recherche</Text>
            <Text style={{ marginTop: 6, color: "#475569" }}>
              Sauvegarde une recherche depuis le loadboard web pour la voir ici.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              borderColor: "#E2E8F0",
              borderWidth: 1,
              padding: 12,
              gap: 8,
            }}
          >
            <Text style={{ fontWeight: "900", color: "#0F172A" }}>{item.name}</Text>
            <Text style={{ color: "#64748B", fontSize: 12 }}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => {
                  // For now, we open loadboard and user can re-enter filters in mobile.
                  // (Web supports URL sync; mobile will support the same once we add filter parsing.)
                  navigation.navigate("Loadboard");
                  Alert.alert("Info", `Critères: ${toQuery(item.criteria)}`);
                }}
                style={{
                  flex: 1,
                  backgroundColor: "#2563EB",
                  borderRadius: 12,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "900" }}>Ouvrir</Text>
              </Pressable>
              <Pressable
                onPress={async () => {
                  const ok = await new Promise<boolean>((resolve) => {
                    Alert.alert("Supprimer", `Supprimer “${item.name}” ?`, [
                      { text: "Annuler", style: "cancel", onPress: () => resolve(false) },
                      { text: "Supprimer", style: "destructive", onPress: () => resolve(true) },
                    ]);
                  });
                  if (!ok) return;
                  await apiFetch(`/api/saved-searches/${item.id}`, { method: "DELETE" });
                  refresh().catch(() => {});
                }}
                style={{
                  paddingHorizontal: 14,
                  borderRadius: 12,
                  borderColor: "#CBD5E1",
                  borderWidth: 1,
                  backgroundColor: "white",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#0F172A", fontWeight: "900" }}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

