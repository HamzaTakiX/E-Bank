declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head: any[];
      body: any[][];
      foot?: any[];
      headStyles?: any;
      startY?: number;
      theme?: string;
      styles?: any;
      didDrawPage?: (data: { pageNumber: number; settings: any }) => void;
      columnStyles?: any;
    }) => jsPDF;
  }
}
