import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onBack: () => void;
  onShare: () => void;
}

export function PlaceDetailHeader({ onBack, onShare }: Props) {
  return (
    <header className="sticky top-0 z-(--z-sticky) flex items-center justify-between bg-background/90 px-4 py-3 backdrop-blur">
      <Button variant="ghost" size="icon" onClick={onBack} aria-label="뒤로 가기">
        <ArrowLeft />
      </Button>
      <Button variant="ghost" size="icon" onClick={onShare} aria-label="공유하기">
        <Share2 />
      </Button>
    </header>
  );
}
