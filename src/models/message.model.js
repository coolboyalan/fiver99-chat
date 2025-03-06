import BaseModel from "#models/base";
import { DataTypes } from "sequelize";

class Message extends BaseModel {}

Message.initialize(
  {
    receiverId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "user_table",
        key: "id",
      },
    },
    senderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "user_table",
        key: "id",
      },
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
