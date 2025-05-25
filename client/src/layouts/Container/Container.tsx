import React from "react";
import styles from "./Container.module.css";
import { MAX_WIDTH } from "./Container.constants";
import { Container as MuiContainer } from "@mui/material";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <MuiContainer maxWidth={MAX_WIDTH} className={styles.container}>
      {children}
    </MuiContainer>
  );
};
