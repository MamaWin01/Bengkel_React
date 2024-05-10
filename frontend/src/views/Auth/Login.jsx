import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import auth from "../../helpers/auth";
import AuthServices from "../../services/AuthServices";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    password: "",
    error: "",
    signedIn: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    AuthServices.login(values).then((data) => {
      auth.authenticate(data, () => {
        if (data.error) {
          setValues({ error: data.error });
        } else {
          navigate("/home");
          setValues({ ...values, error: "", signedIn: true });
        }
      });
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <div className="row" style={{ backgroundColor: "white", width: "98.1vw" }}>
      <navbar style={{ backgroundColor: "green" }}>
        <br />
      </navbar>
      <div
        className="d-flex justify-content-center align-items-center bg-secondary"
        style={{ height: "96.9vh" }}
      >
        <div
          className="bg-white
               p-3 rounded w-25"
        >
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-md-2" style={{ paddingRight: "0px" }}>
                <img src="../public/logo-nobg.png" alt="" />{" "}
              </div>
              <div
                className="col-md-2"
                style={{ paddingLeft: "0px", marginTop: "10px" }}
              >
                <p
                  style={{ color: "red", fontSize: "18px", textAlign: "left" }}
                >
                  <b>
                    MERVIN <br />
                    AUTO
                  </b>
                </p>
              </div>
            </div>
          </div>
          <br />
          <p>Welcome to The Admin Page</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <TextField
                label="Nama"
                type="text"
                placeholder="Masukan Nama"
                autoComplete="off"
                name="name"
                className="form-control rounded-0"
                onChange={handleChange("name")}
              />
            </div>
            <div className="mb-3">
              <TextField
                label="Password"
                type="password"
                placeholder="Password?"
                name="password"
                className="form-control rounded-0"
                onChange={handleChange("password")}
              />
            </div>
            {values.error ? (
              <Stack sx={{ width: "100%", marginBottom: "5px" }} spacing={2}>
                <Alert severity="error">{values.error}</Alert>
              </Stack>
            ) : (
              ""
            )}
            <div className="mb-3">
              <button type="submit" className="btn btn-success rounded-1 w-50">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
