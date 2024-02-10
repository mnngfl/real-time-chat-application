import { AbsoluteCenter, Box, Divider } from "@chakra-ui/react";

interface DividerWithDateProps {
  date: string;
  bgColor: string;
}

const DividerWithDate: React.FC<DividerWithDateProps> = ({ date, bgColor }) => {
  return (
    <Box position={"relative"} p={"10"}>
      <Divider />
      <AbsoluteCenter bg={bgColor} px={"4"}>
        {date}
      </AbsoluteCenter>
    </Box>
  );
};

export default DividerWithDate;
