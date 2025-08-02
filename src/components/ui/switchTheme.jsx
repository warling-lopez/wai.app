"use client";

import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useTheme } from "@/hooks/useTheme";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 60,
  height: 33,
  padding: 4,
  "& .MuiSwitch-switchBase": {
    margin: 2,
    padding: 0,
    transform: "translateX(0px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(25px)",
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 30,
    height: 30,
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 10,
  },
}));

function SwitchTheme() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const handleChange = (event) => {
    setTheme(event.target.checked ? "dark" : "light");
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <MaterialUISwitch
            checked={isDark}
            onChange={handleChange}
            sx={{ m: 1 }}
          />
        }
        label=""
      />
    </FormGroup>
  );
}

export default SwitchTheme;
