import { Image as ImageIcon, Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShareResult } from "../hooks/usePlaceShare";

const RESULT_MESSAGE: Partial<Record<ShareResult, string>> = {
  copied: "링크가 클립보드에 복사되었습니다.",
  downloaded: "공유 이미지가 저장되었습니다.",
  error: "공유에 실패했습니다. 다시 시도해주세요.",
};

interface Props {
  open: boolean;
  result: ShareResult;
  onClose: () => void;
  onShareImage: () => void;
  onShareUrl: () => void;
}

export function ShareBottomSheet({ open, result, onClose, onShareImage, onShareUrl }: Props) {
  if (!open) return null;

  const message = RESULT_MESSAGE[result];

  return (
    <div className="fixed inset-0 z-(--z-modal)">
      <button
        type="button"
        aria-label="공유 닫기"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="공유하기"
        className="absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-lg flex-col gap-4 rounded-t-2xl bg-background p-6 pb-8 animate-in slide-in-from-bottom duration-(--duration-normal)"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base leading-6 font-semibold">공유하기</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="닫기">
            <X />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="h-12 justify-start gap-2" onClick={onShareImage}>
            <ImageIcon />
            이미지로 공유
          </Button>
          <Button variant="outline" className="h-12 justify-start gap-2" onClick={onShareUrl}>
            <Link2 />
            링크로 공유
          </Button>
        </div>
        {message && (
          <p className="text-center text-sm leading-5 text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}
