import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import auth from '../../../helpers/auth';
import DataTable from 'react-data-table-component';
import '../../../assets/BookList.css'; // Import the CSS file
import { Modal } from "react-bootstrap";
import TextField from "@mui/material/TextField";

function BookHistory() {
  // token
  const token = auth.isAuthenticated().token;
  // for data and navigate
  const [bookHistory, setBookHistory] = useState([]);
  const [ShowMessage, ModalShowMessage] = useState(false);
  const [TempData, setTempData] = useState({
    msg: '',
    nohpOrBookID: '',
  })
  
  const columns = [
    { name: 'No', selector: row => row.no, sortable: true, center: 'true', width: '7%' },
    { name: 'Name', selector: row => row.name, sortable: true, center: 'true', width: '15%' },
    { name: 'No HP', selector: row => row.nohp, sortable: true, center: 'true', width: '14%' },
    { name: 'Book ID', selector: row => row.BookID, sortable: true, center: 'true', width: '14%' },
    { name: 'Date', selector: row => formatDate(row.date), sortable: true, center: 'true', width: '15%' },
    { name: 'Desc', selector: row => row.desc, sortable: true, width: '15%', wrap: true }, // Allow text wrapping
    { name: 'Action', selector: row => row.action, center: 'true', width: '20%' },
  ];

  const fetchData = async () => {
    try {
      let response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookHistory`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body:JSON.stringify({
          'nohpOrBookID':TempData.nohpOrBookID,
        })
      });
      let data = await response.json();
      console.log(data)
      let updatedData = data.result.map((item, index) => ({
        ...item,
        no: index + 1,
        action: (() => {
          if (item.status === 1) {
            return (<div style={{color:'green'}}>Accepted</div>);
          } else if (item.status === 2) {
            return (<div style={{color:'red'}}>Decline</div>);
          } else {
            return (<div style={{color:'red'}}>Cancelled</div>);
          }
        })(),
      }));
      setBookHistory(updatedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${day} ${months[monthIndex]} ${year}, ${hours}:${minutes}:${seconds}`;
  };

  const handleChange = (name) => (event) => {
    setTempData({ ...TempData, [name]: event.target.value });
  };

  return (
    <div className="table-container" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', border:'1px solid #7ED321', borderRadius: '5px', padding: '5px'}}>
          <div className='col-lg-4'>
              <TextField
                label="Search Data"
                type="text"
                placeholder="NoHp or BookID"
                name="search"
                className="form-control rounded-0"
                onChange={handleChange('nohpOrBookID')}
                size="small"
              />
          </div>
          
          <div style={{paddingLeft:'10px'}}>
            <button onClick={() => fetchData()} className="btn btn-success">Search</button>
          </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', border:'1px solid #7ED321', borderRadius: '5px', padding: '5px'}}>
        <h3>Booking History List</h3>
      </div>

      <DataTable
        columns={columns}
        data={bookHistory}
        pagination
        paginationPerPage={10} // Initial number of rows per page
        paginationRowsPerPageOptions={[5, 10, 15, 20]} // Options for rows per page
        paginationComponentOptions={{
          rowsPerPageText: 'Rows per page:',
          rangeSeparatorText: 'of',
          selectAllRowsItem: true,
          selectAllRowsItemText: 'All'
        }}
        customStyles={{
          headCells: {
            style: {
              border: '1px solid #7ED321',
              textAlign: 'center',
            },
          },
          cells: {
            style: {
              border: '1px solid #7ED321',
              textAlign: 'center',
              maxHeight: '100px', // Set max height for all cells
              overflow: 'auto', // Enable scrolling if content exceeds max height
            },
          },
          pagination: {
            style: {
              color: '#000000', // Pagination text color
              justifyContent: 'center',
            },
            pageButtonStyle: {
              color: '#000000', // Pagination button text color
              padding: '8px 12px',
              border: '1px solid #7ED321',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '0 5px',
              transition: 'background-color 0.3s',
            },
            pageButtonHover: {
              backgroundColor: '#7ED321',
              color: 'white',
            },
            activePageButtonStyle: {
              backgroundColor: '#7ED321',
              color: 'white',
            },
            perPageOption: {
              color: '#000000', // Pagination option text color
            },
          },
        }}
      />
      <div
        className="modal show"
        style={{ position: "initial" }}
      >
        <Modal show={ShowMessage} style={{ marginTop: "10%" }}>
          <Modal.Header
            closeButton
            onClick={() => {
              ModalShowMessage(false);
            }}
          >
          </Modal.Header>
            <Modal.Body>
              <div className="mb-3" style={{fontSize:'28px'}}>
                  {TempData.msg}
              </div>
            </Modal.Body>
        </Modal>

      </div>
    </div>
  );
}

export default BookHistory;
