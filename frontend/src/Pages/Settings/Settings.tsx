import { Grid, Typography, Button } from "@mui/material";
import ChangePasswordModal from "../../Components/ModalComponents/ChangePasswordModal";
import { useState } from "react";

const Settings = () => {
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState<boolean>(false);
    return (
        <>
            <Grid sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Grid item>
                    <Typography variant="h5">Settings</Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        onClick={() => setOpenChangePasswordModal(true)}
                    >
                        Change password
                    </Button>
                    <ChangePasswordModal
                        open={openChangePasswordModal}
                        handleClose={() => setOpenChangePasswordModal(false)}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default Settings;