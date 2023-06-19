const Groups = require("../models/groups");
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
    // const userGroup = await UserGroupM.create({
    //   userId: id,
    //   groupId: group.groupId,
    // });
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
  const allGroups = await GroupM.findAll();
  // console.log(allGroups);
  res.json(allGroups);
};

const getGroupDetail = async (req, res) => {
  try {
    const { groupId, groupName } = req.query;
    const members = await Users.findAll({
      include: [
        {
          model: Groups,
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

module.exports = { makeGroup, getGroups, getGroupDetail };
