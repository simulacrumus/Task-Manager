import { Checkbox, FormControlLabel } from "@mui/material";

interface LabeledCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          onChange={onChange}
          edge="start"
          checked={checked}
          tabIndex={-1}
        />
      }
      label={label}
    />
  );
};
