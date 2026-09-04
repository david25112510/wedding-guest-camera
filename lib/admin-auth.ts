import { env } from "cloudflare:workers";
import { getChatGPTUser, type ChatGPTUser } from "../app/chatgpt-auth";

type AdminEnvironment = {
  ADMIN_EMAIL?: string;
};

export async function getAdminUser(): Promise<ChatGPTUser | null> {
  const user = await getChatGPTUser();
  const configuredEmail = (env as unknown as AdminEnvironment).ADMIN_EMAIL?.trim().toLowerCase();

  if (!user || !configuredEmail || user.email.trim().toLowerCase() !== configuredEmail) {
    return null;
  }

  return user;
}
