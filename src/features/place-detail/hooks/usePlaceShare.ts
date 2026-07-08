"use client";

import { useState } from "react";
import type { PlaceDetail } from "../types";
import { getTodayHours } from "../utils/openingHours";

export type ShareResult = "idle" | "copied" | "downloaded" | "error";

const CARD_WIDTH = 640;
const CARD_HEIGHT = 360;
const CARD_SCALE = 2;
const CARD_FONT = "-apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

function drawShareCard(place: PlaceDetail): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH * CARD_SCALE;
  canvas.height = CARD_HEIGHT * CARD_SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas를 사용할 수 없습니다.");
  ctx.scale(CARD_SCALE, CARD_SCALE);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, CARD_WIDTH, 8);

  ctx.fillStyle = "#999999";
  ctx.font = `500 16px ${CARD_FONT}`;
  ctx.fillText("찐맛집", 40, 60);

  ctx.fillStyle = "#111111";
  ctx.font = `700 32px ${CARD_FONT}`;
  ctx.fillText(place.name, 40, 110, CARD_WIDTH - 80);

  ctx.fillStyle = "#555555";
  ctx.font = `400 18px ${CARD_FONT}`;
  ctx.fillText(`${place.category} · ★ ${place.rating} (리뷰 ${place.reviewCount})`, 40, 144);

  const infoLines = [
    [place.isOpen ? "영업중" : "영업 종료", getTodayHours(place.weekdayHours)]
      .filter(Boolean)
      .join(" · "),
    place.address,
    place.phone,
  ].filter(Boolean);

  ctx.fillStyle = "#333333";
  ctx.font = `400 17px ${CARD_FONT}`;
  infoLines.forEach((line, i) => {
    ctx.fillText(line, 40, 196 + i * 34, CARD_WIDTH - 80);
  });

  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("이미지 생성에 실패했습니다."))),
      "image/png",
    );
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function isAbortError(err: unknown) {
  return err instanceof DOMException && err.name === "AbortError";
}

export function usePlaceShare(place: PlaceDetail | undefined) {
  const [result, setResult] = useState<ShareResult>("idle");

  const shareImage = async () => {
    if (!place) return;
    setResult("idle");
    try {
      const blob = await canvasToBlob(drawShareCard(place));
      const fileName = `${place.name.replace(/[\\/:*?"<>|]/g, "").trim() || "place"}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: place.name });
      } else {
        downloadBlob(blob, fileName);
        setResult("downloaded");
      }
    } catch (err) {
      if (!isAbortError(err)) setResult("error");
    }
  };

  const shareUrl = async () => {
    if (!place) return;
    setResult("idle");
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: place.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setResult("copied");
      }
    } catch (err) {
      if (!isAbortError(err)) setResult("error");
    }
  };

  const resetResult = () => setResult("idle");

  return { shareImage, shareUrl, result, resetResult };
}
