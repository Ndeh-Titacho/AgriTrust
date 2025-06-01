import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { useWeb3Auth } from '../../context/Web3AuthContext';
import { toast } from 'sonner';
import FarmSupplyChain from '../../abi/FarmSupplyChain.json';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const getTransactionType = (type) => {
  switch (Number(type)) {
    case 0:
      return 'Crop Sale';
    case 1:
      return 'Crowdfunding';
    default:
      return 'Unknown';
  }
};

const weiToFcfa = (weiAmount, ethToFcfaRate) => {
  const ethAmount = ethers.utils.formatEther(weiAmount);
  const fcfaAmount = (parseFloat(ethAmount) * ethToFcfaRate).toFixed(0);
  return new Intl.NumberFormat('fr-FR').format(fcfaAmount) + ' FCFA';
};

export const FinancialDashboard = () => {
  const { account } = useWeb3Auth();
  const [searchAddress, setSearchAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ethToFcfaRate, setEthToFcfaRate] = useState(3500000);
  const tableRef = useRef(null);

  const parseTransaction = (transaction) => {
    try {
      return {
        tid: transaction.tid ? transaction.tid.toString() : '0',
        pid: transaction.pid ? transaction.pid.toString() : '0',
        from: transaction.from || '',
        to: transaction.to || '',
        amount: weiToFcfa(transaction.amount || 0, ethToFcfaRate),
        timestamp: transaction.timestamp ? 
          new Date(transaction.timestamp.toNumber() * 1000).toLocaleString() : 
          new Date().toLocaleString(),
        transaction_type: getTransactionType(Number(transaction.transaction_type))
      };
    } catch (error) {
      console.error('Error parsing transaction:', error);
      return null;
    }
  };

  const fetchTransactions = async (address) => {
    if (!address) {
      toast.error('Please enter a wallet address');
      return;
    }

    try {
      setLoading(true);
      
      // Get provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FarmSupplyChain.abi, signer);

      // Get ETH to FCFA rate
      const rate = await contract.ethToFcfaRate();
      setEthToFcfaRate(rate.toNumber());

      // Get transactions
      const data = await contract.getFarmerTransactions(address);
      
      // Parse and format transactions
      const formattedData = data
        .map(parseTransaction)
        .filter(transaction => transaction !== null);

      // Sort by timestamp
      formattedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setTransactions(formattedData);
      toast.success('Transactions loaded successfully');
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!tableRef.current) {
      toast.error('Table not found');
      return;
    }

    try {
      setLoading(true);
      
      // Get table headers
      const headers = Array.from(tableRef.current.querySelectorAll('th'))
        .map(th => th.textContent.trim());
      
      // Get table rows
      const rows = Array.from(tableRef.current.querySelectorAll('tr'))
        .slice(1) // Skip header row
        .map(row => Array.from(row.querySelectorAll('td'))
          .map(td => td.textContent.trim()));
      
      // Create PDF with landscape orientation
      const pdf = new jsPDF('l', 'mm', 'a4'); // Changed to landscape
      
      // Add title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('Farmer Transaction History', 150, 20, { align: 'center' });
      
      // Add date
      const currentDate = new Date().toLocaleDateString();
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${currentDate}`, 150, 30, { align: 'center' });
      
      // Table settings - Adjusted for better layout
      const startY = 40;
      const cellPadding = 8;
      const colWidths = [10, 70, 70, 40, 30, 40, 60]; // Increased From/To fields and Date field
      const rowHeight = 12;
      const startX = 15; // Moved slightly left
      
      // Draw header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      
      // Draw header cells
      headers.forEach((header, colIndex) => {
        const x = startX + (colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0));
        pdf.text(header, x + (colWidths[colIndex] / 2), startY + (rowHeight / 2), { align: 'center' });
      });
      
      // Draw header line
      pdf.setLineWidth(0.5);
      pdf.line(startX, startY + rowHeight, startX + colWidths.reduce((a, b) => a + b, 0), startY + rowHeight);
      
      // Draw rows
      pdf.setFont('helvetica', 'normal');
      
      rows.forEach((row, rowIndex) => {
        const y = startY + rowHeight + (rowIndex * rowHeight);
        
        row.forEach((cell, colIndex) => {
          const x = startX + (colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0));
          
          // Special handling for amount field (index 4)
          if (colIndex === 4) {
            pdf.setFontSize(10);
            pdf.text(cell, x + cellPadding, y + (rowHeight / 2));
          } else {
            pdf.setFontSize(9);
            pdf.text(cell, x + cellPadding, y + (rowHeight / 2));
          }
        });
        
        // Draw row line
        pdf.line(startX, y + rowHeight, startX + colWidths.reduce((a, b) => a + b, 0), y + rowHeight);
      });
      
      // Add metadata
      pdf.setProperties({
        title: 'Farmer Transaction History',
        subject: 'Transaction records',
        author: 'AgriTrust',
        keywords: 'transactions, blockchain, AgriTrust'
      });
      
      // Save the PDF
      pdf.save('farmer-transactions.pdf');
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get ETH to FCFA rate on mount
    const getEthToFcfaRate = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, FarmSupplyChain.abi, provider);
          const rate = await contract.ethToFcfaRate();
          setEthToFcfaRate(rate.toNumber());
        }
      } catch (error) {
        console.error('Error fetching ETH to FCFA rate:', error);
      }
    };
    getEthToFcfaRate();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Farmer Transaction History</h1>
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter farmer's wallet address"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => fetchTransactions(searchAddress)}
              disabled={loading}
              className={`px-6 py-2 rounded-lg ${
                loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Loading...' : 'Search Transactions'}
            </button>
            <button
              onClick={downloadPDF}
              disabled={loading || transactions.length === 0}
              className={`px-6 py-2 rounded-lg ${
                loading || transactions.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? 'Loading...' : 'Download PDF'}
            </button>
          </div>
          {/* <p className="text-gray-600">
            Current connected wallet: {account ? account.slice(0, 6) + '...' + account.slice(-4) : 'Not connected'}
          </p> */}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div ref={tableRef}>
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TxID</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PID</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (FCFA)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx, index) => (
                <tr key={tx.tid} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.tid}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">{tx.pid}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap">{tx.from.slice(0, 10)}...{tx.from.slice(-10)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.to.slice(0, 10)}...{tx.to.slice(-10)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.transaction_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
