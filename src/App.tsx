import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { sendNotification } from "@tauri-apps/api/notification";
import { ask } from "@tauri-apps/api/dialog";
function App() {
  const [time, setTime] = useState(0);
  const [timerStart, setTimerStart] = useState(false);
  const buttons = [
    {
      value: 300,
      display: "5 minutes",
    },
    {
      value: 1500,
      display: "25 minutes",
    },
    {
      value: 1800,
      display: "30 minutes",
    },
  ];
  const toggleTimer = () => {
    setTimerStart(!timerStart);
  };
  const triggerResetDialog = async () => {
    let shouldReset = await ask("Do you want to reset timer?", {
      title: "Pomodoro Timer App",
      type: "warning",
    });
    if (shouldReset) {
      setTime(900);
      setTimerStart(false);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (timerStart) {
        if (time > 0) {
          setTime(time - 1);
        } else if (time === 0) {
          sendNotification({
            title: `Time's up!`,
            body: `Congrats on completing a session!🎉`,
          });
          clearInterval(interval);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timerStart, time]);
  return (
    <div className="App" style={{ height: "100%", minHeight: "100vh" }}>
      <Flex
        background="pink.100"
        height="100%"
        minHeight="100vh"
        alignItems="center"
        flexDirection="column"
        backgroundImage="url(./images/strawberries.jpg)"
        backgroundSize="cover"
        backgroundBlendMode={["normal", "multiply"]}
      >
        <Text color="white" fontWeight="bold" marginTop="40" fontSize="35">
          Pomodoro Timer
        </Text>
        <Text fontWeight="bold" fontSize="7xl" color="white">
          {`${
            Math.floor(time / 60) < 10
              ? `0${Math.floor(time / 60)}`
              : `${Math.floor(time / 60)}`
          }:${time % 60 < 10 ? `0${time % 60}` : time % 60}`}
        </Text>
        <Flex>
          <Button
            background="transparent"
            color="white"
            marginX={5}
            fontSize="xl"
            onClick={toggleTimer}
          >
            {!timerStart ? "Start" : "Pause"}
          </Button>
          <Button
            background="transparent"
            color="white"
            marginX={5}
            fontSize="xl"
            onClick={triggerResetDialog}
          >
            Reset
          </Button>
        </Flex>
        <Flex marginTop={10}>
          {buttons.map(({ value, display }) => (
            <Button
              marginX={4}
              background="pink.200"
              color="white"
              onClick={() => {
                setTimerStart(false);
                setTime(value);
              }}
            >
              {display}
            </Button>
          ))}
        </Flex>
      </Flex>
    </div>
  );
}
export default App;
