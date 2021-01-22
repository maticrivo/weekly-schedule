import dayjs from "dayjs";
import { getKnex } from "../../../lib/db";

const handler = async (req, res) => {
  try {
    const knex = getKnex();
    switch (req.method) {
      case "GET":
        const results = await knex
          .select("classes.*", knex.raw("GROUP_CONCAT(zooms.timestamp) AS zooms"))
          .from("classes")
          .leftJoin("zooms", "classes.id", "zooms.classId")
          .groupBy("classes.id", "zooms.classId")
          .orderBy([{ column: "classes.timestamp", order: "desc" }]);

        return res.status(200).json(results);

      case "POST":
        const { zooms = [], ...body } = JSON.parse(req.body);

        await knex.transaction(async (trx) => {
          const ids = await trx
            .insert(
              {
                title: body.title,
                contents: JSON.stringify(body.contents),
                timestamp: dayjs(body.date).unix(),
              },
              "id"
            )
            .into("classes");

          if (zooms.length > 0) {
            const normalizedZooms = zooms.map((z) => ({
              classId: ids[0],
              contents: JSON.stringify(z.contents),
              link: z.link,
              meetingId: z.meetingId,
              meetingPassword: z.meetingPassword,
              timestamp: dayjs(z.time).unix(),
            }));
            await trx.insert(normalizedZooms).into("zooms");
          }
        });

        return res.status(200).json({ body: JSON.parse(req.body) });

      default:
        throw new Error("Method not supported");
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
