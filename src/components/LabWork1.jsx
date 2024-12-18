import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button, TextField, Box } from "@mui/material"; // Импортируем Button и другие компоненты из Material UI
import Labwork2 from "./LabWork2";

const Labwork1 = () => {
  const [text, setText] = useState("");
  const [table, setTable] = useState(null);
  const [totalSymbols, setTotalSymbols] = useState(0);
  const [entropyValue, setEntropyValue] = useState(0);

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
    const symbols = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789.,:;- (".split(
      ""
    );
    const symbolCounts = symbols.reduce((acc, symbol) => {
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

  // Вторичная таблица (ASCII и Хартли)
  const asciiBits = 8;
  const hartleyBits = Math.log2(totalSymbols || 1);
  const asciiAbsoluteRedundancy = asciiBits - entropyValue;
  const hartleyAbsoluteRedundancy = hartleyBits - entropyValue;

  const secondTableData = [
    {
      type: "Стандартный код ASCII",
      uncertainty: asciiBits,
      codeLength: asciiBits,
      absoluteRedundancy: asciiAbsoluteRedundancy,
      relativeRedundancy: asciiAbsoluteRedundancy / asciiBits,
    },
    {
      type: "Код по Хартли",
      uncertainty: hartleyBits,
      codeLength: hartleyBits,
      absoluteRedundancy: hartleyAbsoluteRedundancy,
      relativeRedundancy: hartleyAbsoluteRedundancy / hartleyBits,
    },
  ];

  return (
    <main>
      <h1>Лабораторная работа №1</h1>
      <div className="WrapButton">
        <div className="file-input-wrapper">
          <Box>
            {/* Используем TextField для стилизации input */}
            <TextField
              variant="outlined"
              type="file"
              onChange={handleFileChange}
              sx={{
                backgroundColor: "#ffff",
                borderRadius: "10px",
              }}
            />
          </Box>
        </div>

        {/* Кнопка с использованием Material UI */}
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
                <th>№</th>
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
                  <td>{index + 1}</td>
                  <td>{row.symbol}</td>
                  <td>{row.code}</td>
                  <td>{row.count}</td>
                  <td>{row.probability.toFixed(4)}</td>
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
              <strong>Энтропия источника:</strong> <span>{entropyValue}</span>
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
              {secondTableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.type}</td>
                  <td>{row.uncertainty.toFixed(4)}</td>
                  <td>{row.codeLength.toFixed(4)}</td>
                  <td>{row.absoluteRedundancy.toFixed(4)}</td>
                  <td>{row.relativeRedundancy.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
};

export default Labwork1;
