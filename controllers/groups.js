const { Op } = require("sequelize");

const GroupM = require("../models/groups");
const UserGroupM = require("../models/userGroups");
const Users = require("../models/users");

const makeGroup = async (req, res) => {
  console.log(req.authUser);
  const { email, id } = req.authUser;
  console.log(id);
  const groupName = req.body.groupName;
  const existingGroup = await GroupM.findOne({
    where: { groupName: groupName },
  });
  if (existingGroup) {
    res.status(400).json({ error: "A group with this name already exists" });
  } else {
    const group = await GroupM.create({
      groupName: groupName,
      createdBy: email,
    });
    const userGroup = await UserGroupM.create({
      isAdmin: true,
      GroupGroupId: group.groupId,
      UserId: id,
    });
    console.log({ group, userGroup });
    res.status(201).json({ group, userGroup });
  }
};

const getGroups = async (req, res) => {
  const userId = req.query.userId;
  console.log({ userId: userId });
  const userGroups = await GroupM.findAll({
    include: [
      {
        model: Users,
        where: { id: userId },
        through: { foreignKey: "UserId" },
      },
    ],
  });
  res.json(userGroups);
};

const getGroupDetail = async (req, res) => {
  try {
    const { groupId, groupName, userId } = req.query;
    console.log({ groupId, groupName, userId });
    const members = await Users.findAll({
      include: [
        {
          model: GroupM,
          where: { groupId: groupId },
          through: { foreignKey: "GroupGroupId" },
        },
      ],
    });
    console.log(members);
    // ! sending only the parts of the members
    res.json(
      members.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
      }))
    );
  } catch (error) {
    console.error({ error: error });
    res.json(error);
  }
};

const searchedMembers = async (req, res) => {
  try {
    const { input } = req.query;
    const members = await Users.findAll({
      where: {
        [Op.or]: [
          { email: { [Op.like]: `%${input}%` } },
          { phone: { [Op.like]: `%${input}%` } },
        ],
      },
    });
    res.json(
      members.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
      }))
    );
  } catch (error) {
    console.error({ BEsearchMembersError: error });
    res.json(error);
  }
};

const addMember = async (req, res) => {
  const { groupId, memberId } = req.body;
  console.log(groupId, memberId);
  await UserGroupM.create({
    isAdmin: false,
    GroupGroupId: groupId,
    UserId: memberId,
  });
  res.send("Member added to group");
};

module.exports = {
  makeGroup,
  getGroups,
  getGroupDetail,
  searchedMembers,
  addMember,
};
