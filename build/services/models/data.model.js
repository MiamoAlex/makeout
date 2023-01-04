// #region DataBase Table
/**
 * an enum of the database tables
 */
export var Table;
(function (Table) {
    Table["User"] = "user";
    Table["RelUser"] = "r_user";
    Table["Message"] = "message";
})(Table || (Table = {}));
export var RelUserStatus;
(function (RelUserStatus) {
    RelUserStatus[RelUserStatus["Rejected"] = 0] = "Rejected";
    RelUserStatus[RelUserStatus["Accepted"] = 1] = "Accepted";
})(RelUserStatus || (RelUserStatus = {}));
