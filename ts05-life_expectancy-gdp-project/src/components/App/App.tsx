import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import ChartComponent from "../ChartComponent";
import MyAppBar from "../MyAppBar";

export default function App() {
  return (
    <div>
      <CssBaseline />
      <Container maxWidth="xl">
        <MyAppBar />
        <ChartComponent />
      </Container>
    </div>
  );
}
