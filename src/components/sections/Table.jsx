import React from 'react'

export const Table = () => {
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    }
  ]

  return (
    <div className="col-span-3">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.invoice}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.invoice}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.paymentStatus}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.paymentMethod}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{invoice.totalAmount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">$2,500.00</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
