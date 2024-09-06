export default function useGetTitle(original_title: string, title: string) {
  if (original_title === title) {
    return title;
  } else {
    return `${title}(${original_title})`;
  }
}
