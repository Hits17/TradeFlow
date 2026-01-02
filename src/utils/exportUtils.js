/**
 * Export data to CSV file
 */
export function exportToCSV(data, filename = 'export') {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Get headers from first row
    const headers = Object.keys(data[0]);

    // Build CSV content
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            // Handle arrays (like tags)
            if (Array.isArray(value)) {
                return `"${value.join('; ')}"`;
            }
            // Escape quotes and wrap in quotes if contains comma
            const escaped = String(value ?? '').replace(/"/g, '""');
            return escaped.includes(',') ? `"${escaped}"` : escaped;
        });
        csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

/**
 * Export to PDF using browser print
 */
export function exportToPDF(title, content) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .header { display: flex; justify-content: space-between; align-items: center; }
          .date { color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <span class="date">Generated: ${new Date().toLocaleDateString()}</span>
        </div>
        ${content}
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
}

/**
 * Generate HTML table from data
 */
export function dataToHTMLTable(data, columns) {
    if (!data || data.length === 0) return '<p>No data available</p>';

    const headers = columns || Object.keys(data[0]);

    let html = '<table><thead><tr>';
    headers.forEach(h => {
        html += `<th>${formatHeader(h)}</th>`;
    });
    html += '</tr></thead><tbody>';

    data.forEach(row => {
        html += '<tr>';
        headers.forEach(h => {
            let value = row[h];
            if (Array.isArray(value)) value = value.join(', ');
            if (typeof value === 'number' && h.toLowerCase().includes('value')) {
                value = '$' + value.toLocaleString();
            }
            html += `<td>${value ?? ''}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

function formatHeader(str) {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, s => s.toUpperCase())
        .trim();
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
