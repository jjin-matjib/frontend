"use client";

import { useRouter } from "next/navigation";
import { FooterNav } from "@/_components/FooterNav";
import { RegionRecommendContent } from "./_components/RegionRecommendContent";
import { RegionHeader } from "./_components/RegionHeader";

export function RegionRecommendPage() {
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-1 flex-col gap-6">
      <RegionHeader onBack={() => router.back()} />
      <p className="px-4 text-sm text-muted-foreground">
        각자 가까운 역을 선택하면, 최적의 만남 장소를 추천해드려요!
      </p>

      <RegionRecommendContent />
      <div className="mt-auto pt-4">
        <FooterNav />
      </div>
    </main>
  );
}
