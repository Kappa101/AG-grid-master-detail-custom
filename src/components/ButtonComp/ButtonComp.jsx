import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useState } from "react";
import "ag-grid-enterprise";

export const ButtonComp = (p) => {
  const handleActionClick = (params, value) => {
    // value === "approve"
    //   ? (params.data.approvalStatus = "approved")
    //   : value === "reject"
    //   ? (params.data.approvalStatus = "reject")
    //   : "";

    if (value === "approve") {
      params.data["approvalStatus"] = "approve";
    }

    console.log(params.api.context);
    console.log("params", params.data);
  };
  console.log(p);
  const [disabled, setDisabled] = useState(false);
  return (
    <div>
      <Button
        disabled={disabled}
        onClick={() => {
          handleActionClick(p, "approve");
          setDisabled(true);
        }}
        variant="contained"
      >
        Approve
      </Button>
      <Button variant="outlined">Reject</Button>
    </div>
  );
};
