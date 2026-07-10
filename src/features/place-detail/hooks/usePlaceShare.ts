"use client";

import { useState } from "react";
import type { PlaceDetail } from "../types";
import { getTodayHours } from "../utils/openingHours";

export type ShareResult = "idle" | "copied" | "downloaded" | "error";

const CARD_WIDTH = 640;
const CARD_HEIGHT = 570;
const CARD_SCALE = 2;
const CARD_PAD_X = 40;
const CARD_FONT = "-apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

const COLOR_MUTED_FOREGROUND = "#8a8a8a";
const COLOR_FOREGROUND = "#111111";
const COLOR_MUTED_BG = "#f5f5f5";
const COLOR_BORDER = "#e5e5e5";
const COLOR_SUCCESS = "#16a34a";
const COLOR_DESTRUCTIVE = "#dc2626";
const COLOR_AMBER = "#fbbf24";

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

const ICON_SIZE = 16;
const ICON_TEXT_GAP = 12;

function iconDataUrl(pathMarkup: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${COLOR_MUTED_FOREGROUND}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${pathMarkup}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// lucide-react의 Clock/Phone/MapPin과 동일한 path (PlaceInfoSection에서 쓰는 아이콘)
const ICON_CLOCK = iconDataUrl('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>');
const ICON_PHONE = iconDataUrl(
  '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
);
const ICON_MAP_PIN = iconDataUrl(
  '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
);

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
    img.src = src;
  });
}

// PlaceInfoSection의 대표 사진(w-28/h-28, object-cover)과 동일한 크기·크롭 방식
const PHOTO_SIZE = 112;
const PHOTO_GAP = 16;

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number,
) {
  const ratio = img.width / img.height;
  const [sw, sh] =
    ratio > 1 ? [img.height, img.height] : [img.width, img.width];
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, size, size);
}

