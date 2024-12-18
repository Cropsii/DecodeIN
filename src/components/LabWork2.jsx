// src/Labwork2.js
import React from 'react';
import PropTypes from 'prop-types';

const Labwork2 = ({ symbols, entropy }) => {
  // Функция для построения кодов по методу Шеннона-Фано
  const buildShannonFanoCodes = (symbols) => {
    // Сортируем символы по убыванию вероятностей
    symbols.sort((a, b) => b.probability - a.probability);

    // Рекурсивная функция для построения кодов
    const buildCodes = (symbols) => {
      if (symbols.length === 1) {
        return [{ symbol: symbols[0].symbol, code: '' }];
      }

      const mid = Math.ceil(symbols.length / 2);
      const left = symbols.slice(0, mid);
      const right = symbols.slice(mid);

      const leftCodes = buildCodes(left).map(item => ({ ...item, code: '0' + item.code }));
      const rightCodes = buildCodes(right).map(item => ({ ...item, code: '1' + item.code }));

      return [...leftCodes, ...rightCodes];
    };

    return buildCodes(symbols);
  };

  // Функция для построения кодов по методу Хаффмана
  const buildHuffmanCodes = (symbols) => {
    // Создаем начальный массив узлов
    let nodes = symbols.map(symbol => ({ symbol: symbol.symbol, probability: symbol.probability }));

    // Повторяем процесс до тех пор, пока не останется один узел
    while (nodes.length > 1) {
      // Находим два узла с наименьшими вероятностями
      nodes.sort((a, b) => a.probability - b.probability);
      const right = nodes.pop();
      const left = nodes.pop();

      // Создаем новый узел с суммарной вероятностью
      const newNode = {
        symbol: null,
        probability: left.probability + right.probability,
        left,
        right,
      };

      // Добавляем новый узел в массив
      nodes.push(newNode);
    }

    // Рекурсивная функция для построения кодов
    const buildCodes = (node, code = '') => {
      if (!node.symbol) {
        return [...buildCodes(node.left, code + '0'), ...buildCodes(node.right, code + '1')];
      }
      return [{ symbol: node.symbol, code }];
    };

    return buildCodes(nodes[0]);
  };

  const shannonFanoCodes = buildShannonFanoCodes(symbols);
  const huffmanCodes = buildHuffmanCodes(symbols);

  return (
    <div>
      <h2>Часть 2: Кодирование дискретных источников информации</h2>
      <h3>Кодирование методом Шеннона-Фано</h3>
      <table>
        <thead>
          <tr>
            <th>Символ</th>
            <th>Код</th>
          </tr>
        </thead>
        <tbody>
          {shannonFanoCodes.map((row, index) => (
            <tr key={index}>
              <td>{row.symbol}</td>
              <td>{row.code}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Кодирование методом Хаффмана</h3>
      <table>
        <thead>
          <tr>
            <th>Символ</th>
            <th>Код</th>
          </tr>
        </thead>
        <tbody>
          {huffmanCodes.map((row, index) => (
            <tr key={index}>
              <td>{row.symbol}</td>
              <td>{row.code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Labwork2.propTypes = {
  symbols: PropTypes.arrayOf(
    PropTypes.shape({
      symbol: PropTypes.string.isRequired,
      probability: PropTypes.number.isRequired,
    })
  ).isRequired,
  entropy: PropTypes.number.isRequired,
};

export default Labwork2;
