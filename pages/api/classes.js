import { db, query } from "../../lib/db";

import dayjs from "dayjs";

const handler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        const results = await query("SELECT * FROM `classes` ORDER BY `timestamp` DESC");

        return res.status(200).json(results);

      case "POST":
        const body = JSON.parse(req.body);

        const trx = await db.transaction();
        await trx
          .query("INSERT INTO classes (title, contents, timestamp) VALUES (?, ?, ?);", [
            body.title,
            JSON.stringify(body.contents),
            dayjs(body.date).unix(),
          ])
          .query((r) => {
            let sql =
              "INSERT INTO zooms (class_id, contents, link, meeting_id, meeting_password, timestamp) VALUES (?)";
            let multiInsert = [];
            for (let i = 0; i < body.zooms.length; i++) {
              const zoom = body.zooms[i];
              let arr = [
                r.insertId,
                JSON.stringify(zoom.contents),
                zoom.link,
                zoom.meetingId,
                zoom.meetingPassword,
                dayjs(zoom.time).unix(),
              ];
              multiInsert.push(arr);
            }
            return [sql, multiInsert];
          })
          .rollback((e) => console.error(e))
          .commit();

        return res.status(200).json({ body: JSON.parse(req.body) });

      default:
        throw new Error("Method not supported");
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
