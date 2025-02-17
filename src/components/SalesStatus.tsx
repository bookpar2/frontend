import React from "react";
import { SalesStatusProps } from "../dataType";

const SalesStatus: React.FC<SalesStatusProps> = ({ salesStatus }) => {
  return (
    <div className={`text-xs py-1 px-2 font-semibold rounded-sm inline-block select-none ${salesStatus ? 'bg-primary text-white' : 'bg-white text-primary border border-primary'}`}>
      {salesStatus ? '판매중' : '판매완료'}
    </div>
  )
}

export default SalesStatus;