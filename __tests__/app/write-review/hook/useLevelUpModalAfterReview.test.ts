import { renderHook } from "@testing-library/react";
import { useLevelUpCheck } from "app/write-review/hook/useLevelUpCheck";

const LEVELS = ["NEWBIE", "REGULAR", "ACTIVE", "EXPERT"];

describe("useLevelUpModal (리뷰 작성 후 등급 상승 모달)", () => {
  test("리뷰 작성 후 등급이 상승하면 모달이 열린다", () => {
    const { result, rerender } = renderHook(
      ({ prevLevel, currentLevel, reviewSubmitted }) =>
        useLevelUpCheck({
          prevLevel,
          currentLevel,
          levels: LEVELS,
          reviewSubmitted,
        }),
      {
        initialProps: {
          prevLevel: "REGULAR",
          currentLevel: "REGULAR",
          reviewSubmitted: false,
        },
      },
    );
    // 리뷰 작성 전에는 모달이 안 뜸
    expect(result.current[0]).toBe(false);
    // 리뷰 작성 후 등급이 상승하면 모달이 뜸
    rerender({
      prevLevel: "REGULAR",
      currentLevel: "ACTIVE",
      reviewSubmitted: true,
    });
    expect(result.current[0]).toBe(true);
  });

  test("리뷰 작성 후 등급이 같거나 하락하면 모달이 안 열린다", () => {
    const { result, rerender } = renderHook(
      ({ prevLevel, currentLevel, reviewSubmitted }) =>
        useLevelUpCheck({
          prevLevel,
          currentLevel,
          levels: LEVELS,
          reviewSubmitted,
        }),
      {
        initialProps: {
          prevLevel: "ACTIVE",
          currentLevel: "ACTIVE",
          reviewSubmitted: false,
        },
      },
    );
    // 리뷰 작성 전에는 모달이 안 뜸
    expect(result.current[0]).toBe(false);
    // 등급이 같으면 모달이 안 뜸
    rerender({
      prevLevel: "ACTIVE",
      currentLevel: "ACTIVE",
      reviewSubmitted: true,
    });
    expect(result.current[0]).toBe(false);
    // 등급이 하락해도 모달이 안 뜸
    rerender({
      prevLevel: "ACTIVE",
      currentLevel: "REGULAR",
      reviewSubmitted: true,
    });
    expect(result.current[0]).toBe(false);
  });
});
