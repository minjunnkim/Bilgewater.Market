"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";

type GalleryImage = {
  url: string;
  alt?: string;
  label?: string;
};

/** Size of the square selection on the source image (css px). */
const LENS = 110;
/** Magnification of the side preview relative to the lens. */
const ZOOM = 4.2;

function IconDownload() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconExpand() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 3H3v6M15 3h6v6M9 21H3v-6M21 15v6h-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMinus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;

function clampZoom(value: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value * 100) / 100));
}

function ZoomControls({
  zoom,
  onZoomOut,
  onZoomIn,
  size = "md",
}: {
  zoom: number;
  onZoomOut: () => void;
  onZoomIn: () => void;
  size?: "sm" | "md";
}) {
  const btn =
    size === "sm"
      ? "flex h-10 w-10 items-center justify-center rounded-full border border-parchment/35 bg-ink/50 text-parchment backdrop-blur-sm transition hover:border-brass hover:text-brass disabled:cursor-not-allowed disabled:opacity-35"
      : "flex h-11 w-11 items-center justify-center rounded-full border border-parchment/40 bg-harbor text-parchment transition hover:border-brass hover:text-brass disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onZoomOut}
        disabled={zoom <= ZOOM_MIN}
        className={btn}
        aria-label="Zoom out"
        title="Zoom out"
      >
        <IconMinus />
      </button>
      <span className="min-w-[3rem] text-center text-xs tabular-nums text-wake">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        onClick={onZoomIn}
        disabled={zoom >= ZOOM_MAX}
        className={btn}
        aria-label="Zoom in"
        title="Zoom in"
      >
        <IconPlus />
      </button>
    </div>
  );
}

type LensState = {
  visible: boolean;
  x: number;
  y: number;
  imgW: number;
  imgH: number;
  lens: number;
};

type PreviewBox = {
  left: number;
  top: number;
  size: number;
};

const HIDDEN: LensState = {
  visible: false,
  x: 0,
  y: 0,
  imgW: 0,
  imgH: 0,
  lens: LENS,
};

function getDetailsPreviewBox(previewSize: number): PreviewBox | null {
  const col = document.getElementById("inventory-details-column");
  if (!col) return null;
  const rect = col.getBoundingClientRect();
  if (rect.width < 80) return null;

  const size = Math.min(
    Math.max(previewSize, rect.width * 0.92),
    rect.width,
    window.innerHeight - 112,
  );
  const top = Math.min(
    Math.max(rect.top, 88),
    window.innerHeight - size - 20,
  );

  return { left: rect.left, top, size };
}

