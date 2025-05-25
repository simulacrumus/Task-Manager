import * as React from "react";
import styles from "./Modal.module.css";
import { MODAL_BACKGROUND_COLOR } from "./Modal.constants";
import Box from "@mui/material/Box";
import { Modal as MUIModal } from "@mui/material";

interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, open, onClose }) => {
  return (
    <MUIModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        className={styles.modal}
        sx={{ backgroundColor: MODAL_BACKGROUND_COLOR }}
      >
        {children}
      </Box>
    </MUIModal>
  );
};
