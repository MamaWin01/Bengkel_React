import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import auth from '../../helpers/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function MainPages() {
    const user = auth.isAuthenticated().user;
    const Navigate = useNavigate();

    const logout = () => {
        auth.clearJWT(() => {
            Navigate('/admin/login');
        });
    };

    return (
        <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="fixed" style={{ top: 0, left: 0, right: 0, zIndex: 1000, backgroundColor:"green" }}>
                <Toolbar sx={{ justifyContent: "center" }}>
                    <Button style={{ color: "white" }} component={Link} to="/admin/bookList">Booking List</Button>
                    <Button style={{ color: "white" }} component={Link} to="/admin/bookHistory">Booking History</Button>
                    <Button style={{ color: "white" }} onClick={logout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: '74px', /* height of the AppBar */
                    paddingLeft: '0 !important',
                    paddingRight: '0 !important',
                    width: '100vw',
                    maxWidth: '100vw !important',
                    overflow: 'auto'}} >
                <Outlet />
            </Container>
        </Box>
    );
}

export default MainPages;
