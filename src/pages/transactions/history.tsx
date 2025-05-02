import NewLayoutApp from "@/components/NewLayoutApp";
import { useAppSelector } from "@/store/hooks";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const history = () => {
  const { transactions } = useAppSelector((state) => state.transactions);
  return (
    <>
      <NewLayoutApp>
        <Box p={4}>
          <Typography variant="h4" gutterBottom>
            Transaction History
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Book</TableCell>
                  <TableCell>Context</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.book.name}</TableCell>
                    <TableCell>
                      {transaction.returnedAt ? "Returned by" : "Borrowed by"}{" "}
                      {transaction.member.name}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        transaction.returnedAt || transaction.issuedAt
                      ).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </NewLayoutApp>
    </>
  );
};

export default history;
