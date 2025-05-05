import { useState } from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useInvite } from "../../../hooks/useInvite";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const InviteManagement = () => {
  const { user } = useAuth();
  const {
    useSenderInvites,
    useReceiverInvites,
    deleteInvite,
    acceptInvite,
    declineInvite,
    isDeleting,
    isAccepting,
    isDeclining,
  } = useInvite();

  const [tabValue, setTabValue] = useState(0);

  // Fetch invites
  const { data: sentInvites, isLoading: isLoadingSent } = useSenderInvites(
    user._id
  );
  const { data: receivedInvites, isLoading: isLoadingReceived } =
    useReceiverInvites(user._id);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDelete = async (inviteId) => {
    try {
      await deleteInvite({ userId: user._id, inviteId });
      toast.success("Invite deleted");
    } catch (error) {
      toast.error("Failed to delete invite");
    }
  };

  const handleAccept = async (inviteId) => {
    try {
      await acceptInvite({ userId: user._id, inviteId });
      toast.success("Invite accepted");
    } catch (error) {
      toast.error("Failed to accept invite");
    }
  };

  const handleDecline = async (inviteId) => {
    try {
      await declineInvite({ userId: user._id, inviteId });
      toast.success("Invite declined");
    } catch (error) {
      toast.error("Failed to decline invite");
    }
  };

  const renderInviteItem = (invite) => (
    <ListItem key={invite._id} alignItems="flex-start">
      <ListItemAvatar>
        <Avatar src={invite?.recipient?.avatar || invite?.sender?.avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={
          tabValue === 0
            ? `To: ${invite.recipient?.username}`
            : `From: ${invite.sender?.username}`
        }
        secondary={
          <>
            <Typography component="span" variant="body2" color="text.primary">
              {invite.project?.name} - {invite.role?.name}
            </Typography>
            <br />
            {dayjs(invite.createdAt).format("MMM D, YYYY h:mm A")}
            {invite.status && ` • Status: ${invite.status}`}
          </>
        }
      />
      {tabValue === 0 ? (
        <Button
          color="error"
          onClick={() => handleDelete(invite._id)}
          disabled={isDeleting}
        >
          {isDeleting ? <CircularProgress size={24} /> : "Delete"}
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            color="success"
            onClick={() => handleAccept(invite._id)}
            disabled={isAccepting}
          >
            {isAccepting ? <CircularProgress size={24} /> : "Accept"}
          </Button>
          <Button
            color="error"
            onClick={() => handleDecline(invite._id)}
            disabled={isDeclining}
          >
            {isDeclining ? <CircularProgress size={24} /> : "Decline"}
          </Button>
        </div>
      )}
    </ListItem>
  );

  return (
    <div className="p-4">
      <Tabs value={tabValue} onChange={handleTabChange} className="mb-4">
        <Tab label="Sent Invites" />
        <Tab label="Received Invites" />
      </Tabs>

      {isLoadingSent || isLoadingReceived ? (
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      ) : (
        <>
          {tabValue === 0 && (
            <List className="bg-white rounded-lg shadow">
              {sentInvites?.length > 0 ? (
                sentInvites.map(renderInviteItem)
              ) : (
                <Typography className="p-4 text-gray-500">
                  No sent invitations
                </Typography>
              )}
            </List>
          )}

          {tabValue === 1 && (
            <List className="bg-white rounded-lg shadow">
              {receivedInvites?.length > 0 ? (
                receivedInvites.map(renderInviteItem)
              ) : (
                <Typography className="p-4 text-gray-500">
                  No received invitations
                </Typography>
              )}
            </List>
          )}
        </>
      )}
    </div>
  );
};

export default InviteManagement;
