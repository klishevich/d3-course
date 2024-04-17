import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import UpdatePattern from "../UpdatePattern";
import MyAppBar from "../MyAppBar";

export default function App() {
  return (
    <div>
      <CssBaseline />
      <Container maxWidth="xl">
        <MyAppBar />
        <UpdatePattern />
      </Container>
    </div>
  );
}
