import { SalesStatusProps } from "../dataType";

function SalesStatus(props: SalesStatusProps) {
  return (
    <div className={`text-xs py-1 font-semibold rounded-sm inline-block select-none ${props.saleStatus ? 'bg-primary text-white px-3' : 'bg-white text-primary border border-primary px-2'}`}>
      {props.saleStatus ? '판매중' : '판매완료'}
    </div>
  )
}

export default SalesStatus;