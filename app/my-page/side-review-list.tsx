export default function SideReviewList() {
  return (
    <div id="side-review-list" className="w-full px-8">
      <div className="flex items-center">
        <div className="mr-4 text-2xl font-bold">REVIEW LIST</div>
        <div>총 1개</div>
      </div>
      <ul className="space-y-4">
        <li className="flex border-b-2 border-black p-4">
          <div className="mr-4">1.</div>
          <div>제목</div>
          <div>별점</div>
        </li>
      </ul>
    </div>
  );
}
