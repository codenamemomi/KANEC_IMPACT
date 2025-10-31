import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './DonationChart.css';

// Move getMonthName outside the component so it's defined before use
const getMonthName = (monthString) => {
  const [year, month] = monthString.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-US', { month: 'short' });
};

const DonationChart = ({ monthlyTrends = [] }) => {
  // Transform the monthly trends data for the chart
  const chartData = monthlyTrends.map(trend => ({
    month: getMonthName(trend.month), // Convert "2025-10" to "Oct"
    amount: trend.total_donated || 0,
    donations: trend.donation_count || 0
  }));

  // If no real data, show empty state
  if (monthlyTrends.length === 0) {
    return (
      <div className="donation-chart">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Donation Activity</h3>
            <p className="chart-subtitle">Your impact over time</p>
          </div>
        </div>
        <div className="no-chart-data">
          <p>No donation data available yet</p>
          <small>Start donating to see your impact trends</small>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-chart">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Donation Activity</h3>
          <p className="chart-subtitle">Your impact over time</p>
        </div>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `₦${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => [`₦${parseInt(value).toLocaleString()}`, 'Amount']}
              cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
            />
            <Bar 
              dataKey="amount" 
              fill="#22c55e" 
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DonationChart;