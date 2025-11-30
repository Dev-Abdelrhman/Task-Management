const Invite = require("../models/invite.Model.js");
const FS = require("../services/factory-services/Factory.services.js");
const sendInviteService = require("../services/invite-services/sendInvite.service.js");
const acceptAndDeclineService = require("../services/invite-services/acceptAndDeclineInviteService.js");
const searchUsersService = require("../services/invite-services/searchForUsersService.js");

const searchUsersForInvite = searchUsersService.searchUsersForInvite;

const sendInvite = sendInviteService.sendInvite;

const declineInvite = acceptAndDeclineService.declineInvite;
const acceptInvite = acceptAndDeclineService.acceptInvite;

const getAllInvitesForReceiver = FS.getAll(Invite, "receiver");
const getAllInvitesForSender = FS.getAll(Invite, "sender");

const deleteInvite = FS.deleteOne(Invite);

module.exports = {
  sendInvite,
  declineInvite,
  acceptInvite,
  getAllInvitesForSender,
  getAllInvitesForReceiver,
  deleteInvite,
  searchUsersForInvite,
};
