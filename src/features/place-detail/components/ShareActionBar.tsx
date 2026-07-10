import { Image as ImageIcon, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShareResult } from "../hooks/usePlaceShare";

const RESULT_MESSAGE: Partial<Record<ShareResult, string>> = {
  copied: "링크가 클립보드에 복사되었습니다.",
  downloaded: "공유 이미지가 저장되었습니다.",
  error: "공유에 실패했습니다. 다시 시도해주세요.",
};

interface Props {
  result: ShareResult;
  onShareImage: () => void;
  onShareUrl: () => void;
}

export function ShareActionBar({ result, onShareImage, onShareUrl }: Props) {
  const message = RESULT_MESSAGE[result];

  return (
    <section className="flex flex-col gap-2 px-4">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="h-12 gap-2" onClick={onShareImage}>
          <ImageIcon />
          이미지로 공유
        </Button>
        <Button className="h-12 gap-2" onClick={onShareUrl}>
          <Link2 />
          URL로 공유
        </Button>
      </div>
      {message && (
        <p className="text-center text-sm leading-5 text-muted-foreground">{message}</p>
      )}
    </section>
  );
}
