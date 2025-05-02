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
import React, { useEffect } from "react";

const history = () => {
  const { transactions } = useAppSelector((state) => state.transactions);

  return (
    <>
      <NewLayoutApp>
        <Box p={4}>
          <Typography variant="h4" gutterBottom>
            Transaction History
          </Typography>
          <List>
            {transactions.map((transaction) => (
              <ListItem key={transaction.id}>
                <ListItemText
                  primary={`${transaction.book.name} ${
                    transaction.returnedAt
                      ? `returned by ${transaction.member.name} on ${new Date(
                          transaction.returnedAt
                        ).toLocaleDateString()}`
                      : `borrowed by ${transaction.member.name} on ${new Date(
                          transaction.issuedAt
                        ).toLocaleDateString()}`
                  }`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </NewLayoutApp>
    </>
  );
};

export default history;
