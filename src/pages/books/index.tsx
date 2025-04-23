import { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import LayoutApp from "@/components/LayoutApp";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addBook, removeBook } from "@/store/slices/bookSlice";
import { useRouter } from "next/router";
import DeleteDialog from "@/components/DeleteDialog";
import { Book } from "@prisma/client";

export default function BooksPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { books } = useAppSelector((state) => state.books);

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

    const res = await fetch("/api/books", {
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
      const res = await fetch(`/api/books?id=${bookToDelete}`, {
        method: "DELETE",
      });

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
      const response = await fetch(`/api/books/${book.id}/download`, {
        method: "GET",
      });

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
    <LayoutApp>
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
              label="Name"
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
              maxHeight: "400px", // Set a fixed height for the table container
              overflowY: "auto", // Enable vertical scrolling
              border: "1px solid #ccc", // Optional: Add a border for better visibility
              borderRadius: "4px", // Optional: Add rounded corners
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Book ID</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Available</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Generate Book QR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.bookID}</TableCell>

                    <TableCell>
                      <img
                        src={book.imageUrl as string}
                        alt={book.name}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                    </TableCell>
                    <TableCell>{book.name}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell>
                      {book.isAvailable ? "Yes" : "Borrowed"}{" "}
                      {/* Display availability */}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleUpdateBook(book.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setOpenDelete(true);
                          setBookToDelete(book.id);
                        }}
                      >
                        Delete
                      </Button>
                      <DeleteDialog
                        openDelete={openDelete}
                        setOpenDelete={setOpenDelete}
                        title="Delete Book"
                        context="Are You Sure? You want to delete this book"
                        handleDelete={handleDeleteBook}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => handleDownloadBookCard(book)}
                      >
                        Generate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </main>
    </LayoutApp>
  );
}
