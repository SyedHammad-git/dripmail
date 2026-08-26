export interface CampaignFormData {
  sender_email: string;
  app_password: string;
  recipients: string; // raw textarea value, one email per line
  subject: string;
  body_text: string;
  min_delay: number;
  max_delay: number;
}

export interface FailedEmail {
  email: string;
  error: string;
}

export interface CampaignStatus {
  is_running: boolean;
  is_paused: boolean;
  total_emails: number;
  successful_emails: string[];
  failed_emails: FailedEmail[];
  log?: string[];
}

export const DEFAULT_FORM_DATA: CampaignFormData = {
  sender_email: "",
  app_password: "",
  recipients: "",
  subject: "",
  body_text: "",
  min_delay: 10,
  max_delay: 30,
};

export const DEFAULT_STATUS: CampaignStatus = {
  is_running: false,
  is_paused: false,
  total_emails: 0,
  successful_emails: [],
  failed_emails: [],
  log: [],
};
