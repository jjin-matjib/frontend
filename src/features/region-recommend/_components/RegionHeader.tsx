import { ArrowLeft } from "lucide-react";
import { Button } from "@/_components/ui/button";

interface Props {
  onBack: () => void;
}

export function RegionHeader({ onBack }: Props) {
  return (
    // 반투명 + backdrop-blur는 스크롤 시 아래 콘텐츠가 비쳐 깨져 보여 불투명 배경 사용
    <header className="sticky top-0 z-(--z-sticky) flex items-center gap-1 border-b border-border bg-background px-4 py-3">
      <Button variant="ghost" size="icon" onClick={onBack} aria-label="뒤로 가기">
        <ArrowLeft />
      </Button>
      <h1 className="text-lg font-semibold">권역 추천</h1>
    </header>
  );
}
