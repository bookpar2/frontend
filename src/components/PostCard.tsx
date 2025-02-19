import SalesStatus from "./SalesStatus";
import { useNavigate } from "react-router-dom";
import { PostCardProps } from "../dataType";

function PostCard(props: PostCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      className="p-4 w-full overflow-hidden hover:cursor-pointer md:w-56 bg-secondary rounded-md flex flex-col items-center"
      onClick={() => navigate(`/detail/${props.book_id}`)}
    >
      {/* 책 이미지 */}
      <div className="w-full aspect-square bg-white rounded-md mb-3"></div>
      <div className="w-full">
        <div className="font-semibold text-sm mb-1">{props.title}</div>
        <div className="text-sm mb-1">{props.price.toLocaleString()}원</div>
        <SalesStatus saleStatus={props.saleStatus} />
      </div>
    </div>
  )
}

export default PostCard;