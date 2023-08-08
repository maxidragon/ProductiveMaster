import { useEffect, useState } from "react";
import { getUserData } from "../../logic/auth";
import { Grid } from "@mui/material";
import { UserData } from "../../logic/interfaces";
const Dashboard = () => {
    const [data, setData] = useState<UserData | null>(null);

    useEffect(() => {
        const getData = async () => {
            const userData = await getUserData();
            setData(userData);
        };
        getData();
    }, []);

    return (
        <>
            <Grid container sx={{ display: 'flex', flexDirection: 'row' }}>
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
                <Grid item>
                   
                </Grid>
            </Grid>

        </>
    )
};

export default Dashboard;