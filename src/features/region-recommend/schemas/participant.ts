import { z } from "zod";
import { MAX_PARTICIPANTS, MIN_PARTICIPANTS } from "../constants/config";

/**
 * 참여자 폼 검증. 각 행은 라벨과 (선택 전엔 null인) 역 id를 갖는다.
 * 제출 시 전원 역 선택 필수.
 */
export const recommendFormSchema = z.object({
  participants: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        stationId: z.string().nullable(),
      }),
    )
    .min(MIN_PARTICIPANTS, `최소 ${MIN_PARTICIPANTS}명이 필요해요.`)
    .max(MAX_PARTICIPANTS, `최대 ${MAX_PARTICIPANTS}명까지 추천할 수 있어요.`)
    .refine((rows) => rows.every((row) => row.stationId !== null), {
      message: "모든 참여자의 출발 역을 선택해주세요.",
    }),
});

export type RecommendFormValues = z.infer<typeof recommendFormSchema>;
