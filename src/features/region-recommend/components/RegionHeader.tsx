import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onBack: () => void;
}

export function RegionHeader({ onBack }: Props) {
  return (
    <header className="sticky top-0 z-(--z-sticky) flex items-center gap-1 bg-background/90 px-4 py-3 backdrop-blur">
      <Button variant="ghost" size="icon" onClick={onBack} aria-label="뒤로 가기">
        <ArrowLeft />
      </Button>
      <h1 className="text-lg font-semibold">권역 추천</h1>
    </header>
  );
}
