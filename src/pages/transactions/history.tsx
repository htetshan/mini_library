import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTransactions } from "@/store/slices/transactionSlice";
import NewLayoutApp from "@/components/NewLayoutApp";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

const History = () => {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.transactions);
  console.log(transactions);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions"); // Adjust endpoint if needed
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        dispatch(setTransactions(data));
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [dispatch]);

  return (
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
  );
};

export default History;
