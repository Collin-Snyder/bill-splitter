import React, { ChangeEvent, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import IndividualBillEditor from "./IndividualBillEditor";
import If from "./If";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

interface IIndividualBill {
  id: number;
  name: string;
  itemCosts: number[];
}

interface IIndividualTotal {
  name: string;
  total: number;
}

function App() {
  const [nextBillId, setNextBillId] = useState<number>(0);
  const [individualBills, setIndividualBills] = useState<IIndividualBill[]>([]);
  const [individualBillEditorToShow, setIndividualBillEditorToShow] = useState<
    number | null
  >();
  const [taxValue, setTaxValue] = useState<number>();
  const [tipValue, setTipValue] = useState<number>();
  const [otherValue, setOtherValue] = useState<number>();
  const [evenSplitValue, setEvenSplitValue] = useState<number>();
  const [individualTotals, setIndividualTotals] = useState<IIndividualTotal[]>(
    []
  );
  const [showIndividualTotals, setShowIndividualTotals] =
    useState<boolean>(false);

  const addIndividualBill = () => {
    individualBills.push({ id: nextBillId, name: "", itemCosts: [] });
    setIndividualBills([...individualBills]);
    setIndividualBillEditorToShow(nextBillId);
    setNextBillId(nextBillId + 1);
  };

  const updateBillName = (bill: IIndividualBill, name: string) => {
    bill.name = name;
    setIndividualBills([...individualBills]);
  };

  const addBillCost = (bill: IIndividualBill, cost: number) => {
    bill.itemCosts.push(cost);
    setIndividualBills([...individualBills]);
  };

  const deleteBillCost = (bill: IIndividualBill, index: number) => {
    bill.itemCosts = bill.itemCosts.filter((cost, i) => i !== index);
    setIndividualBills([...individualBills]);
  };

  const sumCostArray = (arr: number[]): number => {
    const sum = arr.reduce((sum, num) => {
      return sum + num;
    }, 0);
    return Number(sum.toFixed(2));
  };

  const openBillEditor = (billId: number) => {
    setIndividualBillEditorToShow(billId);
  };

  const closeBillEditors = () => {
    const filteredBills = individualBills.filter((bill) => !!bill.name);
    setIndividualBillEditorToShow(null);
  };

  const handleTaxValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTaxValue(Number(event.target.value));
  };

  const handleTipValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTipValue(Number(event.target.value));
  };

  const handleOtherValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOtherValue(Number(event.target.value));
  };

  const handleEvenSplitValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEvenSplitValue(Number(event.target.value));
  };

  const calculate = () => {
    const foodAndDrinkTotal = individualBills.reduce((sum, bill) => {
      return sum + sumCostArray(bill.itemCosts);
    }, 0);
    const taxPercentage = Number(((taxValue || 0) / foodAndDrinkTotal).toFixed(2));
    const tipPercentage = Number(((tipValue || 0) / foodAndDrinkTotal).toFixed(2));
    const otherPercentage = Number(((otherValue || 0) / foodAndDrinkTotal).toFixed(2));
    const evenSplitPerIndividual =
      (evenSplitValue || 0) / (individualBills.length || 1);

    const newIndividualTotals = individualBills.map((bill) => {
      const indivFoodAndDrinkTotal = sumCostArray(bill.itemCosts);
      return {
        name: bill.name,
        total:
          indivFoodAndDrinkTotal +
          evenSplitPerIndividual +
          taxPercentage * indivFoodAndDrinkTotal +
          tipPercentage * indivFoodAndDrinkTotal +
          otherPercentage * indivFoodAndDrinkTotal,
      };
    });

    setIndividualTotals(newIndividualTotals);
    setShowIndividualTotals(true);
  };

  const calculateEntireBill = () => {
    const foodAndDrinkTotal = individualBills.reduce((sum, bill) => {
      return sum + sumCostArray(bill.itemCosts);
    }, 0);
    return (
      foodAndDrinkTotal + (taxValue || 0) + (tipValue || 0) + (otherValue || 0) + (evenSplitValue || 0)
    );
  };

  const reset = () => {
    setNextBillId(0);
    setIndividualBills([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bill Splitter</h1>
      </header>

      <div id="individual-bill-container">
        <If condition={!individualBills.length}>
          <div>
            <p>Add individual to get started!</p>
          </div>
        </If>

        <If condition={!!individualBills.length}>
          {individualBills.map((bill) => {
            if (individualBillEditorToShow === bill.id) {
              return (
                <IndividualBillEditor
                  {...bill}
                  setName={(name: string) => updateBillName(bill, name)}
                  addItemCost={(cost: number) => addBillCost(bill, cost)}
                  deleteItemCost={(index: number) =>
                    deleteBillCost(bill, index)
                  }
                  closeEditor={closeBillEditors}
                />
              );
            }
            return (
              <div>
                <p>
                  {bill.name}'s Food And Drink Cost: $
                  {sumCostArray(bill.itemCosts)}
                </p>
                <button onClick={() => openBillEditor(bill.id)}>Edit</button>
              </div>
            );
          })}
        </If>

        <button onClick={addIndividualBill}>Add Individual</button>
      </div>

      <div id="percentage-costs-container">
        <label htmlFor="tax-input">
          Tax
          <input
            id="tax-input"
            type="number"
            value={taxValue}
            onChange={handleTaxValueChange}
          />
        </label>
        <label htmlFor="tip-input">
          Tip
          <input
            id="tip-input"
            type="number"
            value={tipValue}
            onChange={handleTipValueChange}
          />
        </label>
        <label htmlFor="other-percentage-cost-input">
          Other Percentage-Based Costs
          <input
            id="other-percentage-cost-input"
            type="number"
            value={otherValue}
            onChange={handleOtherValueChange}
          />
        </label>
        <label htmlFor="even-split-cost-input">
          Even-Split Costs
          <input
            id="even-split-cost-input"
            type="number"
            value={evenSplitValue}
            onChange={handleEvenSplitValueChange}
          />
        </label>
      </div>
      <button onClick={calculate}>Calculate Split Costs</button>
      <button onClick={reset}>Reset All</button>

      <If condition={showIndividualTotals}>
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Individual</TableCell>
                <TableCell>Total Owed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {individualTotals.map(({ name, total }) => (
                <TableRow>
                  <TableCell>{name}</TableCell>
                  <TableCell>${total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>ENTIRE BILL</TableCell>
                <TableCell>${calculateEntireBill().toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </If>
    </div>
  );
}

export default App;