function MagnifierStage({
  src,
  alt,
  priority = false,
  imgClassName = "",
  lensSize = LENS,
  zoom = ZOOM,
  overlayDetailsColumn = false,
  /** Fullscreen: large image + large split zoom pane */
  splitLayout = false,
  /** Simple +/- scale (1 = fit) */
  imageScale = 1,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  imgClassName?: string;
  lensSize?: number;
  zoom?: number;
  overlayDetailsColumn?: boolean;
  splitLayout?: boolean;
  imageScale?: number;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [lens, setLens] = useState<LensState>(HIDDEN);
  const [previewBox, setPreviewBox] = useState<PreviewBox | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const syncPreviewBox = useCallback(
    (lensSizePx: number) => {
      if (!overlayDetailsColumn) {
        setPreviewBox(null);
        return;
      }
      setPreviewBox(getDetailsPreviewBox(lensSizePx * zoom));
    },
    [overlayDetailsColumn, zoom],
  );

  const updateLens = useCallback(
    (clientX: number, clientY: number) => {
      const img = imgRef.current;
      if (!img) return;

      const rect = img.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setLens(HIDDEN);
        setPreviewBox(null);
        return;
      }

      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!inside) {
        setLens(HIDDEN);
        setPreviewBox(null);
        return;
      }

      const size = Math.min(lensSize, rect.width, rect.height);
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const clampedX = Math.max(0, Math.min(x - size / 2, rect.width - size));
      const clampedY = Math.max(0, Math.min(y - size / 2, rect.height - size));

      setLens({
        visible: true,
        x: clampedX,
        y: clampedY,
        imgW: rect.width,
        imgH: rect.height,
        lens: size,
      });
      syncPreviewBox(size);
    },
    [lensSize, syncPreviewBox],
  );

  useEffect(() => {
    if (!lens.visible || !overlayDetailsColumn) return;
    const onScrollOrResize = () => syncPreviewBox(lens.lens);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [lens.visible, lens.lens, overlayDetailsColumn, syncPreviewBox]);

  function onMove(e: ReactMouseEvent) {
    if (imageScale !== 1) {
      setLens(HIDDEN);
      setPreviewBox(null);
      return;
    }
    updateLens(e.clientX, e.clientY);
  }

  function onLeave() {
    setLens(HIDDEN);
    setPreviewBox(null);
  }

  const previewSize = lens.lens * zoom;

  const detailsPortal =
    mounted && lens.visible && overlayDetailsColumn && previewBox
      ? createPortal(
          <div
            aria-hidden
            className="pointer-events-none fixed z-[60] hidden overflow-hidden rounded-sm border border-tide/40 bg-[#0b1214] shadow-2xl lg:block"
            style={{
              left: previewBox.left,
              top: previewBox.top,
              width: previewBox.size,
              height: previewBox.size,
              backgroundImage: `url(${src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${lens.imgW * zoom}px ${lens.imgH * zoom}px`,
              backgroundPosition: `-${lens.x * zoom}px -${lens.y * zoom}px`,
            }}
          />,
          document.body,
        )
      : null;

  const imageBlock = (
    <div
      className="relative inline-block max-w-full cursor-default"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: imageScale !== 1 ? `scale(${imageScale})` : undefined,
        transformOrigin: "center center",
      }}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        width={1600}
        height={2000}
        priority={priority}
        draggable={false}
        className={`mx-auto block h-auto w-auto max-w-full select-none object-contain ${imgClassName}`}
        sizes={splitLayout ? "55vw" : "(max-width: 1024px) 100vw, 45vw"}
      />

      {lens.visible && imageScale === 1 ? (
        <div
          aria-hidden
          className="pointer-events-none absolute z-20 border-2 border-parchment/90 bg-parchment/20 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35)]"
          style={{
            width: lens.lens,
            height: lens.lens,
            left: lens.x,
            top: lens.y,
          }}
        />
      ) : null}
    </div>
  );

  if (splitLayout) {
    const pane =
      typeof window !== "undefined"
        ? Math.min(window.innerWidth * 0.36, window.innerHeight - 160, 500)
        : 440;
    const showHoverMagnifier = lens.visible && imageScale === 1;

    return (
      <div className="flex h-full w-full min-h-0 flex-col items-center justify-center overflow-auto">
        <div className="relative flex min-h-full w-full items-center justify-center p-2">
          {imageBlock}

          {showHoverMagnifier ? (
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-[calc(100%+1.75rem)] hidden -translate-y-1/2 overflow-hidden rounded-sm border border-tide/40 bg-[#0b1214] shadow-2xl lg:block"
              style={{
                width: pane,
                height: pane,
                backgroundImage: `url(${src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${lens.imgW * zoom}px ${lens.imgH * zoom}px`,
                backgroundPosition: `-${lens.x * zoom}px -${lens.y * zoom}px`,
              }}
            />
          ) : null}
        </div>

        {showHoverMagnifier ? (
          <div
            aria-hidden
            className="mt-4 overflow-hidden rounded-sm border border-tide/30 bg-[#0b1214] lg:hidden"
            style={{
              width: Math.min(pane, 280),
              height: Math.min(pane, 280),
              backgroundImage: `url(${src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${lens.imgW * (Math.min(pane, 280) / lens.lens)}px ${lens.imgH * (Math.min(pane, 280) / lens.lens)}px`,
              backgroundPosition: `-${lens.x * (Math.min(pane, 280) / lens.lens)}px -${lens.y * (Math.min(pane, 280) / lens.lens)}px`,
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative inline-block max-w-full">
      {imageBlock}
      {detailsPortal}

      {lens.visible ? (
        <div
          aria-hidden
          className="mt-3 overflow-hidden rounded-sm border border-tide/30 bg-[#0b1214] lg:hidden"
          style={{
            width: Math.min(previewSize, 260),
            height: Math.min(previewSize, 260),
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${lens.imgW * (Math.min(previewSize, 260) / lens.lens)}px ${lens.imgH * (Math.min(previewSize, 260) / lens.lens)}px`,
            backgroundPosition: `-${lens.x * (Math.min(previewSize, 260) / lens.lens)}px -${lens.y * (Math.min(previewSize, 260) / lens.lens)}px`,
          }}
        />
      ) : null}
    </div>
  );
}

export function ItemGallery({
  images,
  name,
  overlayDetailsColumn = false,
}: {
  images: GalleryImage[];
  name: string;
  overlayDetailsColumn?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const current = images[active] ?? images[0];

  const closeExpanded = useCallback(() => {
    setExpanded(false);
    setLightboxZoom(1);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLightboxZoom(1);
  }, [active]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeExpanded();
      if (e.key === "+" || e.key === "=") {
        setLightboxZoom((z) => clampZoom(z + ZOOM_STEP));
      }
      if (e.key === "-" || e.key === "_") {
        setLightboxZoom((z) => clampZoom(z - ZOOM_STEP));
      }
      if (e.key === "ArrowRight") {
        setActive((i) => (i + 1) % images.length);
      }
      if (e.key === "ArrowLeft") {
        setActive((i) => (i - 1 + images.length) % images.length);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [closeExpanded, expanded, images.length]);

  async function downloadCurrent() {
    if (!current) return;
    try {
      const res = await fetch(current.url);
      const blob = await res.blob();
      const ext = blob.type.includes("png")
        ? "png"
        : blob.type.includes("webp")
          ? "webp"
          : "jpg";
      const label = current.label?.toLowerCase().replace(/\s+/g, "-") || "image";
      const filename = `${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${label}.${ext}`;
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(current.url, "_blank", "noopener,noreferrer");
    }
  }

  if (!images.length || !current) {
    return (
      <div className="flex h-64 items-center justify-center rounded-sm border border-tide/25 bg-depth text-sm text-wake">
        No images
      </div>
    );
  }

  const alt =
    current.alt || `${name}${current.label ? ` — ${current.label}` : ""}`;

  const lightbox =
    mounted && expanded
      ? createPortal(
          <div
            className="fixed inset-0 z-[400] flex flex-col bg-ink"
            role="dialog"
            aria-modal="true"
            aria-label="Full size image"
          >
            <div className="relative z-[410] flex shrink-0 items-center justify-between gap-3 border-b border-tide/25 bg-ink px-4 py-3 sm:px-6">
              <p className="truncate text-sm text-parchment">
                {name}
                {current.label ? (
                  <span className="text-wake"> · {current.label}</span>
                ) : null}
              </p>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <ZoomControls
                  zoom={lightboxZoom}
                  onZoomOut={() =>
                    setLightboxZoom((z) => clampZoom(z - ZOOM_STEP))
                  }
                  onZoomIn={() =>
                    setLightboxZoom((z) => clampZoom(z + ZOOM_STEP))
                  }
                />
                <button
                  type="button"
                  onClick={downloadCurrent}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-parchment/40 bg-harbor text-parchment transition hover:border-brass hover:text-brass"
                  aria-label="Download image"
                  title="Download"
                >
                  <IconDownload />
                </button>
                <button
                  type="button"
                  onClick={closeExpanded}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-parchment/40 bg-harbor text-parchment transition hover:border-brass hover:text-brass"
                  aria-label="Close"
                  title="Close"
                >
                  <IconClose />
                </button>
              </div>
            </div>

            <div className="relative z-[405] flex min-h-0 flex-1 items-center justify-center overflow-auto px-4 py-4 sm:px-8 sm:py-6">
              <MagnifierStage
                src={current.url}
                alt={alt}
                lensSize={130}
                zoom={3.6}
                splitLayout
                imageScale={lightboxZoom}
                imgClassName="max-h-[calc(100vh-9.5rem)] w-auto max-w-[min(92vw,36rem)]"
              />
            </div>

            {images.length > 1 ? (
              <div className="relative z-[410] flex shrink-0 justify-center gap-2 border-t border-tide/20 bg-ink px-4 py-4">
                {images.map((image, index) => (
                  <button
                    key={`full-${image.url}-${index}`}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`relative h-14 w-14 overflow-hidden rounded-md ${
                      index === active
                        ? "ring-2 ring-brass"
                        : "ring-1 ring-tide/30 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="flex items-start gap-3 sm:gap-4">
        {images.length > 1 ? (
          <div className="flex w-16 shrink-0 flex-col gap-2 sm:w-20">
            {images.map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`relative aspect-square overflow-hidden rounded-md transition ${
                  index === active
                    ? "bg-parchment/15 ring-2 ring-brass/70"
                    : "bg-harbor/60 ring-1 ring-tide/20 hover:ring-foam/40"
                }`}
                aria-label={image.label || `Image ${index + 1}`}
                aria-current={index === active}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  className="object-cover p-1"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        ) : null}

        <div className="relative min-w-0 flex-1 overflow-visible rounded-sm border border-tide/25 bg-[#0b1214]">
          <div className="flex w-full items-start justify-center p-3 sm:p-5">
            <MagnifierStage
              src={current.url}
              alt={alt}
              priority
              imgClassName="max-h-[min(72vh,36rem)]"
              overlayDetailsColumn={!expanded && overlayDetailsColumn}
            />
          </div>

          {current.label ? (
            <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-sm bg-ink/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-parchment">
              {current.label}
            </span>
          ) : null}

          <div className="absolute bottom-3 right-3 z-40 flex items-center gap-2">
            <button
              type="button"
              onClick={downloadCurrent}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-parchment/35 bg-ink/50 text-parchment backdrop-blur-sm transition hover:border-brass hover:text-brass"
              aria-label="Download image"
              title="Download"
            >
              <IconDownload />
            </button>
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-parchment/35 bg-ink/50 text-parchment backdrop-blur-sm transition hover:border-brass hover:text-brass"
              aria-label="View full size"
              title="Expand"
            >
              <IconExpand />
            </button>
          </div>
        </div>
      </div>

      {lightbox}
    </>
  );
}
