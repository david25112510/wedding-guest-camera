import { env } from "cloudflare:workers";
import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import AdminDashboard from "./admin-dashboard";
import "./admin.css";

export const dynamic = "force-dynamic";

type AdminEnvironment = {
  ADMIN_EMAIL?: string;
};

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const adminEmail = (env as unknown as AdminEnvironment).ADMIN_EMAIL?.trim().toLowerCase();
  const authorized = Boolean(adminEmail && user.email.trim().toLowerCase() === adminEmail);

  if (!authorized) {
    return (
      <main className="admin-denied">
        <div>
          <span>LA</span>
          <p>ÁREA RESTRITA</p>
          <h1>Esta conta não possui acesso administrativo.</h1>
          <a href={chatGPTSignOutPath("/admin")} target="_top">Entrar com outra conta</a>
        </div>
      </main>
    );
  }

  return (
    <AdminDashboard
      adminName={user.fullName ?? "Organizador"}
      signOutPath={chatGPTSignOutPath("/")}
    />
  );
}
