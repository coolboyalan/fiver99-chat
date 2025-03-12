import BaseModel from "#models/base";
import { DataTypes } from "sequelize";

class Message extends BaseModel {}

Message.initialize(
  {
    receiverId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
    },
    file: {
      type: DataTypes.STRING(1000),
      file: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  {
    indexes: [
      {
        fields: ["sender_id"], // Index on senderId
      },
      {
        fields: ["receiver_id"], // Index on receiverId
      },
    ],
  },
);

export default Message;
