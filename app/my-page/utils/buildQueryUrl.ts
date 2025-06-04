/**
 * 주어진 객체(params)를 바탕으로 URL 문자열을 만들어 리턴합니다.
 * - pathname: "/search"
 * - params: { uid: "abc", search: "hello world", page: 2 }
 * => "/search?uid=abc&search=hello%20world&page=2"
 */

export function buildQueryUrl({
  pathname,
  params,
}: {
  pathname: string;
  params: Record<string, string | number>;
}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });
  return `${pathname}?${searchParams.toString()}`;
}
