import SalesStatus from "./SalesStatus";
import { PostCardProps } from "../dataType";

function PostCard(props: PostCardProps) {
  return (
    <div className="p-4 w-full overflow-hidden hover:cursor-pointer md:w-56 bg-secondary rounded-md flex flex-col items-center">
      {/* 책 이미지 */}
      <div className="w-full aspect-square bg-white rounded-md mb-3"></div>
      <div className="w-full">
        <div className="font-semibold text-sm mb-1">{props.title}</div>
        <div className="text-sm mb-1">{props.price}</div>
        <SalesStatus salesStatus={props.salesStatus} />
      </div>
    </div>
  )
}

export default PostCard;