import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const InputField = ({ id, name, label, value, type, onChange }) => {
  return (
    <TextField
      id={id}
      name={name}
      label={label}
      variant="outlined"
      value={value}
      type={type}
      onChange={onChange}
    />
  );
};

InputField.defaultProps = {
  type: "text",
  onChange: () => {}
};

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func
};

export default InputField;
