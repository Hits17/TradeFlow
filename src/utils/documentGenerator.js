/**
 * Generate Invoice document for an order
 */
export function generateInvoice(order) {
    const invoiceNumber = `INV-${order.id?.replace('ORD-', '') || Date.now()}`;
    const date = new Date().toLocaleDateString();

    const content = `
    <div style="margin-bottom: 30px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <h2 style="margin: 0; color: #10b981;">TradeFlow</h2>
          <p style="color: #666; margin: 5px 0;">Import/Export Management</p>
        </div>
        <div style="text-align: right;">
          <h3 style="margin: 0;">INVOICE</h3>
          <p style="margin: 5px 0;">Invoice #: ${invoiceNumber}</p>
          <p style="margin: 5px 0;">Date: ${date}</p>
        </div>
      </div>
    </div>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
      <div>
        <strong>From:</strong><br/>
        ${order.partner || 'N/A'}<br/>
        ${order.origin || ''}
      </div>
      <div style="text-align: right;">
        <strong>To:</strong><br/>
        ${order.consignee || 'N/A'}<br/>
        ${order.destination || ''}
      </div>
    </div>
    
    <table style="width: 100%; margin-bottom: 30px;">
      <tr style="background: #f5f5f5;">
        <th style="padding: 10px; text-align: left;">Description</th>
        <th style="padding: 10px; text-align: left;">HS Code</th>
        <th style="padding: 10px; text-align: right;">Weight</th>
        <th style="padding: 10px; text-align: right;">Value</th>
      </tr>
      <tr>
        <td style="padding: 10px;">${order.cargo || order.reference || 'Trade Goods'}</td>
        <td style="padding: 10px;">${order.hsCode || 'N/A'}</td>
        <td style="padding: 10px; text-align: right;">${order.grossWeight ? order.grossWeight + ' kg' : 'N/A'}</td>
        <td style="padding: 10px; text-align: right;">${order.currency || 'USD'} ${Number(order.value || 0).toLocaleString()}</td>
      </tr>
    </table>
    
    <div style="border-top: 1px solid #ddd; padding-top: 20px;">
      <table style="width: 300px; margin-left: auto;">
        <tr><td>Goods Value:</td><td style="text-align: right;">${order.currency || 'USD'} ${Number(order.value || 0).toLocaleString()}</td></tr>
        <tr><td>Freight:</td><td style="text-align: right;">${order.currency || 'USD'} ${Number(order.freightCost || 0).toLocaleString()}</td></tr>
        <tr><td>Customs Duty:</td><td style="text-align: right;">${order.currency || 'USD'} ${Number(order.customsDuty || 0).toLocaleString()}</td></tr>
        <tr><td>Insurance:</td><td style="text-align: right;">${order.currency || 'USD'} ${Number(order.insurance || 0).toLocaleString()}</td></tr>
        <tr><td>Other Costs:</td><td style="text-align: right;">${order.currency || 'USD'} ${Number(order.otherCosts || 0).toLocaleString()}</td></tr>
        <tr style="font-weight: bold; border-top: 2px solid #333;">
          <td style="padding-top: 10px;">TOTAL LANDED COST:</td>
          <td style="padding-top: 10px; text-align: right; color: #10b981;">${order.currency || 'USD'} ${Number(order.landedCost || order.value || 0).toLocaleString()}</td>
        </tr>
      </table>
    </div>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
      <p><strong>Terms:</strong> ${order.incoterm || 'FOB'}</p>
      <p><strong>Order Reference:</strong> ${order.reference || order.id}</p>
      <p><strong>Status:</strong> ${order.status?.replace('_', ' ') || 'Draft'}</p>
    </div>
  `;

    openPrintWindow(`Invoice - ${invoiceNumber}`, content);
}

/**
 * Generate Packing List document for an order
 */
