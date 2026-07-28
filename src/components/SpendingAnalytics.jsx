import {
ResponsiveContainer,
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip
} from "recharts";

const SpendingAnalytics=({analytics})=>{

return(

<div className="bg-white rounded-2xl shadow p-6 mt-6">

<h2 className="text-xl font-bold mb-6">

Spending Analytics

</h2>

<div className="h-72">

<ResponsiveContainer>

<LineChart data={analytics.monthlyData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Line

type="monotone"

dataKey="amount"

stroke="#2563eb"

strokeWidth={3}

/>

</LineChart>

</ResponsiveContainer>

</div>

<div className="grid grid-cols-3 gap-4 mt-8">

<div>

<p className="text-gray-500 text-sm">

Total Spent

</p>

<h3 className="text-xl font-bold">

₦{analytics.totalSpent?.toLocaleString()}

</h3>

</div>

<div>

<p className="text-gray-500 text-sm">

Average

</p>

<h3 className="text-xl font-bold">

₦{Math.round(
analytics.averageSpent ||0
).toLocaleString()}

</h3>

</div>

<div>

<p className="text-gray-500 text-sm">

Highest Month

</p>

<h3 className="text-xl font-bold">

{analytics.highestMonth}

</h3>

</div>

</div>

</div>

);

};

export default SpendingAnalytics;
