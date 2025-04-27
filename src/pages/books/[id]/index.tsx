import { GetServerSideProps } from "next";
import LayoutApp from "@/components/LayoutApp";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Book } from "@prisma/client";
import { useState } from "react";
import { prisma } from "@/lib/prisma";
import { useAppDispatch } from "@/store/hooks";
import { updateBook } from "@/store/slices/bookSlice";
import { useRouter } from "next/router";
import { config } from "@/config";

interface Props {
  book: Book | null;
}

// Fetch the book data from the database for the given ID
export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(context.params?.id);

  const book = await prisma.book.findUnique({
    where: { id },
  });

  return {
    props: {
      book: book || null, // Return null if no book is found
    },
  };
};

const EditBook = ({ book }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [editBook, setEditBook] = useState<Book | null>(book);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!book) {
    return (
      <LayoutApp>
        <Box>404 Not Found</Box>
      </LayoutApp>
    );
  }

  const handleUpdate = async () => {
    const shouldUpdate =
      book.name !== editBook?.name ||
      book.author !== editBook?.author ||
      book.category !== editBook?.category ||
      selectedFile !== null;

    if (shouldUpdate) {
      const formData = new FormData();
      formData.append("id", String(editBook?.id));
      formData.append("name", editBook?.name || "");
      formData.append("author", editBook?.author || "");
      formData.append("category", editBook?.category || "");
      if (selectedFile) formData.append("image", selectedFile);

      const response = await fetch(`${config.api_url}/books`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(updateBook(data.book)); // Update Redux state
        router.push("/books"); // Redirect to the books list page
      } else {
        console.error("Failed to update book");
      }
    }
  };

  return (
    <LayoutApp>
      <main className="min-h-screen p-8 bg-white">
        <h1 className="text-2xl font-semibold mb-4">📚 Edit Book</h1>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Book
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <TextField
              label="Name"
              variant="outlined"
              value={editBook?.name ?? ""}
              onChange={(e) =>
                setEditBook({
                  ...editBook!,
                  name: e.target.value,
                })
              }
              fullWidth
            />
            <TextField
              label="Author"
              variant="outlined"
              value={editBook?.author ?? ""}
              onChange={(e) =>
                setEditBook({
                  ...editBook!,
                  author: e.target.value,
                })
              }
              fullWidth
            />
            <TextField
              label="Category"
              variant="outlined"
              value={editBook?.category ?? ""}
              onChange={(e) =>
                setEditBook({
                  ...editBook!,
                  category: e.target.value,
                })
              }
              fullWidth
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Box>
      </main>
    </LayoutApp>
  );
};

export default EditBook;
