import React, { ChangeEvent, MouseEvent, useState } from "react";
import If from "./If";

import "./IndividualBillEditor.css";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";

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
    <Card raised={true} className="individual-bill-editor">
      <CardHeader title={name ? `${name}'s Bill` : `New Individual Bill`}>
        {name ? <h2>{name}'s Bill</h2> : <h2>New Individual Bill</h2>}
      </CardHeader>
      <CardContent>
        <If condition={!name}>
          <div className="individual-name-editor">
            <TextField
              label="Enter individual's name"
              id="name-editor"
              type="text"
              value={nameValue}
              onChange={handleNameChange}
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
          <List></List>
          {itemCosts.map((cost, i) => (
            <ListItem key="cost">
              <ListItemText>${cost.toFixed(2)}</ListItemText>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDeleteCost(i)}
              >
                Delete
              </Button>
            </ListItem>
          ))}
        </If>

        <div>
          <TextField
            label={`Enter a cost item for ${name ? name : "this individual"}`}
            id={`new-cost-item-${name || "new-individual"}`}
            type="number"
            value={nextItemCostValue}
            onChange={handleNextItemCostValueChange}
            size="small"
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
        <CardActions>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={handleSaveIndividualBill}
          >
            Save Individual Bill
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default IndividualBillEditor;
