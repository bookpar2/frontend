import SalesStatus from "./SalesStatus";

function PostCard() {
  return (
    <div className="p-4 w-full overflow-hidden hover:cursor-pointer md:w-56 bg-secondary rounded-md flex flex-col items-center">
      {/* 책 이미지 */}
      <div className="w-full aspect-square bg-white rounded-md mb-3"></div>
      <div className="w-full">
        <div className="font-semibold text-sm mb-1">쉽게 배우는 파이썬</div>
        <div className="text-sm mb-1">2,000원</div>
        <SalesStatus salesStatus={false} />
      </div>
    </div>
  )
}

export default PostCard;