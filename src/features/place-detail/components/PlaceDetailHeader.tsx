import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onBack: () => void;
}

export function PlaceDetailHeader({ onBack }: Props) {
  return (
    <header className="sticky top-0 z-(--z-sticky) flex items-center bg-background/90 px-4 py-3 backdrop-blur">
      <Button variant="ghost" size="icon" onClick={onBack} aria-label="뒤로 가기">
        <ArrowLeft />
      </Button>
    </header>
  );
}
