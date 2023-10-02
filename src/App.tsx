import React, { ChangeEvent, useState } from "react";
import logo from "./logo.svg";
import "./App.scss";
import IndividualBillEditor from "./IndividualBillEditor";
import If from "./If";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CurrencyInput from "./CurrencyInput";
import CalculationResultsDialog, {
  IIndividualTotal,
} from "./CalculationResults";

interface IIndividualBill {
  id: number;
  name: string;
  itemCosts: number[];
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
  const [showCalculationResultsDialog, setShowCalculationResultsDialog] =
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

  const handleIndividualBillEditorChange = (billId: number) => {
    if (individualBillEditorToShow === billId)
      setIndividualBillEditorToShow(null);
    else setIndividualBillEditorToShow(billId);
  };

  const handleTaxValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value == "0") {
      setTaxValue(0);
    }
    setTaxValue(Number(event.target.value) || undefined);
  };

  const handleTipValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value == "0") {
      setTipValue(0);
    }
    setTipValue(Number(event.target.value) || undefined);
  };

  const handleOtherValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value == "0") {
      setOtherValue(0);
    }
    setOtherValue(Number(event.target.value) || undefined);
  };

  const handleEvenSplitValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value == "0") {
      setEvenSplitValue(0);
    }
    setEvenSplitValue(Number(event.target.value) || undefined);
  };

  const calculate = () => {
    const foodAndDrinkTotal = individualBills.reduce((sum, bill) => {
      return sum + sumCostArray(bill.itemCosts);
    }, 0);
    const taxPercentage = Number(
      ((taxValue || 0) / foodAndDrinkTotal).toFixed(2)
    );
    const tipPercentage = Number(
      ((tipValue || 0) / foodAndDrinkTotal).toFixed(2)
    );
    const otherPercentage = Number(
      ((otherValue || 0) / foodAndDrinkTotal).toFixed(2)
    );
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
    setShowCalculationResultsDialog(true);
  };

  const calculateEntireBill = () => {
    const foodAndDrinkTotal = individualBills.reduce((sum, bill) => {
      return sum + sumCostArray(bill.itemCosts);
    }, 0);
    return (
      foodAndDrinkTotal +
      (taxValue || 0) +
      (tipValue || 0) +
      (otherValue || 0) +
      (evenSplitValue || 0)
    );
  };

  const reset = () => {
    setNextBillId(0);
    setIndividualBills([]);
  };

  const handleCloseDialog = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    setShowCalculationResultsDialog(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bill Splitter</h1>
      </header>

      <div id="individual-bill-container">
        <If condition={!individualBills.length}>
          <p>Add individual to get started!</p>
        </If>

        <If condition={!!individualBills.length}>
          {individualBills.map((bill) => (
            <Accordion
              sx={{ width: "100%" }}
              expanded={individualBillEditorToShow === bill.id}
              onChange={() => handleIndividualBillEditorChange(bill.id)}
            >
              <AccordionSummary
                id={`individual-bill-header-${bill.id}`}
                expandIcon={<ExpandMoreIcon />}
              >
                <strong>
                  {bill.name || "New Individual"}'s Individual Cost: $
                  {sumCostArray(bill.itemCosts)}
                </strong>
              </AccordionSummary>
              <AccordionDetails>
                <IndividualBillEditor
                  {...bill}
                  setName={(name: string) => updateBillName(bill, name)}
                  addItemCost={(cost: number) => addBillCost(bill, cost)}
                  deleteItemCost={(index: number) =>
                    deleteBillCost(bill, index)
                  }
                  closeEditor={() => handleIndividualBillEditorChange(bill.id)}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </If>

        <Button variant="contained" color="primary" onClick={addIndividualBill}>
          Add Individual
        </Button>
      </div>

      <Divider id="group-costs-divider">Group Costs</Divider>

      <Stack spacing={2}>
        <TextField
          label="Tax"
          id="tax-input"
          value={taxValue}
          onChange={handleTaxValueChange}
          size="small"
          InputProps={{ inputComponent: CurrencyInput as any }}
        />
        <TextField
          label="Tip"
          id="tip-input"
          value={tipValue}
          onChange={handleTipValueChange}
          size="small"
          InputProps={{ inputComponent: CurrencyInput as any }}
        />
        <TextField
          label=" Other Percentage-Based Costs"
          id="other-percentage-cost-input"
          value={otherValue}
          onChange={handleOtherValueChange}
          size="small"
          InputProps={{ inputComponent: CurrencyInput as any }}
        />
        <TextField
          label="Even-Split Costs"
          id="even-split-cost-input"
          value={evenSplitValue}
          onChange={handleEvenSplitValueChange}
          size="small"
          InputProps={{ inputComponent: CurrencyInput as any }}
        />
      </Stack>

      <Stack id="bottom-button-container" spacing={1}>
        <Button variant="contained" color="success" onClick={calculate}>
          Calculate Split Costs
        </Button>
        <Button variant="outlined" color="error" onClick={reset}>
          Reset All
        </Button>
      </Stack>

      <CalculationResultsDialog
        open={showCalculationResultsDialog}
        individualTotals={individualTotals}
        entireBillTotal={calculateEntireBill()}
        handleClose={handleCloseDialog}
      />
    </div>
  );
}

export default App;
