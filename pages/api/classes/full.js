import { getKnex } from "../../../lib/db";

const handler = async (req, res) => {
  try {
    const knex = getKnex();
    switch (req.method) {
      case "GET":
        const { start, end } = req.query;
        const classes = await knex
          .select("*")
          .from("classes")
          .where((builder) =>
            start && end
              ? builder
                  .where("timestamp", ">=", Number(start))
                  .where("timestamp", "<=", Number(end))
              : null
          );

        for (let i in classes) {
          classes[i].zooms = await knex
            .select("*")
            .from("zooms")
            .where({ classId: classes[i].id })
            .orderBy([{ column: "timestamp", order: "asc" }]);
        }

        return res.status(200).json(classes);

      default:
        throw new Error("Method not supported");
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
