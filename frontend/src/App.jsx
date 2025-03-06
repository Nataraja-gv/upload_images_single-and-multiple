import { useEffect, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import { Stack, styled } from "@mui/system";
import axios from "axios";

const Input = styled("input")({
  display: "none",
});

function App() {
  const [file, setFile] = useState(null);
  const [multiFile, setMultiFile] = useState([]);
  const [multiSelected, setMultiSelected] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleMultiFileChange = (event) => {
    const files = Array.from(event.target.files);
    setMultiFile(files);
  };

  const uploadImage = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:7777/upload_image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Uploaded image ID:", res.data.imageId);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const uploadMultiImage = async () => {
    if (multiFile.length === 0) {
      console.log("No files selected");
      return;
    }

    const formData = new FormData();
    multiFile.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await axios.post(
        "http://localhost:7777/multi/upload_image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Uploaded image IDs:", res.data.imageIds);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const fetchMultiimages = async () => {
    try {
      const res = await axios.get("http://localhost:7777/multi/all");
      setMultiSelected(res?.data?.data);
    } catch (error) {
      console.log("Error" + error.message);
    }
  };

  useEffect(() => {
    fetchMultiimages();
  }, []);
  console.log(multiSelected, "multiSelected");
  return (
    <>
      <Stack
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          File Upload for Single Image
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label htmlFor="single-file-upload">
            <Input
              id="single-file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <Button variant="contained" component="span" sx={{ mb: 2 }}>
              Choose File
            </Button>
          </label>
          {file && (
            <Typography variant="body1" sx={{ mt: 1, fontStyle: "italic" }}>
              Selected File: {file.name}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={uploadImage}
          >
            Upload
          </Button>
        </Box>

        <Typography variant="h4" sx={{ mt: 5 }} gutterBottom>
          File Upload for Multiple Images
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label htmlFor="multi-file-upload">
            <Input
              id="multi-file-upload"
              type="file"
              multiple
              onChange={handleMultiFileChange}
            />
            <Button variant="contained" component="span" sx={{ mb: 2 }}>
              Choose Files
            </Button>
          </label>
          {multiFile.length > 0 && (
            <Typography variant="body1" sx={{ mt: 1, fontStyle: "italic" }}>
              Selected Files: {multiFile.map((file) => file.name).join(", ")}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={uploadMultiImage}
          >
            Upload
          </Button>
        </Box>
        <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {multiSelected.length > 0 ? (
            multiSelected.flatMap(
              (item) =>
                item?.images?.map((img) => (
                  <img
                    key={img._id}
                    src={`http://localhost:7777/${img.path}`}
                    alt="Uploaded"
                    width="150px"
                    height="150px"
                  />
                )) || []
            )
          ) : (
            <Typography>No images uploaded yet.</Typography>
          )}
        </Box>
      </Stack>
    </>
  );
}

export default App;
