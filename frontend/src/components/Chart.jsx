import {
    Label,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    AreaChart,
    Area,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";

  export default function Chart(props) {

    return(
        // <ResponsiveContainer width="100%" height={500}>
        //     <LineChart width={500} height={300} data={props.data}>
        //     <XAxis dataKey="timestamp" />
        //     <YAxis />
        //     <Tooltip />
        //     <Legend />
        //     <Line type="monotone" dataKey="Price" stroke="#8884d8" />
        //     <CartesianGrid />
        //     </LineChart>
        // </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={500}>
          <AreaChart
            data={props.data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            
           <Area type="monotone" dataKey="Price" stroke="limegreen " fill="limegreen" />
          <Legend />
          </AreaChart>
        </ResponsiveContainer>
      )
  }