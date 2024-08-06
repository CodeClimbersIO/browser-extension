// Generated by https://quicktype.io

export interface HeartBeatsPayload {
  data: Datum[];
  end: string;
  start: string;
  timezone: string;
}

export interface Datum {
  branch: string;
  category: string;
  created_at: string;
  cursorpos: null;
  dependencies: string;
  entity: string;
  id: string;
  is_write: boolean;
  language: string;
  lineno: null;
  lines: number;
  machine_name_id: string;
  project: string;
  time: string;
  type: string;
  user_agent_id: string;
  user_id: string;
}

export interface SendHeartbeat {
  branch: string | null;
  hostname: string;
  project: string | null;
  url: string;
}

export interface ProjectDetails {
  category: string;
  editor: string;
  language: string;
  project: string;
}

export interface PostHeartbeatMessage {
  projectDetails?: ProjectDetails;
  recordHeartbeat: boolean;
}
