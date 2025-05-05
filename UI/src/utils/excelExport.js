import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Anime List');
  
  // Ajustar el ancho de las columnas
  const maxWidth = data.reduce((w, r) => Math.max(w, r.Título.length), 10);
  worksheet['!cols'] = [
    { wch: 8 },  // Posición
    { wch: maxWidth },  // Título
    { wch: 10 },  // Tipo
    { wch: 10 },  // Episodios
    { wch: 10 },  // Puntuación
    { wch: 15 },  // Estado
    { wch: 8 },   // Año
    { wch: 20 },  // Estudio
    { wch: 30 },  // Géneros
  ];

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}; 