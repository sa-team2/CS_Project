import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import { SignOutAltIcon, UploadIcon } from '@patternfly/react-icons';
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, where } from "firebase/firestore"; // Firebase Firestore
import "./AdminPreview.css";
import { Modal } from "react-bootstrap";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const headCells = [
  {
    id: "FraudResult",
    numeric: true,
    disablePadding: false,
    label: "FraudResult",
    sortable: false,
  },
  {
    id: "MatchKeyword",
    numeric: true,
    disablePadding: false,
    label: "MatchKeyword",
    sortable: false,
  },
  {
    id: "MatchType",
    numeric: true,
    disablePadding: false,
    label: "MatchType",
    sortable: false,
  },
  {
    id: "FraudRate",
    numeric: true,
    disablePadding: false,
    label: "FraudRate",
    sortable: true,
  },
  {
    id: "Stars",
    numeric: true,
    disablePadding: false,
    label: "Stars",
    sortable: false,
  },
];

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => {
        // Ensure both values are treated as numbers
        const aValue =
          orderBy === "FraudRate" ? Number(a[orderBy]) : a[orderBy];
        const bValue =
          orderBy === "FraudRate" ? Number(b[orderBy]) : b[orderBy];
        return bValue < aValue ? -1 : 1;
      }
    : (a, b) => {
        const aValue =
          orderBy === "FraudRate" ? Number(a[orderBy]) : a[orderBy];
        const bValue =
          orderBy === "FraudRate" ? Number(b[orderBy]) : b[orderBy];
        return aValue < bValue ? -1 : 1;
      };
};

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    // 只允許 FraudRate 進行排序
    if (property === "FraudRate") {
      onRequestSort(event, property);
    }
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              disabled={!headCell.sortable}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  openUpdateModal: PropTypes.func.isRequired,
  openDeleteModal: PropTypes.func.isRequired,
  handleOpenFilter: PropTypes.func.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, openUpdateModal, openDeleteModal, handleOpenFilter } = props;




  return (
    <>
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          已選擇 {numSelected} 筆
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          預覽畫面
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          <Tooltip title="更新 Update">
            <IconButton onClick={openUpdateModal}>
              <CloudUploadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="刪除 Delete">
            <IconButton onClick={openDeleteModal}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="篩選 Filter">
          <IconButton onClick={handleOpenFilter}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
    </>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleOpenFilter: PropTypes.func.isRequired,
};

