"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { PlaceDetailContent } from "./_components/PlaceDetailContent";
import { PlaceDetailHeader } from "./_components/PlaceDetailHeader";
import { PlaceDetailSkeleton } from "./_components/PlaceDetailSkeleton";

interface Props {
  placeId: string;
}

export function PlaceDetailPage({ placeId }: Props) {
  const router = useRouter();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 pb-10">
      <PlaceDetailHeader onBack={() => router.back()} />
      <Suspense fallback={<PlaceDetailSkeleton />}>
        <PlaceDetailContent placeId={placeId} />
      </Suspense>
    </main>
  );
}
