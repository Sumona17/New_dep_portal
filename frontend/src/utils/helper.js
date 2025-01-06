import axiosInstance, { customIstance } from "../service/axiosInstance"

export const determineInstance = (type) => {
    switch (type) {
      case 'sftp':
        return axiosInstance
      case 'custom':
        return customIstance
      default:
        return axiosInstance
    }
  }

export const exportCSV = (columns, dataSource, fileName) => {
  const headers = columns.map(col => col.title).filter(Boolean); // Only get titles with value
  const csvRows = [headers.join(",")];

  dataSource.forEach(data => {
    const values = headers.map(header => {
      const key = columns.find(col => col.title === header)?.dataIndex;
      return data[key] ? `"${data[key]}"` : '""';
    });
    csvRows.push(values.join(","));
  });

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadPDf = (filename,data) => {
  const link = document.createElement('a');
  link.href = data;
  link.download = filename;
  link.click();
};

export const setDropdownVals = (results, filesData) => {
    results.data.forEach((result) => {
      for (const key in result) {
        const match = key.match(/^(.*)(Label|Value)$/);
        if (match) {
          const dropDownKey = match[1];
          const type = match[2];
  
          if (!filesData[dropDownKey]) {
            filesData[dropDownKey] = [];
          }
          let obj = filesData[dropDownKey].find(
            (o) => o.label === result[`${dropDownKey}Label`]
          );
  
          if (!obj) {
            const newObj = {
              label: result[`${dropDownKey}Label`] || "",
              value: result[`${dropDownKey}Value`] || "",
            };
            
            if (newObj.label && newObj.value) {
              filesData[dropDownKey].push(newObj);
            }
          } else {
            if (type === "Label") {
              obj.label = result[key];
            } else if (type === "Value") {
              obj.value = result[key];
            }
          }
        }
      }
    });
  };

  export const tableValues = (dataColumns) => {
    var tableColumn = dataColumns.columns
    var tableData = dataColumns.data

    var tableColArr = tableColumn.map((item) => {
      return {
        title: item.name,
        dataIndex: item.key,
        key: item.key,
        sorter: (a,b) => {
          var keyObj = item.key;
          return a[keyObj].localeCompare(b[keyObj])}
      }
    });

    return {tableColArr, tableData}

  }
