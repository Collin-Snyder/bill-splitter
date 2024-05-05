import React, { ChangeEvent, MouseEvent, useState } from "react";
import If from "./If";

import "./IndividualBillEditor.scss";

import { Button, Divider, Stack, TextField } from "@mui/material";
import CurrencyInput from "./CurrencyInput";

interface IndividualBillEditorProps {
  id: number;
  name: string;
  itemCosts: number[];
  onSetName: (name: string) => void;
  onAddItemCost: (cost: number) => void;
  onDeleteItemCost: (index: number) => void;
  onDeleteIndividual: (id: number) => void;
  onCloseEditor: () => void;
}

const IndividualBillEditor = ({
  id,
  name,
  itemCosts,
  onSetName,
  onAddItemCost,
  onDeleteItemCost,
  onDeleteIndividual,
  onCloseEditor,
}: IndividualBillEditorProps): JSX.Element => {
  const [nameValue, setNameValue] = useState<string>("");
  const [nextItemCostValue, setNextItemCostValue] = useState<number | null>(null);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNameValue(event.target.value);
  };

  const handleSaveName = () => {
    onSetName(nameValue);
    setNameValue("");
  };

  const handleNextItemCostValueChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setNextItemCostValue(Number(event.target.value));
  };

  const handleSaveNextItemCost = () => {
    onAddItemCost(nextItemCostValue || 0);
    setNextItemCostValue(0);
  };

  const handleDeleteCost = (index: number) => {
    onDeleteItemCost(index);
  };

  const handleSaveIndividualBill = () => {
    if (nameValue) handleSaveName();
    if (nextItemCostValue) handleSaveNextItemCost();
    onCloseEditor();
  };

  const handleDeleteIndividual = () => {
    onDeleteIndividual(id);
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
                <p>
                  <strong>${cost.toFixed(2)}</strong>
                </p>
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
            label="Enter an item's cost"
            id={`new-cost-item-${name || "new-individual"}`}
            value={nextItemCostValue}
            onChange={handleNextItemCostValueChange}
            placeholder="$0.00"
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

        <div className="individual-bill-button-container">
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleDeleteIndividual}
            className="delete-individual-btn"
          >
            Delete Individual
          </Button>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={handleSaveIndividualBill}
            className="save-individual-btn"
          >
            Save Individual Bill
          </Button>
        </div>
      </Stack>
    </div>
  );
};

export default IndividualBillEditor;
