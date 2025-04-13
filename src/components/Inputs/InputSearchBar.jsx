import React, { useMemo } from "react";
import { Search } from "@mui/icons-material";
import { Box, InputBase, styled } from "@mui/material";
import { searchUser } from "../../services";
import { debounce } from "lodash";
const InputSearchBar = ({ handleSearch}) => {


  return (
    <SearchWrapper>
      <StyledInputBase
        onChange={handleSearch}
        placeholder={"Search....."}
        inputProps={{ "aria-label": "search" }}
      />
      <SearchIconWrapper>
        <Search fontSize="small" sx={{ color: "#616161" }} />
      </SearchIconWrapper>
    </SearchWrapper>
  );
};

export default InputSearchBar;

const SearchWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#F5F5F5",
  borderRadius: "20px",
  height: "35px",
  paddingLeft: "20px",
  maxWidth: "100%",
  boxShadow: "inset 0px 4px 6px rgba(0, 0, 0, 0.13)",
});

const SearchIconWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "10px",
});

const StyledInputBase = styled(InputBase)({
  flex: 1,
  fontSize: "16px",
  color: "black",
  fontFamily: '"Nunito Sans", sans-serif',
  "&::placeholder": {
    color: "#616161",
    opacity: 1,
  },
});
