import React from "react";
import { AppBar, Toolbar, Container, Typography } from "@mui/material";
import styles from "./Header.module.css";

interface NavbarProps {
  title: string;
}

export const Header: React.FC<NavbarProps> = ({ title }) => {
  return (
    <AppBar>
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Typography sx={styles}>{title}</Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
