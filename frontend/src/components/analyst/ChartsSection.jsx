import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function ChartsSection({ data }) {
  const statusData = Object.values(
    data.reduce((acc, curr) => {
      acc[curr.status] = acc[curr.status] || { name: curr.status, value: 0 };
      acc[curr.status].value++;
      return acc;
    }, {})
  );

  const jurisdictionData = Object.values(
    data.reduce((acc, curr) => {
      acc[curr.jurisdiction] = acc[curr.jurisdiction] || {
        name: curr.jurisdiction,
        value: 0,
      };
      acc[curr.jurisdiction].value++;
      return acc;
    }, {})
  );

  const monthlyData = Object.values(
    data.reduce((acc, curr) => {
      const month = curr.filingDate.slice(0, 7);
      acc[month] = acc[month] || { month, filings: 0 };
      acc[month].filings++;
      return acc;
    }, {})
  );

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-lg">
        <h3 className="mb-4 text-indigo-400">Status Distribution</h3>
        <BarChart width={250} height={200} data={statusData}>
          <XAxis dataKey="name" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Bar dataKey="value" fill="#6366f1" />
        </BarChart>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-lg">
        <h3 className="mb-4 text-indigo-400">Jurisdiction</h3>
        <PieChart width={250} height={200}>
          <Pie data={jurisdictionData} dataKey="value" outerRadius={80}>
            {jurisdictionData.map((_, index) => (
              <Cell
                key={index}
                fill={["#6366f1", "#a855f7", "#22d3ee", "#facc15"][index % 4]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-lg">
        <h3 className="mb-4 text-indigo-400">Monthly Trend</h3>
        <LineChart width={250} height={200} data={monthlyData}>
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="month" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Line type="monotone" dataKey="filings" stroke="#a855f7" />
        </LineChart>
      </div>
    </div>
  );
}
