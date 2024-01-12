import { Box, Button, Card, Container, Typography } from "@mui/joy";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const largeIcon = {
    fontSize: '96px'
  };

const Home = () => {

    const singIn = () => {

    }
    
    return (
        <Container style={{ textAlign: "center" }}>
        <Card>
            <Typography>
                To use this app, you must sign in.
            </Typography>
            <Box justifyContent="center"
  alignItems="center"> 
            <AccountCircleIcon style={largeIcon}/>
            </Box>
            <Button
            onClick={singIn}>
                Sign in
            </Button>
        </Card>
        </Container>
    );
}

export default Home;