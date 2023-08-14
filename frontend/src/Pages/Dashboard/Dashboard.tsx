import { useEffect, useState } from "react";
import { getUserData } from "../../logic/auth";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import { UserData } from "../../logic/interfaces";
import TimezonesTable from "../../Components/Table/TimezonesTable";
import { timezones } from "../../logic/timezones";
import TabPanel from "../../Components/TabPanel";


const Dashboard = () => {
    const [value, setValue] = useState(0);
    const [data, setData] = useState<UserData | null>(null);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    useEffect(() => {
        const getData = async () => {
            const userData = await getUserData();
            setData(userData);
        };
        getData();
    }, []);

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Github stats" id="tab-0" />
                        <Tab label="Time" id="tab-1" />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    {data && (
                        <Grid item>
                            {data.gprm_stats && (
                                <Grid item>
                                    <img src={data.gprm_stats} alt="GPRM stats" />
                                </Grid>
                            )}
                            {data.gprm_streak && (
                                <Grid item>
                                    <img src={data.gprm_streak} alt="GPRM streak" />
                                </Grid>

                            )}
                            {data.gprm_languages && (
                                <Grid item>
                                    <img src={data.gprm_languages} alt="GPRM languages" />
                                </Grid>

                            )}
                        </Grid>
                    )}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <TimezonesTable timezones={timezones} />
                </TabPanel>
            </Box>
        </>
    )
};

export default Dashboard;