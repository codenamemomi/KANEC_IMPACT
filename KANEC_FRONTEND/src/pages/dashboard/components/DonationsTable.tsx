import { ExternalLink } from 'lucide-react';
import './DonationsTable.css';

const DonationsTable = () => {
  const donations = [
    {
      project: 'Clean Water Nigeria',
      amount: 'ℏ15,000',
      status: 'Success',
      date: 'Oct 20, 2024',
      transaction: '0x7a8f...d29c'
    },
    {
      project: 'Solar Power for Schools',
      amount: 'ℏ25,000',
      status: 'Success',
      date: 'Oct 18, 2024',
      transaction: '0x3b9e...f83a'
    },
    {
      project: 'Healthcare for Rural Women',
      amount: 'ℏ10,000',
      status: 'Success',
      date: 'Oct 15, 2024',
      transaction: '0x5c2d...a74b'
    },
    {
      project: 'Education Fund Initiative',
      amount: 'ℏ20,000',
      status: 'Success',
      date: 'Oct 12, 2024',
      transaction: '0x9f4e...c63d'
    }
  ];

  return (
    <div className="donations-table-container">
      <h3 className="table-title">Recent Donations</h3>
      
      <div className="table-wrapper">
        <table className="donations-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Transaction</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, index) => (
              <tr key={index}>
                <td className="project-cell">{donation.project}</td>
                <td className="amount-cell">{donation.amount}</td>
                <td>
                  <span className="status-badge">{donation.status}</span>
                </td>
                <td className="date-cell">{donation.date}</td>
                <td className="transaction-cell">
                  <a href="#" className="transaction-link">
                    {donation.transaction}
                    <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationsTable;
