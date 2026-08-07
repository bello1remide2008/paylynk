import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const SpendingAnalytics = ({ analytics }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">

      <h2 className="text-2xl font-bold mb-8">
        Spending Analytics
      </h2>

      {/* ================= TOP SUMMARY ================= */}

      <div className="grid md:grid-cols-4 gap-5 mb-8">

        <div className="bg-blue-50 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">
            Total Spent
          </p>

          <h2 className="text-2xl font-bold text-blue-600">
            ₦{analytics.totalSpent?.toLocaleString()}
          </h2>
        </div>

        <div className="bg-green-50 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">
            Daily Average
          </p>

          <h2 className="text-2xl font-bold text-green-600">
            ₦{analytics.averageSpent?.toLocaleString()}
          </h2>
        </div>

        <div className="bg-orange-50 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">
            Highest Month
          </p>

          <h2 className="text-xl font-bold text-orange-600">
            {analytics.highestMonth}
          </h2>
        </div>

        <div className="bg-purple-50 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">
            Financial Score
          </p>

          <h2 className="text-3xl font-bold text-purple-600">
            {analytics.financialScore}/100
          </h2>
        </div>

      </div>

      {/* ================= MONTHLY TREND ================= */}

      <div className="mb-10">

        <h3 className="font-semibold mb-4">
          Monthly Spending Trend
        </h3>

        <div className="h-72">

          <ResponsiveContainer>

            <LineChart data={analytics.monthlyData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ================= ACCOUNT BREAKDOWN ================= */}

      <div className="grid lg:grid-cols-2 gap-8">

        <div>

          <h3 className="font-semibold mb-4">
            Spending by Linked Account
          </h3>

          <div className="h-72">

            <ResponsiveContainer>

              <BarChart data={analytics.accountBreakdown}>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="bank"/>

                <YAxis/>

                <Tooltip/>

                <Bar
                  dataKey="amount"
                  fill="#2563eb"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* ================= CATEGORY PIE ================= */}

        <div>

          <h3 className="font-semibold mb-4">
            Spending Categories
          </h3>

          <div className="h-72">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={analytics.categoryBreakdown}
                  dataKey="value"
                  nameKey="category"
                  outerRadius={95}
                  label
                >

                  {analytics.categoryBreakdown?.map(
                    (entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}

                </Pie>

                <Tooltip/>

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* ================= INSIGHT ================= */}

      <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white">

        <h3 className="font-bold text-xl mb-3">
          Smart Insight
        </h3>

        <p>
          {analytics.insight}
        </p>

      </div>

      {/* ================= EXTRA STATS ================= */}

      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <div className="border rounded-2xl p-5">

          <p className="text-gray-500">
            Most Used Account
          </p>

          <h3 className="text-xl font-bold mt-2">
            {analytics.mostUsedAccount}
          </h3>

        </div>

        <div className="border rounded-2xl p-5">

          <p className="text-gray-500">
            Highest Transaction
          </p>

          <h3 className="text-xl font-bold mt-2">
            ₦{analytics.highestTransaction?.toLocaleString()}
          </h3>

        </div>

        <div className="border rounded-2xl p-5">

          <p className="text-gray-500">
            Monthly Budget Used
          </p>

          <h3 className="text-xl font-bold mt-2">
            {analytics.budgetUsed}%
          </h3>

        </div>

      </div>

    </div>
  );
};

export default SpendingAnalytics;
