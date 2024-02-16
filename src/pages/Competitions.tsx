import { useEffect, useState } from "react";
import { AuthService } from "../utils/AuthService";
import { Box, Card, CircularProgress, Container, List, ListItem, ListItemButton, ListItemContent } from "@mui/joy";
import { Typography } from "@mui/material";

export const Competitions = () => {
  const [manageableCompetitions, setManageableCompetitions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCompetitions = async () => {
      const oneWeekAgo = new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000);
      const params = new URLSearchParams({
        managed_by_me: "true",
        start: oneWeekAgo.toISOString()
      });

      const data = await fetch("https://www.worldcubeassociation.org/api/v0/competitions?" + params.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AuthService.getToken()}`
        }
      }).then((data) => { return data.json() });

      console.log(data);
      setManageableCompetitions(data.reverse());
      setIsLoading(false);
    }
    getCompetitions();
  }, []);

  console.log(isLoading)


  return (
    <Container style={{ textAlign: "center" }}>
      <Card>
        <Typography variant="h5" fontWeight="bold">
          Your Competitions:
        </Typography>
        {isLoading 
          ? <Box margin="4rem">
            <CircularProgress />
          </Box>
          : <List>
          {manageableCompetitions.map((competition: any) => (
            <ListItem key={competition.id}>
              <ListItemButton component="a" href={`competitions/${competition.id}`}>
                <ListItemContent>
                  <Typography>
                    {competition.name}
                  </Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        }
      </Card>
    </Container>
  );
}   