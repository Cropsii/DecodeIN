// src/SecondTable.js
import React from 'react';

const SecondTable = ({ tableData, entropy }) => {
  const totalSymbols = tableData.reduce((sum, item) => sum + item.count, 0);
  const hartleyMeasure = Math.log2(symbols.length);
  const asciiCodeLength = 8; // ASCII код имеет длину 8 бит

  const uncertaintyAscii = asciiCodeLength;
  const codeLengthHartley = hartleyMeasure;
  const absoluteRedundancyAscii = asciiCodeLength - entropy;
  const relativeRedundancyAscii = absoluteRedundancyAscii / asciiCodeLength;
  const absoluteRedundancyHartley = hartleyMeasure - entropy;
  const relativeRedundancyHartley = absoluteRedundancyHartley / hartleyMeasure;

  const secondTableData = [
    {
      type: 'При кодировании сообщения стандартной кодовой таблицей ASCII',
      uncertainty: uncertaintyAscii,
      codeLength: asciiCodeLength,
      absoluteRedundancy: absoluteRedundancyAscii,
      relativeRedundancy: relativeRedundancyAscii
    },
    {
      type: 'При использовании равномерного кода, построенного на основе меры Хартли',
      uncertainty: entropy,
      codeLength: codeLengthHartley,
      absoluteRedundancy: absoluteRedundancyHartley,
      relativeRedundancy: relativeRedundancyHartley
    }
  ];

  return (
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
  );
};

export default SecondTable;
