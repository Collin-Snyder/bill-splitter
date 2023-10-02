import React, { ChangeEvent, MouseEvent, useState } from "react";
import If from "./If";

import "./IndividualBillEditor.scss";

import { Button, Divider, Stack, TextField } from "@mui/material";
import CurrencyInput from "./CurrencyInput";

interface IndividualBillEditorProps {
  id: number;
  name: string;
  itemCosts: number[];
  setName: Function;
  addItemCost: Function;
  deleteItemCost: Function;
  closeEditor: Function;
}

const IndividualBillEditor = ({
  id,
  name,
  itemCosts,
  setName,
  addItemCost,
  deleteItemCost,
  closeEditor,
}: IndividualBillEditorProps): JSX.Element => {
  const [nameValue, setNameValue] = useState<string>("");
  const [nextItemCostValue, setNextItemCostValue] = useState<number>(0);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNameValue(event.target.value);
  };

  const handleSaveName = () => {
    setName(nameValue);
    setNameValue("");
  };

  const handleNextItemCostValueChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setNextItemCostValue(Number(event.target.value));
  };

  const handleSaveNextItemCost = () => {
    addItemCost(nextItemCostValue);
    setNextItemCostValue(0);
  };

  const handleDeleteCost = (index: number) => {
    deleteItemCost(index);
  };

  const handleSaveIndividualBill = () => {
    if (nameValue) handleSaveName();
    if (nextItemCostValue) handleSaveNextItemCost();
    closeEditor();
  };

  return (
    <div>
      {/* {name ? <h2>{name}'s Bill</h2> : <h2>New Individual Bill</h2>} */}

      <Stack spacing={1}>
        <If condition={!name}>
          <div className="individual-name-editor">
            <TextField
              label="Enter individual's name"
              id="name-editor"
              type="text"
              value={nameValue}
              onChange={handleNameChange}
              size="small"
            />
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleSaveName}
            >
              Save
            </Button>
          </div>
        </If>

        <If condition={!!itemCosts.length}>
          {itemCosts.map((cost, i) => (
            <>
              <div key="cost" className="individual-cost-item">
                <p><strong>${cost.toFixed(2)}</strong></p>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteCost(i)}
                >
                  Delete
                </Button>
              </div>
             
            </>
          ))}
        </If>

        <div className="individual-cost-editor">
          <TextField
            label="Enter a cost item"
            id={`new-cost-item-${name || "new-individual"}`}
            value={nextItemCostValue}
            onChange={handleNextItemCostValueChange}
            size="small"
            InputProps={{ inputComponent: CurrencyInput as any }}
          />

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleSaveNextItemCost}
          >
            Save
          </Button>
        </div>

        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={handleSaveIndividualBill}
        >
          Save Individual Bill
        </Button>
      </Stack>
    </div>
  );
};

export default IndividualBillEditor;
