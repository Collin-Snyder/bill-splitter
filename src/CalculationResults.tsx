import {
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export interface IIndividualTotal {
  name: string;
  total: number;
}

interface ICalculationResultsDialogProps {
  individualTotals: IIndividualTotal[];
  entireBillTotal: number;
  open: boolean;
  handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
}

const CalculationResultsDialog = ({
  handleClose,
  open,
  individualTotals,
  entireBillTotal,
}: ICalculationResultsDialogProps) => (
  <Dialog onClose={handleClose} open={open}>
    <DialogTitle>
      Bill Splits
      <IconButton
        aria-label="close"
        onClick={() => {
          handleClose({}, "backdropClick");
        }}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Individual</strong>
            </TableCell>
            <TableCell>
              <strong>Total Owed</strong>
            </TableCell>
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
            <TableCell>
              <strong>Entire bill</strong>
            </TableCell>
            <TableCell>
              <strong>${entireBillTotal.toFixed(2)}</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </Dialog>
);

export default CalculationResultsDialog;
