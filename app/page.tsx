"use client";

import {
  Camera,
  ChevronDown,
  Images,
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { coupleNames, eventConfig } from "../lib/event-config";

type Photo = {
  id: string;
  url: string;
  guestName: string;
  createdAt: string;
};

function Monogram({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "monogram monogram--compact" : "monogram"} aria-label="L A">
      <i>{eventConfig.couple.initials[0]}</i>
      <b>{eventConfig.couple.initials[1]}</b>
    </span>
  );
}

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [remaining, setRemaining] = useState(24);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const loadGallery = useCallback(async () => {
    const response = await fetch("/api/photos", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as {
      photos: Photo[];
      remaining?: number;
    };
    setPhotos(data.photos);
    if (typeof data.remaining === "number") setRemaining(data.remaining);
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem("24momentos_guest_name");
    if (savedName) {
      setName(savedName);
      setJoined(true);
    }
    void loadGallery();
    const timer = window.setInterval(loadGallery, 10000);
    return () => window.clearInterval(timer);
  }, [loadGallery]);

  function enterEvent() {
    const cleanName = name.trim().slice(0, 40);
    if (!cleanName) return;
    localStorage.setItem("24momentos_guest_name", cleanName);
    setName(cleanName);
    setJoined(true);
  }

  async function sendPhoto(file?: File) {
    if (!file || remaining <= 0) return;
    setUploading(true);
    setMessage("");
    const form = new FormData();
    form.append("photo", file);
    form.append("guestName", name);
    const response = await fetch("/api/photos", { method: "POST", body: form });
    const data = (await response.json()) as {
      remaining?: number;
      error?: string;
    };
    if (!response.ok) {
      setMessage(data.error ?? "Não foi possível enviar a foto.");
    } else {
      setRemaining(data.remaining ?? remaining - 1);
      setMessage("Seu olhar agora faz parte da nossa história.");
      await loadGallery();
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <main className="site-shell">
      {joined && (
        <header className="topbar">
          <div className="topbar__inner">
            <div className="couple-lockup">
              <Monogram compact />
              <div>
                <p>{coupleNames}</p>
                <span>{eventConfig.date.replaceAll(".", " · ")}</span>
              </div>
            </div>
            <div className="film-counter" aria-label={`${remaining} fotos restantes`}>
              <span>{remaining}</span>
              <small>restantes</small>
            </div>
          </div>
        </header>
      )}

      {!joined ? (
        <section className="welcome">
          <div className="welcome__frame" aria-hidden="true" />
          <div className="welcome__content">
            <p className="eyebrow">NOSSO CASAMENTO</p>
            <div className="crest">
              <Monogram />
              <span>{eventConfig.date}</span>
            </div>
            <h1>{eventConfig.couple.firstName} <em>&</em> {eventConfig.couple.secondName}</h1>
            <p className="welcome__copy">
              Guarde o nosso dia através do seu olhar.
              <br />
              Você recebeu um filme com {eventConfig.maximumPhotosPerGuest} momentos.
            </p>
            <div className="guest-entry">
              <label htmlFor="guest-name">Assine este capítulo</label>
              <div className="guest-entry__field">
                <input
                  id="guest-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && enterEvent()}
                  placeholder="Seu nome"
                  autoComplete="name"
                />
                <button
                  onClick={enterEvent}
                  disabled={!name.trim()}
                  aria-label="Entrar no casamento"
                >
                  Entrar
                </button>
              </div>
            </div>
            <div className="welcome__hint">
              <span>{eventConfig.maximumPhotosPerGuest}</span>
              <p>fotos para registrar<br />do seu jeito</p>
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
                <p>
                  Abra a câmera, registre e pronto.
                  <br />
                  Nós cuidamos do resto.
                </p>
              </div>

              <div className="camera-action">
                <span className="camera-action__orbit" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={(event) => void sendPhoto(event.target.files?.[0])}
                />
                <button
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading || remaining <= 0}
                  aria-label={remaining > 0 ? "Abrir câmera" : "Limite de fotos atingido"}
                >
                  {uploading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Camera />
                  )}
                </button>
                <strong>
                  {uploading
                    ? "Enviando..."
                    : remaining > 0
                      ? "Abrir câmera"
                      : "Filme completo"}
                </strong>
              </div>

              {message && (
                <div className="capture__message" role="status">
                  <Sparkles />
                  {message}
                </div>
              )}
            </div>

            <a className="gallery-jump" href="#galeria">
              Ver os momentos
              <ChevronDown />
            </a>
          </section>

          <section className="gallery" id="galeria">
            <div className="gallery__heading">
              <div>
                <p className="eyebrow">GALERIA COLETIVA</p>
                <h2>Nosso dia,<br /><em>por vocês.</em></h2>
              </div>
              <div className="gallery__meta">
                <span>{photos.length}</span>
                <p>{photos.length === 1 ? "momento guardado" : "momentos guardados"}</p>
                <button onClick={() => void loadGallery()} aria-label="Atualizar galeria">
                  <RefreshCw />
                </button>
              </div>
            </div>

            {photos.length === 0 ? (
              <div className="empty-gallery">
                <Images />
                <p>A história começa com a primeira foto.</p>
                <button onClick={() => inputRef.current?.click()}>Registrar agora</button>
              </div>
            ) : (
              <div className="photo-grid">
                {photos.map((photo, index) => (
                  <figure key={photo.id} className={index % 5 === 0 ? "photo-card photo-card--tall" : "photo-card"}>
                    <img
                      src={photo.url}
                      alt={`Foto registrada por ${photo.guestName}`}
                      loading="lazy"
                    />
                    <figcaption>por {photo.guestName}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>

          <footer>
            <Monogram compact />
            <p>{coupleNames} · {eventConfig.date}</p>
          </footer>
        </>
      )}
    </main>
  );
}
