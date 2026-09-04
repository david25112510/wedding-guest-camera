"use client";

import {
  Eye,
  EyeOff,
  ImageIcon,
  LoaderCircle,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type AdminPhoto = {
  id: string;
  guestId: string;
  guestName: string;
  contentType: string;
  hidden: boolean;
  hiddenAt: string | null;
  createdAt: string;
  url: string;
};

type Stats = {
  total: number;
  visible: number;
  hidden: number;
  guests: number;
};

type Filter = "all" | "visible" | "hidden";

const emptyStats: Stats = { total: 0, visible: 0, hidden: 0, guests: 0 };

export default function AdminDashboard({
  adminName,
  signOutPath,
}: {
  adminName: string;
  signOutPath: string;
}) {
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<AdminPhoto | null>(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/photos", { cache: "no-store" });
      const data = (await response.json()) as { photos?: AdminPhoto[]; stats?: Stats; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível carregar o painel.");
      setPhotos(data.photos ?? []);
      setStats(data.stats ?? emptyStats);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível carregar o painel.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadPhotos());
  }, [loadPhotos]);

  const filteredPhotos = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return photos.filter((photo) => {
      const matchesStatus =
        filter === "all" ||
        (filter === "hidden" ? photo.hidden : !photo.hidden);
      const matchesSearch = !term || photo.guestName.toLocaleLowerCase("pt-BR").includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [filter, photos, search]);

  async function toggleVisibility(photo: AdminPhoto) {
    setBusyId(photo.id);
    setError("");
    try {
      const response = await fetch("/api/admin/photos", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: photo.id, hidden: !photo.hidden }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível alterar a foto.");
      await loadPhotos();
      setSelected((current) => current?.id === photo.id ? { ...current, hidden: !current.hidden } : current);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível alterar a foto.");
    } finally {
      setBusyId(null);
    }
  }

  async function deletePhoto(photo: AdminPhoto) {
    const confirmed = window.confirm(
      `Excluir definitivamente a foto enviada por ${photo.guestName}? Esta ação não pode ser desfeita.`,
    );
    if (!confirmed) return;

    setBusyId(photo.id);
    setError("");
    try {
      const response = await fetch("/api/admin/photos", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: photo.id }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível excluir a foto.");
      setSelected(null);
      await loadPhotos();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível excluir a foto.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div className="admin-brand">
          <span>LA</span>
          <div><strong>Painel do casamento</strong><small>Lidieyne & Alexandre · 19.09.2026</small></div>
        </div>
        <div className="admin-account">
          <p>Olá, {adminName}</p>
          <a href={signOutPath} target="_top"><LogOut /> Sair</a>
        </div>
      </header>

      <section className="admin-main">
        <div className="admin-title">
          <div><p>CURADORIA DO MURAL</p><h1>Momentos do evento</h1></div>
          <button onClick={() => void loadPhotos()} disabled={loading}><RefreshCw className={loading ? "spin" : ""} /> Atualizar</button>
        </div>

        <div className="admin-stats">
          <article><ImageIcon /><span><strong>{stats.total}</strong><small>Total de fotos</small></span></article>
          <article><Eye /><span><strong>{stats.visible}</strong><small>Visíveis no mural</small></span></article>
          <article><EyeOff /><span><strong>{stats.hidden}</strong><small>Ocultas</small></span></article>
          <article><Users /><span><strong>{stats.guests}</strong><small>Convidados</small></span></article>
        </div>

        <div className="admin-toolbar">
          <div className="admin-filters" aria-label="Filtrar fotos">
            {(["all", "visible", "hidden"] as const).map((option) => (
              <button key={option} className={filter === option ? "active" : ""} onClick={() => setFilter(option)}>
                {option === "all" ? "Todas" : option === "visible" ? "No mural" : "Ocultas"}
              </button>
            ))}
          </div>
          <label className="admin-search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar convidado" /></label>
        </div>

        {error && <p className="admin-error" role="alert">{error}</p>}

        {loading ? (
          <div className="admin-loading"><LoaderCircle className="spin" /><p>Carregando momentos...</p></div>
        ) : filteredPhotos.length === 0 ? (
          <div className="admin-empty"><ImageIcon /><h2>Nenhuma foto encontrada</h2><p>Novas imagens aparecerão aqui assim que forem enviadas.</p></div>
        ) : (
          <div className="admin-grid">
            {filteredPhotos.map((photo) => (
              <article className={photo.hidden ? "admin-photo hidden" : "admin-photo"} key={photo.id}>
                <button className="admin-photo__image" onClick={() => setSelected(photo)} aria-label={`Ampliar foto de ${photo.guestName}`}>
                  <img src={photo.url} alt={`Foto enviada por ${photo.guestName}`} loading="lazy" />
                  {photo.hidden && <span><EyeOff /> Oculta</span>}
                </button>
                <div className="admin-photo__meta">
                  <div><strong>{photo.guestName}</strong><small>{formatDate(photo.createdAt)}</small></div>
                  <div className="admin-photo__actions">
                    <button onClick={() => void toggleVisibility(photo)} disabled={busyId === photo.id} title={photo.hidden ? "Restaurar no mural" : "Ocultar do mural"}>
                      {busyId === photo.id ? <LoaderCircle className="spin" /> : photo.hidden ? <Eye /> : <EyeOff />}
                    </button>
                    <button className="danger" onClick={() => void deletePhoto(photo)} disabled={busyId === photo.id} title="Excluir definitivamente"><Trash2 /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div className="admin-lightbox" role="dialog" aria-modal="true" aria-label="Visualização da foto">
          <button className="admin-lightbox__close" onClick={() => setSelected(null)} aria-label="Fechar"><X /></button>
          <figure>
            <img src={selected.url} alt={`Foto enviada por ${selected.guestName}`} />
            <figcaption>
              <div><strong>{selected.guestName}</strong><small>{formatDate(selected.createdAt)}</small></div>
              <div className="admin-photo__actions">
                <button onClick={() => void toggleVisibility(selected)}>{selected.hidden ? <Eye /> : <EyeOff />} {selected.hidden ? "Restaurar" : "Ocultar"}</button>
                <button className="danger" onClick={() => void deletePhoto(selected)}><Trash2 /> Excluir</button>
              </div>
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}

function formatDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
