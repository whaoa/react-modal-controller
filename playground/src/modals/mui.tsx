import { createModal, useModal } from '@whaoa/react-modal-manager';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

import { mm } from './mm';

const Modal = createModal((props: { description?: string }) => {
  const { description } = props;
  const { visible, close, remove } = useModal();

  return (
    <Dialog open={visible} onClose={close}>
      <DialogTitle>MUI Dialog</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          A Dialog is a type of modal window that appears in front of app content
          to provide critical information or ask for a decision.
        </Typography>
        <Typography gutterBottom>
          Dialogs disable all app functionality when they appear,
          and remain on screen until confirmed,
          dismissed, or a required action has been taken.
        </Typography>
        {description ? <Typography gutterBottom>{description}</Typography> : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={remove}>Remove</Button>
        <Button autoFocus onClick={close}>Close</Button>
      </DialogActions>
    </Dialog>
  );
});

export function MuiDialogView() {
  return (
    <Button
      style={{ marginRight: 10 }}
      variant="outlined"
      onClick={() => mm.open(Modal, { description: `mui modal (at: ${new Date().toUTCString()})` })}
    >
      Open MUI Dialog
    </Button>
  );
}
