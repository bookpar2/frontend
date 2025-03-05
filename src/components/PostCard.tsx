import SalesStatus from "./SalesStatus";
import { useNavigate } from "react-router-dom";
import { PostCardProps } from "../dataType";

function PostCard(props: PostCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      className="p-4 w-full overflow-hidden hover:cursor-pointer max-w-56 bg-[#EDF3FF] rounded-md flex flex-col items-center"
      onClick={() => navigate(`/detail/${props.book_id}`)}
    >
      {/* 책 이미지 */}
      <div className="w-full aspect-square bg-white rounded-md mb-3 flex justify-center items-center overflow-hidden">
        <img 
          src={props.image_url}
          alt={props.title} 
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="w-full">
        <div className="font-semibold text-sm mb-1">{props.title}</div>
        <div className="text-sm mb-1">{props.price.toLocaleString()}원</div>
        <SalesStatus saleStatus={props.saleStatus} />
      </div>
    </div>
  );
}

export default PostCard;