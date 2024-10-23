import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc,updateDoc, doc } from 'firebase/firestore'; // Firebase Firestore
import './AdminPreview.css';
import { Modal } from 'react-bootstrap';


const headCells = [
    {
      id: 'FraudResult',
      numeric: true,
      disablePadding: false,
      label: 'FraudResult',
      sortable: false,  
    },
    {
      id: 'MatchKeyword',
      numeric: true,
      disablePadding: false,
      label: 'MatchKeyword',
      sortable: false, 
    },
    {
      id: 'MatchType',
      numeric: true,
      disablePadding: false,
      label: 'MatchType',
      sortable: false, 
    },
    {
      id: 'FraudRate',
      numeric: true,
      disablePadding: false,
      label: 'FraudRate',
      sortable: true, 
    },
    {
      id: 'Stars',
      numeric: true,
      disablePadding: false,
      label: 'Stars',
      sortable: false,  
    },
  ];


const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => {
          // Ensure both values are treated as numbers
          const aValue = orderBy === 'FraudRate' ? Number(a[orderBy]) : a[orderBy];
          const bValue = orderBy === 'FraudRate' ? Number(b[orderBy]) : b[orderBy];
          return bValue < aValue ? -1 : 1;
        }
      : (a, b) => {
          const aValue = orderBy === 'FraudRate' ? Number(a[orderBy]) : a[orderBy];
          const bValue = orderBy === 'FraudRate' ? Number(b[orderBy]) : b[orderBy];
          return aValue < bValue ? -1 : 1;
        };
  };
  

  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      // 只允許 FraudRate 進行排序
      if (property === 'FraudRate') {
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
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)} 
              disabled={!headCell.sortable}  
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, handleUpdate, handleDelete } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          已選擇 {numSelected} 筆
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          預覽畫面
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="刪除 Delete">
          <IconButton onClick={ handleDelete }>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="更新 Update">
          <IconButton onClick={ handleUpdate }>
            <CloudUploadIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function AdminPreview() {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('FraudRate');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [show, setShow] = useState(false);
  const [matchedData, setMatchedData] = useState([]);
  const [unmatchedData, setUnmatchedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, 'Outcome')); 
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          FraudRate: doc.data().PythonResult?.FraudRate || 0, 
          FraudResult: doc.data().PythonResult?.FraudResult || '', 
          Match: doc.data().PythonResult?.Match || [], 
        }))
        .filter(item => item.Stars > 3);
        setRows(data);
      };
    
      fetchData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    console.log(`Order: ${isAsc ? 'desc' : 'asc'}, Order By: ${property}`);
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
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
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
      const fraudDefineSnapshot = await getDocs(collection(db, 'FraudDefine')); 
      const fraudDefineKeywords = fraudDefineSnapshot.docs.map(doc => doc.data().Keyword);
  
      // Step 2: 比對 Outcome 的 MatchKeyword 和 FraudDefine 的 Keyword
      const matched = [];
      const unmatched = [];
  
      for (const row of rows) {
        // 檢查每個 MatchKeyword 是否存在於 FraudDefine 中
        const same = row.Match.filter((matchItem) => {
          return fraudDefineKeywords.includes(matchItem.MatchKeyword);
        });
        if (same.length > 0) {
          matched.push({...row, Match: same });
        }

        const updatedMatches = row.Match.filter((matchItem) => {
          return !fraudDefineKeywords.includes(matchItem.MatchKeyword);
        });
  
        if (updatedMatches.length === 0) {
          // 如果所有 Match 都匹配到了 FraudDefine，刪除該筆資料
          await deleteDoc(doc(db, 'Outcome', row.id));
        } else {
          // 如果有未匹配到的項目，更新剩下的 Match
          await updateDoc(doc(db, 'Outcome', row.id), {
            'PythonResult.Match': updatedMatches, 
          });
          unmatched.push({...row, Match: updatedMatches });
        }
      }
      
      console.log(matched);
      console.log(unmatched);
      
      setMatchedData(matched); 
      setUnmatchedData(unmatched); 

      if (unmatched.length > 0 || matched.length > 0) {
        const combinedData = [...unmatched, ...matched]; // 合併 unmatchedData 和 matchedData
        await Promise.all(combinedData.map(async (row) => {
          for (const matchItem of row.Match) {
            if (!fraudDefineKeywords.includes(matchItem.MatchKeyword)) {
              await addDoc(collection(db, 'FraudDefine'), {
                Keyword: matchItem.MatchKeyword, 
                Type: row.FraudType || '未知',   
                Result: row.FraudResult === '詐騙' ? 1 : 0, 
              });
            }
          }
          // 新增完 `FraudDefine` 後刪除在 `Outcome`的資料
          await deleteDoc(doc(db, 'Outcome', row.id));
        }));
      }  
      setRows([]);
      setShow(true);
    } catch (error) {
      console.error('資料比對時發生錯誤: ', error);
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selected.map(async (id) => {
          await deleteDoc(doc(db, 'Outcome', id));
        })
      );
      setRows((prevRows) => prevRows.filter((row) => !selected.includes(row.id)));
      setSelected([]);
      console.log('刪除成功');
    } catch (error) {
      console.error('刪除失敗: ', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setMatchedData([]);
    setUnmatchedData([]);
  };

  return (
    <>
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} handleUpdate={handleUpdate} handleDelete={handleDelete}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
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
                    const matchKeywords = row.Match.map(matchItem => matchItem.MatchKeyword).join(', ');
                    const matchTypes = row.Match.length > 0 ? '可疑' : '';
                    
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
                            'aria-labelledby': labelId,
                            }}
                        />
                        </TableCell>
                        <TableCell align="right">{row.FraudResult}</TableCell>
                        <TableCell align="right">{matchKeywords}</TableCell>
                        <TableCell align="right">{matchTypes}</TableCell>
                        <TableCell align="right">{row.FraudResult !== '詐騙' ? '' : row.FraudRate}</TableCell>
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
          labelDisplayedRows={({ from, to, count }) => `第 ${from} 至 ${to} 筆，共 ${count} 筆`}
        />
      </Paper>
    </Box>

      <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title><b>更新結果：</b></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p className='adminpreview-updatecheck'>重複：</p>
              <div>
                {matchedData.length > 0 ? (
                  matchedData.map((item) => 
                    item.Match.map(match => match.MatchKeyword).join(', ')
                  ).join(', ')
                ) : (
                  <p>無關鍵字重複</p>
                )}
              </div>
            </div>
            <div>
              <p className='adminpreview-updatecheck updatecheck-mt'>更新：</p>
              <div>
                {unmatchedData.length > 0 ? (
                  unmatchedData.map((item) => 
                    item.Match.map(match => match.MatchKeyword).join(', ')
                  ).join(', ')
                ) : (
                  <p>無關鍵字被更新</p>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className='adminpreview-updatecheck-confirm' onClick={handleClose}>
              確認
            </Button>
          </Modal.Footer>

        </Modal>
    </>
  );
}
