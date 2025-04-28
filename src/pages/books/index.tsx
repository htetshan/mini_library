import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addBook, removeBook } from "@/store/slices/bookSlice";
import { useRouter } from "next/router";
import DeleteDialog from "@/components/DeleteDialog";
import { Book } from "@prisma/client";
import { config } from "@/config";
import NewLayoutApp from "@/components/NewLayoutApp";

export default function BooksPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { books } = useAppSelector((state) => state.books);
  console.log(books);

  const [newBook, setNewBook] = useState({
    name: "",
    author: "",
    category: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /*   const [editBook, setEditBook] = useState<any>(null);
   */
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);

  const handleAddBook = async () => {
    const formData = new FormData();
    formData.append("name", newBook.name);
    formData.append("author", newBook.author);
    formData.append("category", newBook.category);
    if (selectedFile) formData.append("image", selectedFile);

    const res = await fetch(`${config.api_url}/books`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      dispatch(addBook(data.book));
      setNewBook({ name: "", author: "", category: "" });
      setSelectedFile(null);
    } else {
      console.error("Upload failed", data.error);
    }
  };
  const handleUpdateBook = (id: number) => {
    router.push(`/books/${id}`);
  };

  const handleDeleteBook = async () => {
    if (bookToDelete !== null) {
      const res = await fetch(`${config.api_url}/books?id=${bookToDelete}`, {
        method: "DELETE",
      });
      const dataFromServer = await res.json();
      const { deletedBook } = dataFromServer;
      if (res.ok) {
        dispatch(removeBook(bookToDelete));
        setOpenDelete(false); // Close the dialog after deletion
        setBookToDelete(null); // Reset the book to delete
      } else {
        console.error("Delete failed");
      }
    }
  };
  const handleDownloadBookCard = async (book: Book) => {
    try {
      const response = await fetch(
        `${config.api_url}/books/${book.id}/download`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download book card.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${book.name}_card.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading book card:", error);
      alert("Failed to download book card. Please try again.");
    }
  };
  return (
    <NewLayoutApp>
      <main className="min-h-screen p-8 bg-white">
        <Typography variant="h4" gutterBottom>
          📚 Books
        </Typography>

        {/* Add Book Form */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Book
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Title Name"
              variant="outlined"
              value={newBook.name}
              onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
            />
            <TextField
              label="Author"
              variant="outlined"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
            />
            <TextField
              label="Category"
              variant="outlined"
              value={newBook.category}
              onChange={(e) =>
                setNewBook({ ...newBook, category: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <Button variant="contained" color="primary" onClick={handleAddBook}>
              Add Book
            </Button>
          </Box>
        </Box>

        {/* Books List */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Books List
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 2,
              Height: "442px",
              mb: 5,

              //overflowY: "auto",
            }}
          >
            {books.map((book) => (
              <Card key={book.id} sx={{ maxWidth: 345 }}>
                <CardMedia
                  sx={{ height: 200, m: 2 }}
                  image={book.imageUrl ?? "/default-image.jpg"} // Fallback to a default image
                  title={book.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {`BookID:  ${book.bookID}`}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    {`Title:  ${book.name}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {`Author:  ${book.author}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {`Category:  ${book.category}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {book.isAvailable ? "Available" : "Borrowed"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => handleUpdateBook(book.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setOpenDelete(true);
                      setBookToDelete(book.id); // Store book ID to delete
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => handleDownloadBookCard(book)}
                  >
                    Generate
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {/* Delete Dialog */}
        </Box>
      </main>
      <DeleteDialog
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        title="Delete Book"
        context="Are You Sure? You want to delete this book"
        handleDelete={handleDeleteBook}
      />
    </NewLayoutApp>
  );
}
