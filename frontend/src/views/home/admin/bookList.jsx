import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import auth from '../../../helpers/auth';
import DataTable from 'react-data-table-component';
import '../../../assets/BookList.css'; // Import the CSS file
import { Modal } from "react-bootstrap";

function BookList() {
  // token
  const token = auth.isAuthenticated().token;
  // for data and navigate
  const [bookList, setBookList] = useState([]);
  const [ShowMessage, ModalShowMessage] = useState(false);
  const [TempData, setTempData] = useState({
    msg: '',
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookList`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        });
        let data = await response.json();
        let updatedData = data.result.map((item, index) => ({
          ...item,
          no: index + 1,
          action: (
            <div className="action-buttons">
              <button onClick={() => AcceptOrDecline(item.BookID,'accept')} className="btn btn-success">Approve</button>&nbsp;
              <button onClick={() => AcceptOrDecline(item.BookID,'decline')} className="btn btn-danger">Decline</button>
            </div>
          ),
        }));
        console.log(updatedData);
        setBookList(updatedData);
      } catch (err) {
        console.log(err);
      }
    };

    // Fetch data initially
    fetchData();

    // Fetch data every 10 seconds
    const interval = setInterval(() => {
      console.log('getData');
      fetchData();
    }, 10000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
    async function AcceptOrDecline(bookid,type) {
        try {
            let response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookList/`+bookid, {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer "+token
              },
              body:JSON.stringify({
                'type':type,
                'function':'updateBackside',
              })
            })
            await response.json().then(res => {
              setTempData({'msg':'Booking have been '+type});
              fetchData();
              ModalShowMessage(true);
            })
        } catch (err) {
        console.log(err)
        }
      }
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

  return (
    <div className="table-container" style={{ width: '100%'}}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', border:'1px solid #7ED321', borderRadius: '5px', padding: '5px'}}>
        <h3>Booking List</h3>
      </div>

      <DataTable
        columns={columns}
        data={bookList}
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

export default BookList;
