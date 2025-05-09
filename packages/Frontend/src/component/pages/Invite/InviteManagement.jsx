import { useState } from "react"
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
} from "@mui/material"
import { useInvite } from "../../../hooks/useInvite"
import { useAuth } from "../../../hooks/useAuth"
import dayjs from "dayjs"
import { useMobile } from "../../../hooks/useMobile"

const InviteManagement = () => {
  const { user } = useAuth()
  const isMobile = useMobile()
  const {
    useSenderInvites,
    useReceiverInvites,
    deleteInvite,
    acceptInvite,
    declineInvite,
    isDeleting,
    isAccepting,
    isDeclining,
  } = useInvite()

  const [tabValue, setTabValue] = useState(0)

  // Fetch invites
  const { data: sentInvitesData = {}, isLoading: isLoadingSent } = useSenderInvites(user._id)
  const { data: receivedInvites = {}, isLoading: isLoadingReceived } = useReceiverInvites(user._id)

  // Extract invites array from data
  const sentInvitesList = sentInvitesData.doc || []
  const receivedInvitesList = receivedInvites.doc || []

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleDelete = async (inviteId) => {
    await deleteInvite({ userId: user._id, inviteId })
  }

  const handleAccept = async (inviteId) => {
    await acceptInvite({ userId: user._id, inviteId })
  }

  const handleDecline = async (inviteId) => {
    await declineInvite({ userId: user._id, inviteId })
  }

  const renderInviteItem = (invite, type) => (
    <ListItem
      key={invite._id}
      className="border-b last:border-0 flex flex-col sm:flex-row py-4"
      alignItems="flex-start"
    >
      <div className="flex items-start w-full">
        <ListItemAvatar>
          <Avatar src={type === "sent" ? invite.receiver?.image?.[0]?.url : invite.sender?.image?.[0]?.url} />
        </ListItemAvatar>
        <ListItemText
          className="flex-1"
          primary={
            <span>
              <span className="dark:text-gray-400">{type === "sent" ? "To:" : "From:"}</span>{" "}
              <span className="dark:text-gray-300">
                {type === "sent" ? invite.receiver?.username : invite.sender?.username}
              </span>
            </span>
          }
          secondary={
            <>
              <Typography className="dark:text-white" component="span" variant="body2" color="text.primary">
                {invite.project?.name} - {invite.role?.name}
              </Typography>
              <br />
              <span className="text-xs">
                {dayjs(invite.createdAt).format("MMM D, YYYY h:mm A")}
                {invite.status && ` • Status: ${invite.status}`}
              </span>
            </>
          }
        />
      </div>

      <div className={`flex ${isMobile ? "w-full mt-3 justify-end" : "ml-auto"}`}>
        {type === "sent" ? (
          <Button
            color="error"
            onClick={() => handleDelete(invite._id)}
            disabled={isDeleting === invite._id}
            className="!text-xs sm:!text-sm !capitalize !bg-red-500 hover:shadow-lg hover:shadow-red-500 !font-bold !text-white !py-2 sm:!py-3 !px-4 sm:!px-7 !rounded-xl"
            size={isMobile ? "small" : "medium"}
          >
            {isDeleting === invite._id ? <CircularProgress size={isMobile ? 16 : 24} /> : "Delete"}
          </Button>
        ) : invite.status === "pending" ? (
          <div className="flex gap-2">
            <Button
              color="success"
              onClick={() => handleAccept(invite._id)}
              disabled={isAccepting === invite._id}
              className="!text-xs sm:!text-sm !capitalize !bg-green-500 hover:shadow-lg hover:shadow-green-500 !font-bold !text-white !py-2 sm:!py-3 !px-4 sm:!px-7 !rounded-xl"
              size={isMobile ? "small" : "medium"}
            >
              {isAccepting === invite._id ? <CircularProgress size={isMobile ? 16 : 20} /> : "Accept"}
            </Button>
            <Button
              color="error"
              onClick={() => handleDecline(invite._id)}
              disabled={isDeclining === invite._id}
              className="!text-xs sm:!text-sm !capitalize !bg-red-500 hover:shadow-lg hover:shadow-red-500 !font-bold !text-white !py-2 sm:!py-3 !px-4 sm:!px-7 !rounded-xl"
              size={isMobile ? "small" : "medium"}
            >
              {isDeclining === invite._id ? <CircularProgress size={isMobile ? 16 : 20} /> : "Decline"}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Typography variant="body2" className="italic text-gray-500 text-xs sm:text-sm">
              {invite.status === "accepted" ? "Accepted" : "Declined"}
            </Typography>
            <Button
              color="error"
              onClick={() => handleDelete(invite._id)}
              disabled={isDeleting === invite._id}
              className="!text-xs sm:!text-sm !capitalize !bg-red-500 hover:shadow-lg hover:shadow-red-500 !font-bold !text-white !py-2 sm:!py-3 !px-4 sm:!px-7 !rounded-xl"
              size={isMobile ? "small" : "medium"}
            >
              {isDeleting === invite._id ? <CircularProgress size={isMobile ? 16 : 20} /> : "Delete"}
            </Button>
          </div>
        )}
      </div>
    </ListItem>
  )

  return (
    <div className="p-2 sm:p-4">
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        className="mb-4"
        variant={isMobile ? "fullWidth" : "standard"}
        centered={isMobile}
      >
        <Tab className="dark:text-gray-500" label="Sent Invites" />
        <Tab className="dark:text-gray-500" label="Received Invites" />
      </Tabs>

      {isLoadingSent || isLoadingReceived ? (
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      ) : (
        <>
          {tabValue === 0 && (
            <List className="bg-white dark:bg-[#2D2D2D] rounded-xl shadow-md hover:shadow-lg">
              {sentInvitesList.length > 0 ? (
                sentInvitesList.map((invite) => renderInviteItem(invite, "sent"))
              ) : (
                <Typography className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No sent invitations
                </Typography>
              )}
            </List>
          )}

          {tabValue === 1 && (
            <List className="bg-white dark:bg-[#2D2D2D] rounded-xl shadow">
              {receivedInvitesList.length > 0 ? (
                receivedInvitesList.map((invite) => renderInviteItem(invite, "received"))
              ) : (
                <Typography className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No received invitations
                </Typography>
              )}
            </List>
          )}
        </>
      )}
    </div>
  )
}

export default InviteManagement
