const userSchema: UserSchema = {
  TITLE: "Name",
  STATUS: "STATUS",
  NAME: "NAME",
  EMAIL: "EMAIL",
  IS_DELETED: "IS_DELETED",
  CREATED_TIME: "CREATED_TIME",
  LAST_EDITED_TIME: "LAST_EDITED_TIME",
};

interface UserSchema {
  TITLE: string;
  STATUS: string;
  NAME: string;
  EMAIL: string;
  IS_DELETED: string;
  CREATED_TIME: string;
  LAST_EDITED_TIME: string;
}

export { userSchema, UserSchema };
