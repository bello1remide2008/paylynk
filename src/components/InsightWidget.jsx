import { TrendingUp, TrendingDown, Wallet, Landmark } from "lucide-react";

const InsightWidget = ({ insight }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-5 mt-6">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold">
          Financial Insights
        </h2>

        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
          Today
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-green-50 rounded-xl p-4">
          <TrendingUp className="text-green-600 mb-2" />

          <p className="text-gray-500 text-sm">
            Money In
          </p>

          <h3 className="text-2xl font-bold">
            ₦{Number(insight.totalIncome || 0).toLocaleString("en-NG")}
          </h3>
        </div>

        <div className="bg-red-50 rounded-xl p-4">
          <TrendingDown className="text-red-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Money Out
          </p>

          <h3 className="text-2xl font-bold">
            ₦{Number(insight.totalExpense || 0).toLocaleString("en-NG")}
          </h3>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <Wallet className="text-blue-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Transactions
          </p>

          <h3 className="text-2xl font-bold">
            {insight.totalTransactions || 0}
          </h3>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4">
          <Landmark className="text-yellow-500 mb-2" />

          <p className="text-gray-500 text-sm">
            Linked Banks
          </p>

          <h3 className="text-2xl font-bold">
            {insight.totalAccounts || 0}
          </h3>
        </div>

      </div>

    </div>
  );
};

export default InsightWidget;
