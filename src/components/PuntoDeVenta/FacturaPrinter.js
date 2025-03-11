const facturaPrinter = (facturaData) => {
    if (!facturaData) return;

    // Crear una nueva ventana para la factura
    const printWindow = window.open("", "_blank");

    // Escribir el contenido de la factura en la nueva ventana
    printWindow.document.write(`
    <html>
      <head>
        <title>Factura</title>
        <style>
          body { 
            margin: 0 !important; 
            padding: 0 !important; 
            width: 58mm !important; /* Ancho del papel térmico */
            font-family: Consolas, sans-serif;
            font-size: 12px; /* Fuente más pequeña */
          }
          h2 { 
            text-align: center; 
            font-size: 14px; /* Título un poco más grande */
            margin: 0; 
            padding: 0; 
          }
          p { 
            margin: 2px 0; /* Reducir el margen entre líneas */
            padding: 0; 
            white-space: nowrap; /* Evitar saltos de línea innecesarios */
          }
          .item { 
            display: flex; 
            justify-content: space-between; 
            margin: 2px 0; 
          }
          .item-name { 
            flex: 2; 
          }
          .item-details { 
            flex: 1; 
            text-align: right; 
          }
          hr {
            border: 0;
            border-top: 1px dashed #000; /* Línea divisoria */
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="factura-container">
          <h2>FACTURA</h2>
          <p><strong>Cliente:</strong> ${
              facturaData.cliente.firstName || "N/A"
          }</p>
          <p><strong>Teléfono:</strong> ${
              facturaData.cliente.phone || "N/A"
          }</p>
          <p><strong>Email:</strong> ${facturaData.cliente.email || "N/A"}</p>
          <p><strong>Total:</strong> $${facturaData.total.toFixed(2)}</p>
          <hr>
          ${facturaData.invoiceDetails
              .map(
                  (item) => `
            <div class="item">
              <div class="item-name">${item.itemName}</div>
              <div class="item-details">
                ${item.quantity} x $${parseFloat(item.unitPrice || 0).toFixed(
                      2
                  )} = $${parseFloat(item.totalPrice || 0).toFixed(2)}
              </div>
            </div>
          `
              )
              .join("")}
          <hr>
          <p><strong>Gracias por su compra!</strong></p>
        </div>
        <script>
          // Imprimir automáticamente y cerrar la ventana después de imprimir
          window.onload = function() {
            window.print();
          };

          // Cerrar la ventana después de imprimir
          window.onafterprint = function() {
            window.close();
          };
        </script>
      </body>
    </html>
  `);

    // Cerrar el documento para que se renderice
    printWindow.document.close();
};

export default facturaPrinter;
