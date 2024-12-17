import React, { useState } from "react";
import * as XLSX from "xlsx";
import { evaluate } from "mathjs";
import "./labwork1.css"; // импортируем файл стилей
import SecondTable from "./SecondTable";

const Labwork1 = () => {
  const [text, setText] = useState("");
  const [table, setTable] = useState(null);
  const [totalSymbols, setTotalSymbols] = useState(0);
  const [entropyValue, setEntropyValue] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
      };
      reader.readAsText(file, "utf-8"); // читаем файл как текст в кодировке utf-8
    }
  };

  const handleGenerateTable = () => {
    if (!text) {
      alert("Пожалуйста, загрузите файл с текстом.");
      return;
    }

    const lowerCaseText = text.toLowerCase(); // Переводим текст в нижний регистр
    const symbols = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789.,:;- (".split(
      ""
    );
    const symbolCounts = symbols.map((symbol) => ({
      symbol,
      count: lowerCaseText.split(symbol).length - 1,
    }));

    const totalSymbols = symbolCounts.reduce(
      (sum, item) => sum + item.count,
      0
    );
    setTotalSymbols(totalSymbols);

    const tableData = symbolCounts.map((item) => ({
      ...item,
      code: item.symbol.charCodeAt(0),
      probability: item.count / totalSymbols,
      ii: item.count > 0 ? -Math.log2(item.count / totalSymbols) : 0,
    }));

    // Вычисление энтропии по указанной формуле
    const entropySum = tableData.reduce(
      (acc, item) =>
        acc +
        (item.probability > 0
          ? item.probability * -Math.log2(item.probability)
          : 0),
      0
    );

    const entropyValue = entropySum;
    setEntropyValue(entropyValue);

    setTable(tableData);
  };

  const handleSaveTable = () => {
    if (!table) {
      alert(
        "Таблица не сгенерирована. Сначала нажмите 'Сгенерировать таблицу'."
      );
      return;
    }

    const ws = XLSX.utils.json_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "lab_work_1_table.xlsx");
  };

  return (
    <main>
      <h1>Лабораторная работа №1</h1>
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="file-input"
        id="file-input"
      />
      <button onClick={handleGenerateTable}>Сгенерировать таблицу</button>
      <button onClick={handleSaveTable}>Сохранить таблицу</button>

      {table && (
        <>
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Символ</th>
                <th>Код символа</th>
                <th>Число вхождений символа в текст</th>
                <th>Вероятность вхождения символа (pi)</th>
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
                  <td>{row.probability ? row.probability.toFixed(4) : ""}</td>
                  <td>{row.ii ? row.ii.toFixed(4) : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="Info">
            <p>
              <strong>Всего символов в тексте:</strong>{" "}
              <span className="InfoNums"> {totalSymbols}</span>
            </p>
            <p>
              <strong>Полная вероятность:</strong>{" "}
              <span className="InfoNums">1</span>
            </p>
            <p>
              <strong>Энтропия источника:</strong>{" "}
              <span className="InfoNums">{entropyValue}</span>
            </p>
          </div>
        </>
      )}
      <SecondTable
        totalSymbols={totalSymbols}
        entropyValue={entropyValue}
      ></SecondTable>
    </main>
  );
};

export default Labwork1;
