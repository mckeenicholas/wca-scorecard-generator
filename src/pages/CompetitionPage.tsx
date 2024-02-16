import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthService } from "../utils/AuthService";
import { Box, Button, CircularProgress, Container, Select, Option } from "@mui/joy";
import { Typography } from "@mui/material"

export const CompetitionPage = () => {
  const { compid } = useParams();

  const [wcif, setWcif] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  useEffect(() => {
    const getWcif = async () => {
      const data = await fetch(`https://www.worldcubeassociation.org/api/v0/competitions/${compid}/wcif`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AuthService.getToken()}`
          }
        })
        .then((response) => { return response.json() });

      setWcif(data);
      setIsLoading(false);
    }

    getWcif();
  }, [])

  if (isLoading) {
    return (
      <Box margin="4rem">
        <CircularProgress />
      </Box>
    );
  }

  const rooms = wcif.schedule.venues[0].rooms;

  const allGroups: { room: any; round: any; group: any; }[] = [];

  rooms.forEach((room: any) => {
    const activities = room.activities;
    activities.forEach((activity: any) => {
      const childActivity = activity.childActivities;
      childActivity.forEach((group: any) => {
        allGroups.push({
          "room": room.name,
          "roomid": room.id,
          "round": activity.activityCode,
          "groupcode": group.activityCode,
          "group": group.id
        });
      })
    })
  });

  const handleChange = (
    _event: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    if (newValue !== null) {
      setSelectedEvent(newValue);
    }
  }

  const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups: Record<K, T[]>, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  const results = groupBy(allGroups, (i => i.round));

  for (const round in results) {
    if (Object.prototype.hasOwnProperty.call(results, round)) {
      results[round] = groupBy(results[round], (i => i.groupcode));
    }
  }

  const balanceGroup = () => {
    const groupCounts = {};

    const groupNumbers = {};

    Object.keys(results[selectedEvent]).forEach((group: any) => {
      groupCounts[group] = 0;

      if (!groupNumbers[group]) {
        groupNumbers[group] = [];
      }

      for (const stage of results[selectedEvent][group]) {
        groupNumbers[group].push(stage.group);
      }
    });

    let wcif_copy = wcif;

    console.log(wcif)

    const persons = wcif_copy.persons
      .filter((person: any) => person.registration && person.registration.status === "accepted" && person.registration.eventIds.includes(selectedEvent.split("-")[0]))
      .map((person: any) => {
        const rank = person.personalBests
          .filter((item: any) => item.eventId === selectedEvent.split("-")[0] && item.type === "average")
          .reduce((acc: number, item: { worldRanking: number; }) => Math.min(acc, item.worldRanking), Number.MAX_SAFE_INTEGER);

        return { name: person.name, rank };
      });

    persons.sort((a: { rank: number; }, b: { rank: number; }) => a.rank - b.rank);

    console.log(persons);

    for (const person of wcif_copy.persons) {
      for (const assignment of person.assignments) {
        if (assignment.assignmentCode === "competitor" && Object.values(groupNumbers).some((arr: any) => arr.includes(assignment.activityId))) {
          for (const key of Object.keys(groupNumbers)) {
            if (groupNumbers[key].includes(assignment.activityId)) {
              // assignment.activityId = groupNumbers[key][persons.findIndex((element: { name: any; }) => (element.name === person.name)) % groupNumbers[key].length];
              assignment.activityId = groupNumbers[key][groupCounts[key]];
              groupCounts[key] = (groupCounts[key] + 1) % groupNumbers[key].length;
              // console.log(persons.findIndex((element: { name: any; }) => (element.name === person.name)), person.name);
            }
          }
        }
      }
    }

    console.log(wcif_copy);
    setWcif(wcif_copy);
  }

  const saveChanges = () => {
    setIsLoading(true);
    const toSend = { "persons": wcif.persons }

    fetch(`https://www.worldcubeassociation.org/api/v0/competitions/${compid}/wcif`, {
      method: "PATCH",
      body: JSON.stringify(toSend),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AuthService.getToken()}`
      }
    })
    setIsLoading(false);
  }

  return (
    <Container style={{ textAlign: "center" }}>
      <Box>
        <Typography variant="h5">
          {wcif.name}
        </Typography>
        <Select defaultValue="Choose Event" onChange={handleChange}>
          {Object.keys(results).map((round: any) => (
            <Option value={round}>{round}</Option>
          ))}
        </Select>
        {selectedEvent !== "" && (
          <>
            <Typography fontWeight="bold">Detected:</Typography>
            {Object.keys(results[selectedEvent]).map((group: any) => (
              <Typography key={group}>
                {`${group}: ${results[selectedEvent][group].map((entry: any) => entry.room).join(', ')}`}
              </Typography>
            ))}
          </>
        )}
        <Button onClick={balanceGroup}>
          Balance Groups
        </Button>
        <Button onClick={saveChanges}>
          Save Changes
        </Button>
      </Box>
    </Container>
  );
}