export default function useConvertRuntime(runtime: number) {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}시간 ${minutes}분`;
}
