import dayjs from "dayjs";
import { getKnex } from "../../../lib/db";

const handler = async (req, res) => {
  const id = req.query.id;

  try {
    const knex = getKnex();

    const classData = await knex.select("*").from("classes").where({ id }).first();
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    switch (req.method) {
      case "GET":
        const zoomsData = await knex.select("*").from("zooms").where({ classId: id });

        return res.status(200).json({ ...classData, zooms: zoomsData });

      case "PUT":
        const body = JSON.parse(req.body);
        const { title, contents, date } = body;
        const updateZooms = body?.zooms?.filter((z) => z.id !== "-1") || [];
        const insertZooms = body?.zooms?.filter((z) => z.id === "-1") || [];
        let deleteZoomsIds = [];

        const currentZooms = await knex.select("*").from("zooms").where({ classId: id });
        if (currentZooms.length !== updateZooms.length) {
          const updateZoomIds = updateZooms.map((z) => Number(z.id));
          deleteZoomsIds = currentZooms
            .filter((z) => !updateZoomIds.includes(z.id))
            .map(({ id }) => id);
        }

        await knex.transaction(async (trx) => {
          let promises = [];
          promises.push(
            trx
              .update({
                title,
                contents: JSON.stringify(contents),
                timestamp: dayjs(date).unix(),
              })
              .into("classes")
              .where({ id })
          );
          if (updateZooms.length) {
            updateZooms.forEach((zoom) => {
              promises.push(
                trx
                  .update({
                    contents: JSON.stringify(zoom.contents),
                    link: zoom.link,
                    meetingId: zoom.meetingId,
                    meetingPassword: zoom.meetingPassword,
                    timestamp: dayjs(zoom.time).unix(),
                  })
                  .into("zooms")
                  .where({ id: zoom.id })
              );
            });
          }
          if (insertZooms.length) {
            insertZooms.forEach((zoom) => {
              promises.push(
                trx
                  .insert({
                    classId: id,
                    contents: JSON.stringify(zoom.contents),
                    link: zoom.link,
                    meetingId: zoom.meetingId,
                    meetingPassword: zoom.meetingPassword,
                    timestamp: dayjs(zoom.time).unix(),
                  })
                  .into("zooms")
              );
            });
          }
          if (deleteZoomsIds.length) {
            promises.push(trx.delete().from("zooms").whereIn("id", deleteZoomsIds));
          }

          await Promise.all(promises);
        });

        return res.status(200).json(body);

      case "POST":
        const zooms = await knex.select("*").from("zooms").where({ classId: id });

        const newClassId = await knex.transaction(async (trx) => {
          const ids = await trx
            .insert(
              {
                title: classData.title,
                contents: classData.contents,
                timestamp: classData.timestamp,
              },
              "id"
            )
            .into("classes");

          if (zooms.length > 0) {
            const normalizedZooms = zooms.map((z) => ({
              classId: ids[0],
              contents: z.contents,
              link: z.link,
              meetingId: z.meetingId,
              meetingPassword: z.meetingPassword,
              timestamp: z.timestamp,
            }));
            await trx.insert(normalizedZooms).into("zooms");
          }

          return ids[0];
        });

        return res.status(200).json({ id: newClassId });

      case "DELETE":
        await knex.transaction(async (trx) => {
          await Promise.all([
            trx.delete().from("classes").where({ id }),
            trx.delete().from("zooms").where({ classId: id }),
          ]);
        });

        return res.status(200).send();

      default:
        throw new Error("Method not supported");
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