async function drawShareCard(place: PlaceDetail): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH * CARD_SCALE;
  canvas.height = CARD_HEIGHT * CARD_SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas를 사용할 수 없습니다.");
  ctx.scale(CARD_SCALE, CARD_SCALE);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.fillStyle = COLOR_FOREGROUND;
  ctx.fillRect(0, 0, CARD_WIDTH, 8);

  ctx.fillStyle = COLOR_MUTED_FOREGROUND;
  ctx.font = `500 16px ${CARD_FONT}`;
  ctx.fillText("먹지도", CARD_PAD_X, 60);

  // 가게 이름 + 카테고리 배지 (PlaceInfoSection 첫 줄과 동일한 순서)
  ctx.fillStyle = COLOR_FOREGROUND;
  ctx.font = `700 32px ${CARD_FONT}`;
  const nameMaxWidth = CARD_WIDTH - CARD_PAD_X * 2 - 140;
  ctx.fillText(place.name, CARD_PAD_X, 110, nameMaxWidth);
  const nameWidth = Math.min(ctx.measureText(place.name).width, nameMaxWidth);

  ctx.font = `500 14px ${CARD_FONT}`;
  const badgeX = CARD_PAD_X + nameWidth + 12;
  const badgeTextWidth = ctx.measureText(place.category).width;
  const badgeWidth = badgeTextWidth + 20;
  ctx.fillStyle = COLOR_MUTED_BG;
  drawRoundedRect(ctx, badgeX, 90, badgeWidth, 24, 12);
  ctx.fill();
  ctx.fillStyle = COLOR_MUTED_FOREGROUND;
  ctx.fillText(place.category, badgeX + 10, 107);

  // 별점 + 리뷰 수 (PlaceInfoSection 두 번째 줄과 동일)
  ctx.fillStyle = COLOR_AMBER;
  ctx.font = `400 17px ${CARD_FONT}`;
  ctx.fillText("★", CARD_PAD_X, 146);
  const starWidth = ctx.measureText("★ ").width;
  ctx.fillStyle = COLOR_FOREGROUND;
  ctx.font = `500 17px ${CARD_FONT}`;
  ctx.fillText(String(place.rating), CARD_PAD_X + starWidth, 146);
  const ratingWidth = ctx.measureText(`${place.rating} `).width;
  ctx.fillStyle = COLOR_MUTED_FOREGROUND;
  ctx.font = `400 17px ${CARD_FONT}`;
  ctx.fillText(
    `· 리뷰 ${place.reviewCount.toLocaleString()}개`,
    CARD_PAD_X + starWidth + ratingWidth,
    146,
  );

  // 정보 박스 (PlaceInfoSection의 영업시간/전화번호/주소 dl과 동일한 내용)
  const [clockIcon, phoneIcon, mapPinIcon, photoIcon] = await Promise.all([
    loadImage(ICON_CLOCK),
    loadImage(ICON_PHONE),
    loadImage(ICON_MAP_PIN),
    place.photoName
      ? loadImage(`/api/places/photo?name=${encodeURIComponent(place.photoName)}&maxWidthPx=300`).catch(
          () => null,
        )
      : Promise.resolve(null),
  ]);

  const todayHours = getTodayHours(place.weekdayHours);
  const lineHeight = 26;
  const sectionGap = 14;
  const boxPad = 24;
  const textIndent = ICON_SIZE + ICON_TEXT_GAP;
  const photoReserve = photoIcon ? PHOTO_SIZE + PHOTO_GAP : 0;
  const contentMaxWidth = CARD_WIDTH - CARD_PAD_X * 2 - boxPad * 2 - textIndent - photoReserve;

  const sections: { icon: HTMLImageElement; lines: string[]; color: (line: string) => string }[] = [
    {
      icon: clockIcon,
      lines: [place.isOpen ? "영업중" : "영업 종료", ...place.weekdayHours],
      color: (line) =>
        line === (place.isOpen ? "영업중" : "영업 종료")
          ? place.isOpen
            ? COLOR_SUCCESS
            : COLOR_DESTRUCTIVE
          : line === todayHours
            ? COLOR_FOREGROUND
            : COLOR_MUTED_FOREGROUND,
    },
    ...(place.phone
      ? [{ icon: phoneIcon, lines: [place.phone], color: () => COLOR_FOREGROUND }]
      : []),
    ...(place.address
      ? [{ icon: mapPinIcon, lines: [place.address], color: () => COLOR_FOREGROUND }]
      : []),
  ];

  const totalLines = sections.reduce((sum, s) => sum + s.lines.length, 0);
  const boxHeight =
    totalLines * lineHeight + (sections.length - 1) * sectionGap + boxPad * 2;
  const boxTop = 182;
  const boxWidth = CARD_WIDTH - CARD_PAD_X * 2;

  ctx.strokeStyle = COLOR_BORDER;
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, CARD_PAD_X, boxTop, boxWidth, boxHeight, 16);
  ctx.stroke();

  if (photoIcon) {
    const photoX = CARD_PAD_X + boxWidth - boxPad - PHOTO_SIZE;
    const photoY = boxTop + boxPad;
    ctx.save();
    drawRoundedRect(ctx, photoX, photoY, PHOTO_SIZE, PHOTO_SIZE, 8);
    ctx.clip();
    drawImageCover(ctx, photoIcon, photoX, photoY, PHOTO_SIZE);
    ctx.restore();
  }

  const textX = CARD_PAD_X + boxPad + textIndent;
  let textY = boxTop + boxPad + lineHeight * 0.7;
  ctx.font = `400 17px ${CARD_FONT}`;
  sections.forEach((section, sectionIndex) => {
    ctx.drawImage(section.icon, CARD_PAD_X + boxPad, textY - ICON_SIZE + 4, ICON_SIZE, ICON_SIZE);
    section.lines.forEach((line, lineIndex) => {
      ctx.font =
        sectionIndex === 0 && lineIndex === 0 ? `500 17px ${CARD_FONT}` : `400 17px ${CARD_FONT}`;
      ctx.fillStyle = section.color(line);
      ctx.fillText(line, textX, textY, contentMaxWidth);
      textY += lineHeight;
    });
    if (sectionIndex < sections.length - 1) textY += sectionGap;
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
      const blob = await canvasToBlob(await drawShareCard(place));
      const fileName = `${place.name.replace(/[\\/:*?"<>|]/g, "").trim() || "place"}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      const url = window.location.href;
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: `${place.name}\n${url}` });
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

  return { shareImage, shareUrl, result };
}
