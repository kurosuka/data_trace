import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import xlsxStyle from 'xlsx-style'
import XSU from './xlsxStyle.utils'

function s2ab(s) {
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i != s.length; ++i)
    view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

/*
  @id tableId
  @name 导出文件名
*/
export const exportExcel = (function (id, name) {
  return new Promise((resolve) => {
    /* 从表生成工作簿对象 */
    //  判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去，
    let fix = document.querySelector('.el-table__fixed');
    let wb
    if (fix) { //判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去
      let xlsxParam = {
        raw: true
      };
      wb = XLSX.utils.table_to_book(document.querySelector('#out-table').removeChild(fix), xlsxParam);
      document.querySelector('#out-table').appendChild(fix);
    } else {
      let xlsxParam = {
        raw: true
      };
      wb = XLSX.utils.table_to_book(document.querySelector('#out-table'), xlsxParam);
    }
    let sheetName = wb.SheetNames[0];
    for (let key in wb.Sheets.Sheet1) {
      if (Object.prototype.toString.call(wb.Sheets.Sheet1[key]) === '[object Object]') {
        wb.Sheets.Sheet1[key].v = wb.Sheets.Sheet1[key].v.toString().replace(/\s+/g, "");
        //我的表格里针对fixed属性的一列，不需要导出，没有想到别的好的办法，就直接置空了。我用这个方法导出时，在表达的最下面一行会有'暂无筛选结果'，没有找到原因，所以也直接置空。
        if (wb.Sheets.Sheet1[key].v == '暂无筛选结果' || wb.Sheets.Sheet1[key].v == '修改' || wb.Sheets.Sheet1[key].v == '管理' || wb.Sheets.Sheet1[key].v == '操作') {
          wb.Sheets.Sheet1[key].v = ''
        } else {
          //置空的表格的单元格不需要增加边框，故else的时候给单元格增加边框
          XSU.setBorderDefault(wb, sheetName, key)
          // XSU.setBorderDefaultAll(wb, sheetName, key)
        }
      }
    }
    let wbout = xlsxStyle.write(wb, {
      bookType: "xlsx",
      bookSST: false,
      type: 'binary'
    });
    try {
      FileSaver.saveAs(
        //Blob 对象表示一个不可变、原始数据的类文件对象。
        //Blob 表示的不一定是JavaScript原生格式的数据。
        //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
        //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
        new Blob([s2ab(wbout)], {
          type: ""
        }),
        //设置导出文件名称
        name + ".xlsx"
      );
    } catch (e) {
      if (typeof console !== "undefined") console.log(e, wbout);
    }
    resolve(wbout)
  })
})