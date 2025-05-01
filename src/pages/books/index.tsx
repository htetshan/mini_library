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
  const { transactions } = useAppSelector((state) => state.transactions);
  const { members } = useAppSelector((state) => state.members);

  const [newBook, setNewBook] = useState({
    name: "",
    author: "",
    category: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    author: "",
    category: "",
  });
  const [fileError, setFileError] = useState<string>("");

  const validateName = (name: string) => {
    return name.trim().length >= 1; // Name must be at least 3 characters long
  };

  const validateAuthor = (author: string) => {
    return author.trim().length >= 1; // Name must be at least 3 characters long
  };

  const validateCategory = (category: string) => {
    return category.trim().length >= 1; // Name must be at least 3 characters long
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);

  const handleAddBook = async () => {
    let isValid = true as boolean;

    // Validate name
    if (!validateName(newBook.name)) {
      setErrors((prev) => ({
        ...prev,
        name: "Name is required",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }

    // Validate author
    if (!validateAuthor(newBook.author)) {
      setErrors((prev) => ({
        ...prev,
        author: "Author Name is required",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, author: "" }));
    }

    // Validate category
    if (!validateCategory(newBook.category)) {
      setErrors((prev) => ({
        ...prev,
        category: "Category Name is required",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
    // Validate file input
    if (!selectedFile) {
      setFileError("File is required");
      isValid = false;
    } else {
      setFileError("");
    }

    if (isValid) {
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
              error={!!errors.name}
              helperText={errors.name}
              onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
            />
            <TextField
              label="Author"
              variant="outlined"
              value={newBook.author}
              error={!!errors.author}
              helperText={errors.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
            />
            <TextField
              label="Category"
              variant="outlined"
              value={newBook.category}
              error={!!errors.category}
              helperText={errors.category}
              onChange={(e) =>
                setNewBook({ ...newBook, category: e.target.value })
              }
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              {fileError && (
                <Typography variant="body2" color="error">
                  {fileError}
                </Typography>
              )}
            </Box>
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
                    {book.isAvailable
                      ? "Available"
                      : `Borrowed by ${
                          members.find(
                            (ele) => ele.id === book.borrowedMemberID
                          )?.name
                        }`}
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
