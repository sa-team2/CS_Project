import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
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
import FactCheckIcon from '@mui/icons-material/FactCheck';
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit"; // 導入編輯圖標
import CloseIcon from "@mui/icons-material/Close"; // 導入關閉圖標
import { visuallyHidden } from "@mui/utils";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, where, getDoc, serverTimestamp } from "firebase/firestore"; // Firebase Firestore
import "./AdminPreview.css";
import { Modal } from "react-bootstrap";
import TextField from "@mui/material/TextField"; // 導入TextField用於編輯


// 此行添加一個全局樣式來修正翻頁按鈕顏色
const globalStyle = document.createElement('style');
globalStyle.innerHTML = `
  .MuiTablePagination-root .MuiIconButton-root, 
  .MuiTablePagination-root .MuiIconButton-root .MuiSvgIcon-root {
    color: white !important;
    fill: white !important;
  }
  .MuiTableCell-root {
    padding: 8px 10px !important;
  }
`;
document.head.appendChild(globalStyle);

// Updated headCells to include fields from Report table and remove Stars
const headCells = [
  {
    id: "Report",
    numeric: false,
    disablePadding: false,
    label: "Report",
    sortable: false,
  },
  {
    id: "Source",
    numeric: false,
    disablePadding: false,
    label: "Source",
    sortable: false,
  },
  {
    id: "AddNote",
    numeric: false,
    disablePadding: false,
    label: "AddNote",
    sortable: false,
  },
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
            inputProps={{
              "aria-label": "select all desserts",
            }}
            style={{ display: 'none' }} // 隱藏全選鍵
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            className="MuiTableCell-root MuiTableCell-head MuiTableCell-alignRight MuiTableCell-sizeMedium css-to33az-MuiTableCell-root"
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              disabled={!headCell.sortable}
              className={orderBy === headCell.id 
                ? "MuiButtonBase-root MuiTableSortLabel-root Mui-active MuiTableSortLabel-directionDesc css-7x9vt0-MuiButtonBase-root-MuiTableSortLabel-root" 
                : "MuiButtonBase-root MuiTableSortLabel-root MuiTableSortLabel-directionAsc css-7x9vt0-MuiButtonBase-root-MuiTableSortLabel-root"}
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
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, openUpdateModal, openDeleteModal, handleCheckFraud, openEditModal } = props;

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
      ]} className="toolbar"
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
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          <Tooltip title="詐騙檢測 Fraud Check">
            <IconButton onClick={handleCheckFraud} style={{color:'white'}}>
              <FactCheckIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="編輯 Edit">
            <IconButton onClick={openEditModal} style={{color:'white'}}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="更新 Update">
            <IconButton onClick={openUpdateModal} style={{color:'white'}}>
              <CloudUploadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="刪除 Delete">
            <IconButton onClick={openDeleteModal} style={{color:'white'}}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : null}
    </Toolbar>
    </>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  openUpdateModal: PropTypes.func.isRequired,
  openDeleteModal: PropTypes.func.isRequired,
  handleCheckFraud: PropTypes.func.isRequired,
  openEditModal: PropTypes.func.isRequired,
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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFraudCheckModalOpen, setIsFraudCheckModalOpen] = useState(false);
  const [fraudCheckResult, setFraudCheckResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const [editData, setEditData] = useState({
    Report: "",
    Source: "",
    AddNote: "",
    FraudResult: "",
    MatchKeyword: "",
    MatchType: "",
    FraudRate: ""
  });

  const openUpdateModal = () => setIsUpdateModalOpen(true);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const openFraudCheckModal = () => setIsFraudCheckModalOpen(true);
  const openEditModal = () => {
    // 取得選中的行資料
    if (selected.length > 0) {
      const selectedRow = rows.find(row => row.id === selected[0]);
      if (selectedRow) {
        setEditData({
          Report: selectedRow.Report || "",
          Source: selectedRow.Source || "",
          AddNote: selectedRow.AddNote || "",
          FraudResult: selectedRow.FraudResult || "",
          MatchKeyword: selectedRow.MatchKeyword || "",
          MatchType: selectedRow.MatchType || "",
          FraudRate: selectedRow.FraudRate || ""
        });
        setIsEditModalOpen(true);
      }
    }
  };

  const closeReturnModal = () => {
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsFraudCheckModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleCloseCheck = () => {
    // 取消進行中的檢測請求
    if (abortController) {
      abortController.abort();
    }
    setIsLoading(false);
    closeReturnModal();
  };

  // 處理編輯資料變更
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 提交編輯的資料
  const handleEditSubmit = async () => {
    try {
      if (selected.length === 0) {
        console.error("未選擇任何資料");
        return;
      }

      const selectedId = selected[0];
      const reportRef = doc(db, "Report", selectedId);

      // 準備更新的資料
      const updateData = {
        Report: editData.Report,
        Source: editData.Source,
        AddNote: editData.AddNote
      };

      // 如果有PythonResult相關資料，則更新它們
      if (editData.FraudResult || editData.FraudRate || editData.MatchKeyword || editData.MatchType) {
        // 將MatchKeyword和MatchType轉換為Match陣列
        const matchKeywords = editData.MatchKeyword.split(',').map(k => k.trim()).filter(k => k);
        const matchTypes = editData.MatchType.split(',').map(t => t.trim()).filter(t => t);
        
        // 確保陣列長度一致
        const maxLength = Math.max(matchKeywords.length, matchTypes.length);
        const matches = [];
        
        for (let i = 0; i < maxLength; i++) {
          matches.push({
            MatchKeyword: matchKeywords[i] || "",
            MatchType: matchTypes[i] || "未知"
          });
        }

        updateData.PythonResult = {
          FraudResult: editData.FraudResult,
          FraudRate: parseFloat(editData.FraudRate) || 0,
          Match: matches
        };
      }

      // 更新Firebase
      await updateDoc(reportRef, updateData);
      
      // 更新本地狀態
      setRows(prevRows => prevRows.map(row => {
        if (row.id === selectedId) {
          return {
            ...row,
            ...editData,
            Match: updateData.PythonResult?.Match || row.Match
          };
        }
        return row;
      }));

      console.log("更新成功");
      closeReturnModal();
    } catch (error) {
      console.error("更新失敗:", error);
      alert(`更新失敗: ${error.message}`);
    }
  };

// Function to handle fraud check
const handleCheckFraud = async () => {
  try {
    // 創建 AbortController 以便後續可取消請求
    const controller = new AbortController();
    setAbortController(controller);
    
    // 開始加載
    openFraudCheckModal();
    setIsLoading(true);
    
    // 獲取選中的行
    const selectedRows = rows.filter(row => selected.includes(row.id));
    
    if (selectedRows.length === 0) {
      console.error("No rows selected");
      setIsLoading(false);
      closeReturnModal();
      return;
    }
    
    // 準備要傳送的數據，包含完整報告內容
    const reportsData = selectedRows.map(row => ({
      id: row.id,
      text: row.Report || ""
    }));
    
    // 直接調用 Flask 後端
    const response = await fetch('http://localhost:5000/process_report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reports: reportsData
      }),
      signal: controller.signal // 添加 signal 以支持取消請求
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Fraud check results:", data);
    
    // 更新行數據
    const updatedRows = [...rows];
    
    for (const result of data.results) {
      if (result.status === 'success') {
        const rowIndex = updatedRows.findIndex(r => r.id === result.id);
        
        if (rowIndex !== -1) {
          // 構建 MatchKeyword 和 MatchType 字符串
          const matchKeywords = result.matched_keywords.map(mk => mk.keyword || mk.MatchKeyword).join(', ');
          const matchTypes = result.matched_keywords.map(mk => mk.type || mk.MatchType).join(', ');
          
          // 更新行資料
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex],
            FraudResult: result.result,
            FraudRate: result.FraudRate,
            MatchKeyword: matchKeywords,
            MatchType: matchTypes,
            // 確保保留 Match 陣列供後續處理
            Match: result.matched_keywords.map(mk => ({
              MatchKeyword: mk.keyword || mk.MatchKeyword,
              MatchType: mk.type || mk.MatchType || "未知"
            }))
          };
        }
      } else {
        console.error(`處理報告 ${result.id} 失敗: ${result.message}`);
      }
    }
    // 更新狀態
    setRows(updatedRows);
    
  } catch (error) {
    // 檢查是否為取消請求的錯誤
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error("Error during fraud check:", error);
      alert("詐騙檢測失敗: " + error.message);
    }
  } finally {
    setIsLoading(false);
    closeReturnModal();
    setAbortController(null);
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the Report collection
        const reportCollection = collection(db, "Report");
        const reportSnapshot = await getDocs(reportCollection);
        
        // Process each Report document
        const reportData = [];
        
        for (const reportDoc of reportSnapshot.docs) {
          const data = reportDoc.data();
          
          // Get the FraudResult, MatchKeyword, MatchType, and FraudRate
          // These might be in different locations depending on your data structure
          let fraudResult = "";
          let matchKeywords = [];
          let matchTypes = [];
          let fraudRate = 0;
          let matches = [];
          
          // Check if the document has a PythonResult field
          if (data.PythonResult) {
            fraudResult = data.PythonResult.FraudResult || "";
            fraudRate = data.PythonResult.FraudRate || 0;
            
            if (data.PythonResult.Match && Array.isArray(data.PythonResult.Match)) {
              matches = data.PythonResult.Match;
              matchKeywords = data.PythonResult.Match.map(m => m.MatchKeyword || "");
              matchTypes = data.PythonResult.Match.map(m => m.MatchType || "");
            }
          }
          
          // Add the report data to our array
          reportData.push({
            id: reportDoc.id,
            Report: data.Report || "",
            Source: data.Source || "",
            AddNote: data.AddNote || "",
            FraudResult: fraudResult,
            MatchKeyword: matchKeywords.join(", "),
            MatchType: matchTypes.join(", "),
            FraudRate: fraudRate,
            Match: matches, // Keep the original Match array for processing
          });
        }
        
        console.log("Fetched Report data:", reportData);
        setRows(reportData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    console.log(`Order: ${isAsc ? "desc" : "asc"}, Order By: ${property}`);
  };

  // 修改點擊行為單選
  const handleClick = (event, id) => {
    // 如果已經選中了這個 ID，則取消選中
    if (selected.indexOf(id) !== -1) {
      setSelected([]);
    } else {
      // 否則，只選中這個 ID
      setSelected([id]);
    }
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


  /*更新finalStatistics，總筆數和最終的準確度
  但因為可能一次判斷成兩種類型，在總筆數我只算一次，
  但類型反而兩者都加，所以類型的總次數加起來不等於TotalDataCount*/

  const updateStatistics = async () => {
    const selectedIds = rows.filter((row) => selected.includes(row.id));
    console.log("選擇的行", selectedIds);
    const ids = selectedIds.map(item => item.id);

    try {
      // 確認是否有選擇的 ID
      if (!selectedIds || selectedIds.length === 0) {
        console.error("未選擇任何資料");
        return;
      }
      
      const ids = selectedIds.map(item => item.id);
      // 1. 讀取 Outcome 集合中符合 selectedIds 的文檔
      const outcomeCollectionRef = collection(db, 'Outcome');
      const selectedDocs = await Promise.all(
        ids.map(async (id) => {
          console.log(id)
          console.log("当前处理的 ID:", id, "类型:", typeof id);

          const docRef = doc(outcomeCollectionRef, id);
          const docSnapshot = await getDoc(docRef);
          return docSnapshot.exists() ? docSnapshot : null;
        })
      );
  
      // 篩選有效的文檔
      const validDocs = selectedDocs.filter((doc) => doc !== null);
      const newTotalDataCount = validDocs.length; // 只計算選中的有效文檔
  
      // 2. 讀取 Statistics 表中的 finalStatistics 文檔
      const statisticsRef = doc(db, 'Statistics', 'finalStatistics');
      const docSnapshot = await getDoc(statisticsRef);
  
      // 3. 獲取現有的 totalDataCount 和 finalAccuracy
      let currentTotalDataCount = 0;
      let currentFinalAccuracy = 0;
      if (docSnapshot.exists()) {
        currentTotalDataCount = docSnapshot.data().totalDataCount || 0; // 預設為 0
        currentFinalAccuracy = docSnapshot.data().finalAccuracy || 0; // 預設為 0
      }
  
      // 4. 計算選中文檔的總準確度
      let totalCalculatedAccuracy = 0;
      let recordCount = 0;
  
      validDocs.forEach((doc) => {
        const data = doc.data();
        const fraudRate = data.PythonResult?.FraudRate;
  
        if (fraudRate !== undefined) {
          let adjustedFraudRate;
          if ((fraudRate >= 50 && fraudRate <= 75) || (fraudRate >= 0 && fraudRate <= 25)) {
            adjustedFraudRate = 100 - fraudRate; // 調整後的 fraudRate
          } else {
            adjustedFraudRate = fraudRate;
          }
  
          const weightedAccuracy = adjustedFraudRate; // 不再使用星星評分
          totalCalculatedAccuracy += weightedAccuracy;
          recordCount++;
  
          // 調試輸出每筆資料的計算過程
          console.log(`Doc ID: ${doc.id}, FraudRate: ${fraudRate}`);
          console.log(`Adjusted FraudRate: ${adjustedFraudRate}`);
          console.log(`Weighted Accuracy for this doc: ${weightedAccuracy}`);
        }
      });
  
      // 5. 更新 totalDataCount，將舊的值和新的值加起來
      const updatedTotalDataCount = currentTotalDataCount + newTotalDataCount;
  
      // 計算新的 finalAccuracy (加權總準確度)
      const newFinalAccuracy = (currentFinalAccuracy * currentTotalDataCount + totalCalculatedAccuracy) / updatedTotalDataCount;
  
      // 6. 更新 Statistics 表中的 finalStatistics 文檔
      await updateDoc(statisticsRef, {
        totalDataCount: updatedTotalDataCount,
        finalAccuracy: newFinalAccuracy,
      });
  
      // 調試輸出最終結果
      console.log("當前 totalDataCount:", currentTotalDataCount);
      console.log("新的 totalDataCount:", newTotalDataCount);
      console.log("更新後 totalDataCount:", updatedTotalDataCount);
      console.log("當前 finalAccuracy:", currentFinalAccuracy);
      console.log("計算的總準確度:", totalCalculatedAccuracy);
      console.log("新的 finalAccuracy:", newFinalAccuracy);
    } catch (error) {
      console.error("統計未更新: ", error);
    }
  };
  
  /* 統計各類型出現次數，和最熱門詐騙類型*/
  const updatetopType = async () => {
    const selectedIds = rows.filter((row) => selected.includes(row.id));
    console.log("選擇的行", selectedIds);
    const matchTypeCount = selectedIds.flatMap(row =>
      row.Match.map(matchItem => matchItem.MatchType)
    );
    
    console.log("提取的 MatchType:", matchTypeCount);
    try {
      // 1. 讀取 Outcome 集合並初始化 MatchType 計數
      const outcomeCollection = await getDocs(collection(db, "Outcome"));
  
      // 2. 遍歷 Outcome 集合，提取 MatchType 並計算頻率
        outcomeCollection.forEach((doc) => {
          const data = doc.data();
          const matches = data.PythonResult?.Match || []; // 獲取 Match 陣列
    
          matches.forEach((match) => {
            const matchType = match.MatchType?.trim(); // 確保去除多餘空格
            if (matchType) {
              matchTypeCount[matchType] = (matchTypeCount[matchType] || 0) + 1;
            }
          });
        });
  
      // 3. 讀取 Statistics 集合
      const statisticsCollection = await getDocs(collection(db, "Statistics"));
  
      // 儲存最高頻率及對應類型
      let maxFrequency = 0;
      let maxFrequencyTypes = []; // 儲存所有最大頻率類型
  
      // 4. 更新 Statistics 中的 Frequency 並找到最大值
      for (const statDoc of statisticsCollection.docs) {
        const data = statDoc.data();
        const type = data.Type?.trim(); // 確保去除多餘空格
  
        console.log(`檢查文檔 ${statDoc.id} 的 Type 值: ${type}`);
  
        if (matchTypeCount[type]) {
          console.log(`找到匹配的 Type: ${type}`);
  
          // 累計更新 Frequency 值
          const updatedFrequency = (data.Frequency || 0) + matchTypeCount[type];
  
          const statisticsRef = doc(db, "Statistics", statDoc.id); // 獲取文檔引用
          await updateDoc(statisticsRef, { Frequency: updatedFrequency }); // 更新 Frequency
  
          console.log(`更新文檔 ${statDoc.id} 的 Frequency 成功，新的值為: ${updatedFrequency}`);
  
          // 更新最大頻率類型列表
          if (updatedFrequency > maxFrequency) {
            maxFrequency = updatedFrequency;
            maxFrequencyTypes = [type]; // 重置為新最大值的類型
          } else if (updatedFrequency === maxFrequency) {
            maxFrequencyTypes.push(type); // 添加到最大值類型列表
          }
        } else {
          console.warn(`Type: ${type} 未在 MatchType 中找到對應項`);
        }
      }
  
      console.log("統計類型頻率更新完成！");
  
      // 5. 返回所有最大頻率的類型
      if (maxFrequencyTypes.length > 0) {
        console.log(`最大頻率類型為: ${maxFrequencyTypes.join(", ")}, 頻率為: ${maxFrequency}`);
        return maxFrequencyTypes; // 返回最大頻率類型的陣列
      } else {
        console.warn("未找到任何匹配的類型！");
        return [];
      }
    } catch (error) {
      console.error("更新統計類型失敗: ", error);
      return [];
    }    
  };

  const handleUpdate = async () => {
    try {
      // Step 0: 更新 Statistics 
      await updateStatistics(); 
      await updatetopType(); 
      
      // Step 1: 從 FraudDefine collection 中抓取資料
      const fraudDefineSnapshot = await getDocs(collection(db, "FraudDefine"));
      const fraudDefineKeywords = fraudDefineSnapshot.docs.map(
        (doc) => doc.data().Keyword
      );
  
      // Step 2: 準備處理選中的 Report 資料
      const matched = [];
      const unmatched = [];
  
      const selectedRows = rows.filter(row => selected.includes(row.id));
  
      for (const row of selectedRows) {
        try {
          // 從 Report 獲取完整資料
          const reportRef = doc(db, "Report", row.id);
          const reportDoc = await getDoc(reportRef);
          
          if (!reportDoc.exists()) {
            console.error(`Report 文檔不存在: ${row.id}`);
            continue;
          }
          
          const reportData = reportDoc.data();
          
          // 在 Outcome 中創建新文檔 (使用 add 自動生成新 ID)
          const outcomeRef = await addDoc(collection(db, "Outcome"), {
            // 複製必要的欄位
            Report: reportData.Report || "",
            Source: reportData.Source || "",
            AddNote: reportData.AddNote || "",
            PythonResult: reportData.PythonResult || {},
            ReportId: row.id, // 儲存原始 Report ID 以便追蹤
            TimeStamp: serverTimestamp() // 記錄複製時間
          });
          
          console.log(`成功將 Report ${row.id} 複製到 Outcome，新 ID 為: ${outcomeRef.id}`);
          
          // 處理 Match 資料
          const same = row.Match.filter((matchItem) =>
            fraudDefineKeywords.includes(matchItem.MatchKeyword)
          );
          
          if (same.length > 0) {
            matched.push({ ...row, outcomeId: outcomeRef.id, Match: same });
          }
          
          const updatedMatches = row.Match.filter((matchItem) => {
            return !fraudDefineKeywords.includes(matchItem.MatchKeyword);
          });
          
          if (updatedMatches.length === 0) {
            // 如果所有 Match 都匹配到了 FraudDefine，刪除該筆資料
            await deleteDoc(outcomeRef);
          } else {
            // 更新剛創建的 Outcome 文檔
            await updateDoc(outcomeRef, {
              "PythonResult.Match": updatedMatches,
            });
            unmatched.push({ ...row, outcomeId: outcomeRef.id, Match: updatedMatches });
          }
          
          // 將新的關鍵字加入 FraudDefine
          for (const matchItem of row.Match) {
            if (!fraudDefineKeywords.includes(matchItem.MatchKeyword)) {
              await addDoc(collection(db, "FraudDefine"), {
                Keyword: matchItem.MatchKeyword,
                Type: matchItem.MatchType || "未知",
                Result: row.FraudResult === "詐騙" ? true : false,
              });
            }
          }
        } catch (error) {
          console.error(`處理 Report ${row.id} 時發生錯誤:`, error);
        }
      }
  
      console.log(matched);
      console.log(unmatched);
  
      setMatchedData(matched);
      setUnmatchedData(unmatched);
  
      // 從本地狀態中移除已處理的 Report
      const remainingRows = rows.filter(row => !selected.includes(row.id));
      setRows(remainingRows); 
  
      setShow(true);
      closeReturnModal();
      setSelected([]);
    } catch (error) {
      console.error("資料比對時發生錯誤: ", error);
    }
  };

  // 修改刪除函數以真正刪除 Report 資料表中的數據
  const handleDelete = async () => {
    try {
      if (selected.length === 0) {
        console.error("未選擇任何資料");
        return;
      }

      // 保存要刪除的 ID
      const idToDelete = selected[0]; // 因為現在是單選，所以只有一個 ID

      // 更新統計數據 (如果需要的話)
      await updateStatistics(); 
      await updatetopType(); 

      // 從 Report 資料表中刪除資料
      await deleteDoc(doc(db, "Report", idToDelete));
      console.log(`已從 Report 資料表刪除文檔 ID: ${idToDelete}`);

      // 從本地狀態中移除已刪除的行
      setRows((prevRows) => prevRows.filter(row => row.id !== idToDelete));
      setSelected([]);
      
      console.log("刪除成功");
      
      // 關閉模態框
      closeReturnModal();
    } catch (error) {
      console.error("刪除失敗: ", error);
      alert(`刪除失敗: ${error.message}`);
    }
  };

  const handleClose = () => {
    setShow(false);
    setMatchedData([]);
    setUnmatchedData([]);
  };

  return (
    <>
      <Box sx={{ width: "100%" }} className="MuiBox-root css-8atqhb">
        <Paper sx={{ width: "100%", mb: 2 }} className="none">
          <div style={{position:'relative'}}>
            <EnhancedTableToolbar
              numSelected={selected.length}
              openUpdateModal={openUpdateModal}
              openDeleteModal={openDeleteModal}
              handleCheckFraud={handleCheckFraud}
              openEditModal={openEditModal}
            />
          </div>
          <TableContainer style={{ width: '100%', maxWidth: '100%' }}>
            <Table 
              sx={{ width: '100%', minWidth: '100%' }} 
              aria-labelledby="tableTitle" 
              className="admin-table"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = selected.indexOf(row.id) !== -1;
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    style={{ width: '100%' }}
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
                      <TableCell align="left" className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-3ssuu9-MuiTableCell-root">{row.Report}</TableCell>
                      <TableCell align="left" className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-3ssuu9-MuiTableCell-root">{row.Source}</TableCell>
                      <TableCell align="left" className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-3ssuu9-MuiTableCell-root">{row.AddNote}</TableCell>
                      <TableCell align="right" className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-3ssuu9-MuiTableCell-root">{row.FraudResult}</TableCell>
                      <TableCell align="right" className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-3ssuu9-MuiTableCell-root">{row.MatchKeyword}</TableCell>
                      <TableCell align="right" className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-3ssuu9-MuiTableCell-root">{row.MatchType}</TableCell>
                      <TableCell align="right" className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-3ssuu9-MuiTableCell-root">{row.FraudRate}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={8} />
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
  
      {/* 更新結果 Modal */}
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <p style={{fontSize:'30px',fontWeight:'bolder', lineHeight:'45px',marginTop:'20px',marginLeft:'10px'}}>
              更新結果
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{marginLeft:'10px'}}>
          <div>
            <p className="adminpreview-updatecheck">重複：</p>
            <div className="adminupdate-text">
              {matchedData.length > 0 ? (
                matchedData
                  .map((item) =>
                    item.Match.map((match) => match.MatchKeyword).join(", ")
                  )
                  .join(", ")
              ) : (
                <p className="adminupdate-text">無關鍵字重複</p>
              )}
            </div>
          </div>
          <div>
            <p className="adminpreview-updatecheck updatecheck-mt">更新：</p>
            <div className="adminupdate-text">
              {unmatchedData.length > 0 ? (
                unmatchedData
                  .map((item) =>
                    item.Match.map((match) => match.MatchKeyword).join(", ")
                  )
                  .join(", ")
              ) : (
                <p className="adminupdate-text">無關鍵字被更新</p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{display:'flex',justifyContent:'center'}}>
          <button
            className="admin-enter"
            onClick={handleClose}
          >
            確認
          </button>
        </Modal.Footer>
      </Modal>
  
      {/* 更新或刪除確認 Modal */}
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
      
{/* 編輯 Modal */}
{isEditModalOpen && (
  <div className="m-overlay">
    <div className="m-content" style={{ 
      maxWidth: '800px', 
      width: '95%', 
      minHeight: '700px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 30px' 
      }}>
        <h4 className="m-title" style={{ margin: 0 }}>編輯資料</h4>
        <IconButton onClick={closeReturnModal}>
          <CloseIcon style={{ color: 'black' }} />
        </IconButton>
      </div>
      <div style={{ 
        padding: '0 10px 20px', 
        maxHeight: '70vh', 
        overflowY: 'auto',
        flex: 1 // 讓內容區域自動填滿剩餘空間
      }}>
        <TextField
          label="回報內容"
          name="Report"
          value={editData.Report}
          onChange={handleEditChange}
          fullWidth
          margin="normal"
          multiline
          rows={2}
          variant="outlined"
          InputProps={{
            style: { fontSize: '18px' }
          }}
          InputLabelProps={{
            style: { 
              fontSize: '20px',
              fontWeight: '700',
              // color: '#2c3e50'
            }
          }}
        />
        <TextField
          label="資料來源"
          name="Source"
          value={editData.Source}
          onChange={handleEditChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            style: { fontSize: '18px'}
          }}
          InputLabelProps={{
            style: { fontSize: '20px',fontWeight: '700' }
          }}
        />
        <TextField
          label="附註"
          name="AddNote"
          value={editData.AddNote}
          onChange={handleEditChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            style: { fontSize: '18px' }
          }}
          InputLabelProps={{
            style: { fontSize: '20px' ,fontWeight: '700' }
          }}
        />
        <TextField
          label="詐騙結果"
          name="FraudResult"
          value={editData.FraudResult}
          onChange={handleEditChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            style: { fontSize: '18px' }
          }}
          InputLabelProps={{
            style: { fontSize: '20px' ,fontWeight: '700' }
          }}
        />
        <TextField
          label="匹配關鍵字"
          name="MatchKeyword"
          value={editData.MatchKeyword}
          onChange={handleEditChange}
          fullWidth
          margin="normal"
          variant="outlined"
          helperText="多個關鍵字請用逗號分隔"
          FormHelperTextProps={{
            style: { fontSize: '16px' }
          }}
          InputProps={{
            style: { fontSize: '18px' }
          }}
          InputLabelProps={{
            style: { fontSize: '20px' ,fontWeight: '700' }
          }}
        />
        <TextField
          label="匹配類型"
          name="MatchType"
          value={editData.MatchType}
          onChange={handleEditChange}
          fullWidth
          margin="normal"
          variant="outlined"
          helperText="多個類型請用逗號分隔"
          FormHelperTextProps={{
            style: { fontSize: '16px' }
          }}
          InputProps={{
            style: { fontSize: '18px' }
          }}
          InputLabelProps={{
            style: { fontSize: '20px' ,fontWeight: '700' }
          }}
        />
        <TextField
          label="詐騙率"
          name="FraudRate"
          value={editData.FraudRate}
          onChange={handleEditChange}
          fullWidth
          margin="normal"
          variant="outlined"
          type="number"
          inputProps={{ min: 0, max: 100 }}
          InputProps={{
            style: { fontSize: '18px' }
          }}
          InputLabelProps={{
            style: { fontSize: '20px' ,fontWeight: '700' }
          }}
        />
      </div>
      {/* 確保按鈕在編輯框內底部 */}
      <div style={{
        padding: '10px 10px 10px',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        borderTop: '1px solid #eee'
      }}>
        <button className="admin-enter" onClick={handleEditSubmit}>確認</button>
        <button className="admin-jumps" onClick={closeReturnModal}>取消</button>
      </div>
    </div>
  </div>
)}
{/* 詐騙檢測 Modal */}
{isFraudCheckModalOpen && isLoading && (
  <div className="m-overlay">
    <div className="m-content fraud-check-modal" style={{ 
        maxWidth: '500px', 
        maxHeight: '350px',
        padding: '20px',
        position: 'relative' 
      }}>
      {/* 直接使用內聯樣式強制定位 */}
      <CloseIcon 
        onClick={handleCloseCheck} 
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          color: 'black',
          fontSize: '30px',
          cursor: 'pointer',
          zIndex: 1000 
        }}
      />
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div className="bubblingG">
          <span id="bubblingG_1"></span>
          <span id="bubblingG_2"></span>
          <span id="bubblingG_3"></span>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <h4 className="m-title">正在進行詐騙檢測中...</h4>
      </div>
    </div>
  </div>
)}
    </>
  );
}
