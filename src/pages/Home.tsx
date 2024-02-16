// Home.tsx
import { Box, Button, Card, Container, Typography } from "@mui/joy";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect } from "react";
import { AuthService } from "../utils/AuthService";
import { useNavigate } from "react-router-dom";

const largeIcon = {
  fontSize: '96px'
};

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = window.location.href;
    const hash = url.substring(url.indexOf("#") + 1);

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      AuthService.setToken(accessToken);

      navigate("/competitions");
    }
  }, [history]);

  return (
    <Container style={{ textAlign: "center" }}>
      <Card>
        <Typography>
          To use this app, you must sign in.
        </Typography>
        <Box justifyContent="center" alignItems="center">
          <AccountCircleIcon style={largeIcon}/>
        </Box>
        <Button component="a" href={AuthService.logIn()}>
          Sign in
        </Button>
      </Card>
    </Container>
  );
}

export default Home;
