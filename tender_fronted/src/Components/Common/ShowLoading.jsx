import PropTypes from 'prop-types';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function ShowLoading(props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      m={4}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "500",
        }}
        m={2}
      >
        {props.message}
      </Box>
      <CircularProgress />
    </Box>
  );
}

ShowLoading.prototype = {
  message: PropTypes.string.isRequired
}
