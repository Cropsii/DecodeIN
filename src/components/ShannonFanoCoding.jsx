import React, { useState } from "react";
import EncoderDecoder from "./EncoderDecoder";
import { Switch } from "@mui/material";

const ShannonFanoCoding = ({ initialTable, entropyValue }) => {
  const [invertCodes, setInvertCodes] = useState(false);

  // Сортируем символы по вероятности (по убыванию)
  const sortedTable = [...initialTable].sort(
    (a, b) => b.probability - a.probability
  );

  // Рекурсивная функция для разделения и создания кодов
  const assignCodes = (symbols, code = "") => {
    if (symbols.length === 1) {
      // Если остался только один символ, возвращаем его код
      return { [symbols[0].symbol]: code };
    }

    // Суммируем вероятности
    const totalProbability = symbols.reduce(
      (sum, item) => sum + item.probability,
      0
    );
    // Ищем точку разделения с минимальной разницей вероятностей
    let splitIndex = 0;
    let leftSum = 0;
    let minDifference = Infinity;

    for (let i = 0; i < symbols.length - 1; i++) {
      leftSum += symbols[i].probability;
      const rightSum = totalProbability - leftSum;
      const difference = Math.abs(leftSum - rightSum);

      if (difference < minDifference) {
        minDifference = difference;
        splitIndex = i;
      }
    }

    // Разделяем на две группы
    const leftGroup = symbols.slice(0, splitIndex + 1);
    const rightGroup = symbols.slice(splitIndex + 1);

    // Рекурсивно генерируем коды для обеих групп
    const leftCodes = assignCodes(leftGroup, code + (invertCodes ? "0" : "1"));
    const rightCodes = assignCodes(rightGroup, code + (invertCodes ? "1" : "0"));

    // Объединяем результаты
    return { ...leftCodes, ...rightCodes };
  };

  // Генерируем коды
  const codes = assignCodes(sortedTable);
  console.log(sortedTable);

  // Функция для расчета средней длины кодов
  const calculateAverageCodeLength = (symbols, codes) => {
    return symbols.reduce(
      (sum, symbol) => sum + codes[symbol.symbol].length * symbol.probability,
      0
    );
  };

  const averageCodeLength = calculateAverageCodeLength(sortedTable, codes);

  const handleSwitchChange = () => {
    setInvertCodes(!invertCodes);
  };

  return (
    <div className="ShanonFanoWrap">
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2>Кодирование Шеннона-Фано</h2>
        <Switch
          defaultChecked
          color="secondary"
          checked={invertCodes}
          onChange={handleSwitchChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Символ</th>
            <th>Вероятность</th>
            <th>Код</th>
            <th>Ii (Длина бит)</th>
          </tr>
        </thead>
        <tbody>
          {sortedTable.map((row, index) => (
            <tr key={index}>
              <td>{row.symbol}</td>
              <td>{row.probability.toFixed(8)}</td>
              <td style={{textAlign:"center"}}>{codes[row.symbol]}</td>
              <td>{codes[row.symbol].length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="Info">
        <p>
          <strong>Средняя длина кодов:</strong>{" "}
          <span>{averageCodeLength.toFixed(4)} бит</span>
        </p>
        <p>
          <strong>Энтропия:</strong> <span>{entropyValue.toFixed(4)} бит</span>
        </p>
      </div>
      <EncoderDecoder codes={codes} Name={"Шеннона-Фано"}></EncoderDecoder>
    </div>
  );
};

export default ShannonFanoCoding;
