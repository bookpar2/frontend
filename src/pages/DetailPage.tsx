import { useParams } from "react-router-dom";
import usePostsStore from "../stores/usePostsStore"
import SalesStatus from "../components/SalesStatus";

function DetailPage() {
  const { book_id } = useParams<{ book_id: string }>();
  const { books } = usePostsStore();
  const book = books.find((b) => b.book_id === Number(book_id));

  if (!book) {
    return <p className="text-center text-gray-500">책 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="flex flex-col justify-between min-h-screen max-w-md mx-auto px-4 space-y-4 bg-white pt-24 pb-8">
      <div>
        <div className="aspect-square bg-blue-100 p-6 rounded-lg text-center">
          <img src={`${book.image_url}`} />
        </div>
        
        <div className="flex items-center space-x-1 border-b py-3">
          <img src="/images/person.svg" alt="User" className="w-8 h-8 ml-2" />
          <span className="text-gray-800 font-medium">{book.seller_name}</span>
        </div>

        <div className="p-4 rounded-lg">
          <SalesStatus saleStatus={book.saleStatus} />
          <h3 className="text-lg font-semibold mt-2">{book.title}</h3>
          <p className="text-gray-500 text-lg mb-6">{book.price.toLocaleString()}원</p>
          <p className="text-sm text-gray-700 mt-2">{book.description}</p>
        </div>
      </div>
      
      {book.saleStatus && (
        <button 
          className="w-full bg-primary text-white py-3 rounded-full mt-3 hover:bg-darker"
          onClick={() => window.open(book.chatLink, "_blank")}
        >
          판매자와 채팅하기
        </button>
      )}
    </div>
  );
}

export default DetailPage;