export function generatePackingList(order) {
    const plNumber = `PL-${order.id?.replace('ORD-', '') || Date.now()}`;
    const date = new Date().toLocaleDateString();

    const content = `
    <div style="margin-bottom: 30px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <h2 style="margin: 0; color: #3b82f6;">TradeFlow</h2>
          <p style="color: #666; margin: 5px 0;">Import/Export Management</p>
        </div>
        <div style="text-align: right;">
          <h3 style="margin: 0;">PACKING LIST</h3>
          <p style="margin: 5px 0;">PL #: ${plNumber}</p>
          <p style="margin: 5px 0;">Date: ${date}</p>
        </div>
      </div>
    </div>
    
    <table style="width: 100%; margin-bottom: 20px;">
      <tr>
        <td style="width: 50%; vertical-align: top;">
          <strong>Shipper:</strong><br/>
          ${order.partner || 'N/A'}<br/>
          ${order.origin || ''}
        </td>
        <td style="width: 50%; vertical-align: top;">
          <strong>Consignee:</strong><br/>
          ${order.consignee || 'N/A'}<br/>
          ${order.destination || ''}
        </td>
      </tr>
    </table>
    
    <table style="width: 100%; margin-bottom: 30px;">
      <tr style="background: #f5f5f5;">
        <th style="padding: 10px; text-align: left;">Item</th>
        <th style="padding: 10px; text-align: left;">Description</th>
        <th style="padding: 10px; text-align: center;">Qty</th>
        <th style="padding: 10px; text-align: right;">Gross Weight</th>
      </tr>
      <tr>
        <td style="padding: 10px;">1</td>
        <td style="padding: 10px;">${order.cargo || order.reference || 'Trade Goods'}</td>
        <td style="padding: 10px; text-align: center;">1</td>
        <td style="padding: 10px; text-align: right;">${order.grossWeight ? order.grossWeight + ' kg' : 'N/A'}</td>
      </tr>
    </table>
    
    <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 20px;">
      <table style="width: 100%;">
        <tr>
          <td><strong>Total Packages:</strong></td>
          <td>1</td>
          <td><strong>Total Gross Weight:</strong></td>
          <td>${order.grossWeight ? order.grossWeight + ' kg' : 'N/A'}</td>
        </tr>
      </table>
    </div>
    
    <div style="margin-top: 40px; color: #666; font-size: 12px;">
      <p><strong>Order Reference:</strong> ${order.reference || order.id}</p>
      <p><strong>HS Code:</strong> ${order.hsCode || 'N/A'}</p>
      <p><strong>Incoterm:</strong> ${order.incoterm || 'FOB'}</p>
    </div>
  `;

    openPrintWindow(`Packing List - ${plNumber}`, content);
}

/**
 * Generate Bill of Lading template
 */
export function generateBillOfLading(order) {
    const blNumber = `BL-${order.id?.replace('ORD-', '') || Date.now()}`;
    const date = new Date().toLocaleDateString();

    const content = `
    <div style="border: 3px double #333; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0;">BILL OF LADING</h2>
        <p style="color: #666;">For Combined Transport or Port to Port Shipment</p>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="width: 48%; border: 1px solid #ddd; padding: 10px;">
          <strong>Shipper:</strong><br/>
          ${order.partner || '____________________'}<br/>
          ${order.origin || '____________________'}
        </div>
        <div style="width: 48%; border: 1px solid #ddd; padding: 10px;">
          <strong>B/L Number:</strong> ${blNumber}<br/>
          <strong>Date:</strong> ${date}
        </div>
      </div>
      
      <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 20px;">
        <strong>Consignee:</strong><br/>
        ${order.consignee || '____________________'}<br/>
        ${order.destination || '____________________'}
      </div>
      
      <table style="width: 100%; border: 1px solid #ddd; margin-bottom: 20px;">
        <tr style="background: #f5f5f5;">
          <th style="padding: 10px; border: 1px solid #ddd;">Marks & Numbers</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Description of Goods</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Gross Weight</th>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${order.reference || 'N/A'}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${order.cargo || 'Trade Goods'}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${order.grossWeight ? order.grossWeight + ' kg' : 'TBD'}</td>
        </tr>
      </table>
      
      <div style="display: flex; gap: 20px; margin-bottom: 20px;">
        <div style="flex: 1; border: 1px solid #ddd; padding: 10px;">
          <strong>Port of Loading:</strong><br/>
          ${order.origin || '____________________'}
        </div>
        <div style="flex: 1; border: 1px solid #ddd; padding: 10px;">
          <strong>Port of Discharge:</strong><br/>
          ${order.destination || '____________________'}
        </div>
      </div>
      
      <div style="margin-top: 40px; font-size: 10px; color: #666;">
        <p>SHIPPED on board in apparent good order and condition the goods or packages specified above.</p>
        <p style="margin-top: 30px;"><strong>Signature:</strong> _________________________ <strong>Date:</strong> _____________</p>
      </div>
    </div>
  `;

    openPrintWindow(`Bill of Lading - ${blNumber}`, content);
}

function openPrintWindow(title, content) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; margin: 0; }
          table { border-collapse: collapse; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
}
