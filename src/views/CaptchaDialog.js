// CaptchaDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';

export default function CaptchaDialog({ open, onClose, onDelete }) {
    const captchaValue = generateCaptcha();

    function generateCaptcha() {
        // Generate a random captcha value (you can implement your own logic here)
        const captchaLength = 6;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < captchaLength; i++) {
            captcha += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return captcha;
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Confirmation : </DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete the User ? </Typography>
                <p>Please confirm your action by entering the following captcha:</p>
                <p>
                    <strong>{captchaValue}</strong>
                </p>
                <TextField id="captchaInput" label="Enter Captcha" variant="outlined" fullWidth />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        const userInput = document.getElementById('captchaInput').value;
                        if (userInput === captchaValue) {
                            // Close the captcha dialog and proceed with deletion
                            onClose();
                            onDelete();
                        } else {
                            // Display a toast notification for invalid captcha
                            toast.error('Invalid Captcha. Please try again.');
                        }
                    }}
                    color="primary"
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
