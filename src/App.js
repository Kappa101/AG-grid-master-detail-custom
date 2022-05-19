import React, { useCallback, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import { ButtonComp } from "../src/components/ButtonComp/ButtonComp";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

var myIcons = {
  sortAscending: function () {
    return "ASC";
  },
  sortDescending: function () {
    return "DESC";
  },
};

const App = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100vh", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    // group cell renderer needed for expand / collapse icons
    {
      field: "name",
      cellRenderer: "agGroupCellRenderer",
      icons: {
        sortAscending: '<i class="fa fa-sort-alpha-up"/>',
        sortDescending: '<i class="fa fa-sort-alpha-down"/>',
      },
    },
    { field: "account" },
    { field: "calls" },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
    { field: "action", cellRenderer: ButtonComp },
    {
      field: "approvalStatus",
      cellStyle: (params) => {
        if (params.value === "approve") {
          return { color: "red", backgroundColor: "green" };
        }
        return null;
      },
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);

  const getRowId = useCallback(function (params) {
    return params.data.account;
  }, []);

  const detailCellRendererParams = useMemo(() => {
    return {
      refreshStrategy: "rows",
      detailGridOptions: {
        pagination: true,
        paginationAutoPageSize: true,
        getRowId: function (params) {
          return params.data.callId;
        },
        columnDefs: [
          { field: "callId" },
          { field: "direction" },
          { field: "number", minWidth: 150 },
          { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
          { field: "switchCode", minWidth: 150 },
        ],
        defaultColDef: {
          flex: 1,
        },
      },
      getDetailRowData: function (params) {
        params.successCallback(params.data.callRecords);
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
      .then((resp) => resp.json())
      .then((data) => {
        setRowData(data);
      });
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    // arbitrarily expand a row for presentational purposes
    setTimeout(function () {
      gridRef.current.api.getDisplayedRowAtIndex(1).setExpanded(true);
    }, 0);
  }, []);

  return (
    <div style={containerStyle}>
      <h1>Hello world</h1>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          getRowId={getRowId}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          masterDetail={true}
          detailCellRendererParams={detailCellRendererParams}
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default App;
