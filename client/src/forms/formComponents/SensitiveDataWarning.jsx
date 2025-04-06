import { Typography } from "@mui/joy";

const SensitiveDataWarning = () => {
  return (
    <Typography
      variant="body2"
      color="gray"
      sx={{ mb: 1, mt: 2, fontStyle: "italic", fontSize: "0.75rem" }}
    >
      Please do not enter real data as this is an open project accessible to
      everyone.
    </Typography>
  );
};

export default SensitiveDataWarning;
