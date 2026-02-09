import sequelize from "../../config/connectionDB.js";

import { Op } from "sequelize";
import LoginDetails from "../../models/models/logindetails.js";
import AdminUser from "../../models/auth/users.js";


export const getReportData = async (req, res) => {
    try {
        const requestInfo = req.body.requestInfo;
        if (!requestInfo.dataFor) {
            return res.status(402).json({
                message: "'Data for' paramater Required."
            });
        }

        if (!requestInfo.fromDate && !requestInfo.toDate) {
            return res.status(402).json({
                message: "From & To Date required."
            });
        }
        if (requestInfo.dataFor === 'Data Entry History') {

            const storedProcedureName = 'prcGetDataEntryHistory';

            sequelize.query(`CALL ${storedProcedureName}(:FromDate, :ToDate)`, {
                replacements: { FromDate: requestInfo.fromDate, ToDate: requestInfo.toDate },
                type: sequelize.QueryTypes.SELECT,
            }).then(([results]) => {
                const formattedResults = Object.values(results);  
                res.status(200).json({ Response: formattedResults });
            }).catch((error) => {
                res.status(500).json({ error: "An error occurred in stored procedure.", details : error.message });
            });
        }
        else if (requestInfo.dataFor === 'User Login-Logout') {
            try {
                const whereCondition = {
                    LoginDateTime: {
                        [Op.between]: [requestInfo.fromDate, requestInfo.toDate]
                    }
                };
                
                if (requestInfo.userId) {
                    whereCondition.UserID = requestInfo.userId;
                }
                const loginDetails = await LoginDetails.findAll({
                    where: whereCondition
                });
                res.status(200).json({ Response: loginDetails });
            } catch (error) {
                res.status(500).json({
                    error: "An error occurred while getting user login history details.",
                    message : error.message,
                });
            }
        }

    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching report info.", mainError: error.message });
    }
};

function formatDateTime(date) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
}

function formatDuration(login, logout) {
  if (!login || !logout) return "-";
  const diffMs = logout - login;
  if (diffMs <= 0) return "-";

  const totalSeconds = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}

export const getLoginHistory = async (req, res) => {
  try {
    const { UserID, StartDate, EndDate } = req.body;

    if (!UserID) return res.status(400).json({ message: "UserID required" });

    const user = await AdminUser.findOne({
      where: { UserID },
      attributes: ["UserID", "name"],
      raw: true
    });

    const logs = await LoginDetails.findAll({
      where: {
        UserID,
        LoginDateTime: {
          [Op.between]: [
            new Date(`${StartDate} 00:00:00`),
            new Date(`${EndDate} 23:59:59`)
          ]
        }
      },
      order: [["LoginDateTime", "ASC"]],
      raw: true
    });

    const formatted = logs.map(row => {
      const login = new Date(row.LoginDateTime);
      const logout = row.LogOutTime ? new Date(row.LogOutTime) : null;

      return {
        UserName: user?.name || "Unknown",
        LoginDateTime: formatDateTime(login),
        LogoutDateTime: logout ? formatDateTime(logout) : "-",
        TotalTime: formatDuration(login, logout)
      };
    });

    return res.json({ sessions: formatted });

  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const getUserLoginHistory = async (req, res) => {
  try {
    const { UserID, StartDate, EndDate } = req.body;

    if (!UserID) {
      return res.status(400).json({ message: "⚠️ UserID is required" });
    }

    const whereClause = { UserID };

    if (StartDate && EndDate) {
      whereClause.LoginDateTime = {
        [Op.between]: [
          new Date(`${StartDate} 00:00:00`),
          new Date(`${EndDate} 23:59:59`)
        ],
      };
    }

    const logs = await LoginDetails.findAll({
      where: whereClause,
      raw: true,
      order: [["LoginDateTime", "ASC"]],
    });


    console.log("Retrieved Logs:", logs);
    const user = await AdminUser.findOne({
      where: { UserID },
      attributes: ["name"],
      raw: true
    });

    const formattedLogs = logs.map((log) => {
      const login = new Date(log.LoginDateTime);
      const logout = log.LogOutTime && !log.LogOutTime.toString().includes("1969")
        ? new Date(log.LogOutTime)
        : null;

      return {
        UserName: user?.name || "-",
        LoginDateTime: formatDateTime(login),
        LogoutDateTime: logout ? formatDateTime(logout) : "-",
        TotalTime: formatDuration(login, logout),
      };
    });

    return res.status(200).json(formattedLogs);

  } catch (error) {
    console.error("🔥 Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};






























