import { query } from "../../../lib/db";

const handler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        const data = await query("SELECT * FROM classes WHERE id = ?", [req.query.id]);
        const zooms = await query("SELECT * FROM `zooms` WHERE classId = ?", [req.query.id]);
        data[0].zooms = zooms;

        return res.status(200).json(data[0]);

      default:
        throw new Error("Method not supported");
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
