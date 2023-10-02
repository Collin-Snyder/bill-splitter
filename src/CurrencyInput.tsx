import React, { forwardRef } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface ICustomCurrencyProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  value: number;
  name: string;
  id: string;
}

const CurrencyInput = forwardRef<NumericFormatProps, ICustomCurrencyProps>(
  function CurrencyInput(props, ref) {
    const { onChange, ...otherProps } = props;

    return (
      <NumericFormat
        {...otherProps}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="$"
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
      />
    );
  }
);

export default CurrencyInput
