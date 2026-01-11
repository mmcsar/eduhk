import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
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

type Props = NativeStackScreenProps<RootStackParamList, "LoadDetails">;

type Load = {
  id: string;
  tenantId: string;
  status: string;
  originCity: string;
  originProvince: string;
  destinationCity: string;
  destinationProvince: string;
  equipment: string;
  lengthFt: number;
  weightKg: number;
  rateUsd?: number | null;
  companyName?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  notes?: string | null;
};

type Me = {
  user: { id: string; email: string } | null;
  tenant: { id: string; name: string } | null;
};

type Bid = {
  id: string;
  status: string;
  amountUsd?: number | null;
  message?: string | null;
  createdAt: string;
};

function moneyUsd(v?: number | null) {
  if (v === null || v === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
}

export function LoadDetailsScreen({ route }: Props) {
  const loadId = route.params.loadId;
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Me | null>(null);
  const [load, setLoad] = useState<Load | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);

  const [amountUsd, setAmountUsd] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const [meData, loadData, bidsData] = await Promise.all([
        apiFetch<Me>("/api/auth/me"),
        apiFetch<{ data: Load }>(`/api/loads/${loadId}`),
        apiFetch<{ data: Bid[] }>(`/api/loads/${loadId}/bids`),
      ]);
      setMe(meData);
      setLoad(loadData.data);
      setBids(bidsData.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh().catch((e) => Alert.alert("Erreur", e instanceof Error ? e.message : "Erreur"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadId]);

  const isOwner = Boolean(me?.tenant?.id && load?.tenantId && me.tenant.id === load.tenantId);

  if (loading || !load) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <View style={{ padding: 12, gap: 8 }}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            borderColor: "#E2E8F0",
            borderWidth: 1,
            padding: 12,
          }}
        >
          <Text style={{ fontWeight: "900", color: "#0F172A" }}>
            {load.originCity}, {load.originProvince} → {load.destinationCity},{" "}
            {load.destinationProvince}
          </Text>
          <Text style={{ marginTop: 4, color: "#475569" }}>
            {load.equipment} • {load.lengthFt} ft • {load.weightKg.toLocaleString()} kg
          </Text>
          <Text style={{ marginTop: 6, fontWeight: "900", color: "#0F172A" }}>
            Rate: {moneyUsd(load.rateUsd)}
          </Text>
          <Text style={{ marginTop: 6, color: "#475569" }}>
            Contact: {load.contactName || "—"} • {load.contactPhone || "—"}
          </Text>
          {load.notes ? (
            <Text style={{ marginTop: 6, color: "#475569" }}>{load.notes}</Text>
          ) : null}
        </View>

        {!isOwner ? (
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
            <Text style={{ fontWeight: "900", color: "#0F172A" }}>Envoyer une offre</Text>
            <TextInput
              value={amountUsd}
              onChangeText={setAmountUsd}
              keyboardType="numeric"
              placeholder="Offre (USD)"
              style={{
                backgroundColor: "white",
                borderColor: "#CBD5E1",
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 8,
              }}
            />
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Message (optionnel)"
              multiline
              style={{
                backgroundColor: "white",
                borderColor: "#CBD5E1",
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 8,
                minHeight: 70,
              }}
            />
            <Pressable
              disabled={submitting}
              onPress={async () => {
                setSubmitting(true);
                try {
                  await apiFetch(`/api/loads/${loadId}/bids`, {
                    method: "POST",
                    json: {
                      amountUsd: amountUsd ? Number(amountUsd) : undefined,
                      message: message || undefined,
                    },
                  });
                  setAmountUsd("");
                  setMessage("");
                  await refresh();
                } catch (e) {
                  Alert.alert("Erreur", e instanceof Error ? e.message : "Impossible");
                } finally {
                  setSubmitting(false);
                }
              }}
              style={{
                backgroundColor: "#2563EB",
                borderRadius: 14,
                paddingVertical: 12,
                alignItems: "center",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              <Text style={{ color: "white", fontWeight: "900" }}>
                {submitting ? "Envoi…" : "Envoyer"}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <FlatList
        data={bids}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        ListHeaderComponent={
          <Text style={{ fontWeight: "900", color: "#0F172A" }}>
            Offres ({bids.length})
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              borderColor: "#E2E8F0",
              borderWidth: 1,
              padding: 12,
              gap: 6,
            }}
          >
            <Text style={{ fontWeight: "900", color: "#0F172A" }}>
              {moneyUsd(item.amountUsd)}{" "}
              <Text style={{ color: "#64748B" }}>({item.status})</Text>
            </Text>
            {item.message ? <Text style={{ color: "#475569" }}>{item.message}</Text> : null}
            <Text style={{ color: "#94A3B8", fontSize: 12 }}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>

            {isOwner && item.status === "SUBMITTED" ? (
              <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                <Pressable
                  onPress={async () => {
                    await apiFetch(`/api/loads/${loadId}/bids/${item.id}`, {
                      method: "PATCH",
                      json: { action: "accept" },
                    });
                    refresh().catch(() => {});
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: "#16A34A",
                    borderRadius: 12,
                    paddingVertical: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "900" }}>Accepter</Text>
                </Pressable>
                <Pressable
                  onPress={async () => {
                    await apiFetch(`/api/loads/${loadId}/bids/${item.id}`, {
                      method: "PATCH",
                      json: { action: "reject" },
                    });
                    refresh().catch(() => {});
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: "#0F172A",
                    borderRadius: 12,
                    paddingVertical: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "900" }}>Refuser</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

