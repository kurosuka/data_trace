export function exportExcel(file, fileName) {
  if ('download' in document.createElement('a')) {
    var a = document.createElement('a'); //创建隐藏a标签
    a.download = fileName;
    a.style.display = "none";
    a.href = URL.createObjectURL(file)
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href)
    document.body.removeChild(a);
  }
}