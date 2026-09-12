const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "API Error");
  }
  return res.json();
}

export type CaseData = {
  caseId: string;
  childName: string;
  age: number;
  photoUrl: string;
  description: string;
  lastSeenLocation: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
  };
  reporterUid: string;
  reporterRelationship: string;
  consentFlag: boolean;
  custodyDisputeFlag: boolean;
  riskScore: string;
  riskReasoning: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  photoHash?: string;
  patternPredictions?: {
    predictedRoute: string;
    probability: number;
    similarCasesCount: number;
    basedOn: string[];
  };
  alertDistributed?: boolean;
  auditLog?: Array<{
    agentName: string;
    action: string;
    reasoning: string;
    timestamp: string;
  }>;
  recoveryLocation?: string;
  recoveryOfficer?: string;
  recoveredAt?: string;
};

export type SightingData = {
  sightingId: string;
  location: { lat: number; lng: number; address: string };
  timestamp: string;
  photoUrl: string;
  reporterUid: string;
  reporterTrustScore: number;
  credibilityScore: number;
  confidenceLabel: string;
  verifiedBy: string;
  status: string;
  reasoning?: string;
};

export type InterceptResolutionPayload = {
  outcome: "found" | "not_found";
  unitCallsign: string;
  officerName: string;
  location: string;
  condition?: string;
  notes?: string;
};

export async function resolveInterceptApi(caseId: string, payload: InterceptResolutionPayload) {
  return apiFetch(`/api/cases/${caseId}/intercept-resolution`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
