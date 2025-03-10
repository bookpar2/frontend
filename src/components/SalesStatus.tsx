import { SalesStatusProps } from "../dataType";

function SalesStatus(props: SalesStatusProps) {
  return (
    <div className={`text-xs py-1 font-semibold rounded-sm inline-block select-none ${props.saleStatus !== "COMPLETED" ? 'bg-[#617EF1] text-white px-3' : 'bg-white text-[#617EF1] border border-[#617EF1] px-2'}`}>
      {props.saleStatus === "FOR_SALE" ? '판매중' : props.saleStatus === "IN_PROGRESS" ? "거래중" : "판매완료"}
    </div>
  )
}

export default SalesStatus;