import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import styles from "./LoadingBar.module.css";
import { DEFAULT_LOADIING_TEXT, TEXT_VARIANT } from "./LoadingBar.constants";

interface LoadingBarProps {
  text?: string;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ text }) => {
  return (
    <Box className={styles.loadingBar}>
      <Typography variant={TEXT_VARIANT}>
        {text ?? DEFAULT_LOADIING_TEXT}
      </Typography>
      <LinearProgress />
    </Box>
  );
};
