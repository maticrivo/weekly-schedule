import { query } from "../../../lib/db";

const handler = async (req, res) => {
  const id = req.query.id;

  try {
    const classData = await query("SELECT * FROM classes WHERE id = ?", [id]);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    switch (req.method) {
      case "GET":
        const zoomsData = await query("SELECT * FROM `zooms` WHERE classId = ?", [id]);
        classData[0].zooms = zoomsData;

        return res.status(200).json(classData[0]);

      case "PUT":
        const body = JSON.parse(req.body);
        const { title, contents, date } = body;
        const updateZooms = body?.zooms?.filter((z) => z.id !== "-1");
        const insertZooms = body?.zooms?.filter((z) => z.id === "-1");

        const trx = await db.transaction();
        await trx
          .query("UPDATE classes SET title = ?, contents = ?, timestamp = ? WHERE id = ?;", [
            title,
            JSON.stringify(contents),
            dayjs(date).unix(),
            id,
          ])
          .query(() => {
            const sql =
              "UPDATE zooms SET contents = ?, link = ?, meetingId = ?, meetingPassword = ?, timestamp = ? WHERE id = ?;";
            let multiUpdate = [];
            for (let i = 0; i < updateZooms.length; i++) {
              const zoom = updateZooms[i];
              let arr = [
                JSON.stringify(zoom.contents),
                zoom.link,
                zoom.meetingId,
                zoom.meetingPassword,
                dayjs(zoom.time).unix(),
                zoom.id,
              ];
              multiUpdate.push(arr);
            }
            return [sql, multiUpdate];
          })
          .query(() => {
            const sql =
              "INSERT INTO zooms (classId, contents, link, meetingId, meetingPassword, timestamp) VALUES (?)";
            let multiInsert = [];
            for (let i = 0; i < insertZooms.length; i++) {
              const zoom = insertZooms[i];
              let arr = [
                id,
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

        return res.status(200).json(body);

      default:
        throw new Error("Method not supported");
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
