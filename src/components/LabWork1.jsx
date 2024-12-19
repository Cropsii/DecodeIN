import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button, TextField, Box } from "@mui/material";
import ShannonFanoCoding from "./ShannonFanoCoding";
import HuffmanCoding from "./HuffmanCoding";

const Labwork1 = () => {
  // Хранение переменных
  const [text, setText] = useState("");
  const [table, setTable] = useState(null);
  const [totalSymbols, setTotalSymbols] = useState(0);
  const [entropyValue, setEntropyValue] = useState(0);

  const symbols = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789.,:;- (";
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setText(event.target.result);
      reader.readAsText(file, "utf-8");
    }
  };

  const calculateTable = () => {
    if (!text) {
      alert("Пожалуйста, загрузите файл с текстом.");
      return;
    }

    const lowerCaseText = text.toLowerCase();
    const symbolArray = symbols.split("");
    const symbolCounts = symbolArray.reduce((acc, symbol) => {
      const count = lowerCaseText.split(symbol).length - 1;
      acc.push({ symbol, count });
      return acc;
    }, []);

    const total = symbolCounts.reduce((sum, item) => sum + item.count, 0);
    setTotalSymbols(total);

    const tableData = symbolCounts.map((item) => {
      const probability = item.count / total;
      return {
        ...item,
        code: item.symbol.charCodeAt(0),
        probability,
        ii: item.count > 0 ? -Math.log2(probability) : 0,
      };
    });

    const entropy = tableData.reduce((sum, item) => {
      return (
        sum +
        (item.probability > 0
          ? item.probability * -Math.log2(item.probability)
          : 0)
      );
    }, 0);

    setEntropyValue(entropy);
    setTable(tableData);
  };

  const handleSaveTable = () => {
    if (!table) {
      alert("Таблица не сгенерирована.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SymbolsTable");
    XLSX.writeFile(wb, "lab_work_1_table.xlsx");
  };

  const compaitTable = [
    {
      type: "Стандартный код ASCII",
      uncertainty: 8,
      codeLength: 8,
      absoluteRedundancy: 8 - entropyValue,
      relativeRedundancy: (8 - entropyValue) / 8,
    },
    {
      type: "Код по Хартли",
      uncertainty: Math.log2(symbols.length),
      codeLength: Math.ceil(Math.log2(symbols.length)),
      absoluteRedundancy: Math.ceil(Math.log2(symbols.length)) - entropyValue,
      relativeRedundancy:
        (Math.ceil(Math.log2(symbols.length)) - entropyValue) /
        Math.ceil(Math.log2(symbols.length)),
    },
  ];

  return (
    <main>
      <h1>Лабораторная работа №7</h1>
      <div className="WrapButton">
        <div className="file-input-wrapper">
          <Box>
            <TextField
              variant="outlined"
              type="file"
              onChange={handleFileChange}
              sx={{
                width: "fit-content",
                backgroundColor: "#ffff",
                borderRadius: "10px",
              }}
            />
          </Box>
        </div>
        <Button variant="contained" color="primary" onClick={calculateTable}>
          Сгенерировать таблицу
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSaveTable}>
          Сохранить таблицу
        </Button>
      </div>
      {table && (
        <>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>№</th>
                <th>Символ</th>
                <th>Код символа</th>
                <th>Число вхождений</th>
                <th>Вероятность (pi)</th>
                <th>Ii</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{row.symbol}</td>
                  <td>{row.code}</td>
                  <td>{row.count}</td>
                  <td>{row.probability.toFixed(8)}</td>
                  <td>{row.ii.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="Info">
            <p>
              <strong>Всего символов:</strong> <span>{totalSymbols}</span>
            </p>
            <p>
              <strong>Энтропия источника:</strong>{" "}
              <span>{entropyValue.toFixed(4)}</span>
            </p>
          </div>

          <h2>Сравнение кодировок</h2>
          <table>
            <thead>
              <tr>
                <th>Тип кодирования</th>
                <th>Неопределенность</th>
                <th>Разрядность кода</th>
                <th>Абсолютная избыточность</th>
                <th>Относительная избыточность</th>
              </tr>
            </thead>
            <tbody>
              {compaitTable.map((row, index) => (
                <tr key={index}>
                  <td>{row.type}</td>
                  <td>{row.uncertainty}</td>
                  <td>{row.codeLength}</td>
                  <td>{row.absoluteRedundancy.toFixed(6)}</td>
                  <td>{row.relativeRedundancy.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="TableWrap">
            <ShannonFanoCoding
              initialTable={table}
              entropyValue={entropyValue}
            />
            <HuffmanCoding
              initialTable={table}
              entropyValue={entropyValue}
            ></HuffmanCoding>
          </div>
        </>
      )}
    </main>
  );
};

export default Labwork1;
