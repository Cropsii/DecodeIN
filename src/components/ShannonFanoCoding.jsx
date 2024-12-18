import React from "react";
import EncoderDecoder from "./EncoderDecoder";

const ShannonFanoCoding = ({ initialTable }) => {
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
    const leftCodes = assignCodes(leftGroup, code + "0");
    const rightCodes = assignCodes(rightGroup, code + "1");

    // Объединяем результаты
    return { ...leftCodes, ...rightCodes };
  };

  // Генерируем коды
  const codes = assignCodes(sortedTable);
  console.log(sortedTable);

  const calculateAverageCodeLength = (symbols, codes) => {
    return symbols.reduce(
      (sum, symbol) => sum + codes[symbol.symbol].length * symbol.probability,
      0
    );
  };
  const averageCodeLength = calculateAverageCodeLength(sortedTable, codes);
  return (
    <div className="ShanonFanoWrap">
      <h2>Кодирование Шеннона-Фано</h2>
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
              <td>{codes[row.symbol]}</td>
              <td>{codes[row.symbol].length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <strong>Средняя длина кодов:</strong> {averageCodeLength.toFixed(4)} бит
      </p>
      <EncoderDecoder codes={codes}></EncoderDecoder>
    </div>
  );
};

export default ShannonFanoCoding;
