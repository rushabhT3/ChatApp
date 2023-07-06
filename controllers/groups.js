const { Op } = require("sequelize");
const GroupM = require("../models/groups");
const UserGroupM = require("../models/userGroups");
const Users = require("../models/users");

const makeGroup = async (req, res) => {
  const { email, id } = req.authUser;
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
    // io.emit("groupCreated", group);
    res.status(201).json({ group, userGroup });
  }
};

const getGroups = async (req, res) => {
  const userId = req.query.userId;
  // ! query returns an array of GroupM instances, with the associated users included as nested objects
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
    const members = await Users.findAll({
      include: [
        {
          model: GroupM,
          where: { groupId: groupId },
          through: { foreignKey: "GroupGroupId" },
        },
      ],
    });
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
        // ! find users where either the email or phone field matches the input value
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
  try {
    const { groupId, memberId } = req.body;
    const existingMember = await UserGroupM.findOne({
      where: {
        GroupGroupId: groupId,
        UserId: memberId,
      },
    });
    if (!existingMember) {
      await UserGroupM.create({
        isAdmin: false,
        GroupGroupId: groupId,
        UserId: memberId,
      });

      res.send("Member added to group");
    } else {
      res.status(400).send("Member already exists in the group");
    }
  } catch (error) {
    res.json(error);
  }
};

const deleteMember = async (req, res) => {
  try {
    const { memberId, groupId } = req.params;
    const loginId = req.headers.loginid;
    const member = await UserGroupM.findOne({
      where: {
        UserId: memberId,
        GroupGroupId: groupId,
      },
    });
    if (member && member.isAdmin === true && memberId !== loginId) {
      return res.status(400).send("Cannot delete an admin member");
    }
    if (member && member.isAdmin === true && memberId === loginId) {
      const adminMembers = await UserGroupM.findAll({
        where: { GroupGroupId: groupId, isAdmin: true },
      });
      const allMembers = await UserGroupM.findAll({
        where: {
          GroupGroupId: groupId,
        },
      });
      if (adminMembers.length === 1 && allMembers.length > 1) {
        return res
          .status(400)
          .send("Please make someone else an admin before leaving the group");
      }
    }
    await member.destroy();
    res.status(200).send("Member deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

const makeAdmin = async (req, res) => {
  try {
    const { memberId, groupId } = req.body;
    const member = await UserGroupM.findOne({
      where: {
        UserId: memberId,
        GroupGroupId: groupId,
      },
    });
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    if (member.isAdmin === true) {
      return res.status(400).json({ message: "Member is already an admin" });
    }
    member.isAdmin = true;
    await member.save();
    res.status(200).json({ message: "Member successfully made an admin" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  makeGroup,
  getGroups,
  getGroupDetail,
  searchedMembers,
  addMember,
  deleteMember,
  makeAdmin,
};
