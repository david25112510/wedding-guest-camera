"use client";

import {
  Camera,
  ChevronDown,
  Images,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { coupleNames, eventConfig } from "../lib/event-config";
import { optimizePhoto } from "../lib/image-optimization";

type Photo = {
  id: string;
  url: string;
  thumbnailUrl: string;
  guestName: string;
  createdAt: string;
};

function Monogram({ compact = false }: { compact?: boolean }) {
  if (!compact) {
    return (
      <span className="monogram monogram--hero" aria-label="Monograma LA">
        <img src="/monogram-la-3d.png" alt="Monograma tridimensional LA de Lidieyne e Alexandre" />
      </span>
    );
  }

  return (
    <span className="monogram monogram--compact" aria-label="L A">
      <i>{eventConfig.couple.initials[0]}</i>
      <b>{eventConfig.couple.initials[1]}</b>
    </span>
  );
}

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const knownPhotoIds = useRef<Set<string>>(new Set());
  const galleryInitialized = useRef(false);
  const toastTimer = useRef<number | null>(null);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [consented, setConsented] = useState(false);
  const [remaining, setRemaining] = useState(eventConfig.maximumPhotosPerGuest);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [newMoment, setNewMoment] = useState<Photo | null>(null);

  const showNewMoment = useCallback((photo: Photo) => {
    setNewMoment(photo);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setNewMoment(null), 5200);
  }, []);

  const loadGallery = useCallback(async () => {
    try {
      const response = await fetch("/api/photos", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { photos: Photo[]; remaining?: number };

      if (galleryInitialized.current) {
        const arrived = data.photos.find((photo) => !knownPhotoIds.current.has(photo.id));
        if (arrived) showNewMoment(arrived);
      }

      knownPhotoIds.current = new Set(data.photos.map((photo) => photo.id));
      galleryInitialized.current = true;
      setPhotos(data.photos);
      if (typeof data.remaining === "number") setRemaining(data.remaining);
    } catch {
      // Keep the experience usable during momentary network instability.
    }
  }, [showNewMoment]);

  useEffect(() => {
    const savedName = localStorage.getItem("24momentos_guest_name");
    const savedConsent = localStorage.getItem("24momentos_privacy_consent") === "yes";
    queueMicrotask(() => {
      if (savedName) {
        setName(savedName);
        setJoined(true);
      }
      if (savedConsent) setConsented(true);
    });
    void loadGallery();
    const timer = window.setInterval(loadGallery, 6000);
    return () => {
      window.clearInterval(timer);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [loadGallery]);

  useEffect(() => {
    if (!selectedPhoto) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setSelectedPhoto(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selectedPhoto]);

  function enterEvent() {
    const cleanName = name.trim().slice(0, 40);
    if (!cleanName) return;
    localStorage.setItem("24momentos_guest_name", cleanName);
    setName(cleanName);
    setJoined(true);
  }

  function acceptConsent() {
    localStorage.setItem("24momentos_privacy_consent", "yes");
    setConsented(true);
  }

  function openCamera() {
    if (!consented) return;
    inputRef.current?.click();
  }

  function openGallery() {
    if (!consented) return;
    galleryInputRef.current?.click();
  }

  async function sendPhoto(file?: File) {
    if (!file || remaining <= 0 || !consented) return;
    if (file.size > 12 * 1024 * 1024) {
      setMessage("A foto original deve ter no máximo 12 MB.");
      return;
    }
    setUploading(true);
    setMessage("Preparando sua foto para um envio mais rápido...");
    try {
      const optimized = await optimizePhoto(file);
      const form = new FormData();
      form.append("photo", optimized.photo);
      form.append("thumbnail", optimized.thumbnail);
      form.append("guestName", name);
      const response = await fetch("/api/photos", { method: "POST", body: form });
      const data = (await response.json()) as { remaining?: number; error?: string };
      if (!response.ok) {
        setMessage(data.error ?? "Não foi possível enviar a foto.");
      } else {
        setRemaining(data.remaining ?? remaining - 1);
        setMessage("Momento revelado. Sua foto já está chegando ao mural.");
        await loadGallery();
        window.setTimeout(() => document.querySelector("#galeria")?.scrollIntoView({ behavior: "smooth" }), 450);
      }
    } catch (reason) {
      setMessage(
        reason instanceof Error && reason.message.startsWith("O navegador")
          ? reason.message
          : "A conexão oscilou. Tente enviar novamente.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  }

  return (
    <main className="site-shell">
      {joined && (
        <header className="topbar">
          <div className="topbar__inner">
            <div className="couple-lockup">
              <Monogram compact />
              <div><p>{coupleNames}</p><span>{eventConfig.date.replaceAll(".", " · ")}</span></div>
            </div>
            <div className="film-counter" aria-label={`${remaining} fotos restantes`}><span>{remaining}</span><small>restantes</small></div>
          </div>
        </header>
      )}

      {!joined ? (
        <section className="welcome">
          <div className="welcome__frame" aria-hidden="true" />
          <div className="welcome__content">
            <div className="welcome__emblem">
              <p className="eyebrow">EDIÇÃO ESPECIAL · 19.09.2026</p>
              <div className="crest"><Monogram /></div>
              <p className="welcome__edition">UMA NOITE · 24 MOMENTOS · MUITAS MEMÓRIAS</p>
            </div>
            <div className="welcome__story">
              <p className="welcome__kicker">A câmera dos convidados</p>
              <h1><span>{eventConfig.couple.firstName}</span> <em>&</em> <span>{eventConfig.couple.secondName}</span></h1>
              <p className="welcome__copy">O nosso dia, visto pelos seus olhos. Registre os instantes que só você poderia enxergar.</p>
              <div className="guest-entry">
                <label htmlFor="guest-name">Como podemos chamar você?</label>
                <div className="guest-entry__field">
                  <input id="guest-name" value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && enterEvent()} placeholder="Digite seu nome" autoComplete="name" />
                  <button onClick={enterEvent} disabled={!name.trim()} aria-label="Entrar no casamento">Entrar na experiência</button>
                </div>
              </div>
              <div className="welcome__hint"><span>{eventConfig.maximumPhotosPerGuest}</span><p>fotos exclusivas<br />reservadas para você</p></div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="capture">
            <div className="capture__card">
              <div className="capture__copy">
                <p className="eyebrow">OLÁ, {name.toUpperCase()}</p>
                <h1>O próximo<br />momento é seu.</h1>
                <p>Fotografe agora ou escolha uma imagem da sua galeria.<br />Nós cuidamos do resto.</p>
              </div>
              <div className="camera-action">
                <span className="camera-action__orbit" aria-hidden="true" />
                <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" onChange={(event) => void sendPhoto(event.target.files?.[0])} />
                <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => void sendPhoto(event.target.files?.[0])} />
                <button onClick={openCamera} disabled={uploading || remaining <= 0 || !consented} aria-label={remaining > 0 ? "Abrir câmera" : "Limite de fotos atingido"}>
                  {uploading ? <LoaderCircle className="animate-spin" /> : <Camera />}
                </button>
                <strong>{uploading ? "Revelando..." : remaining > 0 ? consented ? "Abrir câmera" : "Aceite para fotografar" : "Filme completo"}</strong>
                <button className="camera-action__gallery" onClick={openGallery} disabled={uploading || remaining <= 0 || !consented} aria-label="Escolher foto da galeria">
                  <Images /> Escolher da galeria
                </button>
              </div>
              {message && <div className="capture__message" role="status"><Sparkles />{message}</div>}
            </div>

            {!consented && (
              <div className="consent-note" role="note" aria-label="Consentimento para envio de fotos">
                <ShieldCheck aria-hidden="true" />
                <p>Ao continuar, você concorda que as fotos enviadas sejam exibidas no mural privado deste casamento.</p>
                <button onClick={acceptConsent}>Concordo e continuar</button>
              </div>
            )}

            <a className="gallery-jump" href="#galeria">Ver o mural<ChevronDown /></a>
          </section>

          <section className="gallery" id="galeria">
            <div className="gallery__heading">
              <div><p className="eyebrow">NOSSO MURAL</p><h2>Memórias,<br /><em>por vocês.</em></h2></div>
              <div className="gallery__meta"><span>{photos.length}</span><p>{photos.length === 1 ? "momento guardado" : "momentos guardados"}</p><button onClick={() => void loadGallery()} aria-label="Atualizar mural"><RefreshCw /></button></div>
            </div>
            <p className="gallery__quote">Cada foto conta uma história. Cada momento, uma lembrança eterna.</p>

            {photos.length === 0 ? (
              <div className="empty-gallery"><Images /><p>A história começa com a primeira foto.</p><button onClick={openCamera} disabled={!consented}>Registrar agora</button></div>
            ) : (
              <div className="photo-grid">
                {photos.map((photo, index) => (
                  <figure key={photo.id} className={`${index % 5 === 0 ? "photo-card photo-card--tall" : "photo-card"} ${newMoment?.id === photo.id ? "photo-card--new" : ""}`} onClick={() => setSelectedPhoto(photo)} tabIndex={0} role="button" onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && setSelectedPhoto(photo)}>
                    <img src={photo.thumbnailUrl} alt={`Foto registrada por ${photo.guestName}`} loading="lazy" />
                    <figcaption>por {photo.guestName}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>

          <footer><Monogram compact /><p>{coupleNames} · {eventConfig.date}</p></footer>
        </>
      )}

      {newMoment && joined && (
        <button className="new-moment-toast" onClick={() => { setSelectedPhoto(newMoment); setNewMoment(null); }} aria-label={`Abrir nova foto de ${newMoment.guestName}`}>
          <img src={newMoment.thumbnailUrl} alt="" />
          <span><strong>Novo momento revelado</strong><small>por {newMoment.guestName}</small></span>
          <Sparkles />
        </button>
      )}

      {selectedPhoto && (
        <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={`Foto de ${selectedPhoto.guestName}`} onClick={() => setSelectedPhoto(null)}>
          <button className="photo-lightbox__close" onClick={() => setSelectedPhoto(null)} aria-label="Fechar foto"><X /></button>
          <figure className="photo-lightbox__polaroid" onClick={(event) => event.stopPropagation()}>
            <img src={selectedPhoto.url} alt={`Foto registrada por ${selectedPhoto.guestName}`} />
            <figcaption><span>Um momento por <strong>{selectedPhoto.guestName}</strong></span><small>{new Date(selectedPhoto.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</small></figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}
