import { PlaceDetailPage } from "@/features/place-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PlaceDetailRoute({ params }: Props) {
  const { id } = await params;
  return <PlaceDetailPage placeId={id} />;
}
