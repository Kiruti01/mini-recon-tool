  import React, { useState } from "react";
  import Papa from "papaparse";
  import { saveAs } from "file-saver";

  function App() {
    const [internalData, setInternalData] = useState([]);
    const [providerData, setProviderData] = useState([]);
    const [matched, setMatched] = useState([]);
    const [internalOnly, setInternalOnly] = useState([]);
    const [providerOnly, setProviderOnly] = useState([]);
    const [ready, setReady] = useState(false);

    const handleFileUpload = (e, setDataFn) => {
      const file = e.target.files[0];
      if (!file) return;
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setDataFn(results.data);
        },
      });
    };

    const convertToCSV = (objArray) => {
      const array =
        typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
      if (array.length === 0) return "";

      const keys = Object.keys(array[0]);
      const result = [keys.join(",")];

      array.forEach((obj) => {
        const row = keys.map(
          (key) => `"${(obj[key] || "").toString().replace(/"/g, '""')}"`
        );
        result.push(row.join(","));
      });

      return result.join("\n");
    };

    const exportCSV = (data, filename) => {
      const csv = convertToCSV(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, filename);
    };

    const reconcile = () => {
      const matchedTemp = [];
      const internalOnlyTemp = [];
      const providerOnlyTemp = [];

      const providerMap = new Map();
      providerData.forEach((txn) => {
        providerMap.set(txn.transaction_reference, txn);
      });

      internalData.forEach((txn) => {
        const match = providerMap.get(txn.transaction_reference);
        if (match) {
          matchedTemp.push({
            ...txn,
            provider_amount: match.amount,
            provider_status: match.status,
          });
          providerMap.delete(txn.transaction_reference);
        } else {
          internalOnlyTemp.push(txn);
        }
      });

      providerMap.forEach((txn) => {
        providerOnlyTemp.push(txn);
      });

      setMatched(matchedTemp);
      setInternalOnly(internalOnlyTemp);
      setProviderOnly(providerOnlyTemp);
      setReady(true);
    };

    const tableStyle = {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "1rem",
      marginBottom: "1rem",
    };

    const exportBtnStyle = {
      marginBottom: "0.5rem",
      padding: "0.4rem 0.8rem",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    };

    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
          Mini Reconciliation Tool
        </h1>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
            Upload Internal CSV:
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileUpload(e, setInternalData)}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
            Upload Provider CSV:
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileUpload(e, setProviderData)}
          />
        </div>

        <button
          onClick={reconcile}
          disabled={!internalData.length || !providerData.length}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reconcile
        </button>

        {ready && (
          <div style={{ marginTop: "2rem" }}>
            {/* Matched Transactions */}
            <section style={{ marginBottom: "2rem" }}>
              <h2>Matched Transactions ({matched.length})</h2>
              <button
                onClick={() => exportCSV(matched, "matched.csv")}
                style={exportBtnStyle}
              >
                Export
              </button>
              <table style={tableStyle} border="1">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Internal Amount</th>
                    <th>Provider Amount</th>
                    <th>Internal Status</th>
                    <th>Provider Status</th>
                  </tr>
                </thead>
                <tbody>
                  {matched.map((txn, i) => {
                    const amountMismatch = txn.amount !== txn.provider_amount;
                    const statusMismatch = txn.status !== txn.provider_status;
                    return (
                      <tr
                        key={i}
                        style={{
                          backgroundColor:
                            amountMismatch || statusMismatch
                              ? "#fff3cd"
                              : "#e2f0d9",
                        }}
                      >
                        <td>{txn.transaction_reference}</td>
                        <td>{txn.amount}</td>
                        <td>{txn.provider_amount}</td>
                        <td>{txn.status}</td>
                        <td>{txn.provider_status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>

            {/* Internal Only */}
            <section style={{ marginBottom: "2rem" }}>
              <h2>Internal Only Transactions ({internalOnly.length})</h2>
              <button
                onClick={() => exportCSV(internalOnly, "internal_only.csv")}
                style={exportBtnStyle}
              >
                Export
              </button>
              <table style={tableStyle} border="1">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {internalOnly.map((txn, i) => (
                    <tr key={i}>
                      <td>{txn.transaction_reference}</td>
                      <td>{txn.amount}</td>
                      <td>{txn.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Provider Only */}
            <section>
              <h2>Provider Only Transactions ({providerOnly.length})</h2>
              <button
                onClick={() => exportCSV(providerOnly, "provider_only.csv")}
                style={exportBtnStyle}
              >
                Export
              </button>
              <table style={tableStyle} border="1">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {providerOnly.map((txn, i) => (
                    <tr key={i}>
                      <td>{txn.transaction_reference}</td>
                      <td>{txn.amount}</td>
                      <td>{txn.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </div>
    );
  }

  export default App;
