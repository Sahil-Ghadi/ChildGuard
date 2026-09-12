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
    ahtuUnit?: string;
    ncrbZone?: string;
    corridorType?: string;
    reasoning?: string;
  };
  traffickingMatches?: Array<{
    registryId?: string;
    state?: string;
    corridor?: string;
    flagReason?: string;
    matchConfidence?: number;
    statutoryNotice?: string;
    corridorId?: string;
    corridorName?: string;
    highwayTransit?: string;
    sourceDestination?: string;
    riskTier?: string;
    nodalAHTU?: string;
    surveillanceNodes?: string[];
    statutoryBasis?: string;
    tacticalRecommendation?: string;
  }>;
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

export async function getCaseApi(caseId: string): Promise<CaseData> {
  return apiFetch(`/api/cases/${caseId}`);
}

export async function resolveInterceptApi(caseId: string, payload: InterceptResolutionPayload) {
  return apiFetch(`/api/cases/${caseId}/intercept-resolution`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function sendTwilioDispatchApi(
  caseId: string, 
  officerPhone?: string, 
  channel: string = "both",
  targetLocation?: string,
  sightingId?: string,
  coords?: { lat: number; lng: number }
) {
  return apiFetch(`/api/twilio/dispatch`, {
    method: "POST",
    body: JSON.stringify({ caseId, officerPhone, channel, targetLocation, sightingId, coords }),
  });
}

export async function simulateTwilioReplyApi(body: string, fromNumber?: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const res = await fetch(`${API_BASE}/api/twilio/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Body: body, From: fromNumber || "+919876543210" }),
  });
  const rawXml = await res.text();
  const outcome = res.headers.get("X-ChildGuard-Outcome") || "";
  const caseResolved = res.headers.get("X-ChildGuard-Resolved") === "True" || res.headers.get("X-ChildGuard-Resolved") === "true";
  const caseId = res.headers.get("X-ChildGuard-Case-Id") || "";
  
  const match = rawXml.match(/<Message>([\s\S]*?)<\/Message>/);
  const message = match ? match[1] : rawXml;

  return {
    rawXml,
    message,
    outcome,
    caseResolved,
    caseId,
  };
}
