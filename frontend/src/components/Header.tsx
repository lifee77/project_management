import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button,
  Container
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            Project Management
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
            >
              Dashboard
            </Button>
            
            <Button
              color="inherit"
              component={RouterLink}
              to="/backlog"
            >
              Backlog
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
