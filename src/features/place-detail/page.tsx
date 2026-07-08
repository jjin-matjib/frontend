"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MapLinkButtons } from "./components/MapLinkButtons";
import { PlaceDetailHeader } from "./components/PlaceDetailHeader";
import { PlaceDetailSkeleton } from "./components/PlaceDetailSkeleton";
import { PlaceInfoSection } from "./components/PlaceInfoSection";
import { ShareActionBar } from "./components/ShareActionBar";
import { usePlaceDetailQuery } from "./hooks/usePlaceDetailQuery";
import { usePlaceShare } from "./hooks/usePlaceShare";

interface Props {
  placeId: string;
}

export function PlaceDetailPage({ placeId }: Props) {
  const router = useRouter();
  const {
    data: place,
    isPending,
    isError,
    refetch,
  } = usePlaceDetailQuery(placeId);
  const { shareImage, shareUrl, result } = usePlaceShare(place);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 pb-10">
      <PlaceDetailHeader onBack={() => router.back()} />

      {isPending && <PlaceDetailSkeleton />}

      {isError && (
        <div className="flex flex-col items-center gap-3 px-4 py-16">
          <p className="text-sm leading-5 text-muted-foreground">
            가게 정보를 불러오지 못했습니다.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            다시 시도
          </Button>
        </div>
      )}

      {place && (
        <>
          <PlaceInfoSection place={place} />
          <MapLinkButtons place={place} />
          <ShareActionBar
            result={result}
            onShareImage={shareImage}
            onShareUrl={shareUrl}
          />
        </>
      )}
    </main>
  );
}