export default function AdminPreview() {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("FraudRate");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [show, setShow] = useState(false);
  const [matchedData, setMatchedData] = useState([]);
  const [unmatchedData, setUnmatchedData] = useState([]);
  const [openFilter, setOpenFiter] = useState(false);
  const [selectedStar, setSelectedStar] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openUpdateModal = () => setIsUpdateModalOpen(true);

  const openDeleteModal = () => setIsDeleteModalOpen(true);

  const closeReturnModal = () => {
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleChange = (event) => {
    const star = event.target.value;
    setSelectedStar((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  useEffect(() => {
    console.log("selectedStar inside useEffect:", selectedStar);  // Check what value it has
  
    const fetchData = async () => {
      let q;
  
      if (!Array.isArray(selectedStar) || selectedStar.length === 0) {
        q = collection(db, "Outcome");  // No filter applied here
      } else {
        // Filter based on selectedStars
        q = query(
          collection(db, "Outcome"),
          where("Stars", "in", selectedStar.map(star => parseInt(star)))  // Use the "in" operator to match multiple values
        );
      }
  
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        FraudRate: doc.data().PythonResult?.FraudRate || 0,
        FraudResult: doc.data().PythonResult?.FraudResult || "",
        Match: doc.data().PythonResult?.Match || [],
      }));
  
      console.log("Fetched data:", data); // Check the data
      setRows(data);
    };
  
    fetchData();
  }, [selectedStar]);
  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    console.log(`Order: ${isAsc ? "desc" : "asc"}, Order By: ${property}`);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    setOpenFiter(false)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows] // Ensure rows is included in dependencies
  );

  const handleUpdate = async () => {
    try {
      // Step 1: 從 FraudDefine collection 中抓取資料
      const fraudDefineSnapshot = await getDocs(collection(db, "FraudDefine"));
      const fraudDefineKeywords = fraudDefineSnapshot.docs.map(
        (doc) => doc.data().Keyword
      );

      // Step 2: 比對 Outcome 的 MatchKeyword 和 FraudDefine 的 Keyword
      const matched = [];
      const unmatched = [];

      const selectedRows = rows.filter(row => selected.includes(row.id));

      for (const row of selectedRows) {
        const same = row.Match.filter((matchItem) =>
          fraudDefineKeywords.includes(matchItem.MatchKeyword)
        );
        if (same.length > 0) {
          matched.push({ ...row, Match: same });
        }

        const updatedMatches = row.Match.filter((matchItem) => {
          return !fraudDefineKeywords.includes(matchItem.MatchKeyword);
        });

        if (updatedMatches.length === 0) {
          // 如果所有 Match 都匹配到了 FraudDefine，刪除該筆資料
          await deleteDoc(doc(db, "Outcome", row.id));
        } else {
          // 如果有未匹配到的項目，更新剩下的 Match
          await updateDoc(doc(db, "Outcome", row.id), {
            "PythonResult.Match": updatedMatches,
          });
          unmatched.push({ ...row, Match: updatedMatches });
        }
      }

      console.log(matched);
      console.log(unmatched);

      setMatchedData(matched);
      setUnmatchedData(unmatched);

      if (unmatched.length > 0 || matched.length > 0) {
        const combinedData = [...unmatched, ...matched]; // 合併 unmatchedData 和 matchedData
        await Promise.all(
          combinedData.map(async (row) => {
            for (const matchItem of row.Match) {
              console.log("FraudType:", matchItem.MatchType);

              if (!fraudDefineKeywords.includes(matchItem.MatchKeyword)) {
                await addDoc(collection(db, "FraudDefine"), {
                  Keyword: matchItem.MatchKeyword,
                  Type: matchItem.MatchType || "未知",
                  Result: row.FraudResult === "詐騙" ? true : false,
                });
              }
            }
            // 新增完 `FraudDefine` 後刪除在 `Outcome`的資料
            await deleteDoc(doc(db, "Outcome", row.id));
          })
        );
      }
      const remainingRows = rows.filter(row => !selected.includes(row.id));
      setRows(remainingRows); 

      setShow(true);
      closeReturnModal();
      setSelected([]);
      setOpenFiter(false);
      setSelectedStar([]);
    } catch (error) {
      console.error("資料比對時發生錯誤: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selected.map(async (id) => {
          await deleteDoc(doc(db, "Outcome", id));
        })
      );
      setRows((prevRows) =>
        prevRows.filter((row) => !selected.includes(row.id))
      );
      setSelected([]);
      console.log("刪除成功");
    } catch (error) {
      console.error("刪除失敗: ", error);
    }

    closeReturnModal();
    setSelectedStar([]);
  };

  const handleClose = () => {
    setShow(false);
    setMatchedData([]);
    setUnmatchedData([]);
  };

  const handleOpenFilter = (event) => {
    if (openFilter === false) 
      setOpenFiter(true);
    else 
      setOpenFiter(false)
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <div style={{position:'relative'}}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            openUpdateModal={openUpdateModal}
            openDeleteModal={openDeleteModal}
            handleOpenFilter={handleOpenFilter}
          />
          {openFilter && (
            <div style={{position:'absolute', right:'40px', top:'13px'}}>
              {["1", "2", "3", "4", "5"].map((value) => (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      checked={selectedStar.includes(value)}
                      onChange={handleChange}
                      value={value}
                      icon={<RadioButtonUncheckedIcon sx={{ color: "gray", fontSize: "20px" }}/>}
                      checkedIcon={<RadioButtonCheckedIcon sx={{ color: "white", fontSize: "20px" }}/>}
                    />
                  }
                  label={
                    <Typography sx={{ color: selectedStar.includes(value) ? "white" : "gray" }}>
                      {value}
                    </Typography>
                  }
                />
              ))}   
            </div>
          )}
          </div>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = selected.indexOf(row.id) !== -1;
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const matchKeywords = row.Match.map(
                    (matchItem) => matchItem.MatchKeyword
                  ).join(", ");
                  const matchTypes = row.Match.length > 0 ? "可疑" : "";

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          onClick={(event) => handleClick(event, row.id)}
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">{row.FraudResult}</TableCell>
                      <TableCell align="right">{matchKeywords}</TableCell>
                      <TableCell align="right">{matchTypes}</TableCell>
                      <TableCell align="right">
                        {row.FraudResult !== "詐騙" ? "" : row.FraudRate}
                      </TableCell>
                      <TableCell align="right">{row.Stars}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="顯示筆數："
            labelDisplayedRows={({ from, to, count }) =>
              `第 ${from} 至 ${to} 筆，共 ${count} 筆`
            }
          />
        </Paper>
      </Box>

      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <b>更新結果：</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className="adminpreview-updatecheck">重複：</p>
            <div>
              {matchedData.length > 0 ? (
                matchedData
                  .map((item) =>
                    item.Match.map((match) => match.MatchKeyword).join(", ")
                  )
                  .join(", ")
              ) : (
                <p>無關鍵字重複</p>
              )}
            </div>
          </div>
          <div>
            <p className="adminpreview-updatecheck updatecheck-mt">更新：</p>
            <div>
              {unmatchedData.length > 0 ? (
                unmatchedData
                  .map((item) =>
                    item.Match.map((match) => match.MatchKeyword).join(", ")
                  )
                  .join(", ")
              ) : (
                <p>無關鍵字被更新</p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="adminpreview-updatecheck-confirm"
            onClick={handleClose}
          >
            確認
          </Button>
        </Modal.Footer>
      </Modal>
      {(isUpdateModalOpen || isDeleteModalOpen) && ( 
        <div className="m-overlay">
          <div className="m-content">
            {isUpdateModalOpen ? (
              <CloudUploadIcon style={{ fontSize: '80px', marginTop: '35px', scale: '1.5'}} />
            ) : (
              <DeleteIcon style={{ fontSize: '80px', marginTop: '35px', scale: '1.5' }} />
            )}
            <h4 className="m-title">
              {isUpdateModalOpen ? '是否確定要更新？' : '是否確定要刪除？'}
            </h4>
            <div className="admin-col-area">
              <button className="admin-enter" onClick={isUpdateModalOpen ? handleUpdate : handleDelete}>確認</button>
              <button className="admin-jumps" onClick={closeReturnModal}>取消</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
