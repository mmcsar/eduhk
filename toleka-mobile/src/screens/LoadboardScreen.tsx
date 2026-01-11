import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import type { RootStackParamList } from "../../App";
import { apiFetch } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "Loadboard"> & {
  isAuthed: boolean;
  onLogout?: () => void;
};

type PublicLoad = {
  id: string;
  status: string;
  originProvince: string;
  originCity: string;
  destinationProvince: string;
  destinationCity: string;
  equipment: string;
  lengthFt: number;
  weightKg: number;
  createdAt: string;
};

export function LoadboardScreen({ navigation, isAuthed, onLogout }: Props) {
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [equipment, setEquipment] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<PublicLoad[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    if (originCity) sp.set("originCity", originCity);
    if (destinationCity) sp.set("destinationCity", destinationCity);
    if (equipment) sp.set("equipment", equipment);
    sp.set("sort", sort);
    sp.set("limit", "25");
    return sp.toString();
  }, [originCity, destinationCity, equipment, sort]);

  async function loadFirst() {
    setLoading(true);
    try {
      const data = await apiFetch<{ data: PublicLoad[]; nextCursor: string | null }>(
        `/api/loadboard?${query}`,
      );
      setRows(data.data ?? []);
      setNextCursor(data.nextCursor ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFirst().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <View style={{ padding: 12, gap: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#0F172A" }}>
            Loadboard
          </Text>
          {isAuthed ? (
            <Pressable onPress={onLogout}>
              <Text style={{ color: "#DC2626", fontWeight: "800" }}>Logout</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={{ color: "#2563EB", fontWeight: "800" }}>Login</Text>
            </Pressable>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            value={originCity}
            onChangeText={setOriginCity}
            placeholder="Origine (ville)"
            style={{
              flex: 1,
              backgroundColor: "white",
              borderColor: "#CBD5E1",
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
          />
          <TextInput
            value={destinationCity}
            onChangeText={setDestinationCity}
            placeholder="Destination (ville)"
            style={{
              flex: 1,
              backgroundColor: "white",
              borderColor: "#CBD5E1",
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            value={equipment}
            onChangeText={setEquipment}
            placeholder="Equipment"
            style={{
              flex: 1,
              backgroundColor: "white",
              borderColor: "#CBD5E1",
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
          />
          <Pressable
            onPress={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
            style={{
              paddingHorizontal: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#CBD5E1",
              backgroundColor: "white",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontWeight: "800", color: "#0F172A" }}>
              {sort === "newest" ? "Newest" : "Oldest"}
            </Text>
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12, gap: 10 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                if (!isAuthed) {
                  Alert.alert(
                    "Détails verrouillés",
                    "Connecte-toi / abonne-toi pour voir les détails et faire une offre.",
                    [
                      { text: "Plus tard", style: "cancel" },
                      { text: "Login", onPress: () => navigation.navigate("Login") },
                      { text: "Register", onPress: () => navigation.navigate("Register") },
                    ],
                  );
                  return;
                }
                navigation.navigate("LoadDetails", { loadId: item.id });
              }}
              style={{
                backgroundColor: "white",
                borderColor: "#E2E8F0",
                borderWidth: 1,
                borderRadius: 16,
                padding: 12,
              }}
            >
              <Text style={{ fontWeight: "900", color: "#0F172A" }}>
                {item.originCity}, {item.originProvince} → {item.destinationCity},{" "}
                {item.destinationProvince}
              </Text>
              <Text style={{ marginTop: 4, color: "#475569" }}>
                {item.equipment} • {item.lengthFt} ft • {item.weightKg.toLocaleString()} kg
              </Text>
              <Text style={{ marginTop: 6, color: "#64748B", fontSize: 12 }}>
                Détails: {isAuthed ? "Disponibles" : "Verrouillés"}
              </Text>
            </Pressable>
          )}
          ListFooterComponent={
            nextCursor ? (
              <Pressable
                disabled={loadingMore}
                onPress={async () => {
                  setLoadingMore(true);
                  try {
                    const data = await apiFetch<{
                      data: PublicLoad[];
                      nextCursor: string | null;
                    }>(`/api/loadboard?${query}&cursor=${encodeURIComponent(nextCursor)}`);
                    setRows((prev) => [...prev, ...(data.data ?? [])]);
                    setNextCursor(data.nextCursor ?? null);
                  } catch (e) {
                    Alert.alert("Erreur", e instanceof Error ? e.message : "Impossible");
                  } finally {
                    setLoadingMore(false);
                  }
                }}
                style={{
                  backgroundColor: "white",
                  borderColor: "#CBD5E1",
                  borderWidth: 1,
                  borderRadius: 14,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "900", color: "#0F172A" }}>
                  {loadingMore ? "Chargement…" : "Charger plus"}
                </Text>
              </Pressable>
            ) : (
              <View style={{ height: 10 }} />
            )
          }
        />
      )}

      {isAuthed ? (
        <View style={{ padding: 12, flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => navigation.navigate("SavedSearches")}
            style={{
              flex: 1,
              backgroundColor: "#0F172A",
              borderRadius: 14,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "900" }}>Saved searches</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

