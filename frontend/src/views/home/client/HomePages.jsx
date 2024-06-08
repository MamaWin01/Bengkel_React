import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { initModal } from "../../../helpers/function";
// input waktu
import dayjs from "dayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// icon
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { propTypes } from "react-bootstrap/esm/Image";
import auth from '../../../helpers/auth'

function Home() {
  const [value, setValue] = useState(dayjs(Date.now()));
  const [isShowBook, ModalBookCreate] = useState(false);
  const [isShowSearch, ModalBookSearch] = useState(false);
  const [ShowMessage, ModalShowMessage] = useState(false);
  const [isHidden, TextFieldHidden] = useState(true);
  var userHasScrolled = false;
  let modalRef = useRef();
  // token
  const token = auth.isAuthenticated().token;

  // for new booking
  const [bookList, setBookList] = useState({
    id:'',
    name: '',
    nohp: '',
    date: '',
    desc: '',
    msg: '',
    signedIn: false,
  })

  // for edit booking
  const [editBookList, updateBookList] = useState({
    id:'',
    name: '',
    nohp: Number,
    date: '',
    desc: '',
    msg: '',
    type: '',
    signedIn: false,
  })

  window.onscroll = function (e) {
    if (!userHasScrolled) {
      userHasScrolled = true;
      var element = document.getElementById("offer");
      element.classList.add("fade-in-image");
    }
  };

  async function handleCreate(event) {
    event.preventDefault();
    setBookList({'date':value.$d});
    try {
      let response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookList`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': "Bearer "+token
        },
        // body:JSON.stringify(bookList)
        body:JSON.stringify({
          'name':bookList.name,
          'nohp':bookList.nohp,
          'date':value.$d,
          'desc':bookList.desc,
        })
      })
      await response.json().then(res => {
        setBookList({'msg':'Booking Successfully added, Here your Booking ID '+res.result.BookID});
        ModalBookCreate(false);
        ModalShowMessage(true);
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    // document.addEventListener("mousedown", checkClickOutside);
  });

  const handleChange = (event) => {
    var id = event.target.value;
    let isnum = /^\d+$/.test(id);
    if(!isnum && id != '') {
      setBookList({'msg':'must be number'});
      TextFieldHidden(true);  
      ModalShowMessage(true);
    };
    if (id.length > 12) {
      getBookingInfo(id);
    } else {
      TextFieldHidden(true);
    }
  };

  async function getBookingInfo(id) {
    try {
      let response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookList/`+id, {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
      await response.json().then(res => {
        console.log(res);
        if(res) {
          updateBookList({
            'id'  :(res.id || ''), 
            'name':(res.name || ''), 
            'nohp':(res.nohp || ''), 
            'desc':(res.desc || ''),
          })
          setValue(dayjs(res.date))
          TextFieldHidden(false);  
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  async function UpdateOrDeleteBook(event,type) {
    event.preventDefault();
    try {
      let response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookList/`+editBookList.id, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': "Bearer "+token
        },
        body:JSON.stringify({
          'name':editBookList.name,
          'nohp':editBookList.nohp,
          'date':value.$d,
          'desc':editBookList.desc,
          'type':type
        })
      })
      await response.json().then(res => {
        if(type == 'edit') {
          setBookList({'msg':'Booking Successfully edited'});
        } else {
          setBookList({'msg':'Booking Successfully deleted'});
        }
        TextFieldHidden(true);  
        ModalBookSearch(false);
        ModalShowMessage(true);
      })
    } catch (err) {
      console.log(err)
    }
  }

  // for change value
  const changeField = (name,type) => event => {
    if(type == 'edit') {
      updateBookList({...editBookList, [name]: event.target.value })
    } else {
      setBookList({...bookList, [name]: event.target.value })
    }
  }

  return (
    <div className="row" style={{ backgroundColor: "white", width: "99.1vw" }}>
      <div
        className="col-lg-12 backgroundStyle"
        style={{
          backgroundImage: `url('../public/homepage.png')`,
          height:'100vh',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <table
          style={{
            position: "absolute",
            top: "20%",
            left: "33%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <tbody>
            <tr>
              <td style={{ paddingRight: "5px" }} className="fade-in-image">
                <img
                  src="../public/logo-nobg.png"
                  alt="logo"
                  style={{ width: "90px" }}
                />
              </td>
              <td
                className="slide-right td-slide"
                style={{
                  fontSize: "32px",
                  textAlign: "left",
                  color: "white",
                  fontFamily: "Sans-Serif",
                }}
              >
                <b>
                  <p>
                    MERVIN <br />
                    AUTO
                  </p>
                </b>
              </td>
            </tr>
          </tbody>
        </table>
        <table
          style={{
            position: "absolute",
            top: "70%",
            left: "40%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <tbody>
            <tr>
              <td className="barlow-condensed slide-right2 td-slide2">
                <b>
                  <p
                    style={{
                      color: "white",
                      fontSize: "100px",
                      textAlign: "left",
                    }}
                  >
                    LET'S GET YOU <br />{" "}
                    <span style={{ color: "#ff4c4c" }}>ON THE ROAD</span>
                  </p>
                </b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        className="col-lg-12 backgroundStyle"
        style={{
          backgroundColor: "black",
          height: "100%",
        }}
      >
        <div
          className="container"
          style={{ marginBottom: "190px", marginTop: "120px" }}
        >
          <div className="row">
            <p
              className="barlow-condensed"
              style={{ textAlign: "left", color: "white", fontSize: "70px" }}
            >
              <b>WHAT WE OFFER</b>
            </p>
          </div>
          <div
            className="col card-container open-sauce"
            id="offer"
            style={{ paddingTop: "10px" }}
          >
            <div className="col-lg-4 new-card">
              <div className="card">
                <img
                  src="../public/sec1.png"
                  alt=""
                  style={{
                    border: "1px solid",
                    borderRadius: "5px",
                    height: "287px",
                  }}
                />
                <p style={{ color: "#ff4c4c", fontSize: "26px" }}>
                  <b>MAINTENANCE</b>
                </p>
                <p style={{ color: "white", fontSize: "13px" }}>
                  {" "}
                  Regular checkups to maintain your car's high performance
                </p>
              </div>
            </div>
            <div className="col-lg-4 new-card">
              <div className="card">
                <img
                  src="../public/sec2.png"
                  alt=""
                  style={{
                    border: "1px solid",
                    borderRadius: "5px",
                    height: "287px",
                  }}
                />
                <p style={{ color: "#ff4c4c", fontSize: "26px" }}>
                  <b>REPAIR</b>
                </p>
                <p style={{ color: "white", fontSize: "13px" }}>
                  {" "}
                  Quality service that guarantees smooth and safe rides
                </p>
              </div>
            </div>
            <div className="col-lg-4 new-card">
              <div className="card">
                <img
                  src="../public/sec3.png"
                  alt=""
                  style={{
                    border: "1px solid",
                    borderRadius: "5px",
                    height: "287px",
                  }}
                />
                <p style={{ color: "#ff4c4c", fontSize: "26px" }}>
                  <b>OIL CHANGE</b>
                </p>
                <p style={{ color: "white", fontSize: "13px" }}>
                  {" "}
                  To Keep your engine running strong and smoothly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="col-lg-12 backgroundStyle"
        style={{
          backgroundImage: `url('../public/third2.png')`,
        }}
      >
        <div className="container open-sauce">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <div className="row">
              <div
                className="col-lg-12"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="col-lg-8">
                  <p
                    style={{
                      fontSize: "32px",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    <b>
                      For any automobile repair or maintenance needs, your
                      trusted mechanic is here to help.
                    </b>
                  </p>
                </div>
              </div>
              <div className="col-lg-12">
                <button
                  onClick={() => {
                    ModalBookCreate(initModal("open", "CreateBook"));
                  }}
                  style={{
                    backgroundColor: "#ff4c4c",
                    padding: "15px 70px 15px 70px",
                  }}
                >
                  <b style={{ fontSize: "24px" }}>Book an appointment</b>
                </button>
              </div>
              <div className="col-lg-12" style={{ paddingTop: "5px" }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    ModalBookSearch(initModal("open", "SearchBook"));
                  }}
                  style={{ color: "#ff4c4c", fontSize: "18px" }}
                >
                  Check Your Booking status?
                </a>
              </div>
            </div>
          </div>
          <div
            className="col card-container open-sauce"
            style={{ marginTop: "210px", paddingLeft: "50px" }}
          >
            <div className="col-lg-4" style={{ textAlign: "left" }}>
              <b style={{ fontSize: "24px" }}>ADDRESS</b> <br />
              42J6+R4W, Jl. Bunga Raya,
              <br />
              Batu Selicin, Kec. Lubuk Baja, Kota Batam,
              <br />
              Kepulauan Riau 29442
            </div>
            <div className="col-lg-4" style={{ textAlign: "left" }}>
              <b style={{ fontSize: "24px" }}>EMAIL ADDRESS</b> <br />
              marcell@gmail.com
            </div>
            <div className="col-lg-4" style={{ textAlign: "left" }}>
              <b style={{ fontSize: "24px" }}>PHONE NUMBER</b> <br />
              085101500715
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal show"
        style={{ display: "block", position: "initial" }}
      >
        <Modal show={isShowBook} style={{ marginTop: "10%" }}>
          <Modal.Header
            closeButton
            onClick={() => {
              ModalBookCreate(false);
            }}
          >
            <Modal.Title className="ms-auto">
              <>
                <b>BOOKING</b>
              </>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <TextField
                  label="Name"
                  type="text"
                  placeholder=""
                  autoComplete="off"
                  name="name"
                  id="name"
                  className="form-control rounded-0"
                  onChange={changeField('name','create')}
                />
              </div>
              <div className="mb-4">
                <TextField
                  label="Phone Number"
                  required
                  placeholder=""
                  autoComplete="off"
                  name="phone"
                  id="phone"
                  className="form-control rounded-0"
                  onInput={(e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value))
                      .toString()
                      .slice(0, 13);
                  }}
                  InputProps={{
                    type: "number",
                    sx: {
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                        {
                          display: "none",
                        },
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                    },
                  }}
                  onChange={changeField('nohp','create')}
                />
              </div>
              <div className="mb-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    label="Date"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    orientation="landscape"
                    ampm={false}
                  />
                </LocalizationProvider>
              </div>
              <div className="mb-4">
                <TextField
                  label="Description"
                  type="text"
                  placeholder=""
                  name="desc"
                  id="desc"
                  className="form-control rounded-0"
                  multiline
                  rows={4}
                  onChange={changeField('desc','create')}
                />
              </div>
              <div
                style={{ paddingBottom: "15px", width: "20%", margin: "auto" }}
              >
                <Button type="submit" variant="contained" color="success">
                  Submit
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      <div
        className="modal show"
        style={{ display: "block", position: "initial" }}
      >
        <Modal show={isShowSearch} style={{ marginTop: "10%" }}>
          <Modal.Header
            closeButton
            onClick={() => {
              ModalBookSearch(false);
              TextFieldHidden(true);
            }}
          >
            <Modal.Title className="ms-auto">
              <>
                <b>Check Your Booking</b>
              </>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <TextField
                label="Search"
                type="text"
                placeholder=""
                autoComplete="off"
                name="search"
                id="search"
                onChange={handleChange}
                className="form-control rounded-0"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <form onSubmit={() => {}}>
              <div className="mb-3">
                <TextField
                  label="Name"
                  type="text"
                  placeholder=""
                  autoComplete="off"
                  style={{ display: isHidden ? "none" : "" }}
                  name="name"
                  id="name"
                  value={editBookList.name}
                  onChange={changeField('name','edit')}
                  className="form-control rounded-0"
                />
              </div>
              <div className="mb-3">
                <TextField
                  label="Phone Number"
                  disabled
                  placeholder=""
                  autoComplete="off"
                  style={{ display: isHidden ? "none" : "" }}
                  name="phone"
                  id="phone"
                  value={editBookList.nohp}
                  className="form-control rounded-0"
                  onInput={(e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value))
                      .toString()
                      .slice(0, 13);
                  }}
                  InputProps={{
                    type: "number",
                    sx: {
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                        {
                          display: "none",
                        },
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                    },
                  }}
                />
              </div>
              <div className="mb-3">
                {isHidden ? (
                  ""
                ) : (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDateTimePicker
                      label="Date"
                      value={value}
                      onChange={(newValue) => setValue(newValue)}
                    />
                  </LocalizationProvider>
                )}
              </div>
              <div className="mb-3">
                <TextField
                  label="Description"
                  type="text"
                  placeholder=""
                  style={{ display: isHidden ? "none" : "" }}
                  name="desc"
                  id="desc"
                  value={editBookList.desc}
                  onChange={changeField('desc','edit')}
                  className="form-control rounded-0"
                  multiline
                  rows={4}
                />
              </div>
              <div className="container">
                <div
                  className="row"
                  style={{
                    display: isHidden ? "none" : "flex",
                    justifyContent: "center",
                  }}
                >
                  <div className="col-lg-4">
                    <Button
                      type="button"
                      variant="contained"
                      color="success"
                      style={{ width: "140px" }}
                      onClick={()=> {UpdateOrDeleteBook(event,'edit')}}
                    >
                      Edit Book
                    </Button>
                  </div>
                  <div className="col-lg-4">
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      style={{ width: "140px" }}
                      onClick={()=> {UpdateOrDeleteBook(event,'delete')}}
                    >
                      Cancel Book
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      <div
        className="modal show"
        style={{ display: "block", position: "initial" }}
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
                  {bookList.msg}
              </div>
            </Modal.Body>
        </Modal>

      </div>
    </div>
  );
}

export default Home;
