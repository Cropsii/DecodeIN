import React from "react";
import EncoderDecoder from "./EncoderDecoder";

const HuffmanCoding = ({ initialTable }) => {
  // Сортируем символы по вероятности (по убыванию)
  const sortedTable = [...initialTable].sort(
    (a, b) => b.probability - a.probability
  );

  // Построение кодового дерева методом Хаффмана
  const buildTree = (symbols) => {
    let nodes = symbols.map((symbol) => ({
      symbol: symbol.symbol,
      probability: symbol.probability,
      code: "",
    }));

    while (nodes.length > 1) {
      // Сортируем по вероятности (по возрастанию)
      nodes.sort((a, b) => a.probability - b.probability);

      // Объединяем два узла с наименьшей вероятностью
      const left = nodes[0];
      const right = nodes[1];
      const newNode = {
        symbol: null,
        probability: left.probability + right.probability,
        left,
        right,
      };

      // Удаляем объединённые узлы и добавляем новый
      nodes = [newNode, ...nodes.slice(2)];
    }

    return nodes[0];
  };

  // Генерация кодов для символов
  const generateCodes = (node, code = "") => {
    if (!node.symbol) {
      // Если это не лист, рекурсивно добавляем 0 и 1
      return {
        ...generateCodes(node.left, code + "0"),
        ...generateCodes(node.right, code + "1"),
      };
    }
    // Лист - символ и его код
    return { [node.symbol]: code };
  };

  // Вычисление средней длины кодов
  const calculateAverageCodeLength = (symbols, codes) => {
    return symbols.reduce(
      (sum, symbol) =>
        sum + codes[symbol.symbol].length * symbol.probability,
      0
    );
  };

  // Построение дерева и генерация кодов
  const huffmanTree = buildTree(sortedTable);
  const codes = generateCodes(huffmanTree);
  const averageCodeLength = calculateAverageCodeLength(sortedTable, codes);

  return (
    <div className="HuffmanWrap">
      <h2>Кодирование Хаффмана</h2>
      <table>
        <thead>
          <tr>
            <th>Символ</th>
            <th>Вероятность</th>
            <th>Код</th>
            <th>Длина кода (Ii)</th>
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

export default HuffmanCoding;
