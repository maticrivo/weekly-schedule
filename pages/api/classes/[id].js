import { getKnex } from "../../../lib/db";

const handler = async (req, res) => {
  const id = req.query.id;

  try {
    const knex = getKnex();

    const classData = await knex.select("*").from("classes").where({ id });
    if (!classData.length) {
      return res.status(404).json({ message: "Class not found" });
    }

    switch (req.method) {
      case "GET":
        const zoomsData = await knex.select("*").from("zooms").where({ classId: id });
        classData[0].zooms = zoomsData;

        return res.status(200).json(classData[0]);

      case "DELETE":
        await knex.transaction(async (trx) => {
          await Promise.all([
            trx.delete().from("classes").where({ id }),
            trx.delete().from("zooms").where({ classId: id }),
          ]);
        });

      // case "PUT":
      //   const body = JSON.parse(req.body);
      //   const { title, contents, date } = body;
      //   const updateZooms = body?.zooms?.filter((z) => z.id !== "-1") || [];
      //   const insertZooms = body?.zooms?.filter((z) => z.id === "-1") || [];
      //   let deleteZoomsIds = [];

      //   const currentZooms = await query("SELECT * FROM `zooms` WHERE classId = ?", [id]);
      //   if (currentZooms.length !== updateZooms.length) {
      //     const updateZoomIds = updateZooms.map((z) => Number(z.id));
      //     deleteZoomsIds = currentZooms
      //       .filter((z) => !updateZoomIds.includes(z.id))
      //       .map(({ id }) => id);
      //   }

      //   const trx = db.transaction();
      //   await trx
      //     .query(
      //       "UPDATE `classes` SET `title` = ?, `contents` = ?, `timestamp` = ? WHERE `id` = ?;",
      //       [title, JSON.stringify(contents), dayjs(date).unix(), id]
      //     )
      //     .query(() => {
      //       if (updateZooms.length) {
      //         const sql =
      //           "UPDATE `zooms` SET `contents` = ?, `link` = ?, `meetingId` = ?, `meetingPassword` = ?, `timestamp` = ? WHERE `id` = ?;";
      //         let multiUpdate = [];
      //         for (let i = 0; i < updateZooms.length; i++) {
      //           const zoom = updateZooms[i];
      //           let values = [
      //             JSON.stringify(zoom.contents),
      //             zoom.link,
      //             zoom.meetingId,
      //             zoom.meetingPassword,
      //             dayjs(zoom.time).unix(),
      //             zoom.id,
      //           ];
      //           multiUpdate.push({ sql, values });
      //         }
      //         console.log(multiUpdate);
      //         return multiUpdate;
      //       }
      //       return null;
      //     })
      //     .query(() => {
      //       if (insertZooms.length) {
      //         const sql =
      //           "INSERT INTO `zooms` (`classId`, `contents`, `link`, `meetingId`, `meetingPassword`, `timestamp`) VALUES (?)";
      //         let multiInsert = [];
      //         for (let i = 0; i < insertZooms.length; i++) {
      //           const zoom = insertZooms[i];
      //           let arr = [
      //             id,
      //             JSON.stringify(zoom.contents),
      //             zoom.link,
      //             zoom.meetingId,
      //             zoom.meetingPassword,
      //             dayjs(zoom.time).unix(),
      //           ];
      //           multiInsert.push(arr);
      //         }
      //         return [sql, multiInsert];
      //       }
      //       return null;
      //     })
      //     .query(() => {
      //       if (deleteZoomsIds.length) {
      //         const sql = "DELETE FROM `zooms` WHERE `id` = ?;";
      //         let multiDelete = [];
      //         for (let i = 0; i < deleteZoomsIds.length; i++) {
      //           const zoomId = deleteZoomsIds[i];
      //           let values = [zoomId];
      //           multiDelete.push({ sql, values });
      //         }
      //         console.log({ multiDelete });
      //         return multiDelete;
      //       }
      //       return null;
      //     })
      //     .rollback(console.error)
      //     .commit();

      //   return res.status(200).json(body);

      default:
        throw new Error("Method not supported");
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
