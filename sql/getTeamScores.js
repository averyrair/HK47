const { db } = require('../db');

module.exports.getTeamScores = function getTeamScores(server) {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT t.team_id AS teamID, FLOOR(COALESCE(SUM(experience), 0) * 1000/(COALESCE(SUM(previous_experience), 0) + 1)) AS score
            FROM teams t
            LEFT JOIN members m USING (team_id)
            WHERE t.server_id = ${db.escape(server.id)}
            GROUP BY t.team_name
            ORDER BY score DESC
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results);
        });
    });
}