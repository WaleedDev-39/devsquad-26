const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    task_name: {
      type: String,
      required: true,
    },
    task_desc: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

const Task = model("task", taskSchema);

module.exports = {
  Task,
};
