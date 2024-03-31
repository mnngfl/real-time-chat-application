import { AbsoluteCenter, Box, Divider } from "@chakra-ui/react";
import { formatSameDay } from "@/utils/dateUtil";

export type DividerWithDateProps = {
  date: Date;
  bgColor: string;
};

const DividerWithDate: React.FC<DividerWithDateProps> = ({ date, bgColor }) => {
  return (
    <Box position={"relative"} p={"10"}>
      <Divider />
      <AbsoluteCenter bg={bgColor} px={"4"}>
        {formatSameDay(date)}
      </AbsoluteCenter>
    </Box>
  );
};

export default DividerWithDate;
