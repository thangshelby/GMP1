import * as d3 from "d3";
import { fetchStock } from "../../api";
const addSMA50Line = async (x: any,ric:string,dateStart:string ,y: any,dataUsed:number,xOrigin:number) => {
  removeSMA50Line();

  const window= 50
  const response = await fetchStock(`/indicators/SMA?ticker=${ric}&window=${window}`);
  let data=[]

  for (let i = 0; i < response.length; i++) {
    if (response[i].Date === dateStart) {
      data= response.slice(i, response.length);
      break
    }
  }
  if(data.length===0){data=response.slice(0, dataUsed-window)}
  

  const chartArea = d3.select(".chart-area");

  const line = d3
    .line<any>()
    .x((d: any) => (x(d.Date) ?? 0) + x.bandwidth() / 2)
    .y((d: any) => y(d.SMA));


  chartArea
    .append("path")
    .data([data.slice(0, dataUsed)])
    .attr("class", "sma-line")
    .attr("d", line)
    .attr("stroke", "purple")
    .attr("stroke-width", 1.5)
    .attr("fill", "none")
    .attr('transform', `translate(${xOrigin},0)`);  
};

export default addSMA50Line;

export const removeSMA50Line = () => {
  const chartArea = d3.select(".chart-area");
  chartArea.select(".sma-line").remove();
};

export const hiddenSMA50Line = (chartArea: any) => {
  chartArea.select(".sma-line").attr("display", "none");
};
