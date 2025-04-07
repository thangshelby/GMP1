import React from "react";
import { Sparklines, SparklinesBars } from "react-sparklines";
const MiniBarChart = ({data}:{data:number[]}) => {
  return (
    <Sparklines data={data} width={100} height={40} >
      <SparklinesBars style={{fill:'#2f91ef'}} />
    </Sparklines>
  );
};

export default MiniBarChart;
